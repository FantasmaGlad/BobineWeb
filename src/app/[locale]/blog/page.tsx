import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  getBobineReleases,
  getBobineStableReleases,
  getBobineBetaRelease,
} from "@/lib/github-releases";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import GitHubIcon from "@/components/icons/GitHubIcon";
import ScrollIndicator from "@/components/ScrollIndicator";

const copy = {
  fr: {
    badge: "Journal des Mises à Jour",
    title: "Releases & Changelog",
    intro: "Toutes les versions stables, correctifs et nouveautés logicielles de Bobine, synchronisés directement depuis GitHub.",
    featuredReleaseBadge: "Dernière Version Stable",
    betaBadge: "Canal Bêta (Rolling beta)",
    betaTitle: "Version Bêta (Rolling beta) : Accès anticipé aux fonctionnalités en cours de test",
    betaDesc: "Version continue construite automatiquement sur le tag mobile beta. Elle s'installe directement par-dessus votre version existante sans créer d'application doublon.",
    betaAction: "Consulter la release Bêta & le Changelog",
    releasesHeading: "Historique des versions",
    empty: "Aucune version publiée pour le moment.",
    readMore: "Lire les détails de la version",
    viewOnGithub: "Voir sur GitHub",
    stableLabel: "Stable",
    betaLabel: "Bêta",
  },
  en: {
    badge: "Release Changelog",
    title: "Releases & Changelog",
    intro: "All stable releases, patches, and feature updates for Bobine, synchronized directly from GitHub.",
    featuredReleaseBadge: "Latest Stable Release",
    betaBadge: "Beta Channel (Rolling beta)",
    betaTitle: "Version Bêta (Rolling beta) : Accès anticipé aux fonctionnalités en cours de test",
    betaDesc: "Rolling build updated continuously on GitHub tag beta. Installs in place over your existing app without creating duplicates.",
    betaAction: "View Beta Release & Changelog",
    releasesHeading: "Release History",
    empty: "No releases found yet.",
    readMore: "Read release details",
    viewOnGithub: "View on GitHub",
    stableLabel: "Stable",
    betaLabel: "Beta",
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
      ? "Stay updated with the latest Bobine releases, stable builds, and beta preview features directly from GitHub."
      : "Suivez les dernières versions, notes de mise à jour et nouveautés de la suite logicielle Bobine.",
    keywords: [
      "Releases Bobine",
      "Mises à jour régie vidéo",
      "Changelog Bobine",
      "Nouveautés Bobine",
      "Bobine beta",
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

  const [releases, stableReleases, betaRelease] = await Promise.all([
    getBobineReleases(),
    getBobineStableReleases(),
    getBobineBetaRelease(),
  ]);

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: t.title, url: `/${locale}/blog` },
  ];

  const latestStable = stableReleases[0] ?? releases[0];
  const historyReleases = releases.filter((r) => r.slug !== latestStable?.slug);

  return (
    <div className="container" style={{ maxWidth: "60rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* 1. Hero Section — Plein écran avec la dernière release Stable en vedette */}
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

          {/* DERNIÈRE RELEASE STABLE EN GROS DANS LE HERO */}
          {latestStable && (
            <div
              className="blog-hero-release-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                maxWidth: "52rem",
                marginBottom: "1.5rem",
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
                  {latestStable.slug}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "0.2rem 0.55rem",
                    borderRadius: "4px",
                    background: "var(--accent-subtle)",
                    color: "var(--text-heading)",
                  }}
                >
                  {t.featuredReleaseBadge}
                </span>
                {latestStable.publishedAt && (
                  <time style={{ color: "var(--text-dim)", fontSize: "0.85rem", fontWeight: 500 }}>
                    {new Date(latestStable.publishedAt).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                )}
              </div>

              <h2 style={{ fontSize: "clamp(1.35rem, 2.8vw, 1.85rem)", fontWeight: 800, color: "var(--text-heading)", margin: 0, lineHeight: 1.25 }}>
                <Link
                  href={`/${locale}/blog/${encodeURIComponent(latestStable.slug)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {latestStable.title}
                </Link>
              </h2>

              {latestStable.slug.startsWith("V2.0.1") || latestStable.slug.startsWith("v2.0.1") ? (
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-main)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                  <li>{locale === "en" ? "Full hardware video acceleration for both Intel QuickSync (iHD) and AMD Radeon (mesa-va-drivers) under 8% CPU" : "Accélération matérielle complète pour Intel QuickSync (iHD) et AMD Radeon (mesa-va-drivers) sous 8% CPU"}</li>
                  <li>{locale === "en" ? "New 1-line auto-installer (curl -sSL https://bobine.fit/install.sh | bash) with clean & verbose (-v) modes" : "Nouvel installateur automatique en 1 ligne (curl -sSL https://bobine.fit/install.sh | bash) avec modes épuré et verbeux (-v)"}</li>
                  <li>{locale === "en" ? "Smart update handling for existing directories without conflicts, auto hardware driver setup" : "Gestion intelligente des mises à jour des dossiers existants sans collision et installation automatique des pilotes"}</li>
                </ul>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-main)", fontSize: "0.925rem", lineHeight: 1.6 }}>
                  <li>{locale === "en" ? "Full MPV video playback with Intel QuickSync & VA-API hardware decoding" : "Moteur vidéo MPV avec décodage matériel Intel QuickSync et VA-API (moins de 8% CPU)"}</li>
                  <li>{locale === "en" ? "One-click ZIP backup and restore of the full configuration" : "Sauvegarde et restauration ZIP en un clic de toute la configuration"}</li>
                  <li>{locale === "en" ? "On-demand member touch kiosk and instant smartphone remote via local QR code" : "Borne tactile membre à la demande & télécommande smartphone via QR code local"}</li>
                </ul>
              )}

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.25rem" }}>
                <Link
                  href={`/${locale}/blog/${encodeURIComponent(latestStable.slug)}`}
                  className="btn-primary"
                  style={{ textDecoration: "none" }}
                >
                  <span>{t.readMore}</span>
                </Link>
                <a
                  href={latestStable.url}
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

          {/* CARTE DÉDIÉE : CANAL BÊTA (ROLLING BETA) */}
          {betaRelease && (
            <div
              className="blog-hero-release-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                maxWidth: "52rem",
                borderLeft: "3px solid var(--accent-primary)",
                background: "var(--bg-card)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                <span
                  className="badge"
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.6rem",
                    fontWeight: 800,
                    fontFamily: "monospace",
                    background: "var(--accent-subtle)",
                    borderColor: "var(--accent-primary)",
                    color: "var(--text-heading)",
                  }}
                >
                  beta
                </span>
                <span
                  style={{
                    fontSize: "0.725rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  {t.betaBadge}
                </span>
                {betaRelease.publishedAt && (
                  <time style={{ color: "var(--text-dim)", fontSize: "0.825rem" }}>
                    {new Date(betaRelease.publishedAt).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                )}
              </div>

              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-heading)", margin: 0, lineHeight: 1.35 }}>
                <Link
                  href={`/${locale}/blog/beta`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {t.betaTitle}
                </Link>
              </h3>

              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                {t.betaDesc}
              </p>

              <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.25rem" }}>
                <Link
                  href={`/${locale}/blog/beta`}
                  className="btn-secondary"
                  style={{ textDecoration: "none", fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
                >
                  <span>{t.betaAction}</span>
                </Link>
                <a
                  href={betaRelease.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: "none", fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
                >
                  <GitHubIcon size={15} />
                  <span>{t.viewOnGithub}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        <ScrollIndicator
          locale={locale as Locale}
          label={locale === "en" ? "Scroll down to explore older releases" : "Défiler pour découvrir les anciennes Release"}
        />
      </section>

      {/* 2. HISTORIQUE DES VERSIONS / RELEASES GITHUB */}
      {historyReleases.length > 0 && (
        <div style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
          <div style={{ marginBottom: "0.85rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.4rem" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              {t.releasesHeading}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {historyReleases.map((release) => {
              const isBeta = release.isPrerelease || release.slug.toLowerCase() === "beta";
              return (
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
                    <span
                      style={{
                        fontSize: "0.675rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "3px",
                        border: "1px solid var(--border-subtle)",
                        color: isBeta ? "var(--text-heading)" : "var(--text-dim)",
                        background: isBeta ? "var(--accent-subtle)" : "transparent",
                      }}
                    >
                      {isBeta ? t.betaLabel : t.stableLabel}
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.9rem" }}>
                      {release.title}
                    </span>
                  </div>
                  <span style={{ color: "var(--accent-primary)", fontSize: "0.825rem", fontWeight: 600 }}>
                    {t.readMore}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


