import "server-only";

const REPO = "FantasmaGlad/Bobine";
const DEPLOY_REPO = "FantasmaGlad/bobine-deploy";

export const GITHUB_REVALIDATE_SECONDS = 120;

export interface GitHubReleaseJson {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
  body: string | null;
  target_commitish?: string;
  draft: boolean;
  prerelease: boolean;
  assets?: unknown;
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

export async function fetchRepoReleases(): Promise<GitHubReleaseJson[] | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, {
      headers: githubHeaders(),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as GitHubReleaseJson[]).filter((release) => !release.draft) : null;
  } catch {
    return null;
  }
}

export async function fetchRepoCounts(): Promise<{ stars: number; forks: number }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: githubHeaders(),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });
    if (!res.ok) return { stars: 0, forks: 0 };
    const data = await res.json();
    return { stars: data.stargazers_count ?? 0, forks: data.forks_count ?? 0 };
  } catch {
    return { stars: 0, forks: 0 };
  }
}

export function isAssistantRelease(release: GitHubReleaseJson): boolean {
  return release.tag_name.toLowerCase().startsWith("assistant-");
}

export function pickChannelReleases(releases: GitHubReleaseJson[]): {
  stable?: GitHubReleaseJson;
  beta?: GitHubReleaseJson;
  canary?: GitHubReleaseJson;
} {
  const bobine = releases.filter((release) => !isAssistantRelease(release));
  return {
    stable: bobine.find((release) => !release.prerelease),
    beta: bobine.find((release) => release.tag_name === "beta"),
    canary: bobine.find((release) => release.tag_name === "canary"),
  };
}

export async function fetchDeployReleases(): Promise<GitHubReleaseJson[] | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${DEPLOY_REPO}/releases?per_page=20`, {
      headers: githubHeaders(),
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as GitHubReleaseJson[]).filter((release) => !release.draft) : null;
  } catch {
    return null;
  }
}
