import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { fallbackNewPackages, packageUrl, type PackageChannel } from "@/lib/linuxPackages";

const RELEASES_BASE = "https://github.com/FantasmaGlad/Bobine/releases/download";

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
  };
}

export const FALLBACK_STABLE: ReleaseChannelInfo = {
  version: "V5.2.2",
  title: "Bobine V5.2.2",
  publishedAt: "2026-11-13T20:47:21Z",
  downloads: channelDownloads("V5.2.2", "5.2.2", true),
};

export const FALLBACK_BETA: ReleaseChannelInfo = {
  version: "beta",
  title: "Bobine — Bêta",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: channelDownloads("beta", "beta", true),
};

export const FALLBACK_CANARY: ReleaseChannelInfo = {
  version: "canary",
  title: "Bobine — Canary (build automatique)",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: channelDownloads("canary", "canary", true),
};
