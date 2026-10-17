"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { type Locale } from "@/lib/i18n";
import {
  HARDWARE_BUNDLES,
  PRICE_CHECKED_AT,
  type HardwareOsBundle,
  type OsKey,
  type TierKey,
  type FormFactorKey,
} from "@/content/hardware";
import LinuxIcon from "@/components/icons/LinuxIcon";
import WindowsIcon from "@/components/icons/WindowsIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import AndroidTvIcon from "@/components/icons/AndroidTvIcon";
import HardwareAccessoriesGrid from "@/components/hardware/HardwareAccessoriesGrid";
import AddToCartButton from "@/components/hardware/AddToCartButton";
import SellerLine, { type MerchantPlatform } from "@/components/hardware/SellerLine";
import MarqueeText from "@/components/hardware/MarqueeText";
import { publishStoreView } from "@/lib/storeView";

interface HardwareBundleTabsProps {
  locale: Locale;
  /** Catalogue affiché (Amazon par défaut). */
  bundles?: Partial<Record<OsKey, HardwareOsBundle>>;
  platform?: MerchantPlatform;
  /** Date ISO de la dernière vérification/rafraîchissement des prix. */
  checkedAt?: string;
  /** OS ouverts ; les autres restent visibles mais inertes. */
  enabledOs?: OsKey[];
  /** OS sans catalogue : message et redirection vers d'autres OS proposés. */
  unavailableOs?: Partial<Record<OsKey, { textFr: string; textEn: string; alternatives: OsKey[] }>>;
}

const ALL_OS: OsKey[] = ["linux", "windows", "macos", "arm", "android", "android-tv"];

