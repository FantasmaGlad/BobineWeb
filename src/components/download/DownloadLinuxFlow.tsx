"use client";

import BrandIcon from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n";
import { LINUX_FAMILIES, LINUX_FAMILY_IDS, type LinuxFamilyId } from "@/lib/linuxPackages";
import CopyButton from "./CopyButton";

interface DownloadLinuxFlowProps {
  titleId: string;
  locale: Locale;
  isEn: boolean;
  family: LinuxFamilyId;
  onFamilyChange: (id: LinuxFamilyId) => void;
  repoScript: string;
  filename?: string | null;
  size: string;
  url?: string | null;
  copied: string;
  onCopy: (text: string, id: string) => void;
}

export default function DownloadLinuxFlow({
  titleId, locale, isEn, family, onFamilyChange, repoScript, filename, size, url, copied, onCopy,
}: DownloadLinuxFlowProps) {
  const active = LINUX_FAMILIES[family];
  return (
    <div className="dl-primary-flow">
      <div role="group" aria-label={isEn ? "Distribution family" : "Famille de distribution"} className="dl-segmented dl-segmented--distros">
        {LINUX_FAMILY_IDS.map((id) => {
          const f = LINUX_FAMILIES[id];
          return (
            <button key={id} type="button" className="dl-segmented__btn" aria-pressed={family === id} disabled={!f.live} onClick={() => onFamilyChange(id)}>
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
              {isEn ? `Signed ${active.manager.toUpperCase()} repository (recommended)` : `Dépôt ${active.manager.toUpperCase()} signé (recommandé)`}
            </span>
            <span className="dl-terminal-box__sub">
              {isEn ? "Automatic system updates · OpenPGP" : "Mises à jour automatiques · OpenPGP"}
            </span>
          </div>
          <CopyButton text={repoScript} id="repo" label={isEn ? "Copy" : "Copier"} copied={copied} onCopy={onCopy} isEn={isEn} />
        </div>
        <pre className="dl-code"><code>{repoScript}</code></pre>
      </section>

      <div className="dl-direct-row">
        <div className="dl-direct-row__info">
          <span className="dl-direct-row__label">{isEn ? "Or direct package:" : "Ou paquet direct :"}</span>
          {filename && <code className="dl-direct-row__file">{filename}</code>}
          {size && <span className="dl-direct-row__meta">({size})</span>}
        </div>
        {url ? (
          <a className="dl-btn dl-btn--secondary" href={url} rel="noopener noreferrer" download>
            <Icon name="download" size={16} />
            <span>{isEn ? "Download" : "Télécharger"} {active.extension}</span>
          </a>
        ) : (
          <span className="dl-direct-row__meta">{isEn ? "Not published for this channel" : "Non publié sur ce canal"}</span>
        )}
      </div>
    </div>
  );
}
