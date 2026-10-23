import { NextResponse } from "next/server";
import { getRepoStats } from "@/lib/releaseChannels";
import { CLEARNET_URL } from "@/lib/onion";
import { PACKAGE_REPOS_LIVE, withoutNewPackages } from "@/lib/linuxPackages";

export const dynamic = "force-static";
// Même fenêtre que GITHUB_REVALIDATE_SECONDS : Next.js exige une valeur littérale ici.
export const revalidate = 120;

/**
 * Versions courantes de Bobine en JSON, lues sur GitHub Releases : référence pour les moteurs et
 * agents qui cherchent « la dernière version » sans lire une page HTML.
 */
export async function GET() {
  const stats = await getRepoStats();
  const channel = (info: typeof stats.stable) => ({
    version: info.version,
    commit: info.commit ?? null,
    title: info.title,
    published_at: info.publishedAt,
    // Les paquets Fedora et Arch ne sont annoncés qu'une fois leurs dépôts en ligne (PACKAGE_REPOS_LIVE).
    downloads: PACKAGE_REPOS_LIVE ? info.downloads : withoutNewPackages(info.downloads),
  });
  return NextResponse.json(
    {
      name: "Bobine",
      homepage: CLEARNET_URL,
      repository: "https://github.com/FantasmaGlad/Bobine",
      license: "AGPL-3.0",
      latest_stable: stats.stable.version,
      channels: { stable: channel(stats.stable), beta: channel(stats.beta), canary: channel(stats.canary) },
    },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=300" } }
  );
}
