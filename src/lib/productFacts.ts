/**
 * Faits produit réutilisés dans plusieurs pages (landing, documentation, FAQ, boutique, JSON-LD) : un seul
 * endroit à changer quand la version minimale d'Android évolue. Les numéros de version de Bobine, eux, ne
 * figurent jamais ici : ils viennent de GitHub à l'affichage (`releaseChannels.ts`).
 */
export const ANDROID = {
  /** Première version d'Android prise en charge (paquets téléphone/tablette et Android TV). */
  minVersion: 14,
  minApi: 34,
  /** Dernière version d'Android couverte par les essais. */
  maxVersion: 16,
  maxApi: 36,
} as const;

/** Systèmes d'exploitation déclarés dans les données structurées. */
export const OPERATING_SYSTEMS = ["Windows", "macOS", "Linux", "Android", "Android TV"] as const;

/** « x.y.z » : emplacement de la version dans un nom de fichier cité en exemple. */
export const FILE_VERSION_PLACEHOLDER = "x.y.z";
