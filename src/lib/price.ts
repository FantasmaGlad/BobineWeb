/** Prix Amazon : `null` quand il n'a pas pu être relevé (à consulter sur la fiche Amazon). */
export function formatPrice(price: number | null | undefined, digits = 2): string | null {
  return typeof price === "number" ? `${price.toFixed(digits)} €` : null;
}

export function sumPrices(items: { priceAmazon: number | null }[]): { total: number; unknown: number } {
  let total = 0;
  let unknown = 0;
  for (const item of items) {
    if (typeof item.priceAmazon === "number") total += item.priceAmazon;
    else unknown += 1;
  }
  return { total, unknown };
}
