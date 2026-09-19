"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/hardware/AddToCartButton";
import { fetchCatalogProducts, type ClientProduct } from "@/lib/catalog/client";
import type { Locale } from "@/lib/i18n";

/**
 * Tableau comparatif affiché dans le chat. Toutes les données viennent du catalogue réel (résolues
 * par identifiant), jamais du texte du modèle : le verdict est dans le message, les faits ici.
 */
export default function ChatCompareCard({ ids, locale }: { ids: string[]; locale: Locale }) {
  const isEn = locale === "en";
  const [products, setProducts] = useState<ClientProduct[] | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    let cancelled = false;
    fetchCatalogProducts(ids).then((list) => {
      if (cancelled) return;
      // Un comparatif n'a de sens qu'entre produits de même nature (unités entre elles, câbles entre eux...).
      // Le modèle peut y glisser un accessoire : on ne garde que la catégorie la plus représentée
      // (les unités centrales l'emportent à égalité).
      const found = list.filter((p): p is ClientProduct => p !== null);
      const count = new Map<string, number>();
      for (const p of found) count.set(p.category, (count.get(p.category) ?? 0) + 1);
      const best = [...count.entries()].sort((a, b) => b[1] - a[1] || (a[0] === "uc" ? -1 : 1))[0]?.[0];
      setProducts(found.filter((p) => p.category === best));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!products || products.length < 2) return null;

  const cheapest = Math.min(...products.map((p) => p.price));
  const isUnit = products.every((p) => p.category === "uc");

  const rows: Array<{ label: string; render: (p: ClientProduct) => React.ReactNode }> = [
    {
      label: isEn ? "Store" : "Boutique",
      render: (p) => (p.platform === "aliexpress" ? "AliExpress" : "Amazon"),
    },
    {
      label: isEn ? "Price" : "Prix",
      render: (p) => (
        <strong className={p.price === cheapest ? "is-best" : undefined}>
          {p.price.toFixed(2)} €{p.platform === "aliexpress" ? (isEn ? " (from)" : " (dès)") : ""}
        </strong>
      ),
    },
    { label: isEn ? "Specs" : "Caractéristiques", render: (p) => p.specs },
    ...(isUnit
      ? [
          {
            label: isEn ? "Cooling" : "Refroidissement",
            render: (p: ClientProduct) => (p.hasFan ? (isEn ? "Fan" : "Ventilateur") : isEn ? "Fanless" : "Sans ventilateur"),
          },
        ]
      : []),
    {
      label: isEn ? "Seller" : "Vendeur",
      render: (p) =>
        p.seller
          ? `${p.seller.name}${p.seller.rating ? ` · ${p.seller.rating}` : ""}${p.seller.sales != null ? ` · ${p.seller.sales} ${isEn ? "sold" : "ventes"}` : ""}`
          : p.platform === "amazon"
            ? "Amazon"
            : "-",
    },
  ];

  return (
    <div className="chatbot-compare" role="region" aria-label={isEn ? "Product comparison" : "Comparatif de produits"}>
      <div className="chatbot-compare__scroll">
        <table className="chatbot-compare__table">
          <thead>
            <tr>
              <th aria-hidden="true" />
              {products.map((p) => (
                <th key={p.id} scope="col">
                  <div className="chatbot-compare__thumb">
                    <Image src={p.imageUrl} alt="" width={56} height={56} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                  </div>
                  <span className="chatbot-compare__name" title={p.name}>
                    {p.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {products.map((p) => (
                  <td key={p.id}>{row.render(p)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" aria-hidden="true" />
              {products.map((p) => (
                <td key={p.id} className="chatbot-compare__actions">
                  <AddToCartButton
                    size="sm"
                    locale={locale}
                    item={{
                      platform: p.platform,
                      asin: p.id,
                      name: p.name,
                      imageUrl: p.imageUrl,
                      priceAmazon: p.price,
                      amazonUrl: p.url,
                    }}
                  />
                  <a
                    href={p.url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="chatbot-product-card__link"
                    aria-label={isEn ? `Open ${p.name}` : `Voir ${p.name}`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
