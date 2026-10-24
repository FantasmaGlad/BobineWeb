"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import ScrollingCode from "@/components/ScrollingCode";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { ANDROID } from "@/lib/productFacts";
import DistroLogo from "@/components/icons/DistroLogo";
import {
  LINUX_FAMILIES,
  LINUX_FAMILY_IDS,
  downloadKey,
  packageFileName,
  packageUrl,
  type LinuxFamilyId,
  type PackageChannel,
} from "@/lib/linuxPackages";
import "@/styles/split/download-modal.css";

export type DownloadPlatform = "windows" | "macos" | "linux" | "android" | "android-tv" | "cli" | "tauri" | "assistant";
export type CpuArchitecture = "x86_64" | "arm64";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialPlatform?: DownloadPlatform;
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
  canary: ReleaseChannelInfo;
}

export default function DownloadModal({
  isOpen,
  onClose,
  locale,
  initialPlatform = "windows",
  stable,
  beta,
  canary,
}: DownloadModalProps) {
  const isEn = locale === "en";
  const activePlatform: DownloadPlatform = initialPlatform;
  const [selectedArch, setSelectedArch] = useState<CpuArchitecture>("x86_64");
  const [selectedFamily, setSelectedFamily] = useState<LinuxFamilyId>("debian");
  const [selectedChannel, setSelectedChannel] = useState<PackageChannel>("stable");
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  // Chaque ouverture repart d'un bouton neuf : sans cette remise à zéro, « Lancé » restait affiché
  // à la réouverture et bloquait un second téléchargement.
  const handleClose = () => {
    setDownloadingKey(null);
    onClose();
  };
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Détection légère de l'architecture ARM64 côté client (Snapdragon, Linux aarch64, Windows ARM)
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    if (/\b(aarch64|arm64|armv8|woa|snapdragon)\b/i.test(ua)) {
      setSelectedArch("arm64");
      return;
    }
    const navWithUAData = navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
      };
    };
    navWithUAData.userAgentData
      ?.getHighEntropyValues?.(["architecture"])
      .then((vals) => {
        if (vals?.architecture && /arm/i.test(vals.architecture)) {
          setSelectedArch("arm64");
        }
      })
      .catch(() => {});
  }, []);

  // Gestion de la touche Échap et verrouillage du défilement
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDownloadingKey(null);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus automatique sur le bouton de fermeture
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isMounted) return null;

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCmd(key);
      setTimeout(() => setCopiedCmd(null), 2000);
    }
  };

  const hasFamilySelector = activePlatform === "linux";
  const hasArchSelector =
    activePlatform === "windows" ||
    activePlatform === "linux" ||
    activePlatform === "tauri" ||
    activePlatform === "assistant";

  const cleanVersion = stable.version.replace(/^V/i, "");
  const isArm = selectedArch === "arm64";

  const getPlatformDetails = () => {
    switch (activePlatform) {
      case "windows":
        if (isArm) {
          return {
            title: isEn ? "Bobine for Windows (ARM64)" : "Bobine pour Windows (ARM64)",
            subtitle: isEn
              ? "Windows 11 ARM64 (Qualcomm Snapdragon X Elite / X Plus & ARM PCs)"
              : "Windows 11 ARM64 (Qualcomm Snapdragon X Elite / X Plus & PC ARM)",
            stableUrl:
              stable.downloads.windowsArm64 ||
              `https://github.com/FantasmaGlad/Bobine/releases/download/${stable.version}/Bobine-Setup-${cleanVersion}-arm64.exe`,
            stableFilename: `Bobine-Setup-${cleanVersion}-arm64.exe`,
            betaUrl:
              beta.downloads.windowsArm64 ||
              "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta-arm64.exe",
            betaFilename: "Bobine-Setup-beta-arm64.exe",
            canaryUrl:
              canary.downloads.windowsArm64 ||
              "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-Setup-canary-arm64.exe",
            canaryFilename: "Bobine-Setup-canary-arm64.exe",
            format: ".exe (ARM64)",
          };
        }
        return {
          title: isEn ? "Bobine for Windows" : "Bobine pour Windows",
          subtitle: isEn
            ? "Windows 11, 10 & Windows IoT (x86_64 — Intel / AMD)"
            : "Windows 11, 10 & Windows IoT (x86_64 — Intel / AMD)",
          stableUrl: stable.downloads.windows,
          stableFilename: `Bobine-Setup-${cleanVersion}.exe`,
          betaUrl: beta.downloads.windows,
          betaFilename: "Bobine-Setup-beta.exe",
          canaryUrl: canary.downloads.windows,
          canaryFilename: "Bobine-Setup-canary.exe",
          format: ".exe (x86_64)",
        };
      case "macos":
        return {
          title: isEn ? "Bobine for macOS" : "Bobine pour macOS",
          subtitle: isEn ? "Apple Silicon (M1, M2, M3, M4)" : "Apple Silicon (M1, M2, M3, M4)",
          stableUrl: stable.downloads.macos,
          stableFilename: `Bobine-${cleanVersion}.dmg`,
          betaUrl: beta.downloads.macos,
          betaFilename: "Bobine-beta.dmg",
          canaryUrl: canary.downloads.macos,
          canaryFilename: "Bobine-canary.dmg",
          format: ".dmg",
        };
      case "linux": {
        const family = LINUX_FAMILIES[selectedFamily];
        const arch = isArm ? "arm64" : "x86_64";
        const archLabel = isArm ? "ARM64" : "x86_64";
        const channelLink = (info: ReleaseChannelInfo, channel: PackageChannel, tag: string) =>
          info.downloads[downloadKey(selectedFamily, arch)] || packageUrl(selectedFamily, channel, arch, tag);
        const cpu = isArm
          ? isEn ? "ARM64 (Snapdragon, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi)" : "ARM64 (Snapdragon, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi)"
          : "x86_64 — Intel / AMD";
        return {
          title: isEn ? `Bobine for Linux Desktop${isArm ? " (ARM64)" : ""}` : `Bobine pour Linux Bureau${isArm ? " (ARM64)" : ""}`,
          subtitle: `${family.distros[isEn ? "en" : "fr"]} · ${cpu}`,
          stableUrl: channelLink(stable, "stable", stable.version),
          stableFilename: packageFileName(selectedFamily, "stable", arch, cleanVersion),
          betaUrl: channelLink(beta, "beta", "beta"),
          betaFilename: packageFileName(selectedFamily, "beta", arch, "beta"),
          canaryUrl: channelLink(canary, "canary", "canary"),
          canaryFilename: packageFileName(selectedFamily, "canary", arch, "canary"),
          format: `${family.extension} (${archLabel})`,
        };
      }
      case "android-tv":
        return {
          title: isEn ? "Bobine for Android TV & Google TV" : "Bobine pour Android TV & Google TV",
          subtitle: isEn
            ? `Dedicated for TV boxes & Smart TVs (Android ${ANDROID.minVersion} or later, e.g. Google TV Streamer, Xiaomi TV Box S) — ARM 32 & 64-bit (armeabi-v7a, arm64-v8a)`
            : `Dédié aux box TV & Smart TVs (Android ${ANDROID.minVersion} ou supérieur, ex. Google TV Streamer, Xiaomi TV Box S) — ARM 32 et 64 bits (armeabi-v7a, arm64-v8a)`,
          stableUrl:
            stable.downloads.androidTv ||
            `https://github.com/FantasmaGlad/Bobine/releases/download/${stable.version}/Bobine-TV-${cleanVersion}.apk`,
          stableFilename: `Bobine-TV-${cleanVersion}.apk`,
          betaUrl:
            beta.downloads.androidTv ||
            "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-TV-beta.apk",
          betaFilename: "Bobine-TV-beta.apk",
          canaryUrl:
            canary.downloads.androidTv ||
            "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-TV-canary.apk",
          canaryFilename: "Bobine-TV-canary.apk",
          format: ".apk",
        };
      case "android":
        return {
          title: isEn ? "Bobine for Android & Google Books" : "Bobine pour Android & Google Books",
          subtitle: isEn
            ? "Android Tablets, Google Books (via APK & soon native Google Play Store) & ARM64 touch kiosks"
            : "Tablettes Android, Google Books (via APK et bientôt Google Play Store natif) & Bornes tactiles ARM64",
          stableUrl: stable.downloads.android,
          stableFilename: `Bobine-${cleanVersion}.apk`,
          betaUrl: beta.downloads.android,
          betaFilename: "Bobine-beta.apk",
          canaryUrl: canary.downloads.android,
          canaryFilename: "Bobine-canary.apk",
          format: ".apk",
        };
      case "cli":
        return {
          title: isEn ? "Headless Appliance (Bash CLI)" : "Appliance Headless (Bash CLI)",
          subtitle: isEn
            ? "Automated install for dedicated mini PCs (Dell Wyse, HP ProDesk, Beelink)"
            : "Installation automatisée pour mini PC dédiés (Dell Wyse, HP ProDesk, Beelink)",
          stableCmd: "curl -fsSL https://bobine.fit/install.sh | sudo bash",
          betaCmd: "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta",
          canaryCmd: "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=canary",
          format: "bash",
        };
      case "tauri":
      case "assistant":
        if (isArm) {
          return {
            title: isEn ? "Bobine Assistant (Tauri — ARM64)" : "Bobine Assistant (Tauri — ARM64)",
            subtitle: isEn
              ? "Linux Desktop ARM64 (aarch64 — Snapdragon, NVIDIA Spark, Pi 5)"
              : "Linux Bureau ARM64 (aarch64 — Snapdragon, NVIDIA Spark, Pi 5)",
            stableUrl:
              stable.downloads.assistantArm64 ||
              `https://github.com/FantasmaGlad/Bobine/releases/download/${stable.version}/bobine-assistant-arm64`,
            betaUrl:
              beta.downloads.assistantArm64 ||
              "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-assistant-arm64",
            canaryUrl:
              canary.downloads.assistantArm64 ||
              "https://github.com/FantasmaGlad/Bobine/releases/download/canary/bobine-assistant-arm64",
            stableFilename: "bobine-assistant-arm64",
            betaFilename: "bobine-assistant-arm64",
            canaryFilename: "bobine-assistant-arm64",
            format: isEn ? "ARM64 Binary" : "Binaire ARM64",
          };
        }
        return {
          title: isEn ? "Bobine Assistant (Tauri)" : "Bobine Assistant (Tauri)",
          subtitle: isEn
            ? "Remote orchestrator with built-in channel selector (Stable / Beta / Canary) — Linux x86_64"
            : "Orchestrateur réseau avec sélecteur de canal (Stable / Bêta / Canary) intégré — Linux x86_64",
          stableUrl: stable.downloads.assistant,
          betaUrl: beta.downloads.assistant,
          canaryUrl: canary.downloads.assistant,
          stableFilename: "bobine-assistant",
          betaFilename: "bobine-assistant",
          canaryFilename: "bobine-assistant",
          format: isEn ? "x86_64 Binary" : "Binaire x86_64",
        };
    }
  };

  const details = getPlatformDetails();

  const channelData = {
    stable: {
      info: stable,
      url: details.stableUrl,
      cmd: details.stableCmd,
      filename: details.stableFilename,
      version: stable.version,
      icon: "/images/channels/stable.webp",
      badgeClass: "download-modal__badge--stable",
      badgeText: isEn ? "Stable Release" : "Version Stable",
      isRecommended: true,
      desc:
        activePlatform === "cli"
          ? isEn
            ? "Official tested build recommended for gym production playout."
            : "Version officielle éprouvée, recommandée pour l'exploitation en production."
          : isEn
          ? "Official production release. 100% verified, sovereign offline-first, stable and certified for commercial gym playout."
          : "Version officielle certifiée. 100% testée, souveraineté hors-ligne et stabilité garantie pour l'exploitation en salle de sport.",
    },
    beta: {
      info: beta,
      url: details.betaUrl,
      cmd: details.betaCmd,
      filename: details.betaFilename,
      version: beta.commit ? `#${beta.commit}` : isEn ? "Rolling" : "Continue",
      icon: "/images/channels/beta.webp",
      badgeClass: "download-modal__badge--beta",
      badgeText: isEn ? "Beta (preview)" : "Bêta (aperçu)",
      isRecommended: false,
      desc: isEn
        ? "Curated batches of features and fixes ready for preview and community testing before official release."
        : "Lots de fonctionnalités et correctifs en avant-première pour tester les nouveautés avant la version officielle.",
    },
    canary: {
      info: canary,
      url: details.canaryUrl,
      cmd: details.canaryCmd,
      filename: details.canaryFilename,
      version: canary.commit ? `#${canary.commit}` : isEn ? "Rolling" : "Continue",
      icon: "/images/channels/canary.webp",
      badgeClass: "download-modal__badge--canary",
      badgeText: "Canary (rolling)",
      isRecommended: false,
      desc: isEn
        ? "Rebuilt automatically on every commit to main. Earliest access, experimental, zero curation, untested."
        : "Reconstruite automatiquement à chaque commit sur main. Accès ultra-anticipé, expérimental, non testé.",
    },
  }[selectedChannel];

  return createPortal(
    <div
      className="download-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="download-modal download-modal--apple-grade"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        {/* En-tête de la modale */}
        <div className="download-modal__header">
          <div className="download-modal__title-group">
            <span className="download-modal__eyebrow">
              {isEn ? "Choose your release channel" : "Sélectionnez votre canal de version"}
            </span>
            <div className="download-modal__title-row">
              <h2 id="download-modal-title" className="download-modal__title">
                {details.title}
              </h2>
              {hasArchSelector && (
                <div className="download-modal__selectors">
                  {hasFamilySelector && (
                    <div
                      className="download-modal__arch-selector"
                      role="group"
                      aria-label={isEn ? "Linux distribution family" : "Famille de distribution Linux"}
                    >
                      {LINUX_FAMILY_IDS.map((id) => {
                        const family = LINUX_FAMILIES[id];
                        const soon = !family.live;
                        return (
                          <button
                            key={id}
                            type="button"
                            className={`download-modal__arch-btn download-modal__family-btn${selectedFamily === id ? " is-active" : ""}${soon ? " is-soon" : ""}`}
                            aria-pressed={selectedFamily === id}
                            disabled={soon}
                            onClick={() => setSelectedFamily(id)}
                          >
                            <DistroLogo id={family.logo} />
                            <span>{family.label[isEn ? "en" : "fr"]}</span>
                            <span className="download-modal__family-ext">{family.extension}</span>
                            {soon && <span className="download-modal__soon-tag">{isEn ? "Soon" : "Bientôt"}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div
                    className="download-modal__arch-selector"
                    role="group"
                    aria-label={isEn ? "Processor architecture" : "Architecture processeur"}
                  >
                    <button
                      type="button"
                      className={`download-modal__arch-btn${selectedArch === "x86_64" ? " is-active" : ""}`}
                      aria-pressed={selectedArch === "x86_64"}
                      onClick={() => setSelectedArch("x86_64")}
                    >
                      x86_64 (Intel / AMD)
                    </button>
                    <button
                      type="button"
                      className={`download-modal__arch-btn${selectedArch === "arm64" ? " is-active" : ""}`}
                      aria-pressed={selectedArch === "arm64"}
                      onClick={() => setSelectedArch("arm64")}
                    >
                      ARM64 (Snapdragon / ARM)
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="download-modal__subtitle">{details.subtitle}</p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="download-modal__close-btn"
            onClick={handleClose}
            aria-label={isEn ? "Close modal" : "Fermer la fenêtre"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps de la modale avec Hero Unifié et Sélecteur Segmenté (Option 1 Apple-Grade) */}
        <div className="download-modal__body">
          {/* 1. Sélecteur segmenté de canal (Apple Glass Switcher) */}
          <div
            className="download-modal__channel-switcher"
            role="radiogroup"
            aria-label={isEn ? "Select release channel" : "Sélectionner le canal de version"}
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedChannel === "stable"}
              className={`download-modal__channel-tab${selectedChannel === "stable" ? " is-active" : ""}`}
              onClick={() => setSelectedChannel("stable")}
            >
              <span className="download-modal__channel-tab-dot download-modal__channel-tab-dot--stable" aria-hidden="true" />
              <span className="download-modal__channel-tab-title">{isEn ? "Stable Release" : "Version Stable"}</span>
              <span className="download-modal__channel-tab-rec">{isEn ? "Recommended" : "Recommandé"}</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={selectedChannel === "beta"}
              className={`download-modal__channel-tab${selectedChannel === "beta" ? " is-active" : ""}`}
              onClick={() => setSelectedChannel("beta")}
            >
              <span className="download-modal__channel-tab-dot download-modal__channel-tab-dot--beta" aria-hidden="true" />
              <span className="download-modal__channel-tab-title">{isEn ? "Beta (preview)" : "Bêta (aperçu)"}</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={selectedChannel === "canary"}
              className={`download-modal__channel-tab${selectedChannel === "canary" ? " is-active" : ""}`}
              onClick={() => setSelectedChannel("canary")}
            >
              <span className="download-modal__channel-tab-dot download-modal__channel-tab-dot--canary" aria-hidden="true" />
              <span className="download-modal__channel-tab-title">Canary</span>
            </button>
          </div>

          {/* 2. Carte Hero Unique */}
          <div className={`download-modal__hero-card download-modal__hero-card--${selectedChannel}`}>
            <div className="download-modal__hero-header">
              <div className="download-modal__hero-tag-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="download-modal__channel-icon" src={channelData.icon} alt="" />
                <span className={`download-modal__badge ${channelData.badgeClass}`}>
                  {channelData.badgeText}
                </span>
                {channelData.isRecommended && (
                  <span className="download-modal__badge download-modal__badge--rec">
                    {isEn ? "Recommended" : "Recommandé"}
                  </span>
                )}
              </div>
              <span className="download-modal__version">{channelData.version}</span>
            </div>

            <p className="download-modal__hero-desc">{channelData.desc}</p>

            {activePlatform === "cli" ? (
              <div className="download-modal__cli-block">
                <ScrollingCode>{channelData.cmd}</ScrollingCode>
                <button
                  type="button"
                  className={`download-modal__cli-copy-btn download-modal__cli-copy-btn--${selectedChannel}`}
                  onClick={() => copyToClipboard(channelData.cmd || "", `cli-${selectedChannel}`)}
                  aria-label={isEn ? "Copy command" : "Copier la commande"}
                >
                  {copiedCmd === `cli-${selectedChannel}` ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  <span>{copiedCmd === `cli-${selectedChannel}` ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}</span>
                </button>
              </div>
            ) : (
              <>
                {channelData.url ? (
                  <a
                    href={channelData.url}
                    className={`download-modal__hero-action-btn download-modal__hero-action-btn--${selectedChannel}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    onClick={() => {
                      setDownloadingKey(selectedChannel);
                      setTimeout(handleClose, 300);
                    }}
                  >
                    {downloadingKey === selectedChannel ? (
                      <svg
                        key="check"
                        className="download-modal__action-icon--pop"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    )}
                    <span>
                      {downloadingKey === selectedChannel
                        ? isEn
                          ? "Download Started"
                          : "Téléchargement lancé"
                        : isEn
                        ? `Download ${channelData.badgeText} (${channelData.version}) · ${details.format}`
                        : `Télécharger ${channelData.badgeText} (${channelData.version}) · ${details.format}`}
                    </span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="download-modal__hero-action-btn download-modal__hero-action-btn--stable is-soon"
                    disabled
                  >
                    <span>{isEn ? "Soon" : "Bientôt"}</span>
                  </button>
                )}

                {/* Bandeau de réassurance (Trust Strip) */}
                <div className="download-modal__trust-strip">
                  <span className="download-modal__trust-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {isEn ? "100% Offline Sovereign" : "100% Hors-ligne souverain"}
                  </span>
                  <span className="download-modal__trust-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {isEn ? "OpenPGP Signed" : "Signé cryptographiquement OpenPGP"}
                  </span>
                  <span className="download-modal__trust-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {isEn ? "SHA-256 Verified" : "SHA-256 certifié"}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* 3. Pied de modale */}
          <div className="download-modal__footer-links">
            {activePlatform === "linux" && (
              <p className="download-modal__hint">
                {isEn
                  ? `To receive updates with your system, use the ${LINUX_FAMILIES[selectedFamily].manager} repository: `
                  : `Pour recevoir les mises à jour avec votre système, utilisez le dépôt ${LINUX_FAMILIES[selectedFamily].manager} : `}
                <a href="https://packages.bobine.fit" target="_blank" rel="noopener noreferrer">
                  packages.bobine.fit
                </a>
                {" · "}
                <Link href={`/${locale}/documentation`} onClick={handleClose}>
                  {isEn ? "installation guide" : "guide d'installation"}
                </Link>
              </p>
            )}
            <div className="download-modal__extra-row">
              <a
                href="https://github.com/FantasmaGlad/Bobine/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="download-modal__extra-link"
              >
                {isEn
                  ? "Browse all releases & source code on GitHub ↗"
                  : "Consulter toutes les releases et le code source sur GitHub ↗"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
