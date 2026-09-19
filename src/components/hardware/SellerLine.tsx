import type { HardwareItem } from "@/content/hardware";

export type MerchantPlatform = "amazon" | "aliexpress";

/** Boutique, note et ventes d'un produit de place de marché (AliExpress) : signal de confiance. */
export default function SellerLine({ item, isEn }: { item: HardwareItem; isEn: boolean }) {
  if (!item.seller) return null;
  const { name, rating, sales } = item.seller;
  const isOfficial = /official|flagship|direct store/i.test(name);
  const parts = [
    rating ? (isEn ? `${rating} positive` : `${rating} d'avis positifs`) : null,
    sales != null ? (isEn ? `${sales} sold` : `${sales} vente${sales > 1 ? "s" : ""}`) : null,
  ].filter(Boolean);
  return (
    <div className="hw-seller-line">
      {isOfficial && <span className="hw-seller-badge">{isEn ? "Brand store" : "Boutique officielle"}</span>}
      <span className="hw-seller-name">{name}</span>
      {parts.length > 0 && <span className="hw-seller-stats">{parts.join(" · ")}</span>}
    </div>
  );
}
