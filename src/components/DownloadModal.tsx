"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";

export type DownloadPlatform = "windows" | "macos" | "linux" | "android" | "android-tv" | "cli" | "tauri";

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
}

export default function DownloadModal({
  isOpen,
  onClose,
  locale,
  initialPlatform = "windows",
  stable,
  beta,
}: DownloadModalProps) {
  const isEn = locale === "en";
  const activePlatform: DownloadPlatform = initialPlatform;
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Gestion de la touche Échap et verrouillage du défilement
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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

  const getPlatformDetails = () => {
    switch (activePlatform) {
      case "windows":
        return {
          title: isEn ? "Bobine for Windows" : "Bobine pour Windows",
          subtitle: isEn ? "Windows 11, 10 & Windows IoT" : "Windows 11, 10 & Windows IoT",
          stableUrl: stable.downloads.windows,
          stableFilename: `Bobine-Setup-${stable.version.replace(/^V/i, "")}.exe`,
          betaUrl: beta.downloads.windows,
          betaFilename: "Bobine-Setup-beta.exe",
          format: ".exe",
        };
      case "macos":
        return {
          title: isEn ? "Bobine for macOS" : "Bobine pour macOS",
          subtitle: isEn ? "Apple Silicon (M1, M2, M3, M4)" : "Apple Silicon (M1, M2, M3, M4)",
          stableUrl: stable.downloads.macos,
          stableFilename: `Bobine-${stable.version.replace(/^V/i, "")}.dmg`,
          betaUrl: beta.downloads.macos,
          betaFilename: "Bobine-beta.dmg",
          format: ".dmg",
        };
      case "linux":
        return {
          title: isEn ? "Bobine for Linux Desktop" : "Bobine pour Linux Bureau",
          subtitle: isEn ? "Debian, Ubuntu, Mint (x86_64)" : "Debian, Ubuntu, Mint (x86_64)",
          stableUrl: stable.downloads.linux,
          stableFilename: `bobine_${stable.version.replace(/^V/i, "")}_amd64.deb`,
          betaUrl: beta.downloads.linux,
          betaFilename: "bobine_beta_amd64.deb",
          format: ".deb",
        };
      case "android-tv":
        return {
          title: isEn ? "Bobine for Android TV & Google TV" : "Bobine pour Android TV & Google TV",
          subtitle: isEn
            ? "Dedicated for TV boxes & Smart TVs (Chromecast, Xiaomi Box, Shield TV) — arm64-v8a"
            : "Dédié aux box TV & Smart TVs (Chromecast, Xiaomi Box, Shield TV) — arm64-v8a",
          stableUrl:
            stable.downloads.androidTv ||
            `https://github.com/FantasmaGlad/Bobine/releases/download/${stable.version}/Bobine-TV-${stable.version.replace(/^V/i, "")}.apk`,
          stableFilename: `Bobine-TV-${stable.version.replace(/^V/i, "")}.apk`,
          betaUrl:
            beta.downloads.androidTv ||
            "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-TV-beta.apk",
          betaFilename: "Bobine-TV-beta.apk",
          format: ".apk",
        };
      case "android":
        return {
          title: isEn ? "Bobine for Android" : "Bobine pour Android",
          subtitle: isEn ? "Tablets & ARM touch kiosks (arm64-v8a)" : "Tablettes & Bornes tactiles ARM (arm64-v8a)",
          stableUrl: stable.downloads.android,
          stableFilename: `Bobine-${stable.version.replace(/^V/i, "")}.apk`,
          betaUrl: beta.downloads.android,
          betaFilename: "Bobine-beta.apk",
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
          format: "bash",
        };
      case "tauri":
        return {
          title: isEn ? "Bobine Assistant (Tauri)" : "Bobine Assistant (Tauri)",
          subtitle: isEn
            ? "Remote orchestrator with built-in channel selector (Stable / Beta)"
            : "Orchestrateur réseau avec sélecteur de canal (Stable / Bêta) intégré",
          stableUrl: stable.downloads.assistant,
          betaUrl: beta.downloads.assistant,
          stableFilename: "bobine-assistant",
          betaFilename: "bobine-assistant",
          format: isEn ? "Binary" : "Binaire",
        };
    }
  };

  const details = getPlatformDetails();

  return createPortal(
    <div
      className="download-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
            <h2 id="download-modal-title" className="download-modal__title">
              {details.title}
            </h2>
            <p className="download-modal__subtitle">{details.subtitle}</p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="download-modal__close-btn"
            onClick={onClose}
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
                  <code>{details.stableCmd}</code>
                  <button
                    type="button"
                    className="download-modal__cli-copy-btn"
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
                    <span className="download-modal__badge download-modal__badge--beta">
                      {isEn ? "Beta Channel (Rolling beta)" : "Version Bêta (Rolling beta)"}
                    </span>
                  </div>
                  <span className="download-modal__version">{isEn ? "Rolling tag" : "Tag mobile"}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Version Bêta (Rolling beta) : Early access to upcoming features currently being tested."
                    : "Version Bêta (Rolling beta) : Accès anticipé aux fonctionnalités en cours de test."}
                </p>

                <div className="download-modal__cli-block">
                  <code>{details.betaCmd}</code>
                  <button
                    type="button"
                    className="download-modal__cli-copy-btn"
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
            </div>
          ) : (
            /* Cas normal : Binaires d'applications (Windows, macOS, Linux, Assistant) */
            <div className="download-modal__cards-grid">
              {/* Option 1 : VERSION STABLE */}
              <div className="download-modal__channel-card download-modal__channel-card--stable">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
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

                <div className="download-modal__card-meta">
                  <span className="download-modal__filename">{details.stableFilename}</span>
                  <span className="download-modal__fileformat">{details.format}</span>
                </div>

                <a
                  href={details.stableUrl}
                  className="download-modal__action-btn download-modal__action-btn--primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => {
                    setDownloadingKey("stable");
                    setTimeout(onClose, 300);
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
                      : (isEn ? `Download Stable (${stable.version})` : `Télécharger la Stable (${stable.version})`)}
                  </span>
                </a>
              </div>

              {/* Option 2 : VERSION BÊTA (Rolling beta) */}
              <div className="download-modal__channel-card download-modal__channel-card--beta">
                <div className="download-modal__card-header">
                  <div className="download-modal__card-tag-row">
                    <span className="download-modal__badge download-modal__badge--beta">
                      {isEn ? "Beta Channel (Rolling beta)" : "Version Bêta (Rolling beta)"}
                    </span>
                  </div>
                  <span className="download-modal__version">{isEn ? "Rolling release" : "Release continue"}</span>
                </div>

                <p className="download-modal__card-desc">
                  {isEn
                    ? "Version Bêta (Rolling beta) : Early access to upcoming features currently being tested."
                    : "Version Bêta (Rolling beta) : Accès anticipé aux fonctionnalités en cours de test."}
                </p>

                <div className="download-modal__card-meta">
                  <span className="download-modal__filename">{details.betaFilename}</span>
                  <span className="download-modal__fileformat">{details.format}</span>
                </div>

                <a
                  href={details.betaUrl}
                  className="download-modal__action-btn download-modal__action-btn--secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={() => {
                    setDownloadingKey("beta");
                    setTimeout(onClose, 300);
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
                      : (isEn ? "Download Beta (Rolling)" : "Télécharger la Bêta (Rolling)")}
                  </span>
                </a>
              </div>
            </div>
          )}

          {activePlatform === "android-tv" && (
            <div
              className="download-modal__tv-note"
              style={{
                marginTop: "1.25rem",
                padding: "1rem 1.25rem",
                borderRadius: "0.75rem",
                background: "rgba(61, 220, 132, 0.08)",
                border: "1px solid rgba(61, 220, 132, 0.25)",
                fontSize: "0.875rem",
                color: "var(--text-body)",
                lineHeight: 1.5,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                  color: "#3DDC84",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  {isEn
                    ? "Android TV Playout & Google Play Store"
                    : "Diffusion Android TV & Google Play Store"}
                </span>
              </div>
              <p style={{ margin: "0 0 0.5rem" }}>
                {isEn
                  ? "• Google Play Store: Google Developer account is validated. The official 1-click Google Play release is currently being processed for store approval."
                  : "• Google Play Store : Le compte développeur Google est validé. La parution officielle sur le catalogue Google Play de votre téléviseur est en cours de validation."}
              </p>
              <p style={{ margin: "0 0 0.5rem" }}>
                {isEn
                  ? "• Current Installation: Download the APK above and install it wirelessly using 'Send Files to TV', via a USB flash drive (FAT32/exFAT), or over ADB Wi-Fi."
                  : "• Installation immédiate : Téléchargez le paquet APK ci-dessus et installez-le sans fil via l'application « Send Files to TV », par clé USB (FAT32/exFAT) ou via ADB Wi-Fi."}
              </p>
              <p style={{ margin: 0 }}>
                {isEn
                  ? "• Storage Recommendation: For standalone server usage, connect a USB flash drive or SSD (128GB+) to store video classes without filling the TV's 4-8GB internal storage."
                  : "• Recommandation stockage : En mode serveur autonome, connectez une clé USB ou un SSD externe (128 Go+) pour stocker vos cours sans saturer la mémoire interne (4-8 Go) de la TV."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
