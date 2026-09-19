import type { Locale } from "@/lib/i18n";
import { IS_ONION, ONION_SITE_URL, TOR_PROJECT_URL, TOR_SOURCE_URL } from "@/lib/onion";

const copy = {
  fr: {
    title: "Soutien à Tor",
    onion: "Vous êtes sur le miroir Tor de Bobine. Bobine soutient le projet Tor et, plus largement, le logiciel libre.",
    clear: "Bobine est aussi disponible en .onion : installation et mises à jour sans révéler votre adresse IP.",
    mirror: "Ouvrir la version .onion",
    project: "Projet Tor",
    source: "Code source de Tor",
  },
  en: {
    title: "Supporting Tor",
    onion: "You are on the Bobine Tor mirror. Bobine supports the Tor project and free software at large.",
    clear: "Bobine is also available as a .onion: install and update without revealing your IP address.",
    mirror: "Open the .onion version",
    project: "Tor Project",
    source: "Tor source code",
  },
} as const;

/** Petit encart discret (coin de la documentation), identique sur le site clair et sur le miroir Tor. */
export default function TorSupportNote({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <aside className="docs-tor-note" aria-label={t.title}>
      <span className="docs-tor-note__title">{t.title}</span>
      <p>{IS_ONION ? t.onion : t.clear}</p>
      <div className="docs-tor-note__links">
        {!IS_ONION && (
          <a href={`${ONION_SITE_URL}/${locale}/documentation/`} rel="noopener noreferrer">
            {t.mirror}
          </a>
        )}
        <a href={TOR_PROJECT_URL} target="_blank" rel="noopener noreferrer">
          {t.project}
        </a>
        <a href={TOR_SOURCE_URL} target="_blank" rel="noopener noreferrer">
          {t.source}
        </a>
      </div>
    </aside>
  );
}
