"use client";

import React from "react";
import Image from "next/image";
import { type Locale } from "@/lib/i18n";
import { PRICE_CHECKED_AT, type HardwareItem } from "@/content/hardware";
import AddToCartButton from "@/components/hardware/AddToCartButton";

function formatCheckedDate(iso: string, isEn: boolean) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const CATEGORY_LABELS: Record<HardwareItem["category"], { fr: string; en: string }> = {
  uc: { fr: "Unité", en: "Unit" },
  "cable-video": { fr: "Vidéo", en: "Video" },
  network: { fr: "Réseau", en: "Network" },
  control: { fr: "Contrôle", en: "Control" },
  "power-hub": { fr: "Connectique", en: "Connectivity" },
  mount: { fr: "Fixation", en: "Mount" },
  storage: { fr: "Stockage", en: "Storage" },
};

export default function HardwareAccessoriesGrid({ locale, items }: { locale: Locale; items: HardwareItem[] }) {
  const isEn = locale === "en";
  const checkedDate = formatCheckedDate(PRICE_CHECKED_AT, isEn);

  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: "3.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "var(--text-heading)",
            margin: "0 0 0.5rem 0",
          }}
        >
          {isEn
            ? "Essential Studio Connectors, Remotes & Mounts"
            : "Connectique Studio, Télécommandes & Fixations Testées"}
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
          {isEn
            ? "Need to complete your existing setup? These certified cables, wireless remotes, and secure mounts have been vetted for 24/7 reliability in gym environments."
            : "Vous possédez déjà une machine ? Retrouvez ici la câblerie blindée, les télécommandes sans fil et les supports muraux antivol testés et approuvés pour tourner en continu dans votre salle."}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {items.map((acc) => {
          const name = acc.name;
          const desc = acc.description;
          const cat = isEn ? CATEGORY_LABELS[acc.category].en : CATEGORY_LABELS[acc.category].fr;

          return (
            <div
              key={acc.id}
              className="hw-item-card"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.65rem",
                padding: "1.15rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--accent-primary)",
                      background: "var(--bg-inset)",
                      border: "1px solid var(--border-subtle)",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "0.3rem",
                    }}
                  >
                    {cat}
                  </span>
                  <span
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text-heading)",
                    }}
                  >
                    {acc.priceAmazon.toFixed(2)} €
                  </span>
                </div>

                {/* Miniature photo et en-tête produit */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.85rem",
                    marginBottom: "0.75rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "0.45rem",
                      border: "1px solid var(--border-subtle)",
                      background: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={acc.imageUrl}
                      alt=""
                      width={56}
                      height={56}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                        padding: "4px",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "0.925rem",
                        fontWeight: 700,
                        color: "var(--text-heading)",
                        lineHeight: 1.35,
                        margin: "0 0 0.35rem 0",
                      }}
                    >
                      {name}
                    </h3>
                    <div
                      style={{
                        fontSize: "0.725rem",
                        fontWeight: 600,
                        color: "var(--text-heading)",
                        background: "var(--bg-inset)",
                        padding: "0.2rem 0.45rem",
                        borderRadius: "0.3rem",
                        display: "inline-block",
                        fontFamily: "var(--font-mono, monospace)",
                      }}
                    >
                      {acc.specs}
                    </div>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.45,
                    margin: "0 0 1rem 0",
                  }}
                >
                  {desc}
                </p>
              </div>

              <div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <a
                    href={acc.amazonUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="btn-secondary"
                    title={isEn ? "Open official Amazon product sheet" : "Ouvrir la fiche produit officielle Amazon"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      flex: 1,
                      minWidth: 0,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.45rem",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span>{isEn ? "Product Sheet (Amazon)" : "Fiche Produit (Amazon)"}</span>
                  </a>
                  <AddToCartButton
                    size="sm"
                    locale={locale}
                    item={{
                      asin: acc.asin,
                      name,
                      imageUrl: acc.imageUrl,
                      priceAmazon: acc.priceAmazon,
                      amazonUrl: acc.amazonUrl,
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "0.35rem" }}>
                  <span style={{ fontSize: "0.675rem", color: "var(--text-muted)" }}>
                    {isEn ? `Price checked ${checkedDate}` : `Prix constaté le ${checkedDate}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
