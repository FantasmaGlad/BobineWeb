"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import WindowsIcon from "@/components/icons/WindowsIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import AndroidTvIcon from "@/components/icons/AndroidTvIcon";
import { useDetectedPlatform, reorderForPlatform } from "@/lib/detectPlatform";

import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { FALLBACK_STABLE, FALLBACK_BETA, FALLBACK_CANARY } from "@/lib/releaseFallbacks";
import { useReleaseData } from "@/components/ReleaseProvider";
import DownloadModal, { type DownloadPlatform } from "@/components/DownloadModal";

export default function OsDownloadGrid({
  locale,
  headerSlot,
  title,
  subtitle,
}: {
  locale: Locale;
  headerSlot?: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const isEn = locale === "en";
  const initialRelease = useReleaseData();
  const [stableInfo, setStableInfo] = useState<ReleaseChannelInfo>(initialRelease?.stable ?? FALLBACK_STABLE);
  const [betaInfo, setBetaInfo] = useState<ReleaseChannelInfo>(initialRelease?.beta ?? FALLBACK_BETA);
  const [canaryInfo, setCanaryInfo] = useState<ReleaseChannelInfo>(initialRelease?.canary ?? FALLBACK_CANARY);
  const detected = useDetectedPlatform();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<DownloadPlatform>("windows");

  useEffect(() => {
    let isMounted = true;
    // Miroir Tor : pas de route serveur, valeurs de repli deja en place.
    if (process.env.NEXT_PUBLIC_BOBINE_ONION === "1") return;
    fetch("/api/github-stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.stable) setStableInfo(data.stable);
        if (data.beta) setBetaInfo(data.beta);
        if (data.canary) setCanaryInfo(data.canary);
      })
      .catch(() => {
        // Fallback transparent déjà en place
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const openDownloadModal = (platform: DownloadPlatform) => {
    setModalPlatform(platform);
    setIsModalOpen(true);
  };

  const cards: Array<{
    id: string;
    name: string;
    subtitle: string;
    format: string;
    badge: string;
    statusLabel?: string;
    url: string;
    isComingSoon: boolean;
    icon: ReactNode;
  }> = [
    {
      id: "linux",
      name: "Linux",
      subtitle: isEn ? "Debian, Ubuntu, Mint (x86_64 & ARM64)" : "Debian, Ubuntu, Mint (x86_64 & ARM64)",
      format: isEn ? "Package .deb" : "Paquet .deb",
      badge: isEn ? "1-click install" : "Installation 1 clic",
      url: stableInfo.downloads.linux,
      isComingSoon: false,
      icon: <LinuxIcon size={28} className="os-download-card__icon" />,
    },
    {
      id: "windows",
      name: "Windows",
      subtitle: isEn ? "11, 10 & Windows ARM (Snapdragon)" : "11, 10 & Windows ARM (Snapdragon)",
      format: isEn ? "Installer .exe" : "Installeur .exe",
      badge: isEn ? "1-click install" : "Installation 1 clic",
      url: stableInfo.downloads.windows,
      isComingSoon: false,
      icon: <WindowsIcon size={26} className="os-download-card__icon" />,
    },
    {
      id: "macos",
      name: "macOS",
      subtitle: isEn ? "Apple Silicon (M1–M4)" : "Apple Silicon (M1–M4)",
      format: isEn ? "Disk image .dmg" : "Image disque .dmg",
      badge: isEn ? "1-click install" : "Installation 1 clic",
      url: stableInfo.downloads.macos,
      isComingSoon: false,
      icon: <AppleIcon size={26} className="os-download-card__icon" />,
    },
    {
      id: "android",
      name: "Android",
      subtitle: isEn ? "Tablets, Google Books & ARM kiosks" : "Tablettes, Google Books & Bornes ARM",
      format: isEn ? "Package .apk" : "Paquet .apk",
      badge: isEn ? "1-click install" : "Installation 1 clic",
      url: stableInfo.downloads.android,
      isComingSoon: false,
      icon: <AndroidIcon size={27} className="os-download-card__icon" />,
    },
    {
      id: "android-tv",
      name: "Android TV",
      subtitle: isEn ? "Google TV, Xiaomi & Smart TVs (Android 14+)" : "Google TV, Xiaomi & Smart TV (Android 14+)",
      format: isEn ? "Package .apk" : "Paquet .apk",
      badge: isEn ? "Bientôt sur Google Play" : "Bientôt sur Google Play",
      url: stableInfo.downloads.androidTv || `https://github.com/FantasmaGlad/Bobine/releases/download/${stableInfo.version}/Bobine-TV-${stableInfo.version.replace(/^V/i, "")}.apk`,
      isComingSoon: false,
      icon: <AndroidTvIcon size={28} className="os-download-card__icon" />,
    },
  ];

  const orderedCards = reorderForPlatform(cards, detected);
  const [featuredCard, ...restCards] = orderedCards;

  const renderCard = (card: (typeof cards)[number]) => {
    const isRecommended = detected === card.id;
    if (card.isComingSoon) {
      return (
        <div
          key={card.id}
          data-platform={card.id}
          className={`os-download-card os-download-card--soon${isRecommended ? " os-download-card--recommended" : ""}`}
          aria-label={`${card.name} (${card.format}) — ${card.badge}`}
        >
          {isRecommended && (
            <span className="os-download-card__recommended-tag">
              {isEn ? "Your device" : "Votre appareil"}
            </span>
          )}
          <div className="os-download-card__header">
            <div className="os-download-card__icon-wrap">
              {card.icon}
            </div>
            <div className="os-download-card__title-group">
              <span className="os-download-card__name">{card.name}</span>
              <span className="os-download-card__subtitle">{card.subtitle}</span>
            </div>
          </div>

          <div className="os-download-card__meta">
            <span className="os-download-card__format">{card.format}</span>
            <span className="os-download-card__version os-download-card__version--soon">
              {card.statusLabel}
            </span>
          </div>

          <div className="os-download-card__action os-download-card__action--soon">
            <span className="os-download-card__action-text">
              {card.badge}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
      );
    }

    return (
      <a
        key={card.id}
        data-platform={card.id}
        href={card.url}
        className={`os-download-card${isRecommended ? " os-download-card--recommended" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          openDownloadModal(card.id as DownloadPlatform);
        }}
        aria-haspopup="dialog"
        aria-label={`${isEn ? "Download" : "Télécharger"} Bobine ${stableInfo.version} ${card.name} (${card.format})`}
      >
        {isRecommended && (
          <span className="os-download-card__recommended-tag">
            {isEn ? "Your device" : "Votre appareil"}
          </span>
        )}
        <div className="os-download-card__header">
          <div className="os-download-card__icon-wrap">
            {card.icon}
          </div>
          <div className="os-download-card__title-group">
            <span className="os-download-card__name">{card.name}</span>
            <span className="os-download-card__subtitle">{card.subtitle}</span>
          </div>
        </div>

        <div className="os-download-card__meta">
          <span className="os-download-card__format">{card.format}</span>
          <span className="os-download-card__version">{stableInfo.version}</span>
        </div>

        <div className="os-download-card__action">
          <span className="os-download-card__action-text">
            {isEn ? "Download" : "Télécharger"}
          </span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="os-download-card__action-icon"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
      </a>
    );
  };

  const scrollToOtherVersions = () => {
    const el = document.getElementById("other-os-versions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  return (
    <div className="os-download-shell">
      {/* VUE MOBILE (< 640px) : Premier écran dynamique 100dvh avec carte recommandée et repère de défilement ancré en bas */}
      <div className="os-download-mobile-view">
        <div className="os-download-first-screen">
          {(title || headerSlot) && (
            <div className="os-download-first-screen__header">
              {title ? (
                <>
                  <p className="hero-fullscreen__title" aria-hidden="true" style={{ margin: 0 }}>
                    {title}
                  </p>
                  {subtitle && (
                    <p className="hero-fullscreen__subtitle">
                      {subtitle}
                    </p>
                  )}
                </>
              ) : (
                headerSlot
              )}
            </div>
          )}
          <div className={`os-download-featured${detected ? " os-download-featured--detected" : ""}`}>
            {renderCard(featuredCard)}
          </div>
          <button
            type="button"
            className="os-download-mobile-hint"
            onClick={scrollToOtherVersions}
            aria-label={isEn ? "Scroll to see other versions" : "Défiler pour voir les autres versions"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span>{isEn ? "Scroll to see other versions" : "Défiler pour voir les autres versions"}</span>
          </button>
        </div>

        <div id="other-os-versions" className="os-download-grid" role="region" aria-label={isEn ? "Other versions" : "Autres versions"}>
          {restCards.map((card) => renderCard(card))}
        </div>
      </div>

      {/* VUE DESKTOP (>= 640px) : Grille 5 colonnes immuable, zéro déplacement DOM, zéro CLS */}
      <div className="os-download-desktop-view">
        {(title || headerSlot) && (
          <div className="os-download-desktop-header">
            {title ? (
              <>
                <h1 className="hero-fullscreen__title">
                  {title}
                </h1>
                {subtitle && (
                  <p className="hero-fullscreen__subtitle">
                    {subtitle}
                  </p>
                )}
              </>
            ) : (
              headerSlot
            )}
          </div>
        )}
        <div className="os-download-desktop-grid" role="region" aria-label={isEn ? "Direct downloads" : "Téléchargements directs"}>
          {cards.map((card) => renderCard(card))}
        </div>
      </div>

      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
        initialPlatform={modalPlatform}
        stable={stableInfo}
        beta={betaInfo}
        canary={canaryInfo}
      />
    </div>
  );
}
