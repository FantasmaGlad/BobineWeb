import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";

const copy = {
  fr: {
    title: "Blog",
    intro: "Les nouvelles versions de Bobine, générées automatiquement depuis les releases GitHub.",
    empty: "Aucune release pour le moment.",
    readMore: "Lire →",
  },
  en: {
    title: "Blog",
    intro: "New Bobine releases, generated automatically from GitHub releases.",
    empty: "No release yet.",
    readMore: "Read →",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: copy[locale].title };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const releases = await getBobineReleases();

  return (
    <div className="container" style={{ paddingBlock: "3rem", maxWidth: "40rem" }}>
      <h1>{t.title}</h1>
      <p style={{ color: "var(--text-muted)" }}>{t.intro}</p>

      {releases.length === 0 && <p>{t.empty}</p>}

      <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
        {releases.map((release) => (
          <Link
            key={release.slug}
            href={`/${locale}/blog/${encodeURIComponent(release.slug)}`}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              textDecoration: "none",
              color: "var(--text)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>{release.title}</h3>
            {release.publishedAt && (
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.875rem" }}>
                {new Date(release.publishedAt).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US"
                )}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
