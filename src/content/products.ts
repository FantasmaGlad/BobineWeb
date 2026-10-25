import "server-only";
import data from "./products.json";
import { buildProductUrl, type ProductSource } from "@/lib/productSources";
import type { HardwareItem } from "./hardwareTypes";

export interface Product {
  asin?: string;
  id?: string;
  source: ProductSource;
  name: {fr:string;en:string};
  category: HardwareItem["category"];
  illustration: string;
  hasFan: boolean;
  listing: string;
  review: {status:string;sourceDate:string};
  requirements: {fr:string;en:string};
}
export const PRODUCTS = data as Record<string, Product>;
export function productHref(product: Product): string {
  return product.source === "amazon" ? buildProductUrl(product.asin!) : product.listing;
}
/** Adaptateur pour les consommateurs du catalogue commun. Amazon n'expose aucun prix stocké. */
export function productItem(id: string, locale: "fr"|"en" = "fr"): HardwareItem {
  const p=PRODUCTS[id];
  if (!p) throw new Error(`Produit absent : ${id}`);
  return {id,asin:id,name:p.name[locale],category:p.category,specs:p.requirements[locale],description:p.requirements[locale],imageUrl:p.illustration,amazonUrl:productHref(p),priceAmazon:null,hasFan:p.hasFan};
}
