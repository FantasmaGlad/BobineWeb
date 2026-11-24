"use client";

import Icon from "@/components/ui/Icon";
import type { DownloadPlatform } from "@/lib/downloadCatalog";
import CopyButton from "./CopyButton";

export function DownloadHeroAction({
  titleId, url, filename, version, size, publishedLabel, isEn,
}: {
  titleId: string;
  url?: string | null;
  filename?: string | null;
  version: string;
  size: string;
  publishedLabel: string;
  isEn: boolean;
}) {
  return (
    <section className="dl-hero-action" aria-labelledby={`${titleId}-file`}>
      <div className="dl-hero-action__main">
        {url ? (
          <a id={`${titleId}-file`} className="dl-btn dl-btn--primary dl-btn--hero" href={url} rel="noopener noreferrer" download>
            <Icon name="download" size={18} />
            <span>{isEn ? "Download" : "Télécharger"} {filename || `Bobine ${version}`}</span>
            {size && <small className="dl-btn__size">{size}</small>}
          </a>
        ) : (
          <p className="dl-block__text">
            {isEn ? "This file is not published for this channel yet." : "Ce fichier n'est pas encore publié pour ce canal."}
          </p>
        )}
      </div>
      <div className="dl-hero-action__facts">
        {filename && <span><strong>{isEn ? "File:" : "Fichier :"}</strong> <code>{filename}</code></span>}
        {publishedLabel && <span><strong>{isEn ? "Published:" : "Publié :"}</strong> {publishedLabel}</span>}
        <span>{isEn ? "100% local · No account required" : "100 % local · Sans compte requis"}</span>
      </div>
    </section>
  );
}

export function DownloadOneLineBox({
  titleId, platform, oneLine, copied, onCopy, isEn,
}: {
  titleId: string;
  platform: DownloadPlatform;
  oneLine: string;
  copied: string;
  onCopy: (text: string, id: string) => void;
  isEn: boolean;
}) {
  const title = platform === "windows"
    ? (isEn ? "Or in one PowerShell command" : "Ou en une commande PowerShell")
    : (isEn ? "Or with Homebrew" : "Ou avec Homebrew");
  const subtitle = platform === "windows"
    ? (isEn ? "Signed SHA256SUMS checked, x64 or ARM64 detected" : "SHA256SUMS signé vérifié, x64 ou ARM64 détecté")
    : (isEn ? "Also installs the bobine command" : "Installe aussi la commande bobine");
  return (
    <section className="dl-terminal-box" aria-labelledby={`${titleId}-one-line`}>
      <div className="dl-terminal-box__bar">
        <div className="dl-terminal-box__meta">
          <span id={`${titleId}-one-line`} className="dl-terminal-box__title">{title}</span>
          <span className="dl-terminal-box__sub">{subtitle}</span>
        </div>
        <CopyButton text={oneLine} id="one-line" label={isEn ? "Copy" : "Copier"} copied={copied} onCopy={onCopy} isEn={isEn} />
      </div>
      <pre className="dl-code"><code>{oneLine}</code></pre>
    </section>
  );
}
