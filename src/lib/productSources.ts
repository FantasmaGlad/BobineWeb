/** Provenance d'une fiche, commune aux catalogues marchands et aux fiches fabricant. */
export type ProductSource = "amazon" | "aliexpress" | "manufacturer";
export const AMAZON_STORE_ID = "fantasmaglad-21";
export function buildProductUrl(asin: string): string {
  return `https://www.amazon.fr/dp/${asin}?tag=${AMAZON_STORE_ID}`;
}
export function productSourceLabel(source: ProductSource): string {
  return {amazon:"Amazon",aliexpress:"AliExpress",manufacturer:"Fabricant / Manufacturer"}[source];
}
