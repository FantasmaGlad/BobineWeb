"use client";

import type { DownloadPlatform } from "@/lib/downloadCatalog";
import type { OsCard } from "./osDownloadCards";

function CardHeader({ card, isRecommended, isEn }: { card: OsCard; isRecommended: boolean; isEn: boolean }) {
  return (
    <>
      {isRecommended && (
        <span className="os-download-card__recommended-tag">{isEn ? "Your device" : "Votre appareil"}</span>
      )}
      <div className="os-download-card__header">
        <div className="os-download-card__icon-wrap">{card.icon}</div>
        <div className="os-download-card__title-group">
          <span className="os-download-card__name">{card.name}</span>
          <span className="os-download-card__subtitle">{card.subtitle}</span>
        </div>
      </div>
    </>
  );
}

function SoonOsCard({ card, isRecommended, isEn }: { card: OsCard; isRecommended: boolean; isEn: boolean }) {
  return (
    <div data-platform={card.id} className={`os-download-card os-download-card--soon${isRecommended ? " os-download-card--recommended" : ""}`}
      aria-label={`${card.name} (${card.format}) — ${card.badge}`}>
      <CardHeader card={card} isRecommended={isRecommended} isEn={isEn} />
      <div className="os-download-card__meta">
        <span className="os-download-card__format">{card.format}</span>
        <span className="os-download-card__version os-download-card__version--soon">{card.statusLabel}</span>
      </div>
      <div className="os-download-card__action os-download-card__action--soon">
        <span className="os-download-card__action-text">{card.badge}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    </div>
  );
}

export default function OsDownloadCard({ card, version, isRecommended, isEn, onOpen }: {
  card: OsCard;
  version: string;
  isRecommended: boolean;
  isEn: boolean;
  onOpen: (platform: DownloadPlatform) => void;
}) {
  if (card.isComingSoon) return <SoonOsCard card={card} isRecommended={isRecommended} isEn={isEn} />;
  return (
    <a data-platform={card.id} href={card.url}
      className={`os-download-card${isRecommended ? " os-download-card--recommended" : ""}`}
      onClick={(e) => { e.preventDefault(); onOpen(card.id as DownloadPlatform); }}
      aria-haspopup="dialog"
      aria-label={`${isEn ? "Download" : "Télécharger"} Bobine ${version} ${card.name} (${card.format})`}>
      <CardHeader card={card} isRecommended={isRecommended} isEn={isEn} />
      <div className="os-download-card__meta">
        <span className="os-download-card__format">{card.format}</span>
        <span className="os-download-card__version">{version}</span>
      </div>
      <div className="os-download-card__action">
        <span className="os-download-card__action-text">{isEn ? "Download" : "Télécharger"}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="os-download-card__action-icon">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
    </a>
  );
}
