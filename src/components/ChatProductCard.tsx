"use client";

import Image from "next/image";
import { findHardwareItemByAsin } from "@/content/hardware";
import AddToCartButton from "@/components/hardware/AddToCartButton";
import type { Locale } from "@/lib/i18n";

export default function ChatProductCard({ asin, locale }: { asin: string; locale: Locale }) {
  const isEn = locale === "en";
  const product = findHardwareItemByAsin(asin, isEn ? "en" : "fr");

  // ASIN cite par le modele mais introuvable dans le catalogue reel (erreur de
  // frappe, hallucination) : on n'affiche rien plutot que de risquer une carte
  // fausse ou un lien casse.
  if (!product) return null;

  return (
    <div className="chatbot-product-card">
      <div className="chatbot-product-card__thumb">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={44}
          height={44}
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
        />
      </div>
      <div className="chatbot-product-card__info">
        <span className="chatbot-product-card__name">{product.name}</span>
        <span className="chatbot-product-card__price">{product.priceAmazon.toFixed(2)} €</span>
      </div>
      <div className="chatbot-product-card__actions">
        <AddToCartButton size="sm" locale={locale} item={product} />
        <a
          href={product.amazonUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="chatbot-product-card__link"
          title={isEn ? "Open official Amazon product sheet" : "Ouvrir la fiche produit officielle Amazon"}
          aria-label={isEn ? "Open on Amazon" : "Voir sur Amazon"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
