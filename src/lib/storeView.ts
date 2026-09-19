import type { FormFactorKey, OsKey, TierKey } from "@/content/hardware";

/**
 * Ce que le visiteur regarde actuellement dans la boutique matériel. Publié par la boutique,
 * lu par Baamix au moment d'envoyer un message : il ne transmet que la sélection (plateforme,
 * OS, forme, gamme) ; le détail des produits est reconstruit côté serveur depuis le catalogue.
 */
export interface StoreView {
  platform: "amazon" | "aliexpress";
  os: OsKey;
  form: FormFactorKey;
  tier: TierKey;
}

const EVENT = "bobine-store-view-changed";
const KEY = "__bobineStoreView";

type ViewWindow = Window & { [KEY]?: StoreView | null };

export function publishStoreView(view: StoreView | null) {
  if (typeof window === "undefined") return;
  (window as ViewWindow)[KEY] = view;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function readStoreView(): StoreView | null {
  if (typeof window === "undefined") return null;
  return (window as ViewWindow)[KEY] ?? null;
}

export function subscribeStoreView(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
