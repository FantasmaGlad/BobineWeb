"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { type Locale } from "@/lib/i18n";
import {
  HARDWARE_BUNDLES,
  STANDALONE_ACCESSORIES,
  PRICE_CHECKED_AT,
  type OsKey,
  type TierKey,
  type FormFactorKey,
  type HardwareItem,
} from "@/content/hardware";
import LinuxIcon from "@/components/icons/LinuxIcon";
import WindowsIcon from "@/components/icons/WindowsIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import VendorBadge from "@/components/hardware/VendorBadge";
import HardwareAccessoriesGrid from "@/components/hardware/HardwareAccessoriesGrid";

interface HardwareBundleTabsProps {
  locale: Locale;
}

function formatCheckedDate(iso: string, isEn: boolean) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function HardwareBundleTabs({ locale }: HardwareBundleTabsProps) {
  const isEn = locale === "en";
  const checkedDate = formatCheckedDate(PRICE_CHECKED_AT, isEn);

  const [selectedOs, setSelectedOs] = useState<OsKey>("linux");
  const [selectedFormFactor, setSelectedFormFactor] = useState<FormFactorKey>("minipc");
  const [selectedTier, setSelectedTier] = useState<TierKey>("recommande");

  const currentBundle = HARDWARE_BUNDLES[selectedOs];
  const formFactorKeys = Object.keys(currentBundle.formFactors) as FormFactorKey[];
  const activeFormFactorKey = currentBundle.formFactors[selectedFormFactor]
    ? selectedFormFactor
    : formFactorKeys[0];
  const currentFormFactor = currentBundle.formFactors[activeFormFactorKey]!;
  const currentTier = currentFormFactor.tiers[selectedTier] || currentFormFactor.tiers[currentFormFactor.defaultTier];

  const totalAmazon = currentTier.items.reduce((acc, item) => acc + item.priceAmazon, 0);
  const mainItem = currentTier.items.find((item) => item.category === "uc") ?? currentTier.items[0];
  const accessoryItems = currentTier.items.filter((item) => item.id !== mainItem?.id);
  const showFanBadge = activeFormFactorKey === "minipc" && (selectedOs === "linux" || selectedOs === "windows" || selectedOs === "macos") && mainItem;

  const filteredStandaloneAccessories = STANDALONE_ACCESSORIES.filter((acc) => acc.compatibleOs.includes(selectedOs));

  // Navigation "shop & buy" entre gammes : glisser au doigt (mobile) ou à la souris (PC)
  // fait défiler d'une gamme à l'autre, comme les onglets, sans dupliquer l'état sélectionné.
  const tierOrder: TierKey[] = ["essentiel", "recommande", "pro", "premium"];
  const tierIndex = tierOrder.indexOf(selectedTier);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number | null>(null);

  const goToTier = (direction: 1 | -1) => {
    const nextIndex = tierIndex + direction;
    if (nextIndex < 0 || nextIndex >= tierOrder.length) return;
    setSelectedTier(tierOrder[nextIndex]);
  };

  const handleSwipeStart = (clientX: number, targetEl: EventTarget) => {
    if ((targetEl as HTMLElement).closest("a,button,input,select,textarea")) return;
    dragStartXRef.current = clientX;
    setIsDragging(true);
  };
  const handleSwipeMove = (clientX: number) => {
    if (dragStartXRef.current === null) return;
    let delta = clientX - dragStartXRef.current;
    if ((tierIndex === 0 && delta > 0) || (tierIndex === tierOrder.length - 1 && delta < 0)) {
      delta = delta / 3;
    }
    setDragX(delta);
  };
  const handleSwipeEnd = () => {
    if (dragStartXRef.current === null) return;
    const threshold = 64;
    if (dragX <= -threshold) goToTier(1);
    else if (dragX >= threshold) goToTier(-1);
    dragStartXRef.current = null;
    setIsDragging(false);
    setDragX(0);
  };

  const osList: Array<{ id: OsKey; label: string; badge?: string; icon: React.ReactNode }> = [
    {
      id: "linux",
      label: "Linux Appliance",
      badge: isEn ? "Official" : "Officiel",
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

  const formFactorLabels: Record<FormFactorKey, { fr: string; en: string }> = {
    minipc: { fr: "Mini PC", en: "Mini PC" },
    laptop: { fr: "PC Portable", en: "Laptop" },
    tablet: { fr: "Tablette", en: "Tablet" },
  };

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
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "0.65rem",
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
                const nextKeys = Object.keys(HARDWARE_BUNDLES[item.id].formFactors) as FormFactorKey[];
                if (!nextKeys.includes(selectedFormFactor)) {
                  setSelectedFormFactor(nextKeys[0]);
                }
                const nextFormFactor = HARDWARE_BUNDLES[item.id].formFactors[nextKeys.includes(selectedFormFactor) ? selectedFormFactor : nextKeys[0]]!;
                if (!nextFormFactor.tiers[selectedTier]) {
                  setSelectedTier(nextFormFactor.defaultTier);
                }
              }}
              style={{
                font: "inherit",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                rowGap: "0.35rem",
                columnGap: "0.55rem",
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", minWidth: 0 }}>
                <span style={{ color: isActive ? "var(--accent-primary)" : "currentColor", flexShrink: 0, display: "flex" }}>
                  {item.icon}
                </span>
                <span style={{ fontWeight: isActive ? 700 : 500, fontSize: "0.875rem", whiteSpace: "nowrap" }}>
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
                    padding: "0.18rem 0.45rem",
                    borderRadius: "0.3rem",
                    background: isActive ? "var(--accent-primary)" : "var(--bg-inset)",
                    color: isActive ? "var(--accent-primary-fg)" : "var(--text-muted)",
                    whiteSpace: "nowrap",
                    marginLeft: "auto",
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
          position: "relative",
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
                {isEn ? currentFormFactor.titleEn : currentFormFactor.titleFr}
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 0.4rem 0" }}>
              {isEn ? currentFormFactor.subtitleEn : currentFormFactor.subtitleFr}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
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
                {isEn ? currentFormFactor.targetEn : currentFormFactor.targetFr}
              </span>
            </div>
          </div>

          {/* SÉLECTEUR DE GAMME — positionné à droite de l'encadré titre */}
          <div
            className="stepper-mode-toggle"
            role="tablist"
            aria-label={isEn ? "Tier level" : "Gamme de performance"}
            style={{ flexWrap: "wrap", alignSelf: "center" }}
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

        {/* SÉLECTEUR MINI PC / PC PORTABLE (masqué si une seule voie disponible) */}
        {formFactorKeys.length > 1 && (
          <div
            className="stepper-mode-toggle"
            role="tablist"
            aria-label={isEn ? "Hardware form factor" : "Type de matériel"}
            style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}
          >
            {formFactorKeys.map((key) => {
              const isFormActive = activeFormFactorKey === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isFormActive}
                  onClick={() => {
                    setSelectedFormFactor(key);
                    const nextFormFactor = currentBundle.formFactors[key]!;
                    if (!nextFormFactor.tiers[selectedTier]) {
                      setSelectedTier(nextFormFactor.defaultTier);
                    }
                  }}
                  className={`stepper-mode-btn ${isFormActive ? "is-active" : ""}`}
                  style={{ padding: "0.45rem 0.85rem", fontSize: "0.775rem" }}
                >
                  <span>{isEn ? formFactorLabels[key].en : formFactorLabels[key].fr}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Flèches de navigation entre gammes — équivalent souris du glisser tactile, masquées en bout de course */}
        {tierIndex > 0 && (
          <button
            type="button"
            aria-label={isEn ? "Previous tier" : "Gamme précédente"}
            onClick={() => goToTier(-1)}
            className="hw-tier-nav-arrow hw-tier-nav-arrow--prev"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {tierIndex < tierOrder.length - 1 && (
          <button
            type="button"
            aria-label={isEn ? "Next tier" : "Gamme suivante"}
            onClick={() => goToTier(1)}
            className="hw-tier-nav-arrow hw-tier-nav-arrow--next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        <div
          key={`${selectedOs}-${activeFormFactorKey}-${selectedTier}`}
          className="hw-fade-panel"
          style={{
            transform: `translateX(${dragX}px)`,
            transition: isDragging ? "none" : "transform 0.25s ease",
            touchAction: "pan-y",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onPointerDown={(e) => handleSwipeStart(e.clientX, e.target)}
          onPointerMove={(e) => isDragging && handleSwipeMove(e.clientX)}
          onPointerUp={handleSwipeEnd}
          onPointerLeave={() => isDragging && handleSwipeEnd()}
        >
          {currentFormFactor.editorialNoteFr && (
            <div
              style={{
                marginBottom: "1.25rem",
                padding: "0.85rem 1rem",
                borderRadius: "0.5rem",
                background: "var(--bg-inset)",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                lineHeight: 1.55,
              }}
            >
              {isEn ? currentFormFactor.editorialNoteEn : currentFormFactor.editorialNoteFr}
            </div>
          )}

          {/* 5. DÉTAILS DE LA GAMME ACTIVE */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
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
                {showFanBadge && (
                  <span
                    style={{
                      fontSize: "0.675rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "0.3rem",
                      background: mainItem!.hasFan ? "var(--bg-inset)" : "rgba(16, 185, 129, 0.14)",
                      color: mainItem!.hasFan ? "var(--text-muted)" : "#059669",
                      border: mainItem!.hasFan ? "1px solid var(--border-subtle)" : "1px solid rgba(16, 185, 129, 0.35)",
                    }}
                  >
                    {mainItem!.hasFan
                      ? (isEn ? "Quiet fan" : "Ventilateur silencieux")
                      : (isEn ? "100% Fanless" : "100% Fanless")}
                  </span>
                )}
              </div>

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
          </div>

          {/* 6. UNITÉ PRINCIPALE — carte hero large écran */}
          {mainItem && (
            <div
              className="hw-item-card hw-item-card--hero hw-hero-grid"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.65rem",
                padding: "1.25rem",
                marginBottom: "1rem",
              }}
            >
              <div
                className="hw-hero-grid__image"
                style={{
                  borderRadius: "0.55rem",
                  border: "1px solid var(--border-subtle)",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                }}
              >
                <Image
                  src={mainItem.imageUrl}
                  alt={mainItem.name}
                  width={180}
                  height={180}
                  style={{ objectFit: "contain", width: "100%", height: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", minWidth: 0 }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                  {mainItem.name}
                </h4>
                <div
                  style={{
                    fontSize: "0.775rem",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {mainItem.specs}
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                  {mainItem.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    marginTop: "0.35rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px dashed var(--border-subtle)",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-heading)" }}>
                      {mainItem.priceAmazon.toFixed(2)} €
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "0.4rem" }}>
                      {isEn ? `checked ${checkedDate}` : `constaté le ${checkedDate}`}
                    </span>
                  </div>
                  <a
                    href={mainItem.amazonUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      padding: "0.55rem 1rem",
                      borderRadius: "0.45rem",
                      textDecoration: "none",
                    }}
                  >
                    <span>{isEn ? "See current price on Amazon" : "Voir le prix actuel sur Amazon"}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 7. ACCESSOIRES DU PACK — grille qui tire parti d'un écran large, alignement fixe */}
          {accessoryItems.length > 0 && (
            <div
              className="hw-accessory-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              {accessoryItems.map((item: HardwareItem) => (
                <div
                  key={item.id}
                  className="hw-item-card"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "0.55rem",
                    padding: "0.85rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "0.4rem",
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
                        width={48}
                        height={48}
                        style={{ objectFit: "contain", width: "100%", height: "100%", padding: "3px" }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h5 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 0.2rem 0", lineHeight: 1.3 }}>
                        {item.name}
                      </h5>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.35 }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "0.5rem",
                      marginTop: "auto",
                      borderTop: "1px dashed var(--border-subtle)",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-heading)" }}>
                      {item.priceAmazon.toFixed(2)} €
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
                        gap: "0.3rem",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        padding: "0.3rem 0.6rem",
                        borderRadius: "0.35rem",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <span>Amazon</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 8. SYNTHÈSE BUDGÉTAIRE */}
          <div
            style={{
              background: "var(--bg-inset)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.65rem",
              padding: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
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
                  marginBottom: "0.3rem",
                }}
              >
                {isEn ? "Estimated Pack Total (Hardware + All Cables)" : "Total Estimé du Pack Complet (Unité + Tous Câbles)"}
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent-primary)", letterSpacing: "-0.02em" }}>
                  {totalAmazon.toFixed(2)} €
                </span>
                <VendorBadge size="sm" />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {isEn ? `Prices checked ${checkedDate} — click through for today's price` : `Prix constatés le ${checkedDate} — cliquez pour le tarif du jour`}
                </span>
              </div>
            </div>

            <a
              href={mainItem?.amazonUrl}
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>{isEn ? "View Central Unit on Amazon" : "Voir l'Unité Centrale sur Amazon"}</span>
            </a>
          </div>
        </div>

        {/* Repère de progression entre les 4 gammes — confirme visuellement le glisser/clic */}
        <div className="hw-tier-dots" aria-hidden="true">
          {tierOrder.map((tier) => (
            <span key={tier} className={`hw-tier-dot ${tier === selectedTier ? "is-active" : ""}`} />
          ))}
        </div>
      </div>

      {/* 9. ACCESSOIRES & CÂBLERIE À L'UNITÉ — filtrés selon l'OS sélectionné ci-dessus */}
      <HardwareAccessoriesGrid locale={locale} items={filteredStandaloneAccessories} />

      {/* 10. BARRE D'ACHAT FIXE MOBILE — reste accessible pendant le scroll d'achat sur téléphone */}
      <div className="hw-mobile-buybar">
        <div className="hw-mobile-buybar-info">
          <span className="hw-mobile-buybar-price">{totalAmazon.toFixed(2)} €</span>
          <span className="hw-mobile-buybar-label">{isEn ? "Full pack" : "Pack complet"}</span>
        </div>
        <a
          href={mainItem?.amazonUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="btn-primary hw-mobile-buybar-cta"
        >
          {isEn ? "Buy on Amazon" : "Voir sur Amazon"}
        </a>
      </div>
    </div>
  );
}
