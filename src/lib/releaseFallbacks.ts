import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { fallbackNewPackages, packageUrl, type PackageChannel } from "@/lib/linuxPackages";

const RELEASES_BASE = "https://github.com/FantasmaGlad/Bobine/releases/download";

/**
 * Liens de repli quand l'API GitHub ne répond pas (limite de débit, panne) : les noms de fichiers
 * suivent exactement ceux que publie le workflow de release du dépôt Bobine
 * (`scripts/ci/verify-release-assets.sh` y bloque toute publication incomplète).
 * `tag` est le tag GitHub, `fileVersion` le fragment de version dans les noms de fichiers.
 * Les paquets Fedora et Arch ne sont ajoutés (`withNewPackages`) que pour les canaux qui les publient : la Stable
 * V5.0.2 est antérieure à ces paquets, aucun lien de repli n'est donc inventé pour elle. À la prochaine Stable, passer
 * `withNewPackages` à vrai en même temps que la version.
 */
function channelDownloads(tag: string, fileVersion: string, withNewPackages = false): ReleaseChannelInfo["downloads"] {
  const base = `${RELEASES_BASE}/${tag}`;
  const channel: PackageChannel = tag === "beta" || tag === "canary" ? tag : "stable";
  return {
    ...(withNewPackages ? fallbackNewPackages(tag, channel) : {}),
    windows: `${base}/Bobine-Setup-${fileVersion}.exe`,
    windowsArm64: `${base}/Bobine-Setup-${fileVersion}-arm64.exe`,
    linux: packageUrl("debian", channel, "x86_64", tag),
    linuxArm64: packageUrl("debian", channel, "arm64", tag),
    macos: `${base}/Bobine-${fileVersion}.dmg`,
    android: `${base}/Bobine-${fileVersion}.apk`,
    androidTv: `${base}/Bobine-TV-${fileVersion}.apk`,
    assistant: `${base}/bobine-assistant`,
    assistantArm64: `${base}/bobine-assistant-arm64`,
    installScript: `${base}/install.sh`,
  };
}

export const FALLBACK_STABLE: ReleaseChannelInfo = {
  version: "V5.0.7",
  title: "Bobine V5.0.7",
  publishedAt: "2026-10-29T12:41:48Z",
  downloads: channelDownloads("V5.0.7", "5.0.7", true),
};

// Canal curé, publié manuellement par lots (job release-beta du dépôt Bobine).
export const FALLBACK_BETA: ReleaseChannelInfo = {
  version: "beta",
  title: "Bobine — Bêta",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: channelDownloads("beta", "beta", true),
};

// Canal rolling, republié à chaque push sur main (job release-canary du dépôt Bobine).
export const FALLBACK_CANARY: ReleaseChannelInfo = {
  version: "canary",
  title: "Bobine — Canary (build automatique)",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: channelDownloads("canary", "canary", true),
};
