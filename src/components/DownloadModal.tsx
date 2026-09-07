"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { ReleaseChannelInfo } from "@/app/api/github-stats/route";
import WindowsIcon from "@/components/icons/WindowsIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import TerminalIcon from "@/components/icons/TerminalIcon";
import TauriIcon from "@/components/icons/TauriIcon";

export type DownloadPlatform = "windows" | "macos" | "linux" | "cli" | "tauri";

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
  const [activePlatform, setActivePlatform] = useState<DownloadPlatform>(initialPlatform);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Synchronise la plateforme sélectionnée lors de l'ouverture
  useEffect(() => {
    if (isOpen && initialPlatform) {
      setActivePlatform(initialPlatform);
    }
  }, [isOpen, initialPlatform]);

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

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCmd(key);
      setTimeout(() => setCopiedCmd(null), 2000);
    }
  };

  const platforms: Array<{
    id: DownloadPlatform;
    name: string;
    badge: string;
    icon: ReactNode;
  }> = [
    {
      id: "windows",
      name: "Windows",
      badge: ".exe",
      icon: <WindowsIcon size={18} />,
    },
    {
      id: "macos",
      name: "macOS",
      badge: ".dmg",
      icon: <AppleIcon size={18} />,
    },
    {
      id: "linux",
      name: "Linux",
      badge: ".deb",
      icon: <LinuxIcon size={18} />,
    },
    {
      id: "cli",
      name: isEn ? "CLI Appliance" : "CLI Appliance",
      badge: "bash",
      icon: <TerminalIcon size={18} />,
    },
    {
      id: "tauri",
      name: isEn ? "Assistant" : "Assistant",
      badge: "Tauri",
      icon: <TauriIcon size={18} />,
    },
  ];

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
          betaFilename: "bobine-beta_amd64.deb",
          format: ".deb",
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

  return (
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

        {/* Sélecteur d'OS sous forme d'onglets compacts */}
        <div
          className="download-modal__os-nav"
          role="tablist"
          aria-label={isEn ? "Platform selector" : "Sélecteur de plateforme"}
        >
          {platforms.map((p) => {
            const isSelected = activePlatform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`download-modal__os-tab ${isSelected ? "is-active" : ""}`}
                onClick={() => setActivePlatform(p.id)}
              >
                <span className="download-modal__os-icon">{p.icon}</span>
                <span className="download-modal__os-name">{p.name}</span>
                <span className="download-modal__os-badge">{p.badge}</span>
              </button>
            );
          })}
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
                  onClick={onClose}
                >
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
                  <span>
                    {isEn ? `Download Stable (${stable.version})` : `Télécharger la Stable (${stable.version})`}
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
                  onClick={onClose}
                >
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
                  <span>
                    {isEn ? "Download Beta (Rolling)" : "Télécharger la Bêta (Rolling)"}
                  </span>
                </a>
              </div>
            </div>
          )}

          {/* Note rassurante sur la mise à jour sans doublon */}
          <div className="download-modal__reassurance">
            <div className="download-modal__reassurance-icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <p className="download-modal__reassurance-text">
              {isEn ? (
                <>
                  <strong>In-place update guarantee:</strong> The Beta uses the same application identifiers as the Stable. Installing it upgrades your existing Bobine installation without creating a duplicate app or affecting your library and settings.
                </>
              ) : (
                <>
                  <strong>Garantie de mise à jour sans doublon :</strong> La version Bêta partage les mêmes identifiants système que la Stable. Son installation met à jour votre version existante sans créer d&apos;application doublon ni altérer vos vidéos ou réglages.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
