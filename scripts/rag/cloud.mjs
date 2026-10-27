import { GoogleAuth } from "google-auth-library";
export const project = process.env.GCP_PROJECT_ID || "malefiquevirtualmachine";
export const bucket = process.env.RAG_BUCKET || "bobine-knowledge-prod";
export const location = process.env.GCP_LOCATION || "global";
export const api = `https://discoveryengine.googleapis.com/v1/projects/${project}/locations/${location}/collections/default_collection`;
const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
/** @param {string} url @param {{method?: string, body?: any, headers?: Record<string,string>, optional?: boolean}} options */
export async function request(url, { method = "GET", body, headers = {}, optional = false } = {}) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const token = await auth.getAccessToken();
    const response = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`,
      "X-Goog-User-Project": project, ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: body === undefined ? undefined : typeof body === "string" || body instanceof Buffer ? body : JSON.stringify(body),
      signal: AbortSignal.timeout(60000) });
    if (optional && response.status === 404) return null;
    if ([429, 500, 502, 503, 504].includes(response.status) && attempt < 3) {
      await new Promise(r => setTimeout(r, 1000 * 2 ** attempt)); continue;
    }
    if (!response.ok) throw new Error(`${method} ${new URL(url).pathname}: HTTP ${response.status} ${(await response.text()).slice(0, 1000)}`);
    if (response.status === 204) return null;
    const text = await response.text();
    try { return JSON.parse(text); } catch { return text; }
  }
}
export const storePath = id => `${api}/dataStores/${id}`;
export async function readObject(name) {
  return request(`https://storage.googleapis.com/storage/v1/b/${bucket}/o/${encodeURIComponent(name)}?alt=media`, { optional: true });
}
export async function writeObject(name, body, contentType = "application/json") {
  return request(`https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(name)}`, {
    method: "POST", body: typeof body === "string" ? body : JSON.stringify(body), headers: { "Content-Type": contentType },
  });
}
export async function waitOperation(operation) {
  const deadline = Date.now() + 25 * 60 * 1000;
  while (!operation.done) {
    if (Date.now() > deadline) throw new Error(`Opération encore en cours : ${operation.name}`);
    await new Promise(r => setTimeout(r, 5000));
    operation = await request(`https://discoveryengine.googleapis.com/v1/${operation.name}`);
  }
  if (operation.error) throw new Error(JSON.stringify(operation.error));
  if (operation.response?.errorSamples?.length || Number(operation.metadata?.failureCount || 0)) {
    throw new Error(`Import partiel refusé : ${JSON.stringify(operation.response ?? operation.metadata)}`);
  }
  return operation;
}
