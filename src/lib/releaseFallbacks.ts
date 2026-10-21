import type { ReleaseChannelInfo } from "@/lib/releaseTypes";

const RELEASES_BASE = "https://github.com/FantasmaGlad/Bobine/releases/download";

/**
 * Liens de repli quand l'API GitHub ne répond pas (limite de débit, panne) : les noms de fichiers
 * suivent exactement ceux que publie le workflow de release du dépôt Bobine
 * (`scripts/ci/verify-release-assets.sh` y bloque toute publication incomplète).
 * `tag` est le tag GitHub, `fileVersion` le fragment de version dans les noms de fichiers.
 */
function channelDownloads(tag: string, fileVersion: string): ReleaseChannelInfo["downloads"] {
  const base = `${RELEASES_BASE}/${tag}`;
  return {
    windows: `${base}/Bobine-Setup-${fileVersion}.exe`,
    windowsArm64: `${base}/Bobine-Setup-${fileVersion}-arm64.exe`,
    linux: `${base}/bobine_${fileVersion}_amd64.deb`,
    linuxArm64: `${base}/bobine_${fileVersion}_arm64.deb`,
    macos: `${base}/Bobine-${fileVersion}.dmg`,
    android: `${base}/Bobine-${fileVersion}.apk`,
    androidTv: `${base}/Bobine-TV-${fileVersion}.apk`,
    assistant: `${base}/bobine-assistant`,
    assistantArm64: `${base}/bobine-assistant-arm64`,
    installScript: `${base}/install.sh`,
  };
}

export const FALLBACK_STABLE: ReleaseChannelInfo = {
  version: "V5.0.2",
  title: "Bobine V5.0.2",
  publishedAt: "2026-10-20T07:21:23Z",
  downloads: channelDownloads("V5.0.2", "5.0.2"),
};

// Canal curé, publié manuellement par lots (job release-beta du dépôt Bobine).
export const FALLBACK_BETA: ReleaseChannelInfo = {
  version: "beta",
  title: "Bobine — Bêta",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: channelDownloads("beta", "beta"),
};

// Canal rolling, republié à chaque push sur main (job release-canary du dépôt Bobine).
export const FALLBACK_CANARY: ReleaseChannelInfo = {
  version: "canary",
  title: "Bobine — Canary (build automatique)",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: channelDownloads("canary", "canary"),
};
