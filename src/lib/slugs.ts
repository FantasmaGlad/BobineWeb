/**
 * Slugs anglais des pages dont le chemin français diffère : `/fr/confidentialite` devient
 * `/en/privacy`. Fichier sans import, lu à la fois par l'application (`seo.ts`) et par
 * `next.config.ts`, qui en dérive les redirections 308 de l'ancien chemin français sous `/en` et
 * les réécritures vers la page réelle (un seul dossier par page dans `src/app/[locale]/`).
 * Une page absente de cette table garde le même chemin dans les deux langues.
 */
export const EN_SLUG_MAP: Record<string, string> = {
  "/fonctionnalites": "/features",
  "/comparatif": "/compare",
  "/comparatif/les-mills-cinema": "/compare/les-mills-cinema",
  "/comparatif/wexer-fitness-on-demand": "/compare/wexer-fitness-on-demand",
  "/comparatif/radical-fitness-yako": "/compare/radical-fitness-yako",
  "/comparatif/affichage-dynamique-fitness": "/compare/digital-signage-fitness",
  "/materiel": "/hardware",
  "/telechargement": "/download",
  "/ressources": "/resources",
  "/materiel/amazon": "/hardware/amazon",
  "/materiel/aliexpress": "/hardware/aliexpress",
  "/documentation/utilisation": "/documentation/user-guide",
  "/documentation/developpeurs": "/documentation/developers",
  "/canaux": "/channels",
  "/canaux/stable": "/channels/stable",
  "/canaux/beta": "/channels/beta",
  "/canaux/canary": "/channels/canary",
  "/nouveautes": "/whats-new",
  "/a-propos": "/about",
  "/soutenir": "/support",
  "/mentions-legales": "/legal-notice",
  "/confidentialite": "/privacy",
  "/securite": "/security",
  "/ordinateur": "/computer",
};
