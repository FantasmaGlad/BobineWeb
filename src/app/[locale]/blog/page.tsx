import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import GitHubIcon from "@/components/icons/GitHubIcon";

const copy = {
  fr: {
    badge: "Journal des Mises à Jour",
    title: "Releases & Changelog",
    intro: "Toutes les versions stables, correctifs et nouveautés logicielles de Bobine, synchronisés directement depuis GitHub.",
    featuredReleaseBadge: "Dernière Version Stable",
    releasesHeading: "Historique des versions",
    empty: "Aucune version publiée pour le moment.",
    readMore: "Lire les détails de la version",
    viewOnGithub: "Voir sur GitHub",
  },
  en: {
    badge: "Release Changelog",
    title: "Releases & Changelog",
    intro: "All stable releases, patches, and feature updates for Bobine, synchronized directly from GitHub.",
    featuredReleaseBadge: "Latest Stable Release",
    releasesHeading: "Release History",
    empty: "No releases found yet.",
    readMore: "Read release details",
    viewOnGithub: "View on GitHub",
  },
} as const;

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
    title: isEn ? "Releases & Changelog — Bobine" : "Releases & Changelog — Bobine",
    description: isEn
      ? "Stay updated with the latest Bobine releases, new features, and playout improvements directly from GitHub."
      : "Suivez les dernières versions, notes de mise à jour et nouveautés de la suite logicielle Bobine.",
    keywords: [
      "Releases Bobine",
      "Mises à jour régie vidéo",
      "Changelog Bobine",
      "Nouveautés Bobine",
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

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: t.title, url: `/${locale}/blog` },
  ];

  const latestRelease = releases[0];

  return (
    <div className="container" style={{ maxWidth: "60rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* 1. Hero Section — Plein écran avec la dernière release en vedette */}
      <section className="hero-fullscreen blog-hero-section">
        <div>
          <span className="feature-category-label" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
            {t.badge}
          </span>

          <h1 className="hero-fullscreen__title" style={{ marginBottom: "0.5rem" }}>
            {t.title}
          </h1>

          <p className="hero-fullscreen__subtitle" style={{ marginBottom: "1.5rem" }}>
            {t.intro}
          </p>

          {/* DERNIÈRE RELEASE MAJEURE EN GROS DANS LE HERO */}
          {latestRelease && (
            <div
              className="blog-hero-release-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                maxWidth: "52rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span
                  className="badge"
                  style={{
                    fontSize: "0.85rem",
                    padding: "0.25rem 0.65rem",
                    fontWeight: 800,
                    fontFamily: "monospace",
                    color: "var(--accent-primary)",
                    borderColor: "var(--accent-primary)",
                  }}
                >
                  {latestRelease.slug}
                </span>
                {latestRelease.publishedAt && (
                  <time style={{ color: "var(--text-dim)", fontSize: "0.85rem", fontWeight: 500 }}>
                    {new Date(latestRelease.publishedAt).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                )}
              </div>

              <h2 style={{ fontSize: "clamp(1.35rem, 2.8vw, 1.85rem)", fontWeight: 800, color: "var(--text-heading)", margin: 0, lineHeight: 1.25 }}>
                <Link
                  href={`/${locale}/blog/${encodeURIComponent(latestRelease.slug)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {latestRelease.title}
                </Link>
              </h2>

              {latestRelease.slug.startsWith("V2.0.1") || latestRelease.slug.startsWith("v2.0.1") ? (
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-main)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                  <li>{locale === "en" ? "Full hardware video acceleration for both Intel QuickSync (iHD) and AMD Radeon (mesa-va-drivers) under 8% CPU" : "Accélération matérielle complète pour Intel QuickSync (iHD) et AMD Radeon (mesa-va-drivers) sous 8% CPU"}</li>
                  <li>{locale === "en" ? "New 1-line auto-installer (curl -sSL https://bobine.fit/install.sh | bash) with clean & verbose (-v) modes" : "Nouvel installateur automatique en 1 ligne (curl -sSL https://bobine.fit/install.sh | bash) avec modes épuré et verbeux (-v)"}</li>
                  <li>{locale === "en" ? "Smart update handling for existing directories without conflicts, auto hardware driver setup" : "Gestion intelligente des mises à jour des dossiers existants sans collision et installation automatique des pilotes"}</li>
                </ul>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-main)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                  <li>{locale === "en" ? "Full MPV video playback with Intel QuickSync & VA-API hardware decoding" : "Moteur vidéo MPV avec décodage matériel Intel QuickSync et VA-API (moins de 8% CPU)"}</li>
                  <li>{locale === "en" ? "Automated TV power on/off scheduling via HDMI-CEC signals" : "Allumage et extinction automatique des téléviseurs via protocole HDMI-CEC"}</li>
                  <li>{locale === "en" ? "On-demand member touch kiosk and instant smartphone remote via local QR code" : "Borne tactile membre à la demande & télécommande smartphone via QR code local"}</li>
                </ul>
              )}

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.25rem" }}>
                <Link
                  href={`/${locale}/blog/${encodeURIComponent(latestRelease.slug)}`}
                  className="btn-primary"
                  style={{ textDecoration: "none" }}
                >
                  <span>{t.readMore}</span>
                </Link>
                <a
                  href={latestRelease.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: "none" }}
                >
                  <GitHubIcon size={16} />
                  <span>{t.viewOnGithub}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="hero-fullscreen__scroll">
          <span>{locale === "en" ? "Scroll down to explore older releases" : "Défiler pour découvrir les anciennes Release"}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* 2. HISTORIQUE DES ANCIENNES VERSIONS / RELEASES GITHUB */}
      {releases.length > 1 && (
        <div style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
          <div style={{ marginBottom: "0.85rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.4rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              {t.releasesHeading}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {releases.slice(1).map((release) => (
              <Link
                key={release.slug}
                href={`/${locale}/blog/${encodeURIComponent(release.slug)}`}
                className="doc-open-row"
                style={{
                  textDecoration: "none",
                  paddingBlock: "0.85rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.65rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span className="badge" style={{ fontSize: "0.725rem" }}>
                    {release.slug}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.9rem" }}>
                    {release.title}
                  </span>
                </div>
                <span style={{ color: "var(--accent-primary)", fontSize: "0.825rem", fontWeight: 600 }}>
                  {t.readMore}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


