import "server-only";
import { unstable_cache } from "next/cache";
import type { HardwareItem, HardwareOsBundle, HardwareTier, OsKey } from "@/content/hardware";
import { ALIEXPRESS_BUNDLES, ALIEXPRESS_SNAPSHOT_DATE, getAliexpressProductIds } from "@/content/aliexpressHardware";
import { AliexpressApiError, callAliexpress } from "./client";

interface LiveProduct {
  price: number;
  link?: string;
  rating: string | null;
  sales: number | null;
}

interface DetailResponse {
  resp_result?: {
    result?: {
      products?: {
        product?: Array<{
          product_id: number | string;
          target_sale_price: string;
          promotion_link?: string;
          evaluate_rate?: string;
          lastest_volume?: number;
        }>;
      };
    };
  };
}

const REVALIDATE_SECONDS = 6 * 60 * 60;
const PARALLEL = 3;

async function fetchOne(id: string): Promise<[string, LiveProduct] | null> {
  try {
    const res = await callAliexpress<DetailResponse>("aliexpress.affiliate.productdetail.get", {
      product_ids: id,
      target_currency: "EUR",
      target_language: "FR",
      country: "FR",
      ship_to_country: "FR",
    });
    const p = res.resp_result?.result?.products?.product?.[0];
    const price = p ? Number(p.target_sale_price) : NaN;
    if (!p || !Number.isFinite(price) || price <= 0) return null;
    return [String(p.product_id), { price, link: p.promotion_link, rating: p.evaluate_rate ?? null, sales: p.lastest_volume ?? null }];
  } catch (error) {
    if (!(error instanceof AliexpressApiError)) throw error;
    return null;
  }
}

async function loadLive(): Promise<{ products: Record<string, LiveProduct>; fetchedAt: string }> {
  const ids = getAliexpressProductIds();
  const products: Record<string, LiveProduct> = {};
  for (let i = 0; i < ids.length; i += PARALLEL) {
    const chunk = await Promise.all(ids.slice(i, i + PARALLEL).map(fetchOne));
    for (const entry of chunk) if (entry) products[entry[0]] = entry[1];
  }
  return { products, fetchedAt: new Date().toISOString().slice(0, 10) };
}

// L'API renvoie parfois une liste vide (limitation de débit) : un produit absent garde simplement
// son instantané. Le résultat n'est mis en cache que s'il n'est pas vide.
const getLiveCached = unstable_cache(
  async () => {
    const live = await loadLive();
    if (Object.keys(live.products).length === 0) throw new Error("aliexpress-live-empty");
    return live;
  },
  ["aliexpress-live-v1"],
  { revalidate: REVALIDATE_SECONDS }
);

function mergeItem(item: HardwareItem, live: Record<string, LiveProduct>): HardwareItem {
  const fresh = live[item.asin];
  if (!fresh) return item;
  return {
    ...item,
    priceAmazon: fresh.price,
    amazonUrl: fresh.link || item.amazonUrl,
    seller: item.seller ? { ...item.seller, rating: fresh.rating ?? item.seller.rating, sales: fresh.sales ?? item.seller.sales } : item.seller,
  };
}

/** Catalogue AliExpress avec prix et liens rafraîchis en direct, repli par produit sur l'instantané. */
export async function getAliexpressCatalog(): Promise<{
  bundles: Partial<Record<OsKey, HardwareOsBundle>>;
  checkedAt: string;
  isLive: boolean;
}> {
  let live: Awaited<ReturnType<typeof loadLive>> | null = null;
  try {
    live = await getLiveCached();
  } catch {
    live = null;
  }
  if (!live) return { bundles: ALIEXPRESS_BUNDLES, checkedAt: ALIEXPRESS_SNAPSHOT_DATE, isLive: false };

  const products = live.products;
  const bundles: Partial<Record<OsKey, HardwareOsBundle>> = {};
  for (const [os, bundle] of Object.entries(ALIEXPRESS_BUNDLES) as Array<[OsKey, HardwareOsBundle]>) {
    const formFactors: HardwareOsBundle["formFactors"] = {};
    for (const [key, ff] of Object.entries(bundle.formFactors) as Array<[keyof HardwareOsBundle["formFactors"], NonNullable<HardwareOsBundle["formFactors"][keyof HardwareOsBundle["formFactors"]]>]>) {
      const tiers = Object.fromEntries(
        Object.entries(ff.tiers).map(([tierKey, tier]) => [
          tierKey,
          {
            ...tier,
            items: tier.items.map((i) => mergeItem(i, products)),
            alternativeUnits: tier.alternativeUnits?.map((i) => mergeItem(i, products)),
          } satisfies HardwareTier,
        ])
      ) as typeof ff.tiers;
      formFactors[key] = { ...ff, tiers };
    }
    bundles[os] = { ...bundle, formFactors };
  }
  return { bundles, checkedAt: live.fetchedAt, isLive: true };
}
