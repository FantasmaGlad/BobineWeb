import { SearchServiceClient } from "@google-cloud/discoveryengine";
import { ACTIVE_FILTER, normalizeResult, relaxQuery } from "./results.mjs";

export interface RagSnippet {
  id: string;
  title: string;
  snippet: string;
  url?: string;
  platform?: "amazon" | "aliexpress" | "doc" | "spec";
}
export interface RagResult {
  snippets: RagSnippet[];
  projectKnowledgeSnippet: string;
  hardwareCatalogSnippet: string;
}

let cachedClient: SearchServiceClient | null = null;
function getClient(): SearchServiceClient {
  if (cachedClient) return cachedClient;
  const raw = process.env.GCP_SERVICE_ACCOUNT_KEY?.trim();
  const credentials = raw ? JSON.parse(raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8")) : undefined;
  cachedClient = new SearchServiceClient({ credentials, projectId: process.env.GCP_PROJECT_ID });
  return cachedClient;
}

const WARM_BUDGET_MS = 3000;
/** La première recherche d'une instance démarrée à froid ouvre le canal et obtient le jeton : mesuré 3,0 à 3,2 s contre 1,4 à 1,9 s ensuite. */
const COLD_BUDGET_MS = 4500;
let connected = false;
/** Réponses récentes par question : les mêmes questions reviennent (suggestions, relances) et la recherche coûte 1,5 s. */
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX = 200;
const cache = new Map<string, { at: number; value: RagResult }>();
const inflight = new Map<string, Promise<RagResult | null>>();
let warmUp: Promise<unknown> | null = null;

function servingConfigPath(client: SearchServiceClient): string {
  return client.projectLocationCollectionDataStoreServingConfigPath(
    process.env.GCP_PROJECT_ID || "malefiquevirtualmachine", process.env.GCP_LOCATION || "global",
    "default_collection", process.env.VERTEX_DATA_STORE_ID || "bobine-web-store", "default_search",
  );
}

function runSearch(client: SearchServiceClient, query: string, pageSize: number, deadlineMs: number) {
  return client.search({
    servingConfig: servingConfigPath(client), query: relaxQuery(query.slice(0, 4000), "bobine"), pageSize,
    filter: ACTIVE_FILTER,
    contentSearchSpec: { snippetSpec: { returnSnippet: true } },
  }, { autoPaginate: false, timeout: deadlineMs - 200, retry: null }).then(([results]) => {
    connected = true;
    return results;
  });
}

/** Préchauffage au chargement du module : obtient le jeton (environ 1 s) pendant que la requête prépare le catalogue. Aucune recherche supplémentaire n'est émise. */
function startWarmUp(): void {
  if (warmUp || process.env.ENABLE_VERTEX_RAG !== "true") return;
  try {
    const client = getClient();
    warmUp = client.initialize().then(() => client.auth.getAccessToken()).catch(() => undefined);
  } catch { warmUp = Promise.resolve(); }
}
startWarmUp();

/** La recherche est facultative ; une panne conserve le contexte documentaire local. */
export async function searchBobineKnowledge(query: string, maxResults = 5): Promise<RagResult | null> {
  if (process.env.ENABLE_VERTEX_RAG !== "true" || !query.trim()) return null;
  const key = `${relaxQuery(query.slice(0, 4000), "bobine")}|${maxResults}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;
  const pending = inflight.get(key);
  if (pending) return pending;
  const run = searchUncached(query, maxResults).then(value => {
    if (value) { if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value as string); cache.set(key, { at: Date.now(), value }); }
    return value;
  }).finally(() => inflight.delete(key));
  inflight.set(key, run);
  return run;
}

async function searchUncached(query: string, maxResults: number): Promise<RagResult | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const budget = connected ? WARM_BUDGET_MS : COLD_BUDGET_MS;
    const search = runSearch(getClient(), query, Math.max(1, Math.min(10, maxResults)), budget).then(results => {
      const snippets = results.map(normalizeResult).filter((s): s is NonNullable<typeof s> => s !== null);
      if (!snippets.length) return null;
      console.info("Recherche documentaire disponible.", { snippets: snippets.length });
      const products = snippets.filter(s => s.platform === "amazon" || s.platform === "aliexpress");
      const docs = snippets.filter(s => s.platform !== "amazon" && s.platform !== "aliexpress");
      return {
        snippets: snippets as RagSnippet[],
        projectKnowledgeSnippet: docs.map(s => `### ${s.title}\nSource : ${s.url}\n${s.snippet}`).join("\n\n"),
        hardwareCatalogSnippet: products.map(s => `- **${s.title}** : ${s.snippet}`).join("\n"),
      };
    });
    const timeout = new Promise<null>(resolve => { timer = setTimeout(() => resolve(null), budget); });
    return await Promise.race([search, timeout]);
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : "initialisation";
    console.warn("Recherche documentaire indisponible ; contexte local utilisé.", { code });
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
