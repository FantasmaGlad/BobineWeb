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

function CopyButton({ text, id, label, copied, onCopy, isEn }: { text: string; id: string; label: string; copied: string; onCopy: (text: string, id: string) => void; isEn: boolean }) {
  return (
    <button type="button" className="dl-btn dl-btn--ghost" onClick={() => onCopy(text, id)}>
      <Icon name={copied === id ? "check" : "copy"} size={16} />
      <span>{copied === id ? (isEn ? "Copied" : "Copié") : label}</span>
    </button>
  );
}

/** Fenêtre de téléchargement : `<dialog>` natif (arrière-plan inerte, Échap, piège et retour du focus). */
export default function DownloadPanel({ isOpen, onClose, locale, initialPlatform = "windows", stable, beta, canary }: DownloadPanelProps) {
  const isEn = locale === "en";
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const titleId = useId();
  const [arch, setArch] = useState<CpuArchitecture>("x86_64");
  const [family, setFamily] = useState<LinuxFamilyId>("debian");
  const [channel, setChannel] = useState<PackageChannel>("stable");
  const [copied, setCopied] = useState("");

  // Architecture ARM64 détectée côté client (Snapdragon, Linux aarch64, Windows ARM).
  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/\b(aarch64|arm64|armv8|woa|snapdragon)\b/i.test(ua)) {
      setArch("arm64");
      return;
    }
    const uaData = (navigator as Navigator & { userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }> } }).userAgentData;
    uaData?.getHighEntropyValues?.(["architecture"]).then((v) => v?.architecture && /arm/i.test(v.architecture) && setArch("arm64")).catch(() => {});
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

  // La plateforme est celle de la carte cliquée : la fenêtre ne la fait pas choisir une seconde fois.
  const platform: DownloadPlatform = initialPlatform === "tauri" || initialPlatform === "assistant" ? "linux" : initialPlatform;
  const result = resolveDownload({ locale, platform, arch, family, channel, stable, beta, canary });
  const hasArch = platform === "windows" || platform === "linux";
  const isLinux = platform === "linux";
  const isCli = platform === "cli";
  const size = formatSize(result.file?.size, locale);
  const published = result.file?.updatedAt ?? result.publishedAt;
  const publishedLabel = published ? new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { dateStyle: "long" }).format(new Date(published)) : "";

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? "" : c)), 2000);
    });
  };

  const repoScript = family === "debian" ? aptInstallScript(channel) : family === "fedora" ? fedoraInstallScript(channel) : archInstallScript(channel);
  const cliSteps = [
    "curl -fsSL https://bobine.fit/install.sh -o install.sh",
    "less install.sh",
    `sudo bash install.sh${channel === "stable" ? "" : ` --channel=${channel}`}`,
  ].join("\n");

  const channelRows: Array<{ id: PackageChannel; label: string; version: string; hint: string }> = [
    { id: "stable", label: "Stable", version: stable.version, hint: isEn ? "Official numbered release" : "Version officielle numérotée" },
    { id: "beta", label: isEn ? "Beta" : "Bêta", version: beta.commit ? `#${beta.commit}` : isEn ? "rolling" : "continue", hint: isEn ? "Curated batches ahead of Stable" : "Lots choisis avant la Stable" },
    { id: "canary", label: "Canary", version: canary.commit ? `#${canary.commit}` : isEn ? "rolling" : "continue", hint: isEn ? "Latest commit, untested" : "Dernier commit, non testé" },
  ];

  return (
    <dialog
      ref={dialogRef}
      className="dl-panel"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dl-panel__sheet">
        <header className="dl-panel__header">
          <BrandIcon name={HEADING_ICON[platform] ?? "os.linux"} size={40} className="dl-panel__logo" />
          <div className="dl-panel__heading">
            <h2 id={titleId} className="dl-panel__title">
              {isEn ? `Bobine for ${result.heading}` : `Bobine pour ${result.heading}`}
            </h2>
            <p className="dl-panel__targets">{result.targets}</p>
          </div>
          <button type="button" className="dl-panel__close" onClick={onClose} autoFocus aria-label={isEn ? "Close" : "Fermer"}>
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="dl-panel__body">
          <div className="dl-panel__col">
            {hasArch && (
              <div role="group" aria-labelledby={`${titleId}-arch`} className="dl-field">
                <span id={`${titleId}-arch`} className="dl-field__label">{isEn ? "Architecture" : "Architecture"}</span>
                <div className="dl-chips">
                  <button type="button" className="dl-chip" aria-pressed={arch === "x86_64"} onClick={() => setArch("x86_64")}>
                    <span>x86_64</span>
                    <small>Intel / AMD</small>
                  </button>
                  <button type="button" className="dl-chip" aria-pressed={arch === "arm64"} onClick={() => setArch("arm64")}>
                    <span>ARM64</span>
                    <small>Snapdragon / Pi 5</small>
                  </button>
                </div>
              </div>
            )}

            {isLinux && (
              <div role="group" aria-labelledby={`${titleId}-family`} className="dl-field">
                <span id={`${titleId}-family`} className="dl-field__label">{isEn ? "Distribution family" : "Famille de distribution"}</span>
                <div className="dl-chips">
                  {LINUX_FAMILY_IDS.map((id) => {
                    const f = LINUX_FAMILIES[id];
                    return (
                      <button key={id} type="button" className="dl-chip" aria-pressed={family === id} disabled={!f.live} onClick={() => setFamily(id)}>
                        <BrandIcon name={`distro.${f.logo}`} size={18} />
                        <span>{f.label[locale]}</span>
                        <small>{f.live ? f.extension : isEn ? "soon" : "bientôt"}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div role="group" aria-labelledby={`${titleId}-channel`} className="dl-field">
              <span id={`${titleId}-channel`} className="dl-field__label">{isEn ? "Release channel" : "Canal de version"}</span>
              <div className="dl-chips dl-chips--stack">
                {channelRows.map((row) => (
                  <button key={row.id} type="button" className="dl-chip dl-chip--row" aria-pressed={channel === row.id} onClick={() => setChannel(row.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/channels/${row.id}.webp`} alt="" width={28} height={28} className="dl-chip__logo" />
                    <span className="dl-chip__name">{row.label}</span>
                    <code>{row.version}</code>
                    <small>{row.hint}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="dl-panel__col">
            {isLinux && (
              <section className="dl-block" aria-labelledby={`${titleId}-repo`}>
                <h3 id={`${titleId}-repo`} className="dl-block__title">
                  {isEn ? `Signed ${LINUX_FAMILIES[family].manager.toUpperCase()} repository (recommended)` : `Dépôt ${LINUX_FAMILIES[family].manager.toUpperCase()} signé (recommandé)`}
                </h3>
                <p className="dl-block__text">
                  {isEn ? "Updates arrive with the system. The repository is signed with OpenPGP." : "Les mises à jour arrivent avec le système. Le dépôt est signé avec OpenPGP."}
                </p>
                <pre className="dl-code"><code>{repoScript}</code></pre>
                <CopyButton text={repoScript} id="repo" label={isEn ? "Copy commands" : "Copier les commandes"} copied={copied} onCopy={copy} isEn={isEn} />
              </section>
            )}

            {isCli ? (
              <section className="dl-block" aria-labelledby={`${titleId}-cli`}>
                <h3 id={`${titleId}-cli`} className="dl-block__title">{isEn ? "Read the script, then run it" : "Lire le script, puis l'exécuter"}</h3>
                <p className="dl-block__text">
                  {isEn
                    ? "The script installs services and packages with administrator rights: read it before running it."
                    : "Le script installe des services et des paquets avec les droits d'administrateur : lisez-le avant de l'exécuter."}
                </p>
                <pre className="dl-code"><code>{cliSteps}</code></pre>
                <CopyButton text={cliSteps} id="cli-steps" label={isEn ? "Copy commands" : "Copier les commandes"} copied={copied} onCopy={copy} isEn={isEn} />
                <details className="dl-details">
                  <summary>{isEn ? "Single command (without reading)" : "Commande unique (sans lecture préalable)"}</summary>
                  <pre className="dl-code"><code>{result.command}</code></pre>
                  <CopyButton text={result.command ?? ""} id="cli-one" label={isEn ? "Copy" : "Copier"} copied={copied} onCopy={copy} isEn={isEn} />
                </details>
              </section>
            ) : null}

            <section className="dl-block" aria-labelledby={`${titleId}-file`}>
              <h3 id={`${titleId}-file`} className="dl-block__title">{isLinux ? (isEn ? "Direct download" : "Téléchargement direct") : isEn ? "File" : "Fichier"}</h3>
              <dl className="dl-facts">
                {result.filename && (<><dt>{isEn ? "File" : "Fichier"}</dt><dd><code>{result.filename}</code></dd></>)}
                <dt>{isEn ? "Version" : "Version"}</dt>
                <dd className="dl-facts__version">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/channels/${channel}.webp`} alt="" width={22} height={22} className="dl-chip__logo" />
                  <span>{result.version}</span>
                </dd>
                {size && (<><dt>{isEn ? "Size" : "Taille"}</dt><dd>{size}</dd></>)}
                {publishedLabel && (<><dt>{isEn ? "Published" : "Publié"}</dt><dd>{publishedLabel}</dd></>)}
              </dl>
              {!isCli && (result.url ? (
                <a className="dl-btn dl-btn--primary" href={result.url} rel="noopener noreferrer" download>
                  <Icon name="download" size={18} />
                  <span>
                    {isEn ? "Download" : "Télécharger"} {result.filename}
                    {size ? ` (${size})` : ""}
                  </span>
                </a>
              ) : (
                <p className="dl-block__text">{isEn ? "This file is not published for this channel yet." : "Ce fichier n'est pas encore publié pour ce canal."}</p>
              ))}
              <div className="dl-links">
                <a href={result.releaseUrl} target="_blank" rel="noopener noreferrer">{isEn ? "Release notes" : "Notes de version"}</a>
                <a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noopener noreferrer">{isEn ? "Source code (AGPL-3.0)" : "Code source (AGPL-3.0)"}</a>
                <a href="https://github.com/FantasmaGlad/Bobine/releases" target="_blank" rel="noopener noreferrer">{isEn ? "Other files" : "Autres fichiers"}</a>
                {isLinux && <Link href={`/${locale}/linux`} onClick={onClose}>{isEn ? "Linux page" : "Page Linux"}</Link>}
              </div>
            </section>

            {result.requirements && (
              <p className="dl-block__text dl-requirements">
                <strong>{isEn ? "Requirements: " : "Prérequis : "}</strong>
                {result.requirements} {isEn ? "No account or online service required." : "Aucun compte ni service en ligne requis."}
              </p>
            )}
          </div>
        </div>
        <p className="dl-sr-only" role="status" aria-live="polite">{copied ? (isEn ? "Copied to the clipboard" : "Copié dans le presse-papiers") : ""}</p>
      </div>
    </dialog>
  );
}
