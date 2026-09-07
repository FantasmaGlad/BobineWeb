import { NextResponse } from "next/server";

export const runtime = "nodejs";

const REPO = "FantasmaGlad/Bobine";

export interface ReleaseChannelInfo {
  version: string;
  title: string;
  publishedAt: string;
  downloads: {
    windows: string;
    linux: string;
    macos: string;
    assistant: string;
    installScript: string;
  };
}

export interface RepoStatsResponse {
  stars: number;
  forks: number;
  latestRelease: string;
  downloads: {
    windows: string;
    linux: string;
    macos: string;
    assistant: string;
    installScript?: string;
  };
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
}

const FALLBACK_STABLE: ReleaseChannelInfo = {
  version: "V3.0.0",
  title: "Bobine V3.0.0 — Sortie Officielle Multi-Plateforme",
  publishedAt: "2026-09-06T12:53:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/Bobine-Setup-3.0.0.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/bobine_3.0.0_amd64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/Bobine-3.0.0.dmg",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/bobine-assistant",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/install.sh",
  },
};

const FALLBACK_BETA: ReleaseChannelInfo = {
  version: "beta",
  title: "Bobine — Bêta (build automatique)",
  publishedAt: "2026-09-07T18:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_amd64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.dmg",
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
    } else if (name.includes("assistant")) {
      downloads.assistant = url;
    } else if (name === "install.sh") {
      downloads.installScript = url;
    }
  }
  return downloads;
}

export async function GET() {
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
        assistant: stableInfo.downloads.assistant,
        installScript: stableInfo.downloads.installScript,
      },
      stable: stableInfo,
      beta: betaInfo,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[GitHub Stats] Error fetching repo stats:", err);
    return NextResponse.json({
      stars: 0,
      forks: 0,
      latestRelease: FALLBACK_STABLE.version,
      downloads: FALLBACK_STABLE.downloads,
      stable: FALLBACK_STABLE,
      beta: FALLBACK_BETA,
    });
  }
}
