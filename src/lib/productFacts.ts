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

export type PlatformId = "windows" | "macos" | "linux" | "android" | "android-tv";

/** Configuration requise par plateforme, affichée sur les pages de téléchargement et de référencement. */
export const REQUIREMENTS: Record<PlatformId, { name: string; fr: string; en: string }> = {
  windows: {
    name: "Windows",
    fr: "Windows 10 ou 11, processeur x86-64 ou ARM64 (Snapdragon).",
    en: "Windows 10 or 11, x86-64 or ARM64 (Snapdragon) processor.",
  },
  macos: {
    name: "macOS",
    fr: "Mac Apple Silicon (M1 à M4).",
    en: "Apple Silicon Mac (M1 to M4).",
  },
  linux: {
    name: "Linux",
    fr: "Debian, Ubuntu ou Mint, paquet .deb en x86-64 ou ARM64 ; dépôt APT officiel disponible.",
    en: "Debian, Ubuntu or Mint, .deb package for x86-64 or ARM64; official APT repository available.",
  },
  android: {
    name: "Android",
    fr: `Android ${ANDROID.minVersion} ou supérieur (API ${ANDROID.minApi}), tablette, Google Book ou borne ARM.`,
    en: `Android ${ANDROID.minVersion} or later (API ${ANDROID.minApi}), tablet, Google Book or ARM kiosk.`,
  },
  "android-tv": {
    name: "Android TV",
    fr: `Android ${ANDROID.minVersion} ou supérieur (API ${ANDROID.minApi}), ARM 32 ou 64 bits, box, clé HDMI ou téléviseur Android TV ou Google TV.`,
    en: `Android ${ANDROID.minVersion} or later (API ${ANDROID.minApi}), 32-bit or 64-bit ARM, Android TV or Google TV box, stick or television.`,
  },
};
