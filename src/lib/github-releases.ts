import "server-only";

const REPO = "FantasmaGlad/Bobine";

export interface BobineRelease {
  slug: string;
  title: string;
  publishedAt: string;
  url: string;
  body: string;
}

interface GitHubReleaseApiResponse {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
}

export async function getBobineReleases(): Promise<BobineRelease[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const releases = (await res.json()) as GitHubReleaseApiResponse[];

  return releases
    .filter((release) => !release.draft)
    .map((release) => ({
      slug: release.tag_name,
      title: release.name || release.tag_name,
      publishedAt: release.published_at ?? "",
      url: release.html_url,
      body: release.body ?? "",
    }));
}

export async function getBobineRelease(
  slug: string
): Promise<BobineRelease | null> {
  const releases = await getBobineReleases();
  return releases.find((release) => release.slug === slug) ?? null;
}
