"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/hardware/AddToCartButton";
import { fetchCatalogProducts, type ClientProduct } from "@/lib/catalog/client";
import type { Locale } from "@/lib/i18n";

export default function ChatProductCard({ id, locale }: { id: string; locale: Locale }) {
  const isEn = locale === "en";
  const [product, setProduct] = useState<ClientProduct | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchCatalogProducts([id]).then(([p]) => {
      if (!cancelled) setProduct(p);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Identifiant cité par le modèle mais introuvable dans le catalogue réel (erreur de frappe,
  // hallucination) : on n'affiche rien plutôt que de risquer une carte fausse ou un lien cassé.
  if (!product) return null;

  const platformName = product.platform === "aliexpress" ? "AliExpress" : "Amazon";

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
        <span className="chatbot-product-card__price">
          {product.price.toFixed(2)} € <span className="chatbot-platform-tag">{platformName}</span>
        </span>
      </div>
      <div className="chatbot-product-card__actions">
        <AddToCartButton
          size="sm"
          locale={locale}
          item={{
            platform: product.platform,
            asin: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            priceAmazon: product.price,
            amazonUrl: product.url,
          }}
        />
        <a
          href={product.url}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="chatbot-product-card__link"
          title={isEn ? `Open the ${platformName} product page` : `Ouvrir la fiche produit ${platformName}`}
          aria-label={isEn ? `Open on ${platformName}` : `Voir sur ${platformName}`}
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
