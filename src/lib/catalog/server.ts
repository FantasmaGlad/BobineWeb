import "server-only";
import { buildCatalog, type CatalogEntry } from "./entries";
import { ALIEXPRESS_BUNDLES } from "@/content/aliexpressHardware";
import { getAliexpressCatalog } from "@/lib/aliexpress/catalog";
import type { HardwareOsBundle, OsKey } from "@/content/hardware";

export interface ServerCatalog {
  entries: CatalogEntry[];
  aliexpressBundles: Partial<Record<OsKey, HardwareOsBundle>>;
  aliexpressCheckedAt: string;
}

/** Catalogue unifié côté serveur, avec les prix AliExpress rafraîchis (cache 6 h) et repli statique. */
export async function getServerCatalog(): Promise<ServerCatalog> {
  let aliexpressBundles = ALIEXPRESS_BUNDLES;
  let aliexpressCheckedAt = "";
  try {
    const live = await getAliexpressCatalog();
    aliexpressBundles = live.bundles;
    aliexpressCheckedAt = live.checkedAt;
  } catch {
    // repli sur l'instantané statique
  }
  return { entries: buildCatalog(aliexpressBundles), aliexpressBundles, aliexpressCheckedAt };
}