function formatCheckedDate(iso: string, isEn: boolean) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function HardwareBundleTabs({
  locale,
  bundles = HARDWARE_BUNDLES,
  platform = "amazon",
  checkedAt = PRICE_CHECKED_AT,
  enabledOs = ALL_OS,
  unavailableOs,
}: HardwareBundleTabsProps) {
  const isEn = locale === "en";
  const checkedDate = formatCheckedDate(checkedAt, isEn);
  const platformName = platform === "aliexpress" ? "AliExpress" : "Amazon";
  const cartEnabled = true;

  const [selectedOs, setSelectedOs] = useState<OsKey>(enabledOs[0] ?? "linux");
  const [selectedFormFactor, setSelectedFormFactor] = useState<FormFactorKey>("minipc");
  const [selectedTier, setSelectedTier] = useState<TierKey>("recommande");

  const unavailableNotice = bundles[selectedOs] ? undefined : unavailableOs?.[selectedOs];
  const fallbackOs = enabledOs.find((os) => bundles[os]) ?? "linux";
  const currentBundle = bundles[selectedOs] ?? bundles[fallbackOs]!;
  const formFactorKeys = Object.keys(currentBundle.formFactors) as FormFactorKey[];
  const activeFormFactorKey = currentBundle.formFactors[selectedFormFactor]
    ? selectedFormFactor
    : formFactorKeys[0];
  const currentFormFactor = currentBundle.formFactors[activeFormFactorKey]!;
  const currentTier = currentFormFactor.tiers[selectedTier] || currentFormFactor.tiers[currentFormFactor.defaultTier];

  const totalAmazon = currentTier.items.reduce((acc, item) => acc + item.priceAmazon, 0);
  const mainItem = currentTier.items.find((item) => item.category === "uc") ?? currentTier.items[0];
  const accessoryItems = currentTier.items.filter((item) => item.id !== mainItem?.id);
  const showFanBadge =
    activeFormFactorKey === "minipc" &&
    (selectedOs === "linux" || selectedOs === "windows" || selectedOs === "macos" || selectedOs === "arm") &&
    mainItem;


  // Baamix voit ce que le visiteur regarde : on publie la sélection courante (et on la retire en quittant la page).
  useEffect(() => {
    publishStoreView(unavailableNotice ? null : { platform, os: selectedOs, form: activeFormFactorKey, tier: selectedTier });
  }, [platform, selectedOs, activeFormFactorKey, selectedTier, unavailableNotice]);
  useEffect(() => () => publishStoreView(null), []);

  // Navigation "shop & buy" entre gammes : glisser au doigt (mobile) ou à la souris (PC)
  // fait défiler d'une gamme à l'autre, comme les onglets, sans dupliquer l'état sélectionné.
  const tierOrder: TierKey[] = ["essentiel", "recommande", "pro", "premium"];
  const tierIndex = tierOrder.indexOf(selectedTier);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const altUnitsRef = useRef<HTMLDivElement | null>(null);

  const goToTier = (direction: 1 | -1) => {
    const nextIndex = tierIndex + direction;
    if (nextIndex < 0 || nextIndex >= tierOrder.length) return;
    setSelectedTier(tierOrder[nextIndex]);
  };

  // Navigation clavier : fleche gauche/droite change de gamme, comme le glisser tactile.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input,textarea,select,[contenteditable='true']")) return;
      if (event.key === "ArrowLeft") goToTier(-1);
      else if (event.key === "ArrowRight") goToTier(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tierIndex]);

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
      badge: isEn ? "Mini PC & PC" : "Mini PC & PC",
      icon: <WindowsIcon size={18} />,
    },
    {
      id: "macos",
      label: "macOS Studio",
      badge: isEn ? "Apple Silicon" : "Apple Silicon",
      icon: <AppleIcon size={18} />,
    },
    {
      id: "arm",
      label: "PC & Mini PC ARM",
      badge: "Snapdragon & ARM64",
      icon: (
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3" />
          <path d="M15 1v3" />
          <path d="M9 20v3" />
          <path d="M15 20v3" />
          <path d="M20 9h3" />
          <path d="M20 14h3" />
          <path d="M1 9h3" />
          <path d="M1 14h3" />
        </svg>
      ),
    },
    {
      id: "android",
      label: isEn ? "Android Tablets" : "Android Tablettes",
      badge: isEn ? "Touch Tablets" : "Tablettes Tactiles",
      icon: <AndroidIcon size={18} />,
    },
    {
      id: "android-tv",
      label: "Android TV & Box",
      badge: "Google TV & 4K",
      icon: <AndroidTvIcon size={18} />,
    },
  ];

  const formFactorLabels: Record<FormFactorKey, { fr: string; en: string }> = {
    tv: { fr: "Android TV & Box", en: "Android TV & Box" },
    minipc: { fr: "Mini PC", en: "Mini PC" },
    laptop: { fr: "PC Portable", en: "Laptop" },
    tablet: { fr: "Tablette", en: "Tablet" },
  };
  const formOrder: FormFactorKey[] =
    selectedOs === "android"
      ? ["tablet"]
      : selectedOs === "android-tv"
        ? ["tv"]
        : ["minipc", "laptop"];

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
    <div style={{ marginTop: "1rem" }} className="hw-os-layout">
      <div className="hw-os-content">
      {unavailableNotice ? (
        <div className="hw-unavailable-os">
          <p>{isEn ? unavailableNotice.textEn : unavailableNotice.textFr}</p>
          <div className="hw-unavailable-os__actions">
            {unavailableNotice.alternatives.map((os) => {
              const label = osList.find((o) => o.id === os)!;
              return (
                <button
                  key={os}
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setSelectedOs(os);
                    const keys = Object.keys(bundles[os]!.formFactors) as FormFactorKey[];
                    setSelectedFormFactor(keys[0]);
                    setSelectedTier(bundles[os]!.formFactors[keys[0]]!.defaultTier);
                  }}
                >
                  {isEn ? `See ${label.label} offers` : `Voir les offres ${label.label}`}
                </button>
              );
            })}
          </div>
        </div>
      ) : (<>
      {/* 2. BANDEAU DE L'OS SÉLECTIONNÉ — englobe tout le contenu de la gamme active */}
      <div
        className="hw-tier-card"
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
          className="hw-tier-header-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "nowrap",
            gap: "1rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ minWidth: 0, flex: "1 1 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <h1
                className="hw-form-title"
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text-heading)",
                  margin: 0,
                }}
              >
                <MarqueeText text={isEn ? currentFormFactor.titleEn : currentFormFactor.titleFr} />
              </h1>
            </div>
          </div>

          {/* SÉLECTEUR DE GAMME — positionné à droite de l'encadré titre sur grand écran,
              repasse sur 2 lignes de 2 boutons sur mobile plutôt que de déborder (hw-tier-toggle) */}
          <div
            className="stepper-mode-toggle hw-tier-toggle"
            role="tablist"
            aria-label={isEn ? "Tier level" : "Gamme de performance"}
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

        {/* SÉLECTEUR DE FORME : toujours affiché pour garder la même mise en page sur tous les OS.
            Les formes absentes du catalogue (ex. Mini PC / PC Portable sous Android, réservés aux
            futurs PC ARM Android) restent visibles mais grisées. */}
        <div
          className="stepper-mode-toggle hw-form-toggle"
          role="tablist"
          aria-label={isEn ? "Hardware form factor" : "Type de matériel"}
          style={{ marginBottom: "1.25rem", flexWrap: "wrap" }}
        >
          {formOrder.map((key) => {
            const isAvailable = formFactorKeys.includes(key);
            const isFormActive = activeFormFactorKey === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isFormActive}
                aria-disabled={!isAvailable}
                disabled={!isAvailable}
                title={isAvailable ? undefined : isEn ? "Coming soon" : "Bientôt disponible"}
                onClick={() => {
                  setSelectedFormFactor(key);
                  const nextFormFactor = currentBundle.formFactors[key]!;
                  if (!nextFormFactor.tiers[selectedTier]) {
                    setSelectedTier(nextFormFactor.defaultTier);
                  }
                }}
                className={`stepper-mode-btn ${isFormActive ? "is-active" : ""}`}
                style={{
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.775rem",
                  opacity: isAvailable ? 1 : 0.45,
                  cursor: isAvailable ? "pointer" : "not-allowed",
                }}
              >
                <span>{isEn ? formFactorLabels[key].en : formFactorLabels[key].fr}</span>
              </button>
            );
          })}
        </div>

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
              className="hw-tier-specs-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div className="hw-tier-specs-row__title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-heading)",
                    margin: 0,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <MarqueeText text={isEn ? currentTier.headlineEn : currentTier.headlineFr} />
                </h3>
                {showFanBadge && (
                  <span
                    style={{
                      flexShrink: 0,
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

              <div className="hw-tier-specs-row__badges" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
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

            <p className="hw-tier-summary" style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              <MarqueeText text={isEn ? currentTier.summaryEn : currentTier.summaryFr} />
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
                  alt=""
                  width={180}
                  height={180}
                  style={{ objectFit: "contain", width: "100%", height: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", minWidth: 0 }}>
                <h4 className="hw-hero-name" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                  <MarqueeText text={mainItem.name} />
                </h4>
                <div
                  className="hw-hero-specs"
                  style={{
                    fontSize: "0.775rem",
                    fontWeight: 600,
                    color: "var(--text-heading)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  <MarqueeText text={mainItem.specs} />
                </div>
                <p
                  className="hw-clamp hw-hero-desc"
                  title={mainItem.description}
                  style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}
                >
                  {mainItem.description}
                </p>
                <div className="hw-seller-slot">
                  <SellerLine item={mainItem} isEn={isEn} />
                </div>

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
                  <div className="hw-price-block">
                    <span className="hw-price" style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-heading)" }}>
                      {mainItem.priceAmazon.toFixed(2)} €
                    </span>
                    {/* Emplacement toujours réservé : la hauteur ne change pas selon que le prix est en direct ou constaté. */}
                    <span className="hw-price-note">
                      {!mainItem.isLive && (isEn ? `checked ${checkedDate}` : `constaté le ${checkedDate}`)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    {cartEnabled && <AddToCartButton
                      locale={locale}
                      item={{
                        platform,
                        asin: mainItem.asin,
                        name: mainItem.name,
                        imageUrl: mainItem.imageUrl,
                        priceAmazon: mainItem.priceAmazon,
                        amazonUrl: mainItem.amazonUrl,
                      }}
                    />}
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
                      <span>{isEn ? `See current price on ${platformName}` : `Voir le prix actuel sur ${platformName}`}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6bis. AUTRES MARQUES — l'acheteur choisit entre plusieurs fabricants pour l'unité
              centrale de cette gamme, chaque ASIN vérifié au même titre que le choix principal */}
          {currentTier.alternativeUnits && currentTier.alternativeUnits.length > 0 && (
            <div className="hw-alt-units">
              <span className="hw-alt-units__label">
                {isEn ? "Other brands to consider" : "Autres marques à considérer"}
              </span>
              <div className="hw-alt-units__row">
              <div ref={altUnitsRef} className="hw-alt-units__list">
                {currentTier.alternativeUnits.map((alt) => (
                  <div key={alt.id} className="hw-alt-unit-card">
                    <div className="hw-alt-unit-card__image">
                      <Image src={alt.imageUrl} alt="" width={64} height={64} />
                    </div>
                    <div className="hw-alt-unit-card__info">
                      <span className="hw-alt-unit-card__name">{alt.name}</span>
                      <span className="hw-alt-unit-card__price">{alt.priceAmazon.toFixed(2)} €</span>
                      <SellerLine item={alt} isEn={isEn} />
                    </div>
                    <div className="hw-alt-unit-card__actions">
                      {cartEnabled && <AddToCartButton
                        size="sm"
                        locale={locale}
                        item={{
                          platform,
                          asin: alt.asin,
                          name: alt.name,
                          imageUrl: alt.imageUrl,
                          priceAmazon: alt.priceAmazon,
                          amazonUrl: alt.amazonUrl,
                        }}
                      />}
                      <a
                        href={alt.amazonUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className="hw-alt-unit-card__link"
                        title={isEn ? `Open the ${platformName} product page` : `Ouvrir la fiche produit ${platformName}`}
                        aria-label={isEn ? `Open ${alt.name} on ${platformName}` : `Voir ${alt.name} sur ${platformName}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {currentTier.alternativeUnits.length > 1 && (
                <button
                  type="button"
                  className="hw-alt-units__arrow"
                  aria-label={isEn ? "Scroll to see more brands" : "Faire défiler pour voir plus de marques"}
                  onClick={() => {
                    altUnitsRef.current?.scrollBy({ left: 240, behavior: "smooth" });
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
              </div>
            </div>
          )}

        </div>

        {/* Repère de progression entre les 4 gammes — confirme visuellement le glisser/clic */}
        <div className="hw-tier-dots" aria-hidden="true">
          {tierOrder.map((tier) => (
            <span key={tier} className={`hw-tier-dot ${tier === selectedTier ? "is-active" : ""}`} />
          ))}
        </div>
      </div>

      {/* 9. ACCESSOIRES & CÂBLERIE À L'UNITÉ — filtrés selon l'OS sélectionné ci-dessus */}
      <HardwareAccessoriesGrid locale={locale} items={accessoryItems} platform={platform} checkedAt={checkedAt} />

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
          {isEn ? `View on ${platformName}` : `Voir sur ${platformName}`}
        </a>
      </div>
      </>)}
      </div>

      {/* 1. SÉLECTEUR D'OS — colonne verticale à droite sur grand écran, ligne horizontale sur mobile */}
      <div
        role="tablist"
        aria-label={isEn ? "Operating System selection" : "Sélection du système d'exploitation"}
        className="hw-os-sidebar"
      >
        {osList.map((item) => {
          const isActive = selectedOs === item.id;
          const isEnabled = enabledOs.includes(item.id);
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={!isEnabled}
              disabled={!isEnabled}
              onClick={() => {
                setSelectedOs(item.id);
                // OS sans catalogue (ex. macOS sur AliExpress) : la page affiche un message, rien à préparer.
                if (!bundles[item.id]) return;
                const nextKeys = Object.keys(bundles[item.id]!.formFactors) as FormFactorKey[];
                if (!nextKeys.includes(selectedFormFactor)) {
                  setSelectedFormFactor(nextKeys[0]);
                }
                const nextFormFactor = bundles[item.id]!.formFactors[nextKeys.includes(selectedFormFactor) ? selectedFormFactor : nextKeys[0]]!;
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
                cursor: isEnabled ? "pointer" : "not-allowed",
                opacity: isEnabled ? 1 : 0.55,
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
              {(item.badge || !isEnabled) && (
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
                  {isEnabled ? item.badge : isEn ? "Soon" : "Bientôt"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
