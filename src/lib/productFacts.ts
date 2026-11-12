import { PACKAGE_REPOS_LIVE } from "@/lib/linuxPackages";

export const ANDROID = {
  minVersion: 14,
  minApi: 34,
  maxVersion: 16,
  maxApi: 36,
} as const;

export const OPERATING_SYSTEMS = ["Windows", "macOS", "Linux", "Android", "Android TV"] as const;

export type PlatformId = "windows" | "macos" | "linux" | "android" | "android-tv";

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
    fr: PACKAGE_REPOS_LIVE
      ? "Debian, Ubuntu ou Mint (.deb), Fedora et dérivés (.rpm), Arch Linux et dérivés (pacman), en x86-64 ou ARM64 ; dépôts officiels signés."
      : "Debian, Ubuntu ou Mint, paquet .deb en x86-64 ou ARM64 ; dépôt APT officiel disponible. Paquets Fedora (.rpm) et Arch Linux (pacman) bientôt.",
    en: PACKAGE_REPOS_LIVE
      ? "Debian, Ubuntu or Mint (.deb), Fedora and derivatives (.rpm), Arch Linux and derivatives (pacman), on x86-64 or ARM64; official signed repositories."
      : "Debian, Ubuntu or Mint, .deb package for x86-64 or ARM64; official APT repository available. Fedora (.rpm) and Arch Linux (pacman) packages coming soon.",
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
