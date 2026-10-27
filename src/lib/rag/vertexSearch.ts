import { SearchServiceClient } from "@google-cloud/discoveryengine";
import { ACTIVE_FILTER, normalizeResult } from "./results.mjs";

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

/** La recherche est facultative ; une panne conserve le contexte documentaire local. */
export async function searchBobineKnowledge(query: string, maxResults = 5): Promise<RagResult | null> {
  if (process.env.ENABLE_VERTEX_RAG !== "true" || !query.trim()) return null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const client = getClient();
    const servingConfig = client.projectLocationCollectionDataStoreServingConfigPath(
      process.env.GCP_PROJECT_ID || "malefiquevirtualmachine", process.env.GCP_LOCATION || "global",
      "default_collection", process.env.VERTEX_DATA_STORE_ID || "bobine-web-store", "default_search",
    );
    const search = client.search({
      servingConfig, query: query.slice(0, 4000), pageSize: Math.max(1, Math.min(10, maxResults)),
      filter: ACTIVE_FILTER,
      contentSearchSpec: { snippetSpec: { returnSnippet: true } },
    }, { autoPaginate: false, timeout: 1400, retry: null }).then(([results]) => {
      const snippets = results.map(normalizeResult).filter((s): s is NonNullable<typeof s> => s !== null);
      if (!snippets.length) return null;
      const products = snippets.filter(s => s.platform === "amazon" || s.platform === "aliexpress");
      const docs = snippets.filter(s => s.platform !== "amazon" && s.platform !== "aliexpress");
      return {
        snippets: snippets as RagSnippet[],
        projectKnowledgeSnippet: docs.map(s => `### ${s.title}\nSource : ${s.url}\n${s.snippet}`).join("\n\n"),
        hardwareCatalogSnippet: products.map(s => `- **${s.title}** : ${s.snippet}`).join("\n"),
      };
    });
    const timeout = new Promise<null>(resolve => { timer = setTimeout(() => resolve(null), 1500); });
    return await Promise.race([search, timeout]);
  } catch {
    console.warn("Recherche documentaire indisponible ; contexte local utilisé.");
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
