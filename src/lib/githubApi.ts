import "server-only";

const REPO = "FantasmaGlad/Bobine";

/**
 * Fenêtre de rafraîchissement des données GitHub (versions, téléchargements, étoiles). Deux minutes :
 * une release publiée par le workflow du dépôt Bobine apparaît sur le site à la requête suivante
 * passé ce délai, sans redéploiement. Les deux appels ci-dessous tiennent dans
 * la limite de 60 requêtes/heure sans jeton, `GITHUB_TOKEN` la porte à 5 000.
 */
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

/** Toutes les releases publiées (Stable, tags mobiles `beta` et `canary` compris), les plus récentes d'abord. */
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

/**
 * L'assistant d'installation publie ses propres releases dans le même dépôt (tags `assistant-Vx.y.z`, `assistant-beta`,
 * `assistant-canary`, pointeur `assistant-stable`), jamais « Latest » ni mêlées à celles de Bobine : elles ne doivent
 * compter ni comme une version de Bobine ni comme un billet.
 */
export function isAssistantRelease(release: GitHubReleaseJson): boolean {
  return release.tag_name.toLowerCase().startsWith("assistant-");
}

/**
 * Release de chaque canal : Stable = la plus récente qui n'est pas une pré-release (même règle que
 * `/releases/latest`), Bêta et Canary = leur tag mobile unique.
 */
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

/** Releases de l'assistant par canal : la Stable est la plus récente `assistant-Vx.y.z` (pas le pointeur `assistant-stable`). */
export function pickAssistantReleases(releases: GitHubReleaseJson[]): {
  stable?: GitHubReleaseJson;
  beta?: GitHubReleaseJson;
  canary?: GitHubReleaseJson;
} {
  return {
    stable: releases.find((release) => /^assistant-V\d+\.\d+\.\d+$/.test(release.tag_name)),
    beta: releases.find((release) => release.tag_name === "assistant-beta"),
    canary: releases.find((release) => release.tag_name === "assistant-canary"),
  };
}
