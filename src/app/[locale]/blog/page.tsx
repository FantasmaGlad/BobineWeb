import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";

const copy = {
  fr: {
    title: "Blog & Journal des versions",
    intro: "Les nouvelles versions et mises à jour de Bobine, synchronisées en continu depuis les releases GitHub.",
    empty: "Aucune version publiée pour le moment.",
    readMore: "Lire les détails de la version →",
  },
  en: {
    title: "Blog & Release Changelog",
    intro: "The latest versions and updates for Bobine, synchronized continuously from GitHub releases.",
    empty: "No releases found yet.",
    readMore: "Read release details →",
  },
} as const;

import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEn = locale === "en";
  return buildMetadata({
    locale: locale as Locale,
    pathname: "/blog",
    title: isEn ? "Blog & Release Changelog — Bobine" : "Blog & Journal des Versions — Bobine",
    description: isEn
      ? "Stay updated with the latest Bobine releases, new features, and playout improvements directly from GitHub."
      : "Suivez les dernières versions, notes de mise à jour et nouveautés de la suite logicielle Bobine.",
    keywords: [
      "Blog Bobine",
      "Releases Bobine",
      "Mises à jour régie vidéo",
      "Changelog Bobine",
    ],
  });
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
    <div className="container" style={{ paddingBlock: "1.25rem", maxWidth: "48rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", marginBottom: "0.4rem" }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>
            {t.intro}
          </p>
        </div>
        <ShareButton
          locale={locale as Locale}
          pathname="/blog"
          title={t.title}
          description={t.intro}
        />
      </div>


      {releases.length === 0 && (
        <div className="card-interactive" style={{ padding: "1.25rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>{t.empty}</p>
        </div>
      )}

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {releases.map((release) => (
          <Link
            key={release.slug}
            href={`/${locale}/blog/${encodeURIComponent(release.slug)}`}
            className="card-interactive"
            style={{ textDecoration: "none", padding: "1.1rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <span className="badge" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                {release.slug}
              </span>
              {release.publishedAt && (
                <time
                  style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 500 }}
                  dateTime={release.publishedAt}
                >
                  {new Date(release.publishedAt).toLocaleDateString(
                    locale === "fr" ? "fr-FR" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
              )}
            </div>

            <h3 className="card-title" style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>
              {release.title}
            </h3>

            <span style={{ color: "var(--accent-primary)", fontSize: "0.85rem", fontWeight: 600, marginTop: "0.25rem", display: "inline-block" }}>
              {t.readMore}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

