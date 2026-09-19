"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  IS_ONION,
  ONION_APT_HOST,
  ONION_SITE_HOST,
  ONION_SITE_URL,
  TOR_PROJECT_URL,
  TOR_SOURCE_URL,
} from "@/lib/onion";
import TorLogo from "@/components/icons/TorLogo";

const copy = {
  fr: {
    title: "Distribution Tor (.onion)",
    badge: "Réseau Tor",
    onion: "Vous consultez la version .onion de Bobine. Les échanges sont chiffrés de bout en bout et sans intermédiaire.",
    clear: "Bobine est accessible sur le réseau Tor pour préserver la confidentialité de votre salle et contourner les pare-feu restrictifs.",
    siteLabel: "Site miroir :",
    aptLabel: "Dépôt APT :",
    copy: "Copier",
    copied: "Copié !",
    project: "Projet Tor officiel",
    source: "Code source Tor",
  },
  en: {
    title: "Tor Distribution (.onion)",
    badge: "Tor Network",
    onion: "You are browsing the .onion version of Bobine. Connections are end-to-end encrypted with zero intermediary.",
    clear: "Bobine is available over Tor to keep your gym's IP address private and bypass restrictive firewalls.",
    siteLabel: "Mirror site:",
    aptLabel: "APT repo:",
    copy: "Copy",
    copied: "Copied!",
    project: "Official Tor Project",
    source: "Tor source code",
  },
} as const;

/** Petit encart soigné dans la barre latérale de documentation (site clair et miroir). */
export default function TorSupportNote({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [copiedKey, setCopiedKey] = useState<"site" | "apt" | null>(null);

  const copyUrl = (key: "site" | "apt", text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const onionSiteFull = `${ONION_SITE_URL}/`;
  const onionAptFull = `tor+http://${ONION_APT_HOST}/`;

  return (
    <aside className="docs-tor-note" aria-label={t.title}>
      <div className="docs-tor-note__header">
        <TorLogo size={16} />
        <span className="docs-tor-note__title">{t.title}</span>
      </div>

      <p className="docs-tor-note__desc">{IS_ONION ? t.onion : t.clear}</p>

      <div className="docs-tor-note__urls">
        <div className="docs-tor-note__url-row">
          <span className="docs-tor-note__url-label">{t.siteLabel}</span>
          <div className="docs-tor-note__url-box">
            <code className="docs-tor-note__code" title={onionSiteFull}>
              {ONION_SITE_HOST}
            </code>
            <button
              type="button"
              className="docs-tor-note__copy-btn"
              onClick={() => copyUrl("site", onionSiteFull)}
              aria-label={`${t.copy} ${onionSiteFull}`}
            >
              {copiedKey === "site" ? t.copied : t.copy}
            </button>
          </div>
        </div>

        <div className="docs-tor-note__url-row">
          <span className="docs-tor-note__url-label">{t.aptLabel}</span>
          <div className="docs-tor-note__url-box">
            <code className="docs-tor-note__code" title={onionAptFull}>
              {ONION_APT_HOST}
            </code>
            <button
              type="button"
              className="docs-tor-note__copy-btn"
              onClick={() => copyUrl("apt", onionAptFull)}
              aria-label={`${t.copy} ${onionAptFull}`}
            >
              {copiedKey === "apt" ? t.copied : t.copy}
            </button>
          </div>
        </div>
      </div>

      <div className="docs-tor-note__links">
        <a href={TOR_PROJECT_URL} target="_blank" rel="noopener noreferrer">
          {t.project}
        </a>
        <span className="docs-tor-note__bullet" aria-hidden="true">·</span>
        <a href={TOR_SOURCE_URL} target="_blank" rel="noopener noreferrer">
          {t.source}
        </a>
      </div>
    </aside>
  );
}
