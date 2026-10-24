import type { ReleaseChannelInfo, ReleaseFile } from "@/lib/releaseTypes";
import { assignPackageAsset, withoutNewPackages } from "@/lib/linuxPackages";
import { FALLBACK_STABLE, FALLBACK_BETA, FALLBACK_CANARY } from "@/lib/releaseFallbacks";
import {
  fetchRepoCounts,
  fetchRepoReleases,
  pickChannelReleases,
  type GitHubReleaseJson,
} from "@/lib/githubApi";

export interface RepoStatsResponse {
  stars: number;
  forks: number;
  latestRelease: string;
  downloads: {
    windows: string;
    windowsArm64?: string;
    linux: string;
    linuxArm64?: string;
    linuxRpm?: string;
    linuxRpmArm64?: string;
    linuxArch?: string;
    linuxArchArm64?: string;
    macos: string;
    android: string;
    androidTv?: string;
    assistant: string;
    assistantArm64?: string;
    installScript?: string;
  };
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
  canary: ReleaseChannelInfo;
}

function parseReleaseAssets(
  assets: unknown,
  fallback: ReleaseChannelInfo["downloads"]
): ReleaseChannelInfo["downloads"] {
  if (!Array.isArray(assets)) return { ...fallback };
  // Une release lue sur GitHub n'offre que ce qu'elle contient : les paquets Fedora et Arch du repli ne sont
  // gardés que s'ils y figurent vraiment, pour ne jamais proposer un fichier qui n'existe pas encore.
  const downloads = withoutNewPackages(fallback);
  for (const asset of assets) {
    const name = String(asset?.name || "").toLowerCase();
    const url = typeof asset?.browser_download_url === "string" ? asset.browser_download_url : "";
    if (!url) continue;
    const isArm = name.includes("arm64") || name.includes("aarch64");
    if (name.endsWith(".exe")) {
      if (isArm) {
        downloads.windowsArm64 = url;
      } else {
        downloads.windows = url;
      }
    } else if (name.endsWith(".deb")) {
      if (isArm) {
        downloads.linuxArm64 = url;
      } else {
        downloads.linux = url;
      }
    } else if (assignPackageAsset(downloads, name, url)) {
      // .rpm et .pkg.tar.zst rangés par le module des paquets Linux
    } else if (name.endsWith(".dmg")) {
      downloads.macos = url;
    } else if (name.includes("-tv") || name.includes("bobine-tv")) {
      downloads.androidTv = url;
    } else if (name.endsWith(".apk")) {
      downloads.android = url;
    } else if (name.includes("assistant")) {
      if (isArm) {
        downloads.assistantArm64 = url;
      } else {
        downloads.assistant = url;
      }
    } else if (name === "install.sh") {
      downloads.installScript = url;
    }
  }
  return downloads;
}

/** Fichiers publiés d'une release (taille, empreinte, date), par adresse de téléchargement. */
function parseReleaseFiles(assets: unknown): { files?: Record<string, ReleaseFile>; checksumsSigned: boolean } {
  if (!Array.isArray(assets)) return { checksumsSigned: false };
  const files: Record<string, ReleaseFile> = {};
  const names = new Set<string>();
  for (const asset of assets) {
    const name = typeof asset?.name === "string" ? asset.name : "";
    const url = typeof asset?.browser_download_url === "string" ? asset.browser_download_url : "";
    if (!name || !url) continue;
    names.add(name);
    const digest = typeof asset?.digest === "string" ? /^sha256:([0-9a-f]{64})$/i.exec(asset.digest)?.[1]?.toLowerCase() : undefined;
    files[url] = {
      name,
      url,
      size: typeof asset?.size === "number" ? asset.size : 0,
      ...(digest ? { sha256: digest } : {}),
      ...(typeof asset?.updated_at === "string" ? { updatedAt: asset.updated_at } : {}),
    };
  }
  return { files, checksumsSigned: names.has("SHA256SUMS") && names.has("SHA256SUMS.asc") };
}

function channelInfoFromRelease(
  release: GitHubReleaseJson | undefined,
  fallback: ReleaseChannelInfo
): ReleaseChannelInfo {
  if (!release) return fallback;
  const commitish = typeof release.target_commitish === "string" ? release.target_commitish : "";
  return {
    version: release.tag_name || fallback.version,
    commit: /^[0-9a-f]{7,40}$/i.test(commitish) ? commitish.slice(0, 7) : fallback.commit,
    title: release.name || fallback.title,
    publishedAt: release.published_at || fallback.publishedAt,
    htmlUrl: release.html_url || fallback.htmlUrl,
    ...parseReleaseFiles(release.assets),
    downloads: parseReleaseAssets(release.assets, fallback.downloads),
  };
}

/** Statistiques du dépôt et versions publiées (étoiles, canaux stable, beta et canary), avec repli statique. */
export async function getRepoStats(): Promise<RepoStatsResponse> {
  const [releases, counts] = await Promise.all([fetchRepoReleases(), fetchRepoCounts()]);
  const channels = releases ? pickChannelReleases(releases) : {};

  const stableInfo = channelInfoFromRelease(channels.stable, FALLBACK_STABLE);
  const betaInfo = channelInfoFromRelease(channels.beta, FALLBACK_BETA);
  const canaryInfo = channelInfoFromRelease(channels.canary, FALLBACK_CANARY);

  return {
    stars: counts.stars,
    forks: counts.forks,
    latestRelease: stableInfo.version,
    downloads: { ...stableInfo.downloads },
    stable: stableInfo,
    beta: betaInfo,
    canary: canaryInfo,
  };
}
