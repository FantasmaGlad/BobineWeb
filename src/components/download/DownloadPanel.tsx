"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import BrandIcon from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";
import type { AssetKey } from "@/lib/assets";
import {
  CpuArchitecture,
  DownloadPlatform,
  formatSize,
  resolveDownload,
} from "@/lib/downloadCatalog";
import {
  LINUX_FAMILIES,
  LINUX_FAMILY_IDS,
  aptInstallScript,
  archInstallScript,
  fedoraInstallScript,
  type LinuxFamilyId,
  type PackageChannel,
} from "@/lib/linuxPackages";
import "@/styles/components/download-panel.css";

export type { DownloadPlatform, CpuArchitecture } from "@/lib/downloadCatalog";

interface DownloadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialPlatform?: DownloadPlatform;
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
  canary: ReleaseChannelInfo;
}

const HEADING_ICON: Record<string, AssetKey> = {
  windows: "os.windows",
  macos: "os.macos",
  linux: "os.linux",
  android: "os.android",
  "android-tv": "os.androidtv",
  cli: "os.linux",
  tauri: "os.linux",
  assistant: "os.linux",
};

function CopyButton({
  text,
  id,
  label,
  copied,
  onCopy,
  isEn,
}: {
  text: string;
  id: string;
  label: string;
  copied: string;
  onCopy: (text: string, id: string) => void;
  isEn: boolean;
}) {
  const isCopied = copied === id;
  return (
    <button
      type="button"
      className={`dl-btn dl-btn--copy${isCopied ? " is-copied" : ""}`}
      onClick={() => onCopy(text, id)}
    >
      <Icon name={isCopied ? "check" : "copy"} size={15} />
      <span>{isCopied ? (isEn ? "Copied" : "Copié") : label}</span>
    </button>
  );
}

