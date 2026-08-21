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
    <div className="container" style={{ paddingBlock: "clamp(2rem, 5vw, 4rem)", maxWidth: "68rem" }}>
      {/* En-tête large et aéré */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1.5rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: "1rem",
        }}
      >
        <div style={{ maxWidth: "44rem" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "0.75rem",
              color: "var(--text-heading)",
            }}
          >
            {t.title}
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
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
        <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem" }}>{t.empty}</p>
        </div>
      )}

      {/* Liste aérée avec délimitations par traits fins */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {releases.map((release) => (
          <Link
            key={release.slug}
            href={`/${locale}/blog/${encodeURIComponent(release.slug)}`}
            style={{
              textDecoration: "none",
              paddingBlock: "1.75rem",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              transition: "opacity 0.15s ease",
            }}
            className="blog-list-item"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="badge" style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}>
                  {release.slug}
                </span>
                {release.publishedAt && (
                  <time
                    style={{ color: "var(--text-dim)", fontSize: "0.85rem", fontWeight: 500 }}
                    dateTime={release.publishedAt}
                  >
                    {new Date(release.publishedAt).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                )}
              </div>
              <span
                style={{
                  color: "var(--accent-primary)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                {t.readMore}
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
                fontWeight: 700,
                color: "var(--text-heading)",
                margin: 0,
                lineHeight: 1.35,
              }}
            >
              {release.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

