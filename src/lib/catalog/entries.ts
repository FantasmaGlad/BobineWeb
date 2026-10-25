import {
  HARDWARE_BUNDLES,
  STANDALONE_ACCESSORIES,
  type FormFactorKey,
  type HardwareItem,
  type HardwareOsBundle,
  type OsKey,
  type TierKey,
} from "@/content/hardware";

import type { ProductSource } from "@/lib/productSources";
export type CatalogPlatform = Exclude<ProductSource, "manufacturer">;
export type CatalogRole = "main" | "alternative" | "accessory";

/** Un produit achetable, décrit de façon neutre quelle que soit la plateforme. */
export interface CatalogEntry {
  id: string; // ASIN (Amazon) ou product_id (AliExpress)
  platform: CatalogPlatform;
  name: string;
  /** Absent quand le prix n'a pas pu être relevé (fiche Amazon à consulter). */
  price: number | null;
  imageUrl: string;
  url: string;
  specs: string;
  description: string;
  category: HardwareItem["category"];
  hasFan: boolean;
  seller?: { name: string; rating: string | null; sales: number | null };
  isLive: boolean;
  os?: OsKey;
  form?: FormFactorKey;
  tier?: TierKey;
  role: CatalogRole;
}

export const OS_LABELS: Record<OsKey, string> = {
  linux: "Linux",
  windows: "Windows",
  macos: "macOS",
  arm: "PC & Mini PC ARM (Snapdragon / ARM64)",
  android: "Tablettes Android",
  "android-tv": "Android TV & Google TV",
};
export const FORM_LABELS: Record<FormFactorKey, string> = { minipc: "Mini PC", laptop: "PC Portable", tablet: "Tablette", tv: "Android TV & Box" };
export const TIER_LABELS: Record<TierKey, string> = { essentiel: "Essentiel", recommande: "Recommandé", pro: "Pro", premium: "Premium" };

type Bundles = Partial<Record<OsKey, HardwareOsBundle>>;

function toEntry(
  item: HardwareItem,
  platform: CatalogPlatform,
  role: CatalogRole,
  os: OsKey,
  form: FormFactorKey,
  tier: TierKey
): CatalogEntry {
  return {
    id: item.asin,
    platform,
    name: item.name,
    price: item.priceAmazon,
    imageUrl: item.imageUrl,
    url: item.amazonUrl,
    specs: item.specs,
    description: item.description,
    category: item.category,
    hasFan: item.hasFan,
    seller: item.seller,
    isLive: Boolean(item.isLive),
    os,
    form,
    tier,
    role,
  };
}

/** Entrées d'une gamme précise : unité principale, alternatives et accessoires (ce que la boutique affiche). */
export function getTierEntries(
  bundles: Bundles,
  platform: CatalogPlatform,
  os: OsKey,
  form: FormFactorKey,
  tier: TierKey
): CatalogEntry[] {
  const tierData = bundles[os]?.formFactors[form]?.tiers[tier];
  if (!tierData) return [];
  const main = tierData.items.find((i) => i.category === "uc") ?? tierData.items[0];
  const entries: CatalogEntry[] = [];
  for (const item of tierData.items) {
    if (platform === "amazon" && !/^[A-Z0-9]{10}$/.test(item.asin)) continue;
    entries.push(toEntry(item, platform, item.asin === main?.asin ? "main" : "accessory", os, form, tier));
  }
  for (const alt of tierData.alternativeUnits ?? []) {
    entries.push(toEntry(alt, platform, "alternative", os, form, tier));
  }
  return entries;
}

function collect(bundles: Bundles, platform: CatalogPlatform, into: Map<string, CatalogEntry>) {
  for (const [os, bundle] of Object.entries(bundles) as Array<[OsKey, HardwareOsBundle]>) {
    for (const form of Object.keys(bundle.formFactors) as FormFactorKey[]) {
      for (const tier of Object.keys(bundle.formFactors[form]!.tiers) as TierKey[]) {
        for (const entry of getTierEntries(bundles, platform, os, form, tier)) {
          if (!into.has(entry.id)) into.set(entry.id, entry);
        }
      }
    }
  }
}

/** Catalogue complet dédupliqué (Amazon statique + AliExpress éventuellement rafraîchi en direct). */
export function buildCatalog(aliexpressBundles: Bundles): CatalogEntry[] {
  const byId = new Map<string, CatalogEntry>();
  collect(HARDWARE_BUNDLES, "amazon", byId);
  collect(aliexpressBundles, "aliexpress", byId);

  for (const acc of STANDALONE_ACCESSORIES) {
    if (byId.has(acc.asin)) continue;
    byId.set(acc.asin, {
      id: acc.asin,
      platform: "amazon",
      name: acc.nameFr,
      price: acc.priceAmazon,
      imageUrl: acc.imageUrl,
      url: acc.amazonUrl,
      specs: acc.specs,
      description: acc.descriptionFr,
      category: "cable-video",
      hasFan: false,
      isLive: false,
      role: "accessory",
    });
  }
  return [...byId.values()];
}
