import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { exportWeb, type SourceDocument } from "./export";
import { exportUpstream } from "./upstream.mjs";
import { request, readObject, writeObject, storePath, waitOperation, bucket } from "./cloud.mjs";
import { ACTIVE_FILTER, MANAGED_BY } from "../../src/lib/rag/results.mjs";
const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const bobineRoot = resolve(process.env.BOBINE_SOURCE_DIR || resolve(root, "../Bobine"));
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
  if (JSON.stringify(schema) === current.jsonSchema) return;
  await waitOperation(await request(`${storePath(store)}/schemas/default_schema`, {
    method: "PATCH", body: { name: current.name, jsonSchema: JSON.stringify(schema) },
  }));
}
async function probe(store: string, generation: string, framework?: string) {
  const filter = `${ACTIVE_FILTER} AND generation: ANY("${generation}")${framework ? ` AND framework: ANY("${framework}")` : ""}`;
  const result = await request(`${storePath(store)}/servingConfigs/default_search:search`, {
    method: "POST", body: { query: framework || "Bobine", filter, pageSize: 3, contentSearchSpec: { snippetSpec: { returnSnippet: true } } },
  });
  if (!result.results?.length) throw new Error(`Index pas encore interrogeable : ${store}${framework ? `/${framework}` : ""}`);
  for (const r of result.results) {
    if (r.document?.structData?.generation !== generation || (framework && r.document?.structData?.framework !== framework)) {
      throw new Error("Résultat hors du filtre attendu");
    }
  }
}
async function sync(corpus: string, sources: SourceDocument[]) {
  const rows = documentRows(sources);
  const generation = hash(rows.map(r => r.hash).join("\n")).slice(0, 32);
  const store = corpus === "web" ? "bobine-web-store" : "bobine-frameworks-store";
  const stateKey = `sync-v2/state/${corpus}.json`;
  const previous = await readObject(stateKey);
  const frameworks = [...new Set(sources.map(s => s.framework).filter(Boolean))] as string[];
  if (previous?.generation === generation) {
    await probe(store, generation);
    console.log(`${corpus} : inchangé, recherche vérifiée (${rows.length} documents)`);
    return;
  }
  const pendingKey = `sync-v2/state/${corpus}.pending.json`;
  const pending = await readObject(pendingKey);
  let operation = pending?.generation === generation
    ? await request(`https://discoveryengine.googleapis.com/v1/${pending.operation}`) : null;
  if (!operation || operation.error || Number(operation.metadata?.failureCount || 0)) {
    await ensureSchema(store);
    const documents: Record<string, unknown>[] = [];
    await parallel(rows, async row => {
      const object = `sync-v2/content/${corpus}/${row.hash}.txt`;
      if (!previous?.hashes?.includes(row.hash)) await writeObject(object, row.text, "text/plain; charset=utf-8");
      documents.push({ id: row.id, structData: { ...row.meta, active: "true", managed_by: MANAGED_BY, generation },
        content: { mimeType: "text/plain", uri: `gs://${bucket}/${object}` } });
    });
    documents.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const manifestKey = `sync-v2/imports/${corpus}/${generation}.jsonl`;
    await writeObject(manifestKey, documents.map(d => JSON.stringify(d)).join("\n") + "\n", "application/x-ndjson");
    operation = await request(`${storePath(store)}/branches/default_branch/documents:import`, {
      method: "POST", body: { gcsSource: { inputUris: [`gs://${bucket}/${manifestKey}`], dataSchema: "document" }, reconciliationMode: "INCREMENTAL" },
    });
    await writeObject(pendingKey, { generation, operation: operation.name });
  }
  console.log(`${corpus} : suivi de l’import, ${rows.length} documents, opération ${operation.name}`);
  const complete = await waitOperation(operation);
  if (Number(complete.metadata?.successCount) !== rows.length) throw new Error(`Import incomplet : ${complete.metadata?.successCount || 0}/${rows.length}`);
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
    frameworks, operation: complete.name, verifiedAt: new Date().toISOString(), retired: retired.length };
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
