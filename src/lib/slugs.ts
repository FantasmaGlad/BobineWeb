/**
 * Slugs anglais des pages dont le chemin français diffère : `/fr/confidentialite` devient
 * `/en/privacy`. Fichier sans import, lu à la fois par l'application (`seo.ts`) et par
 * `next.config.ts`, qui en dérive les redirections 308 de l'ancien chemin français sous `/en` et
 * les réécritures vers la page réelle (un seul dossier par page dans `src/app/[locale]/`).
 * Une page absente de cette table garde le même chemin dans les deux langues.
 */
export const EN_SLUG_MAP: Record<string, string> = {
  "/fonctionnalites": "/features",
  "/ressources": "/resources",
  "/a-propos": "/about",
  "/documentation/utilisation": "/documentation/user-guide",
  "/documentation/developpeurs": "/documentation/developers",
  "/documentation/anonymisation": "/documentation/anonymization",
  "/canaux": "/channels",
  "/canaux/stable": "/channels/stable",
  "/canaux/beta": "/channels/beta",
  "/canaux/canary": "/channels/canary",
  "/mentions-legales": "/legal-notice",
  "/confidentialite": "/privacy",
};
