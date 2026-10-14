import type { ReleaseChannelInfo } from "@/lib/releaseTypes";

const REPO = "FantasmaGlad/Bobine";

export interface RepoStatsResponse {
  stars: number;
  forks: number;
  latestRelease: string;
  downloads: {
    windows: string;
    linux: string;
    macos: string;
    android: string;
    androidTv?: string;
    assistant: string;
    installScript?: string;
  };
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
}

const FALLBACK_STABLE: ReleaseChannelInfo = {
  version: "V4.0.2",
  title: "Bobine V4.0.2 — Support Android TV & Google TV Natif, Hotplug HDMI Robuste & Optimisations Kiosque",
  publishedAt: "2026-10-14T09:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/V4.0.2/Bobine-Setup-4.0.2.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/V4.0.2/bobine_4.0.2_amd64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/V4.0.2/Bobine-4.0.2.dmg",
    android: "https://github.com/FantasmaGlad/Bobine/releases/download/V4.0.2/Bobine-4.0.2.apk",
    androidTv: "https://github.com/FantasmaGlad/Bobine/releases/download/V4.0.2/Bobine-TV-4.0.2.apk",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/V4.0.2/bobine-assistant",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/V4.0.2/install.sh",
  },
};

const FALLBACK_BETA: ReleaseChannelInfo = {
  version: "beta",
  title: "Bobine — Bêta (build automatique)",
  publishedAt: "2026-09-09T20:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_amd64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.dmg",
    android: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.apk",
    androidTv: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-TV-beta.apk",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-assistant",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/install.sh",
  },
};

function parseReleaseAssets(
  assets: unknown,
  fallback: ReleaseChannelInfo["downloads"]
): ReleaseChannelInfo["downloads"] {
  const downloads = { ...fallback };
  if (!Array.isArray(assets)) return downloads;
  for (const asset of assets) {
    const name = String(asset?.name || "").toLowerCase();
    const url = typeof asset?.browser_download_url === "string" ? asset.browser_download_url : "";
    if (!url) continue;
    if (name.endsWith(".exe")) {
      downloads.windows = url;
    } else if (name.endsWith(".deb")) {
      downloads.linux = url;
    } else if (name.endsWith(".dmg")) {
      downloads.macos = url;
    } else if (name.includes("-tv") || name.includes("bobine-tv")) {
      downloads.androidTv = url;
    } else if (name.endsWith(".apk")) {
      downloads.android = url;
    } else if (name.includes("assistant")) {
      downloads.assistant = url;
    } else if (name === "install.sh") {
      downloads.installScript = url;
    }
  }
  return downloads;
}

/** Statistiques du depot et versions publiees (etoiles, canaux stable et beta), avec repli statique. */
export async function getRepoStats(): Promise<RepoStatsResponse> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, stableRes, betaRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO}`, {
        headers,
        next: { revalidate: 1800 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers,
        next: { revalidate: 1800 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/releases/tags/beta`, {
        headers,
        next: { revalidate: 1800 },
      }),
    ]);

    let stars = 0;
    let forks = 0;
    let stableInfo: ReleaseChannelInfo = { ...FALLBACK_STABLE };
    let betaInfo: ReleaseChannelInfo = { ...FALLBACK_BETA };

    if (repoRes.ok) {
      const repoData = await repoRes.json();
      stars = repoData.stargazers_count ?? 0;
      forks = repoData.forks_count ?? 0;
    }

    if (stableRes.ok) {
      const relData = await stableRes.json();
      stableInfo = {
        version: relData.tag_name || FALLBACK_STABLE.version,
        title: relData.name || relData.tag_name || FALLBACK_STABLE.title,
        publishedAt: relData.published_at || FALLBACK_STABLE.publishedAt,
        downloads: parseReleaseAssets(relData.assets, FALLBACK_STABLE.downloads),
      };
    }

    if (betaRes.ok) {
      const betaData = await betaRes.json();
      betaInfo = {
        version: betaData.tag_name || FALLBACK_BETA.version,
        title: betaData.name || "Bobine — Bêta (build automatique)",
        publishedAt: betaData.published_at || FALLBACK_BETA.publishedAt,
        downloads: parseReleaseAssets(betaData.assets, FALLBACK_BETA.downloads),
      };
    }

    const payload: RepoStatsResponse = {
      stars,
      forks,
      latestRelease: stableInfo.version,
      downloads: {
        windows: stableInfo.downloads.windows,
        linux: stableInfo.downloads.linux,
        macos: stableInfo.downloads.macos,
        android: stableInfo.downloads.android,
        androidTv: stableInfo.downloads.androidTv,
        assistant: stableInfo.downloads.assistant,
        installScript: stableInfo.downloads.installScript,
      },
      stable: stableInfo,
      beta: betaInfo,
    };

    return payload;
  } catch (err) {
    console.error("[GitHub Stats] Error fetching repo stats:", err);
    return {
      stars: 0,
      forks: 0,
      latestRelease: FALLBACK_STABLE.version,
      downloads: FALLBACK_STABLE.downloads,
      stable: FALLBACK_STABLE,
      beta: FALLBACK_BETA,
    };
  }
}
