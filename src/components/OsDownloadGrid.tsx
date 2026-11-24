"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { useDetectedPlatform, reorderForPlatform } from "@/lib/detectPlatform";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { FALLBACK_STABLE, FALLBACK_BETA, FALLBACK_CANARY } from "@/lib/releaseFallbacks";
import { useReleaseData } from "@/components/ReleaseProvider";
import DownloadPanel, { type DownloadPlatform } from "@/components/download/DownloadPanel";
import OsDownloadCard from "@/components/download/OsDownloadCard";
import { buildOsCards } from "@/components/download/osDownloadCards";
import "@/styles/split/pages-misc.css";

function useLiveReleases() {
  const initial = useReleaseData();
  const [stable, setStable] = useState<ReleaseChannelInfo>(initial?.stable ?? FALLBACK_STABLE);
  const [beta, setBeta] = useState<ReleaseChannelInfo>(initial?.beta ?? FALLBACK_BETA);
  const [canary, setCanary] = useState<ReleaseChannelInfo>(initial?.canary ?? FALLBACK_CANARY);
  useEffect(() => {
    let active = true;
    fetch("/api/github-stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (data.stable) setStable(data.stable);
        if (data.beta) setBeta(data.beta);
        if (data.canary) setCanary(data.canary);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  return { stable, beta, canary };
}

function scrollToOtherVersions() {
  const el = document.getElementById("other-os-versions");
  if (el) el.scrollIntoView({ behavior: "smooth" });
  else window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
}

export default function OsDownloadGrid({ locale, headerSlot, title, subtitle }: {
  locale: Locale;
  headerSlot?: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const isEn = locale === "en";
  const { stable, beta, canary } = useLiveReleases();
  const detected = useDetectedPlatform();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlatform, setModalPlatform] = useState<DownloadPlatform>("windows");
  const openDownloadModal = (platform: DownloadPlatform) => {
    setModalPlatform(platform);
    setIsModalOpen(true);
  };

  const cards = buildOsCards(locale, stable);
  const [featuredCard, ...restCards] = reorderForPlatform(cards, detected);
  const renderCard = (card: (typeof cards)[number]) => (
    <OsDownloadCard key={card.id} card={card} version={stable.version} isRecommended={detected === card.id} isEn={isEn} onOpen={openDownloadModal} />
  );

  return (
    <div className="os-download-shell">
      <div className="os-download-mobile-view">
        <div className="os-download-first-screen">
          {(title || headerSlot) && (
            <div className="os-download-first-screen__header">
              {title ? (
                <>
                  <p className="hero-fullscreen__title os-download-grid-p-1" aria-hidden="true">{title}</p>
                  {subtitle && <p className="hero-fullscreen__subtitle">{subtitle}</p>}
                </>
              ) : headerSlot}
            </div>
          )}
          <div className={`os-download-featured${detected ? " os-download-featured--detected" : ""}`}>
            {renderCard(featuredCard)}
          </div>
          <button type="button" className="os-download-mobile-hint" onClick={scrollToOtherVersions}
            aria-label={isEn ? "Scroll to see other versions" : "Défiler pour voir les autres versions"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span>{isEn ? "Scroll to see other versions" : "Défiler pour voir les autres versions"}</span>
          </button>
        </div>
        <div id="other-os-versions" className="os-download-grid" role="region" aria-label={isEn ? "Other versions" : "Autres versions"}>
          {restCards.map(renderCard)}
        </div>
      </div>

      <div className="os-download-desktop-view">
        {(title || headerSlot) && (
          <div className="os-download-desktop-header">
            {title ? (
              <>
                <h1 className="hero-fullscreen__title">{title}</h1>
                {subtitle && <p className="hero-fullscreen__subtitle">{subtitle}</p>}
              </>
            ) : headerSlot}
          </div>
        )}
        <div className="os-download-desktop-grid" role="region" aria-label={isEn ? "Direct downloads" : "Téléchargements directs"}>
          {cards.map(renderCard)}
        </div>
      </div>

      <DownloadPanel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} locale={locale} initialPlatform={modalPlatform}
        stable={stable} beta={beta} canary={canary} />
    </div>
  );
}
