"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";
import ScrollingCode from "@/components/ScrollingCode";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { ANDROID } from "@/lib/productFacts";

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
      case "linux":
        if (isArm) {
          return {
            title: isEn ? "Bobine for Linux Desktop (ARM64)" : "Bobine pour Linux Bureau (ARM64)",
            subtitle: isEn
              ? "Debian, Ubuntu, Mint ARM64 (Snapdragon, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi)"
              : "Debian, Ubuntu, Mint ARM64 (Snapdragon, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi)",
            stableUrl:
              stable.downloads.linuxArm64 ||
              `https://github.com/FantasmaGlad/Bobine/releases/download/${stable.version}/bobine_${cleanVersion}_arm64.deb`,
            stableFilename: `bobine_${cleanVersion}_arm64.deb`,
            betaUrl:
              beta.downloads.linuxArm64 ||
              "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_arm64.deb",
            betaFilename: "bobine_beta_arm64.deb",
            canaryUrl:
              canary.downloads.linuxArm64 ||
              "https://github.com/FantasmaGlad/Bobine/releases/download/canary/bobine_canary_arm64.deb",
            canaryFilename: "bobine_canary_arm64.deb",
            format: ".deb (arm64)",
          };
        }
        return {
          title: isEn ? "Bobine for Linux Desktop" : "Bobine pour Linux Bureau",
          subtitle: isEn ? "Debian, Ubuntu, Mint (x86_64 — Intel / AMD)" : "Debian, Ubuntu, Mint (x86_64 — Intel / AMD)",
          stableUrl: stable.downloads.linux,
          stableFilename: `bobine_${cleanVersion}_amd64.deb`,
          betaUrl: beta.downloads.linux,
          betaFilename: "bobine_beta_amd64.deb",
          canaryUrl: canary.downloads.linux,
          canaryFilename: "bobine_canary_amd64.deb",
          format: ".deb (amd64)",
        };
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
        className="download-modal"
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

        {/* Corps de la modale avec les deux canaux de version */}
        <div className="download-modal__body">
          {activePlatform === "cli" ? (
            /* Cas particulier : CLI Appliance */
            <div className="download-modal__cli-grid">
              {/* Carte CLI Stable */}
              <div className="download-modal__channel-card download-modal__channel-card--stable">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="download-modal__channel-icon" src="/images/channels/stable.webp" alt="" />
                    <span className="download-modal__badge download-modal__badge--stable">
                      {isEn ? "Stable Release" : "Version Stable"}
                    </span>
                    <span className="download-modal__badge download-modal__badge--rec">
                      {isEn ? "Recommended" : "Recommandé"}
                    </span>
                  </div>
                  <span className="download-modal__version">{stable.version}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Official tested build recommended for gym production playout."
                    : "Version officielle éprouvée, recommandée pour l'exploitation en production."}
                </p>

                <div className="download-modal__cli-block">
                  <ScrollingCode>{details.stableCmd}</ScrollingCode>
                  <button
                    type="button"
                    className="download-modal__cli-copy-btn download-modal__cli-copy-btn--stable"
                    onClick={() => copyToClipboard(details.stableCmd || "", "cli-stable")}
                    aria-label={isEn ? "Copy command" : "Copier la commande"}
                  >
                    {copiedCmd === "cli-stable" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                    <span>{copiedCmd === "cli-stable" ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}</span>
                  </button>
                </div>
              </div>

              {/* Carte CLI Bêta */}
              <div className="download-modal__channel-card download-modal__channel-card--beta">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="download-modal__channel-icon" src="/images/channels/beta.webp" alt="" />
                    <span className="download-modal__badge download-modal__badge--beta">
                      {isEn ? "Beta (curated)" : "Bêta (curée)"}
                    </span>
                  </div>
                  <span className="download-modal__version">{beta.commit ? `#${beta.commit}` : (isEn ? "Rolling" : "Continue")}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Beta: batches of features/fixes I select and publish manually when ready."
                    : "Bêta : lots de fonctionnalités/correctifs que je sélectionne et publie manuellement quand ils sont prêts."}
                </p>

                <div className="download-modal__cli-block">
                  <ScrollingCode>{details.betaCmd}</ScrollingCode>
                  <button
                    type="button"
                    className="download-modal__cli-copy-btn download-modal__cli-copy-btn--beta"
                    onClick={() => copyToClipboard(details.betaCmd || "", "cli-beta")}
                    aria-label={isEn ? "Copy command" : "Copier la commande"}
                  >
                    {copiedCmd === "cli-beta" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                    <span>{copiedCmd === "cli-beta" ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}</span>
                  </button>
                </div>
              </div>

              {/* Carte CLI Canary */}
              <div className="download-modal__channel-card download-modal__channel-card--canary">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="download-modal__channel-icon" src="/images/channels/canary.webp" alt="" />
                    <span className="download-modal__badge download-modal__badge--canary">
                      {isEn ? "Canary (rolling)" : "Canary (rolling)"}
                    </span>
                  </div>
                  <span className="download-modal__version">{canary.commit ? `#${canary.commit}` : (isEn ? "Rolling" : "Continue")}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Canary: rebuilt automatically on every commit to main. Earliest access, zero curation, untested."
                    : "Canary : reconstruite automatiquement à chaque commit sur main. Accès le plus anticipé, zéro curation, non testé."}
                </p>

                <div className="download-modal__cli-block">
                  <ScrollingCode>{details.canaryCmd}</ScrollingCode>
                  <button
                    type="button"
                    className="download-modal__cli-copy-btn download-modal__cli-copy-btn--canary"
                    onClick={() => copyToClipboard(details.canaryCmd || "", "cli-canary")}
                    aria-label={isEn ? "Copy command" : "Copier la commande"}
                  >
                    {copiedCmd === "cli-canary" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                    <span>{copiedCmd === "cli-canary" ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Cas normal : Binaires d'applications (Windows, macOS, Linux, Assistant) */
            <div className="download-modal__cards-grid">
              {/* Option 1 : VERSION STABLE */}
              <div className="download-modal__channel-card download-modal__channel-card--stable">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="download-modal__channel-icon" src="/images/channels/stable.webp" alt="" />
                    <span className="download-modal__badge download-modal__badge--stable">
                      {isEn ? "Stable Release" : "Version Stable"}
                    </span>
                    <span className="download-modal__badge download-modal__badge--rec">
                      {isEn ? "Recommended" : "Recommandé"}
                    </span>
                  </div>
                  <span className="download-modal__version">{stable.version}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Official production release. 100% verified, stable and recommended for fitness studio playout."
                    : "Version officielle certifiée. 100% testée, stable et recommandée pour l'exploitation en salle de sport."}
                </p>

                <a
                  href={details.stableUrl}
                  className="download-modal__action-btn download-modal__action-btn--primary download-modal__action-btn--stable"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => {
                    setDownloadingKey("stable");
                    setTimeout(handleClose, 300);
                  }}
                >
                  {downloadingKey === "stable" ? (
                    <svg
                      key="check"
                      className="download-modal__action-icon--pop"
                      width="16"
                      height="16"
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
                      width="16"
                      height="16"
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
                    {downloadingKey === "stable"
                      ? (isEn ? "Started" : "Lancé")
                      : (isEn ? `Download Stable (${stable.version}) · ${details.format}` : `Télécharger la Stable (${stable.version}) · ${details.format}`)}
                  </span>
                </a>
              </div>

              {/* Option 2 : VERSION BÊTA (curée) */}
              <div className="download-modal__channel-card download-modal__channel-card--beta">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="download-modal__channel-icon" src="/images/channels/beta.webp" alt="" />
                    <span className="download-modal__badge download-modal__badge--beta">
                      {isEn ? "Beta (curated)" : "Bêta (curée)"}
                    </span>
                  </div>
                  <span className="download-modal__version">{beta.commit ? `#${beta.commit}` : (isEn ? "Rolling" : "Continue")}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Beta: batches of features/fixes I select and publish manually when ready."
                    : "Bêta : lots de fonctionnalités/correctifs que je sélectionne et publie manuellement quand ils sont prêts."}
                </p>

                <a
                  href={details.betaUrl}
                  className="download-modal__action-btn download-modal__action-btn--beta"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => {
                    setDownloadingKey("beta");
                    setTimeout(handleClose, 300);
                  }}
                >
                  {downloadingKey === "beta" ? (
                    <svg
                      key="check"
                      className="download-modal__action-icon--pop"
                      width="16"
                      height="16"
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
                      width="16"
                      height="16"
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
                    {downloadingKey === "beta"
                      ? (isEn ? "Started" : "Lancé")
                      : (isEn ? `Download Beta · ${details.format}` : `Télécharger la Bêta · ${details.format}`)}
                  </span>
                </a>
              </div>

              {/* Option 3 : VERSION CANARY (rolling) */}
              <div className="download-modal__channel-card download-modal__channel-card--canary">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="download-modal__channel-icon" src="/images/channels/canary.webp" alt="" />
                    <span className="download-modal__badge download-modal__badge--canary">
                      {isEn ? "Canary (rolling)" : "Canary (rolling)"}
                    </span>
                  </div>
                  <span className="download-modal__version">{canary.commit ? `#${canary.commit}` : (isEn ? "Rolling" : "Continue")}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Canary: rebuilt automatically on every commit to main. Earliest access, zero curation, untested."
                    : "Canary : reconstruite automatiquement à chaque commit sur main. Accès le plus anticipé, zéro curation, non testé."}
                </p>

                <a
                  href={details.canaryUrl}
                  className="download-modal__action-btn download-modal__action-btn--canary"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => {
                    setDownloadingKey("canary");
                    setTimeout(handleClose, 300);
                  }}
                >
                  {downloadingKey === "canary" ? (
                    <svg
                      key="check"
                      className="download-modal__action-icon--pop"
                      width="16"
                      height="16"
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
                      width="16"
                      height="16"
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
                    {downloadingKey === "canary"
                      ? (isEn ? "Started" : "Lancé")
                      : (isEn ? `Download Canary · ${details.format}` : `Télécharger la Canary · ${details.format}`)}
                  </span>
                </a>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>,
    document.body
  );
}
