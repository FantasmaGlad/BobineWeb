import type { CatalogPlatform } from "./entries";

/** Fiche produit résolue par /api/catalog (jamais construite à partir du texte du modèle). */
export interface ClientProduct {
  id: string;
  platform: CatalogPlatform;
  name: string;
  price: number | null;
  imageUrl: string;
  url: string;
  specs: string;
  hasFan: boolean;
  category: string;
  seller: { name: string; rating: string | null; sales: number | null } | null;
  os: string | null;
  form: string | null;
  tier: string | null;
}

const cache = new Map<string, ClientProduct | null>();
const pending = new Map<string, Promise<void>>();

/** Résout des identifiants via l'API, avec cache mémoire : un identifiant inconnu donne `null`. */
export async function fetchCatalogProducts(ids: string[]): Promise<Array<ClientProduct | null>> {
  const missing = ids.filter((id) => !cache.has(id));
  if (missing.length > 0) {
    const key = missing.join(",");
    let request = pending.get(key);
    if (!request) {
      request = fetch(`/api/catalog?ids=${encodeURIComponent(key)}`)
        .then((res) => (res.ok ? res.json() : { products: [] }))
        .then((data: { products: ClientProduct[] }) => {
          const found = new Map(data.products.map((p) => [p.id, p.platform === "amazon" ? {
            ...p,
            price: null,
            imageUrl: p.imageUrl.includes("/editorial/") ? p.imageUrl : "/images/hardware/editorial/selection.svg",
          } : p]));
          for (const id of missing) cache.set(id, found.get(id) ?? null);
        })
        .catch(() => {
          for (const id of missing) cache.set(id, null);
        })
        .finally(() => pending.delete(key));
      pending.set(key, request);
    }
    await request;
  }
  return ids.map((id) => cache.get(id) ?? null);
}
