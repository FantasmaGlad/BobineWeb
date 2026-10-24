"use client";

import { useHardwareCart, type CartItem } from "@/lib/hardwareCart";
import { spawnConfettiBurst } from "@/lib/confettiBurst";
import type { Locale } from "@/lib/i18n";

interface AddToCartButtonProps {
  item: CartItem;
  locale: Locale;
  size?: "sm" | "md";
}

export default function AddToCartButton({ item, locale, size = "md" }: AddToCartButtonProps) {
  const { isInCart, toggleItem } = useHardwareCart();
  const isEn = locale === "en";
  const inCart = isInCart(item.asin);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!inCart) {
          const styles = getComputedStyle(e.currentTarget);
          const accent = styles.getPropertyValue("--accent-primary").trim();
          const surface = styles.getPropertyValue("--bg-card").trim();
          spawnConfettiBurst(e.clientX, e.clientY, {
            colors: [accent, styles.getPropertyValue("--text-muted").trim(), surface],
          });
        }
        toggleItem(item);
      }}
      aria-pressed={inCart}
      aria-label={inCart ? (isEn ? "Remove from pack" : "Retirer du pack") : (isEn ? "Add to pack" : "Ajouter au pack")}
      className={`hw-cart-toggle-btn ${inCart ? "is-added" : ""} ${size === "sm" ? "hw-cart-toggle-btn--sm" : ""}`}
      title={inCart ? (isEn ? "Remove from pack" : "Retirer du pack") : (isEn ? "Add to pack" : "Ajouter au pack")}
    >
      {inCart ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      )}
      {size !== "sm" && <span>{inCart ? (isEn ? "Added" : "Ajouté") : (isEn ? "Add to pack" : "Ajouter au pack")}</span>}
    </button>
  );
}
