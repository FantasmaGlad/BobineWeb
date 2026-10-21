import { getBobineReleases } from "@/lib/github-releases";
import { CLEARNET_URL } from "@/lib/onion";

export const dynamic = "force-static";
// Même fenêtre que GITHUB_REVALIDATE_SECONDS : Next.js exige une valeur littérale ici.
export const revalidate = 120;

const BASE_URL = CLEARNET_URL;

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Flux Atom des versions publiées (une entrée par release GitHub, Bêta et Canary comprises). */
export async function GET() {
  const releases = await getBobineReleases();
  const dated = releases.filter((r) => r.publishedAt);
  const updated = dated[0]?.publishedAt ?? new Date().toISOString();

  const entries = dated
    .slice(0, 30)
    .map(
      (r) => `  <entry>
    <id>${escapeXml(r.url)}</id>
    <title>${escapeXml(r.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(`${BASE_URL}/fr/blog/${r.slug}`)}"/>
    <updated>${escapeXml(r.publishedAt)}</updated>
    <summary>${escapeXml(r.body.replace(/\s+/g, " ").slice(0, 400))}</summary>
  </entry>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="fr">
  <id>${BASE_URL}/feed.xml</id>
  <title>Bobine - versions et nouveautés</title>
  <subtitle>Versions publiées de Bobine, la régie vidéo libre pour salles de sport</subtitle>
  <link rel="self" type="application/atom+xml" href="${BASE_URL}/feed.xml"/>
  <link rel="alternate" type="text/html" href="${BASE_URL}/fr/nouveautes"/>
  <updated>${escapeXml(updated)}</updated>
  <author><name>Clément Barillot</name></author>
${entries}
</feed>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=120, stale-while-revalidate=300",
    },
  });
}