/** Fenêtre de téléchargement minimaliste (« Simple d'abord » + divulgation progressive). */
export default function DownloadPanel({
  isOpen,
  onClose,
  locale,
  initialPlatform = "windows",
  stable,
  beta,
  canary,
}: DownloadPanelProps) {
  const isEn = locale === "en";
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const [arch, setArch] = useState<CpuArchitecture>("x86_64");
  const [family, setFamily] = useState<LinuxFamilyId>("debian");
  const [channel, setChannel] = useState<PackageChannel>("stable");
  const [copied, setCopied] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Architecture ARM64 détectée côté client (Snapdragon, Linux aarch64, Windows ARM).
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/\b(aarch64|arm64|armv8|woa|snapdragon)\b/i.test(ua)) {
      queueMicrotask(() => setArch("arm64"));
      return;
    }
    const uaData = (
      navigator as Navigator & {
        userAgentData?: {
          getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
        };
      }
    ).userAgentData;
    uaData
      ?.getHighEntropyValues?.(["architecture"])
      .then((v) => v?.architecture && /arm/i.test(v.architecture) && setArch("arm64"))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [isOpen]);

  const platform: DownloadPlatform =
    initialPlatform === "tauri" || initialPlatform === "assistant" ? "linux" : initialPlatform;
  const result = resolveDownload({
    locale,
    platform,
    arch,
    family,
    channel,
    stable,
    beta,
    canary,
  });
  const hasArch = platform === "windows" || platform === "linux";
  const isLinux = platform === "linux";
  const isCli = platform === "cli";
  const size = formatSize(result.file?.size, locale);
  const published = result.file?.updatedAt ?? result.publishedAt;
  const publishedLabel = published
    ? new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { dateStyle: "medium" }).format(
        new Date(published),
      )
    : "";

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? "" : c)), 2000);
    });
  };

  const repoScript =
    family === "debian"
      ? aptInstallScript(channel)
      : family === "fedora"
        ? fedoraInstallScript(channel)
        : archInstallScript(channel);
  const cliSteps = [
    "curl -fsSL https://bobine.fit/install.sh -o install.sh",
    "less install.sh",
    `sudo bash install.sh${channel === "stable" ? "" : ` --channel=${channel}`}`,
  ].join("\n");

  const channelRows: Array<{ id: PackageChannel; label: string; version: string }> = [
    { id: "stable", label: "Stable", version: stable.version },
    {
      id: "beta",
      label: isEn ? "Beta" : "Bêta",
      version: beta.commit ? `#${beta.commit}` : isEn ? "rolling" : "continue",
    },
    {
      id: "canary",
      label: "Canary",
      version: canary.commit ? `#${canary.commit}` : isEn ? "rolling" : "continue",
    },
  ];

  const activeChannelLabel =
    channel === "stable" ? "Stable" : channel === "beta" ? (isEn ? "Beta" : "Bêta") : "Canary";

  return (
    <dialog
      ref={dialogRef}
      className={`dl-panel${isLinux || isCli ? " dl-panel--wide" : ""}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dl-panel__sheet">
        <header className="dl-panel__header">
          <BrandIcon
            name={HEADING_ICON[platform] ?? "os.linux"}
            size={36}
            className="dl-panel__logo"
          />
          <div className="dl-panel__heading">
            <div className="dl-panel__title-row">
              <h2 id={titleId} className="dl-panel__title">
                {isEn ? `Bobine for ${result.heading}` : `Bobine pour ${result.heading}`}
              </h2>
              <span className="dl-panel__badge">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/channels/bobine-${channel}.webp`}
                  alt=""
                  width={16}
                  height={16}
                  className="dl-panel__badge-logo"
                />
                <span>
                  {activeChannelLabel} · {result.version}
                </span>
                {hasArch && <span>· {arch}</span>}
              </span>
            </div>
            <p className="dl-panel__targets">{result.targets}</p>
          </div>
          <button
            type="button"
            className="dl-panel__close"
            onClick={onClose}
            autoFocus
            aria-label={isEn ? "Close" : "Fermer"}
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="dl-panel__body">
          {/* NIVEAU 1 : PARCOURS SIMPLE IMMÉDIAT */}
          {isLinux && (
            <div className="dl-primary-flow">
              <div
                role="group"
                aria-label={isEn ? "Distribution family" : "Famille de distribution"}
                className="dl-segmented dl-segmented--distros"
              >
                {LINUX_FAMILY_IDS.map((id) => {
                  const f = LINUX_FAMILIES[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      className="dl-segmented__btn"
                      aria-pressed={family === id}
                      disabled={!f.live}
                      onClick={() => setFamily(id)}
                    >
                      <BrandIcon name={`distro.${f.logo}`} size={16} />
                      <span>{f.label[locale]}</span>
                      <small>{f.extension}</small>
                    </button>
                  );
                })}
              </div>

              <section className="dl-terminal-box" aria-labelledby={`${titleId}-repo`}>
                <div className="dl-terminal-box__bar">
                  <div className="dl-terminal-box__meta">
                    <span id={`${titleId}-repo`} className="dl-terminal-box__title">
                      {isEn
                        ? `Signed ${LINUX_FAMILIES[family].manager.toUpperCase()} repository (recommended)`
                        : `Dépôt ${LINUX_FAMILIES[family].manager.toUpperCase()} signé (recommandé)`}
                    </span>
                    <span className="dl-terminal-box__sub">
                      {isEn ? "Automatic system updates · OpenPGP" : "Mises à jour automatiques · OpenPGP"}
                    </span>
                  </div>
                  <CopyButton
                    text={repoScript}
                    id="repo"
                    label={isEn ? "Copy" : "Copier"}
                    copied={copied}
                    onCopy={copy}
                    isEn={isEn}
                  />
                </div>
                <pre className="dl-code">
                  <code>{repoScript}</code>
                </pre>
              </section>

              <div className="dl-direct-row">
                <div className="dl-direct-row__info">
                  <span className="dl-direct-row__label">
                    {isEn ? "Or direct package:" : "Ou paquet direct :"}
                  </span>
                  {result.filename && <code className="dl-direct-row__file">{result.filename}</code>}
                  {size && <span className="dl-direct-row__meta">({size})</span>}
                </div>
                {result.url ? (
                  <a
                    className="dl-btn dl-btn--secondary"
                    href={result.url}
                    rel="noopener noreferrer"
                    download
                  >
                    <Icon name="download" size={16} />
                    <span>
                      {isEn ? "Download" : "Télécharger"} {LINUX_FAMILIES[family].extension}
                    </span>
                  </a>
                ) : (
                  <span className="dl-direct-row__meta">
                    {isEn ? "Not published for this channel" : "Non publié sur ce canal"}
                  </span>
                )}
              </div>
            </div>
          )}

          {isCli && (
            <section className="dl-terminal-box" aria-labelledby={`${titleId}-cli`}>
              <div className="dl-terminal-box__bar">
                <div className="dl-terminal-box__meta">
                  <span id={`${titleId}-cli`} className="dl-terminal-box__title">
                    {isEn ? "Read the script, then run it" : "Lire le script, puis l'exécuter"}
                  </span>
                </div>
                <CopyButton
                  text={cliSteps}
                  id="cli-steps"
                  label={isEn ? "Copy" : "Copier"}
                  copied={copied}
                  onCopy={copy}
                  isEn={isEn}
                />
              </div>
              <pre className="dl-code">
                <code>{cliSteps}</code>
              </pre>
            </section>
          )}

          {!isLinux && !isCli && (
            <section className="dl-hero-action" aria-labelledby={`${titleId}-file`}>
              <div className="dl-hero-action__main">
                {result.url ? (
                  <a
                    id={`${titleId}-file`}
                    className="dl-btn dl-btn--primary dl-btn--hero"
                    href={result.url}
                    rel="noopener noreferrer"
                    download
                  >
                    <Icon name="download" size={18} />
                    <span>
                      {isEn ? "Download" : "Télécharger"} {result.filename || `Bobine ${result.version}`}
                    </span>
                    {size && <small className="dl-btn__size">{size}</small>}
                  </a>
                ) : (
                  <p className="dl-block__text">
                    {isEn
                      ? "This file is not published for this channel yet."
                      : "Ce fichier n'est pas encore publié pour ce canal."}
                  </p>
                )}
              </div>
              <div className="dl-hero-action__facts">
                {result.filename && (
                  <span>
                    <strong>{isEn ? "File:" : "Fichier :"}</strong> <code>{result.filename}</code>
                  </span>
                )}
                {publishedLabel && (
                  <span>
                    <strong>{isEn ? "Published:" : "Publié :"}</strong> {publishedLabel}
                  </span>
                )}
                <span>{isEn ? "100% local · No account required" : "100 % local · Sans compte requis"}</span>
              </div>
            </section>
          )}

          {/* BARRE DE PIED & BOUTON "PLUS D'OPTIONS" (DIVULGATION PROGRESSIVE) */}
          <div className="dl-footer-bar">
            <button
              type="button"
              className="dl-more-toggle"
              aria-expanded={showMoreOptions}
              onClick={() => setShowMoreOptions((v) => !v)}
            >
              <Icon name={showMoreOptions ? "close" : "plus"} size={14} />
              <span>
                {isEn
                  ? "More options (Channel, Architecture, Info)"
                  : "Plus d'options (Canal, Architecture, Infos)"}
              </span>
            </button>

            <div className="dl-links">
              <a href={result.releaseUrl} target="_blank" rel="noopener noreferrer">
                {isEn ? "Release notes" : "Notes de version"}
              </a>
              <a
                href="https://github.com/FantasmaGlad/Bobine"
                target="_blank"
                rel="noopener noreferrer"
              >
                {isEn ? "Source code" : "Code source"}
              </a>
              {isLinux && (
                <Link href={`/${locale}/linux`} onClick={onClose}>
                  {isEn ? "Linux page" : "Page Linux"}
                </Link>
              )}
            </div>
          </div>

          {/* NIVEAU 2 : TIROIR D'OPTIONS AVANCÉES */}
          <div className="dl-advanced-drawer" data-open={showMoreOptions ? "true" : "false"}>
            <div className="dl-advanced-drawer__inner">
              <div className="dl-advanced-grid">
                {hasArch && (
                  <div role="group" aria-labelledby={`${titleId}-arch`} className="dl-field">
                    <span id={`${titleId}-arch`} className="dl-field__label">
                      {isEn ? "Processor architecture" : "Architecture processeur"}
                    </span>
                    <div className="dl-segmented">
                      <button
                        type="button"
                        className="dl-segmented__btn"
                        aria-pressed={arch === "x86_64"}
                        onClick={() => setArch("x86_64")}
                      >
                        <span>x86_64</span>
                        <small>Intel / AMD</small>
                      </button>
                      <button
                        type="button"
                        className="dl-segmented__btn"
                        aria-pressed={arch === "arm64"}
                        onClick={() => setArch("arm64")}
                      >
                        <span>ARM64</span>
                        <small>Snapdragon / Pi 5</small>
                      </button>
                    </div>
                  </div>
                )}

                <div role="group" aria-labelledby={`${titleId}-channel`} className="dl-field">
                  <span id={`${titleId}-channel`} className="dl-field__label">
                    {isEn ? "Release channel" : "Canal de version"}
                  </span>
                  <div className="dl-segmented">
                    {channelRows.map((row) => (
                      <button
                        key={row.id}
                        type="button"
                        className="dl-segmented__btn"
                        aria-pressed={channel === row.id}
                        onClick={() => setChannel(row.id)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/images/channels/bobine-${row.id}.webp`}
                          alt=""
                          width={16}
                          height={16}
                          className="dl-chip__logo"
                        />
                        <span>{row.label}</span>
                        <small>{row.version}</small>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {result.requirements && (
                <p className="dl-requirements">
                  <strong>{isEn ? "Requirements: " : "Prérequis : "}</strong>
                  {result.requirements}{" "}
                  {isEn
                    ? "No account or online service required."
                    : "Aucun compte ni service en ligne requis."}
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="dl-sr-only" role="status" aria-live="polite">
          {copied ? (isEn ? "Copied to the clipboard" : "Copié dans le presse-papiers") : ""}
        </p>
      </div>
    </dialog>
  );
}
