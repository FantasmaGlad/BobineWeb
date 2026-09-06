import { NextResponse } from "next/server";

export const runtime = "nodejs";

const REPO = "FantasmaGlad/Bobine";

export interface RepoStatsResponse {
  stars: number;
  forks: number;
  latestRelease: string;
  downloads: {
    windows: string;
    linux: string;
    macos: string;
    assistant: string;
  };
}

const FALLBACK_DOWNLOADS = {
  windows: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/Bobine-Setup-3.0.0.exe",
  linux: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/bobine_3.0.0_amd64.deb",
  macos: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/Bobine-3.0.0.dmg",
  assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/bobine-assistant",
};

export async function GET() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, releasesRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO}`, {
        headers,
        next: { revalidate: 1800 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers,
        next: { revalidate: 1800 },
      }),
    ]);

    let stars = 0;
    let forks = 0;
    let latestRelease = "V3.0.0";
    const downloads = { ...FALLBACK_DOWNLOADS };

    if (repoRes.ok) {
      const repoData = await repoRes.json();
      stars = repoData.stargazers_count ?? 0;
      forks = repoData.forks_count ?? 0;
    }

    if (releasesRes.ok) {
      const relData = await releasesRes.json();
      latestRelease = relData.tag_name || "V3.0.0";
      if (Array.isArray(relData.assets)) {
        for (const asset of relData.assets) {
          const name = (asset.name || "").toLowerCase();
          const url = asset.browser_download_url;
          if (!url) continue;
          if (name.endsWith(".exe")) {
            downloads.windows = url;
          } else if (name.endsWith(".deb")) {
            downloads.linux = url;
          } else if (name.endsWith(".dmg")) {
            downloads.macos = url;
          } else if (name.includes("assistant")) {
            downloads.assistant = url;
          }
        }
      }
    }

    const payload: RepoStatsResponse = {
      stars,
      forks,
      latestRelease,
      downloads,
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
      latestRelease: "V3.0.0",
      downloads: FALLBACK_DOWNLOADS,
    });
  }
}
