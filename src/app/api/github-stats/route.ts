import { NextResponse } from "next/server";

export const runtime = "nodejs";

const REPO = "FantasmaGlad/Bobine";

interface RepoStatsResponse {
  stars: number;
  forks: number;
  latestRelease: string;
}

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
    let latestRelease = "v2.0.0";

    if (repoRes.ok) {
      const repoData = await repoRes.json();
      stars = repoData.stargazers_count ?? 0;
      forks = repoData.forks_count ?? 0;
    }

    if (releasesRes.ok) {
      const relData = await releasesRes.json();
      latestRelease = relData.tag_name || "v2.0.0";
    }

    const payload: RepoStatsResponse = {
      stars,
      forks,
      latestRelease,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[GitHub Stats] Error fetching repo stats:", err);
    return NextResponse.json({
      stars: 0,
      forks: 0,
      latestRelease: "v2.0.0",
    });
  }
}
