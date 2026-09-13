"use client";

import React, { useState } from "react";
import Image from "next/image";
import { type Locale } from "@/lib/i18n";
import {
  HARDWARE_BUNDLES,
  type OsKey,
  type TierKey,
  type HardwareItem,
} from "@/content/hardware";
import LinuxIcon from "@/components/icons/LinuxIcon";
import WindowsIcon from "@/components/icons/WindowsIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import VendorBadge from "@/components/hardware/VendorBadge";

interface HardwareBundleTabsProps {
  locale: Locale;
}

export default function HardwareBundleTabs({ locale }: HardwareBundleTabsProps) {
  const isEn = locale === "en";

  const [selectedOs, setSelectedOs] = useState<OsKey>("linux");
  const [selectedTier, setSelectedTier] = useState<TierKey>("recommande");

  const currentBundle = HARDWARE_BUNDLES[selectedOs];
  const currentTier = currentBundle.tiers[selectedTier] || currentBundle.tiers.recommande;

  // Calcul du total estimé du pack
  const totalAmazon = currentTier.items.reduce((acc, item) => acc + item.priceEstAmazon, 0);
  const totalRecon = currentTier.items.reduce(
    (acc, item) => acc + (item.priceEstRecon ?? item.priceEstAmazon * 0.75),
    0
  );
  const totalAli = currentTier.items.reduce(
    (acc, item) => acc + (item.priceEstAli ?? item.priceEstAmazon * 0.65),
    0
  );

  const osList: Array<{ id: OsKey; label: string; badge?: string; icon: React.ReactNode }> = [
    {
      id: "linux",
      label: "Linux Appliance",
      badge: isEn ? "Official Pick" : "Choix Officiel",
      icon: <LinuxIcon size={18} />,
    },
    {
      id: "windows",
      label: "Windows Desktop",
      badge: isEn ? "Mini PC" : "Mini PC",
      icon: <WindowsIcon size={18} />,
    },
    {
      id: "macos",
      label: "macOS Studio",
      badge: isEn ? "Apple Silicon" : "Apple Silicon",
      icon: <AppleIcon size={18} />,
    },
    {
      id: "android",
      label: "Android Tactile",
      badge: isEn ? "Tablet" : "Tablette",
      icon: <AndroidIcon size={18} />,
    },
  ];

  const tierList: Array<{ id: TierKey; label: string; sub: string }> = [
    {
      id: "essentiel",
      label: isEn ? "Essentiel" : "Essentiel",
      sub: isEn ? "Budget Friendly" : "Premier Prix",
    },
    {
      id: "recommande",
      label: isEn ? "Recommandé" : "Recommandé",
      sub: isEn ? "Studio Balance" : "Choix Bobine",
    },
    {
      id: "pro",
      label: isEn ? "Pro" : "Gamme Pro",
      sub: isEn ? "High Cadence" : "Multi-Écrans",
    },
    {
      id: "premium",
      label: isEn ? "Premium" : "Premium",
      sub: isEn ? "No Compromise" : "Sans Compromis",
    },
  ];

  return (
    <div style={{ marginTop: "1rem" }}>
      {/* 1. SÉLECTEUR D'OS (4 Onglets principaux) */}
      <div
        role="tablist"
        aria-label={isEn ? "Operating System selection" : "Sélection du système d'exploitation"}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        {osList.map((item) => {
          const isActive = selectedOs === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setSelectedOs(item.id);
                if (!HARDWARE_BUNDLES[item.id].tiers[selectedTier]) {
                  setSelectedTier("recommande");
                }
              }}
              style={{
                font: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: isActive ? "2px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                background: isActive ? "var(--bg-card)" : "var(--bg-surface)",
                color: isActive ? "var(--text-heading)" : "var(--text-muted)",
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ color: isActive ? "var(--accent-primary)" : "currentColor" }}>
                  {item.icon}
                </span>
                <span style={{ fontWeight: isActive ? 700 : 500, fontSize: "0.875rem" }}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: "0.675rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    padding: "0.15rem 0.4rem",
                    borderRadius: "0.3rem",
                    background: isActive ? "var(--accent-primary)" : "var(--bg-inset)",
                    color: isActive ? "var(--accent-primary-fg)" : "var(--text-muted)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. BANDEAU DE L'OS SÉLECTIONNÉ */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text-heading)",
                  margin: 0,
                }}
              >
                {isEn ? currentBundle.titleEn : currentBundle.titleFr}
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 0.4rem 0" }}>
              {isEn ? currentBundle.subtitleEn : currentBundle.subtitleFr}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {isEn ? "Target use-case :" : "Usage type :"}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-heading)",
                  background: "var(--bg-inset)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "0.3rem",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {isEn ? currentBundle.targetEn : currentBundle.targetFr}
              </span>
            </div>
          </div>

          {/* 3. SÉLECTEUR DE GAMME INTERNE (Essentiel, Recommandé, Pro, Premium) */}
          <div
            className="stepper-mode-toggle"
            role="tablist"
            aria-label={isEn ? "Tier level" : "Gamme de performance"}
            style={{ alignSelf: "center", flexWrap: "wrap" }}
          >
            {tierList.map((tier) => {
              const isTierActive = selectedTier === tier.id;
              return (
                <button
                  key={tier.id}
                  role="tab"
                  aria-selected={isTierActive}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`stepper-mode-btn ${isTierActive ? "is-active" : ""}`}
                  style={{
                    padding: "0.45rem 0.85rem",
                    fontSize: "0.775rem",
                  }}
                >
                  <span>{tier.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. DÉTAILS DE LA GAMME ACTIVE */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-heading)",
                  margin: 0,
                }}
              >
                {isEn ? currentTier.headlineEn : currentTier.headlineFr}
              </h3>
              {currentTier.badgeFr && (
                <span
                  style={{
                    fontSize: "0.675rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "0.3rem",
                    background: "var(--accent-primary)",
                    color: "var(--accent-primary-fg)",
                  }}
                >
                  {isEn ? currentTier.badgeEn : currentTier.badgeFr}
                </span>
              )}
            </div>

            {/* Badges télémétrie matérielle (Watts & Résolution) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.725rem",
                  fontWeight: 600,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "0.3rem",
                  background: "var(--bg-inset)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-heading)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span>{currentTier.powerWatts}</span>
              </span>
              <span
                style={{
                  fontSize: "0.725rem",
                  fontWeight: 600,
                  padding: "0.2rem 0.5rem",
                  borderRadius: "0.3rem",
                  background: "var(--bg-inset)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-heading)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>{currentTier.resolution}</span>
              </span>
            </div>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
            {isEn ? currentTier.summaryEn : currentTier.summaryFr}
          </p>

          {/* Note de transparence tarifaire pour le Wyse 5070 */}
          {selectedOs === "linux" && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "0.45rem",
                background: "var(--bg-inset)",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.775rem",
                color: "var(--text-muted)",
                lineHeight: 1.4,
              }}
            >
              <strong style={{ color: "var(--text-heading)" }}>
                {isEn ? "Market Availability Note :" : "Note sur l'approvisionnement du Wyse 5070 :"}
              </strong>{" "}
              {isEn
                ? "The Dell Wyse 5070 is an enterprise decommissioned model. Amazon pricing reflects certified renewed availability (~€130 - €160). For budget second-hand deals (€55 - €75), check circular economy platforms (eBay, Back Market, AfB Shop). If you prefer a brand new unit with direct manufacturer warranty on Amazon, check the Windows Mini PC tab (Intel N100)."
                : "Le Dell Wyse 5070 étant un matériel d'entreprise déclassé, son tarif sur Amazon correspond aux stocks reconditionnés certifiés (~130 € - 160 €). Pour dénicher le meilleur prix d'occasion (55 € - 75 €), privilégiez les circuits de reconditionnement (eBay, Back Market, AfB Shop). Si vous souhaitez une machine neuve sous garantie constructeur directe sur Amazon, consultez l'onglet Windows Mini PC (Intel N100)."}
            </div>
          )}
        </div>

        {/* 5. LISTE DES COMPOSANTS DU PACK AVEC PHOTOS & LIENS DIRECTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.75rem" }}>
          {currentTier.items.map((item: HardwareItem) => {
            return (
              <div
                key={item.id}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.55rem",
                  padding: "1rem",
                  display: "grid",
                  gridTemplateColumns: "72px minmax(0, 1fr) auto",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* Miniature photo du produit */}
                <div
                  style={{
                    width: "72px",
                    height: "72px",
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
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: "100%",
                      padding: "4px",
                    }}
                  />
                </div>

                {/* Descriptif technique */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <h4
                      style={{
                        fontSize: "0.925rem",
                        fontWeight: 700,
                        color: "var(--text-heading)",
                        margin: 0,
                      }}
                    >
                      {item.name}
                    </h4>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                      fontFamily: "var(--font-mono, monospace)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {item.specs}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>

                {/* Prix et bouton direct fiche produit Amazon */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
                  <span
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 800,
                      color: "var(--text-heading)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ~{item.priceEstAmazon.toFixed(2)} €
                  </span>
                  <a
                    href={item.amazonUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="btn-secondary"
                    title={isEn ? "Open official Amazon product sheet" : "Ouvrir la fiche produit officielle Amazon"}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.4rem 0.75rem",
                      borderRadius: "0.35rem",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
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
                  <span
                    style={{
                      fontSize: "0.675rem",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono, monospace)",
                    }}
                  >
                    Réf {item.asin}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. SYNTHÈSE BUDGÉTAIRE ET REPERES MULTI-CANAUX */}
        <div
          style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "0.65rem",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.725rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                  display: "block",
                  marginBottom: "0.2rem",
                }}
              >
                {isEn ? "Estimated Pack Total (Hardware + All Cables)" : "Total Estimé du Pack Complet (Unité + Tous Câbles)"}
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "var(--accent-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ~{totalAmazon.toFixed(2)} €
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {isEn ? "via Amazon (Prime / Fast 24-48h shipping)" : "via Amazon (Livraison express 24-48h)"}
                </span>
              </div>
            </div>

            <a
              href={currentTier.items[0]?.amazonUrl || `https://www.amazon.fr/dp/${currentTier.items[0]?.asin}?tag=fantasmaglad-21`}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                padding: "0.6rem 1.15rem",
                borderRadius: "0.45rem",
                textDecoration: "none",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>{isEn ? "View Central Unit on Amazon" : "Voir l'Unité Centrale sur Amazon"}</span>
            </a>
          </div>

          {/* Comparatif direct informatif transparent */}
          <div>
            <span
              style={{
                fontSize: "0.725rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              {isEn ? "Transparent Channel Price Benchmark :" : "Repères Comparatifs Multi-Canaux en Toute Transparence :"}
            </span>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {/* Canal Amazon */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--accent-primary)",
                  borderRadius: "0.45rem",
                  padding: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <VendorBadge channel="amazon" size="sm" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>
                    ~{totalAmazon.toFixed(0)} €
                  </span>
                </div>
                <p style={{ fontSize: "0.725rem", color: "var(--text-muted)", margin: 0 }}>
                  {isEn
                    ? "Delivery in 24-48h · Full A-to-Z guarantee · Direct product sheets"
                    : "Livraison 24-48h · Garantie A à Z · Fiches directes"}
                </p>
              </div>

              {/* Canal Reconditionné (AfB Shop / eBay) */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.45rem",
                  padding: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <VendorBadge channel="reconditionne" label="Reconditionné" size="sm" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>
                    ~{totalRecon.toFixed(0)} €
                  </span>
                </div>
                <p style={{ fontSize: "0.725rem", color: "var(--text-muted)", margin: 0 }}>
                  {isEn
                    ? "Circular economy · Decommissioned pro units · -25% to -40% savings"
                    : "Économie circulaire · Parcs pro déclassés · 25% à 40% d'économie"}
                </p>
              </div>

              {/* Canal AliExpress Direct Usine */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.45rem",
                  padding: "0.75rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <VendorBadge channel="aliexpress" label="Direct Usine" size="sm" />
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)" }}>
                    ~{totalAli.toFixed(0)} €
                  </span>
                </div>
                <p style={{ fontSize: "0.725rem", color: "var(--text-muted)", margin: 0 }}>
                  {isEn
                    ? "Factory direct · 7-12 days shipping · Floor prices on remotes & cables"
                    : "Direct usine · Délais 7-12j · Prix plancher sur câbles & récepteurs"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
