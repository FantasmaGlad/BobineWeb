import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, writeFileSync } from "node:fs";
import { exportWeb, type SourceDocument } from "./export";
import { exportUpstream } from "./upstream.mjs";
import { request, readObject, writeObject, storePath, waitOperation, bucket } from "./cloud.mjs";
import { ACTIVE_FILTER, MANAGED_BY } from "../../src/lib/rag/results.mjs";
/** Préfixe des objets Cloud Storage ; RAG_PREFIX et RAG_WEB_STORE permettent un essai sur un index jetable sans toucher à la production. */
const PREFIX = process.env.RAG_PREFIX || "sync-v2";
const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const bobineRoot = resolve(process.env.BOBINE_SOURCE_DIR || [resolve(root, "../Bobine"), resolve(root, "../../Bobine")].find(existsSync) || resolve(root, "../Bobine"));
const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const selected = process.argv.find(a => a.startsWith("--corpus="))?.split("=")[1] || "all";
if (!["all", "web", "frameworks"].includes(selected)) throw new Error("Corpus inconnu");

export function documentRows(sources: SourceDocument[]) {
  if (!sources.length) throw new Error("Export vide : import refusé");
  const seen = new Set<string>();
  return sources.map(source => {
    const id = hash(source.key).slice(0, 32);
    if (seen.has(id)) throw new Error(`Document en double : ${source.key}`);
    seen.add(id);
    if (!source.text.trim() || !source.source_url.startsWith("https://")) throw new Error(`Source invalide : ${source.key}`);
    if (!source.framework && /-----BEGIN (?:RSA )?PRIVATE KEY-----|hf_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/.test(source.text)) throw new Error(`Secret détecté : ${source.key}`);
    const { text, key: _key, ...meta } = source;
    void _key;
    const contentHash = hash(JSON.stringify({ text, ...meta }));
    return { id, text, hash: contentHash, meta };
  }).sort((a, b) => a.id.localeCompare(b.id));
}
async function parallel<T>(items: T[], worker: (item: T) => Promise<unknown>, width = 8) {
  let i = 0;
  await Promise.all(Array.from({ length: width }, async () => { while (i < items.length) await worker(items[i++]); }));
}
async function ensureSchema(store: string) {
  const current = await request(`${storePath(store)}/schemas/default_schema`);
  const schema = JSON.parse(current.jsonSchema);
  schema.properties ??= {};
  for (const field of ["framework", "version", "platform", "locale", "active", "managed_by", "generation", "source_revision"]) {
    schema.properties[field] = { type: "string", indexable: true, retrievable: true };
  }
  schema.properties.title = { type: "string", retrievable: true, keyPropertyMapping: "title" };
  schema.properties.source_url = { type: "string", retrievable: true };
  if (isDeepStrictEqual(schema, JSON.parse(current.jsonSchema))) return;
  await waitOperation(await request(`${storePath(store)}/schemas/default_schema`, {
    method: "PATCH", body: { name: current.name, jsonSchema: JSON.stringify(schema) },
  }));
}
async function probe(store: string, generation: string, framework?: string) {
  const filter = `${ACTIVE_FILTER} AND generation: ANY("${generation}")${framework ? ` AND framework: ANY("${framework}")` : ""}`;
  const result = await request(`${storePath(store)}/servingConfigs/default_search:search`, {
    method: "POST", body: { query: framework || "", filter, pageSize: 3, contentSearchSpec: { snippetSpec: { returnSnippet: true } } },
  });
  if (!result.results?.length) throw new Error(`Index pas encore interrogeable : ${store}${framework ? `/${framework}` : ""}`);
  for (const r of result.results) {
    if (r.document?.structData?.generation !== generation || (framework && r.document?.structData?.framework !== framework)) {
      throw new Error("Résultat hors du filtre attendu");
    }
  }
}
export function retryableDocuments(complete: { metadata?: { failureCount?: string }; response?: { errorSamples?: { code?: number; message?: string }[] } }, documents: Record<string, unknown>[]) {
  const samples = complete.response?.errorSamples || [];
  const failures = Number(complete.metadata?.failureCount || 0) || samples.length;
  if (!failures) return [];
  if (failures !== samples.length) throw new Error("Erreurs incomplètes : reprise ciblée impossible");
  const ids = new Set<string>();
  for (const sample of samples) {
    const id = sample.message?.match(/\/documents\/([a-f0-9]{32})/)?.[1];
    if (![4, 5, 8, 10, 13, 14].includes(Number(sample.code)) || !id || !documents.some(d => d.id === id)) {
      throw new Error("Échec d'import non transitoire ou document non identifié");
    }
    ids.add(id);
  }
  if (ids.size !== failures) throw new Error("Nombre d'erreurs incohérent");
  return documents.filter(d => ids.has(String(d.id)));
}
async function sync(corpus: string, sources: SourceDocument[]) {
  const rows = documentRows(sources);
  const generation = hash(rows.map(r => r.hash).join("\n")).slice(0, 32);
  const store = corpus === "web" ? (process.env.RAG_WEB_STORE || "bobine-web-store") : (process.env.RAG_FRAMEWORKS_STORE || "bobine-frameworks-store");
  const stateKey = `${PREFIX}/state/${corpus}.json`;
  const previous = await readObject(stateKey);
  const frameworks = [...new Set(sources.map(s => s.framework).filter(Boolean))] as string[];
  if (previous?.generation === generation) {
    await probe(store, generation);
    console.log(`${corpus} : inchangé, recherche vérifiée (${rows.length} documents)`);
    return;
  }
  const pendingKey = `${PREFIX}/state/${corpus}.pending.json`;
  const pending = await readObject(pendingKey);
  let operation = pending?.generation === generation
    ? await request(`https://discoveryengine.googleapis.com/v1/${pending.operation}`) : null;
  if (!operation || operation.error) {
    await ensureSchema(store);
    const documents: Record<string, unknown>[] = [];
    await parallel(rows, async row => {
      const object = `${PREFIX}/content/${corpus}/${row.hash}.txt`;
      if (!previous?.hashes?.includes(row.hash)) await writeObject(object, row.text, "text/plain; charset=utf-8");
      documents.push({ id: row.id, structData: { ...row.meta, active: "true", managed_by: MANAGED_BY, generation },
        content: { mimeType: "text/plain", uri: `gs://${bucket}/${object}` } });
    });
    documents.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const manifestKey = `${PREFIX}/imports/${corpus}/${generation}.jsonl`;
    await writeObject(manifestKey, documents.map(d => JSON.stringify(d)).join("\n") + "\n", "application/x-ndjson");
    operation = await request(`${storePath(store)}/branches/default_branch/documents:import`, {
      method: "POST", body: { gcsSource: { inputUris: [`gs://${bucket}/${manifestKey}`], dataSchema: "document" }, reconciliationMode: "INCREMENTAL" },
    });
    await writeObject(pendingKey, { generation, operation: operation.name });
  }
  console.log(`${corpus} : suivi de l’import, ${rows.length} documents, opération ${operation.name}`);
  const complete = await waitOperation(operation, { allowPartial: true });
  const allDocuments = rows.map(row => ({ id: row.id,
    structData: { ...row.meta, active: "true", managed_by: MANAGED_BY, generation },
    content: { mimeType: "text/plain", uri: `gs://${bucket}/${PREFIX}/content/${corpus}/${row.hash}.txt` } }));
  const failed = retryableDocuments(complete, allDocuments);
  let recovered = 0;
  let retryOperationName: string | undefined;
  if (failed.length) {
    for (const doc of failed) {
      const uri = (doc.content as { uri: string }).uri;
      if (await readObject(uri.replace(`gs://${bucket}/`, "")) === null) throw new Error("Source GCS manquante : reprise refusée");
    }
    const previousRetry = pending?.generation === generation && pending?.operation === operation.name ? pending.retryOperation : null;
    let retry = previousRetry ? await request(`https://discoveryengine.googleapis.com/v1/${previousRetry}`) : null;
    if (!retry) {
      const key = `${PREFIX}/imports/${corpus}/${generation}-retry.jsonl`;
      await writeObject(key, failed.map(d => JSON.stringify(d)).join("\n") + "\n", "application/x-ndjson");
      retry = await request(`${storePath(store)}/branches/default_branch/documents:import`, { method: "POST", body: {
        gcsSource: { inputUris: [`gs://${bucket}/${key}`], dataSchema: "document" }, reconciliationMode: "INCREMENTAL",
      } });
      await writeObject(pendingKey, { generation, operation: operation.name, retryOperation: retry.name });
    }
    console.log(`${corpus} : reprise unique de ${failed.length} échecs transitoires, sources GCS vérifiées`);
    const repaired = await waitOperation(retry);
    recovered = Number(repaired.metadata?.successCount || 0);
    retryOperationName = repaired.name;
    if (recovered !== failed.length) throw new Error("Reprise partielle : synchronisation non validée");
  }
  if (Number(complete.metadata?.successCount) + recovered !== rows.length) throw new Error(`Import incomplet : ${complete.metadata?.successCount || 0}+${recovered}/${rows.length}`);
  const deadline = Date.now() + 10 * 60 * 1000;
  while (true) {
    try {
      await probe(store, generation);
      for (const framework of frameworks) await probe(store, generation, framework);
      break;
    } catch (error) {
      if (Date.now() > deadline) throw error;
      await new Promise(r => setTimeout(r, 10000));
    }
  }
  // Le retrait d'une source devient une désactivation réversible, après validation du nouvel import.
  const ids = new Set(rows.map(r => r.id));
  const retired = (previous?.ids || []).filter((id: string) => !ids.has(id));
  await parallel(retired, async (id: string) => {
    const url = `${storePath(store)}/branches/default_branch/documents/${id}`;
    const doc = await request(url, { optional: true });
    if (doc) await request(`${url}?updateMask=structData`, { method: "PATCH", body: { name: doc.name,
      structData: { ...doc.structData, active: "false" } } });
  });
  const state = { generation, count: rows.length, ids: rows.map(r => r.id), hashes: rows.map(r => r.hash),
    frameworks, operation: complete.name, retryOperation: retryOperationName, verifiedAt: new Date().toISOString(), retired: retired.length };
  await writeObject(stateKey, state);
  console.log(`${corpus} : import et recherche vérifiés, génération ${generation}, ${retired.length} fiches désactivées`);
}
async function main() {
  for (const corpus of selected === "all" ? ["web", "frameworks"] : [selected]) {
    const sources = corpus === "web" ? exportWeb(root, bobineRoot) : await exportUpstream(root, bobineRoot);
    if (process.argv.includes("--dry-run")) {
      const rows = documentRows(sources);
      console.log(`${corpus} : export local valide, ${rows.length} documents, aucune écriture distante`);
      if (process.env.RAG_EXPORT_REPORT) writeFileSync(process.env.RAG_EXPORT_REPORT, JSON.stringify(rows.map(({ text: _text, ...r }) => { void _text; return r; }), null, 2));
    } else await sync(corpus, sources);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
}
