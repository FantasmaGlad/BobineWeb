"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import WindowsIcon from "@/components/icons/WindowsIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import { detectPlatform, reorderForPlatform, type DetectedPlatform } from "@/lib/detectPlatform";

interface DownloadsState {
  version: string;
  windows: string;
  linux: string;
  macos: string;
}

const FALLBACK_DOWNLOADS: DownloadsState = {
  version: "V3.0.0",
  windows: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/Bobine-Setup-3.0.0.exe",
  linux: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/bobine_3.0.0_amd64.deb",
  macos: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/Bobine-3.0.0.dmg",
};

export default function OsDownloadGrid({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [downloads, setDownloads] = useState<DownloadsState>(FALLBACK_DOWNLOADS);
  const [detected, setDetected] = useState<DetectedPlatform>(null);

  useEffect(() => {
    setDetected(detectPlatform());
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/github-stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        setDownloads({
          version: data.latestRelease || FALLBACK_DOWNLOADS.version,
          windows: data.downloads?.windows || FALLBACK_DOWNLOADS.windows,
          linux: data.downloads?.linux || FALLBACK_DOWNLOADS.linux,
          macos: data.downloads?.macos || FALLBACK_DOWNLOADS.macos,
        });
      })
      .catch(() => {
        // Fallback transparent déjà en place
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      id: "linux",
      name: "Linux",
      subtitle: isEn ? "Debian, Ubuntu, Mint" : "Debian, Ubuntu, Mint",
      format: isEn ? "Package .deb" : "Paquet .deb",
      badge: isEn ? "1-click install" : "Installation 1 clic",
      url: downloads.linux,
      isComingSoon: false,
      icon: <LinuxIcon size={28} className="os-download-card__icon" />,
    },
    {
      id: "windows",
      name: "Windows",
      subtitle: isEn ? "11, 10 & Windows IoT" : "11, 10 & Windows IoT",
      format: isEn ? "Installer .exe" : "Installeur .exe",
      badge: isEn ? "1-click install" : "Installation 1 clic",
      url: downloads.windows,
      isComingSoon: false,
      icon: <WindowsIcon size={26} className="os-download-card__icon" />,
    },
    {
      id: "macos",
      name: "macOS",
      subtitle: isEn ? "Apple Silicon (M1–M4)" : "Apple Silicon (M1–M4)",
      format: isEn ? "Disk image .dmg" : "Image disque .dmg",
      badge: isEn ? "1-click install" : "Installation 1 clic",
      url: downloads.macos,
      isComingSoon: false,
      icon: <AppleIcon size={26} className="os-download-card__icon" />,
    },
    {
      id: "android",
      name: "Android",
      subtitle: isEn ? "Tablets & ARM tactile kiosks" : "Tablettes & Bornes tactiles ARM",
      format: isEn ? "Package .apk" : "Paquet .apk",
      badge: isEn ? "Coming Soon" : "Arrive Bientôt",
      url: "#",
      isComingSoon: true,
      icon: <AndroidIcon size={27} className="os-download-card__icon" />,
    },
  ];

  const orderedCards = reorderForPlatform(cards, detected);

  return (
    <div className="os-download-grid" role="region" aria-label={isEn ? "Direct downloads" : "Téléchargements directs"}>
      {orderedCards.map((card) => {
        const isRecommended = detected === card.id;
        if (card.isComingSoon) {
          return (
            <div
              key={card.id}
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
                  {isEn ? "In development" : "En développement"}
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
            href={card.url}
            className={`os-download-card${isRecommended ? " os-download-card--recommended" : ""}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${isEn ? "Download" : "Télécharger"} Bobine ${downloads.version} ${card.name} (${card.format})`}
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
              <span className="os-download-card__version">{downloads.version}</span>
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
      })}
    </div>
  );
}
