"use client";

import { useState } from "react";
import { formatPrice, sumPrices } from "@/lib/price";
import Image from "next/image";
import { useHardwareCart, cartItemPlatform, type CartItem, type CartPlatform } from "@/lib/hardwareCart";
import { AMAZON_STORE_ID } from "@/content/hardware";
import type { Locale } from "@/lib/i18n";
import "@/styles/split/pages-hardware.css";

export default function HardwareCartBar({ locale }: { locale: Locale }) {
  const { items, count, total, unknownPrices, removeItem, clear } = useHardwareCart();
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  // Fiches AliExpress déjà ouvertes dans cette session du panier (le lien de suivi est propre à
  // chaque produit : AliExpress n'a pas de panier partagé côté affiliation).
  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const groups = (["amazon", "aliexpress"] as CartPlatform[])
    .map((platform) => {
      const groupItems = items.filter((i) => cartItemPlatform(i) === platform);
      return { platform, items: groupItems, total: sumPrices(groupItems).total, unknown: sumPrices(groupItems).unknown };
    })
    .filter((g) => g.items.length > 0);

  // Amazon : le formulaire officiel d'ajout au panier des Partenaires ajoute tous les articles
  // d'un coup, avec le tag d'affiliation, dans un seul onglet.
  const amazonCartUrl = (groupItems: CartItem[]) => {
    const params = new URLSearchParams({ AssociateTag: AMAZON_STORE_ID, tag: AMAZON_STORE_ID });
    groupItems.forEach((item, index) => {
      params.set(`ASIN.${index + 1}`, item.asin);
      params.set(`Quantity.${index + 1}`, "1");
    });
    return `https://www.amazon.fr/gp/aws/cart/add.html?${params.toString()}`;
  };

  // AliExpress : un onglet par clic. Chaque ouverture est un geste utilisateur direct, donc jamais
  // bloquée comme popup, contrairement à une salve de window.open.
  const openNextAliexpress = (groupItems: CartItem[]) => {
    const next = groupItems.find((i) => !opened[i.asin]);
    if (!next) {
      setOpened((prev) => {
        const copy = { ...prev };
        groupItems.forEach((i) => delete copy[i.asin]);
        return copy;
      });
      return;
    }
    window.open(next.amazonUrl, "_blank", "noopener,noreferrer");
    setOpened((prev) => ({ ...prev, [next.asin]: true }));
  };

  if (count === 0 && !isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="hw-cart-fab"
        onClick={() => setIsOpen(true)}
        aria-label={isEn ? `Open my pack (${count} items)` : `Ouvrir mon pack (${count} articles)`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span className="hw-cart-fab-total">{total > 0 ? `${unknownPrices > 0 ? "≥ " : ""}${total.toFixed(0)} €` : "—"}</span>
        {count > 0 && (
          <span key={count} className="hw-cart-fab-badge">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="hw-cart-overlay" onClick={() => setIsOpen(false)}>
          <div className="hw-cart-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={isEn ? "My pack" : "Mon pack"}>
            <div className="hw-cart-sheet-header">
              <h3>{isEn ? `My Pack (${count})` : `Mon Pack (${count})`}</h3>
              <button type="button" className="hw-cart-sheet-close" onClick={() => setIsOpen(false)} aria-label={isEn ? "Close" : "Fermer"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="hw-cart-sheet-list">
              {items.length === 0 ? (
                <div className="hw-cart-sheet-empty">
                  <p>
                    {isEn
                      ? "Your pack is empty. Click \"Add to pack\" on any product to start building your setup."
                      : "Votre pack est vide. Cliquez sur « Ajouter au pack » sur un produit pour commencer à construire votre configuration."}
                  </p>
                </div>
              ) : (
                groups.map((group) => {
                  const name = group.platform === "aliexpress" ? "AliExpress" : "Amazon";
                  const openedCount = group.items.filter((i) => opened[i.asin]).length;
                  const allOpened = openedCount === group.items.length;
                  return (
                    <section key={group.platform} className={`hw-cart-group hw-cart-group--${group.platform}`}>
                      <header className="hw-cart-group__head">
                        <span className="hw-cart-group__chip">{name}</span>
                        <span className="hw-cart-group__meta">
                          {isEn
                            ? `${group.items.length} item${group.items.length > 1 ? "s" : ""}`
                            : `${group.items.length} article${group.items.length > 1 ? "s" : ""}`}
                          {" · "}
                          <strong>{group.total > 0 ? `${group.unknown > 0 ? "≥ " : ""}${group.total.toFixed(2)} €` : (isEn ? "price on the store" : "prix sur la boutique")}</strong>
                        </span>
                      </header>

                      {group.items.map((item) => (
                        <div key={item.asin} className={`hw-cart-sheet-row ${opened[item.asin] ? "is-opened" : ""}`}>
                          <div className="hw-cart-sheet-row-thumb">
                            <Image src={item.imageUrl} alt={item.name} width={44} height={44} className="hw-image-3" />
                          </div>
                          <div className="hw-cart-sheet-row-info">
                            <span className="hw-cart-sheet-row-name">{item.name}</span>
                            <span className="hw-cart-sheet-row-price">{formatPrice(item.priceAmazon) ?? (isEn ? "See price on Amazon" : "Voir le prix sur Amazon")}</span>
                          </div>
                          <a
                            href={item.amazonUrl}
                            target="_blank"
                            rel="nofollow sponsored noopener noreferrer"
                            className="hw-cart-sheet-row-link"
                            title={isEn ? `Open on ${name}` : `Voir sur ${name}`}
                            aria-label={isEn ? `Open ${item.name} on ${name}` : `Voir ${item.name} sur ${name}`}
                            onClick={() => group.platform === "aliexpress" && setOpened((prev) => ({ ...prev, [item.asin]: true }))}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            className="hw-cart-sheet-row-remove"
                            onClick={() => removeItem(item.asin)}
                            aria-label={isEn ? `Remove ${item.name}` : `Retirer ${item.name}`}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {group.platform === "amazon" ? (
                        <>
                          <a
                            href={amazonCartUrl(group.items)}
                            target="_blank"
                            rel="nofollow sponsored noopener noreferrer"
                            className="btn-primary hw-cart-group__cta"
                          >
                            {isEn
                              ? `Add ${group.items.length} item${group.items.length > 1 ? "s" : ""} to my Amazon cart`
                              : `Ajouter ${group.items.length} article${group.items.length > 1 ? "s" : ""} à mon panier Amazon`}
                          </a>
                          <p className="hw-cart-sheet-note">
                            {isEn
                              ? "One tab only: Amazon adds every item of this group to your cart, then you check out there."
                              : "Un seul onglet : Amazon ajoute tous les articles de ce groupe à votre panier, puis vous payez sur Amazon."}
                          </p>
                        </>
                      ) : (
                        <>
                          <button type="button" className="btn-primary hw-cart-group__cta" onClick={() => openNextAliexpress(group.items)}>
                            {allOpened
                              ? isEn ? "All opened - start over" : "Tout est ouvert - recommencer"
                              : isEn
                                ? `Open next AliExpress page (${openedCount + 1}/${group.items.length})`
                                : `Ouvrir la fiche AliExpress suivante (${openedCount + 1}/${group.items.length})`}
                          </button>
                          <p className="hw-cart-sheet-note">
                            {isEn
                              ? "AliExpress has no shared cart: each item opens in its own tab, one per click (never blocked by your browser). Add each one to your AliExpress cart there."
                              : "AliExpress n'a pas de panier partagé : chaque article s'ouvre dans son propre onglet, un par clic (jamais bloqué par le navigateur). Ajoutez chacun à votre panier AliExpress."}
                          </p>
                        </>
                      )}
                    </section>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="hw-cart-sheet-footer">
                <div className="hw-cart-sheet-total">
                  <span>{isEn ? "Estimated total" : "Total estimé"}</span>
                  <strong>{total > 0 ? `${unknownPrices > 0 ? "≥ " : ""}${total.toFixed(2)} €` : "—"}</strong>
                </div>
                <div className="hw-cart-sheet-actions">
                  <button
                    type="button"
                    className="btn-secondary hw-cart-sheet-clear"
                    onClick={() => {
                      clear();
                      setOpened({});
                    }}
                  >
                    {isEn ? "Empty" : "Vider"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
