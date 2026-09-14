"use client";

import { useState } from "react";
import Image from "next/image";
import { useHardwareCart, type CartItem } from "@/lib/hardwareCart";
import type { Locale } from "@/lib/i18n";

export default function HardwareCartBar({ locale }: { locale: Locale }) {
  const { items, count, total, removeItem, clear } = useHardwareCart();
  const isEn = locale === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [blockedItems, setBlockedItems] = useState<CartItem[]>([]);

  // Amazon ne propose pas de panier multi-produits via lien affilie : on tente
  // d'ouvrir un onglet par produit retenu. La plupart des navigateurs bloquent
  // les fenetres popup au-dela de la premiere par clic utilisateur : celles qui
  // echouent sont listees juste apres comme de vrais liens cliquables (un clic
  // direct sur une balise <a> n'est jamais bloque, contrairement a window.open).
  const openAllInTabs = () => {
    const blocked: CartItem[] = [];
    for (const item of items) {
      const win = window.open(item.amazonUrl, "_blank", "noopener,noreferrer");
      if (!win) blocked.push(item);
    }
    setBlockedItems(blocked);
  };

  if (count === 0 && !isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="hw-cart-fab"
        onClick={() => {
          setBlockedItems([]);
          setIsOpen(true);
        }}
        aria-label={isEn ? `Open my pack (${count} items)` : `Ouvrir mon pack (${count} articles)`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span className="hw-cart-fab-total">{total.toFixed(0)} €</span>
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
                items.map((item) => (
                  <div key={item.asin} className="hw-cart-sheet-row">
                    <div className="hw-cart-sheet-row-thumb">
                      <Image src={item.imageUrl} alt={item.name} width={44} height={44} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                    </div>
                    <div className="hw-cart-sheet-row-info">
                      <span className="hw-cart-sheet-row-name">{item.name}</span>
                      <span className="hw-cart-sheet-row-price">{item.priceAmazon.toFixed(2)} €</span>
                    </div>
                    <a
                      href={item.amazonUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="hw-cart-sheet-row-link"
                      title={isEn ? "Open on Amazon" : "Voir sur Amazon"}
                      aria-label={isEn ? `Open ${item.name} on Amazon` : `Voir ${item.name} sur Amazon`}
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
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="hw-cart-sheet-footer">
                <div className="hw-cart-sheet-total">
                  <span>{isEn ? "Estimated total" : "Total estimé"}</span>
                  <strong>{total.toFixed(2)} €</strong>
                </div>
                <p className="hw-cart-sheet-note">
                  {isEn
                    ? `Opens ${count} Amazon tab${count > 1 ? "s" : ""} — one per product. Amazon's affiliate program has no shared multi-item cart link.`
                    : `Ouvre ${count} onglet${count > 1 ? "s" : ""} Amazon — un par produit. Le programme d'affiliation Amazon ne permet pas de lien de panier partagé.`}
                </p>
                <div className="hw-cart-sheet-actions">
                  <button
                    type="button"
                    className="btn-secondary hw-cart-sheet-clear"
                    onClick={() => {
                      clear();
                      setBlockedItems([]);
                    }}
                  >
                    {isEn ? "Empty" : "Vider"}
                  </button>
                  <button type="button" className="btn-primary hw-cart-sheet-checkout" onClick={openAllInTabs}>
                    {isEn ? `Open on Amazon (${count})` : `Ouvrir sur Amazon (${count})`}
                  </button>
                </div>

                {blockedItems.length > 0 && (
                  <div className="hw-cart-sheet-blocked">
                    <p className="hw-cart-sheet-blocked-note">
                      {isEn
                        ? `Your browser blocked ${blockedItems.length} pop-up tab${blockedItems.length > 1 ? "s" : ""} — open ${blockedItems.length > 1 ? "them" : "it"} manually below:`
                        : `Votre navigateur a bloqué ${blockedItems.length} onglet${blockedItems.length > 1 ? "s" : ""} — ouvrez-le${blockedItems.length > 1 ? "s" : ""} manuellement ci-dessous :`}
                    </p>
                    <div className="hw-cart-sheet-blocked-list">
                      {blockedItems.map((item) => (
                        <a
                          key={item.asin}
                          href={item.amazonUrl}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          className="hw-cart-sheet-blocked-link"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
