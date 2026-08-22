import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
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
    <div className="container" style={{ paddingBlock: "clamp(1rem, 2.5vh, 2.5rem)", maxWidth: "60rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* En-tête large et aéré */}
      <section style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1.25rem",
            paddingBottom: "1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ maxWidth: "42rem" }}>
            <span className="feature-category-label">{t.badge}</span>
            <h1
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBlock: "0.35rem 0.5rem",
                color: "var(--text-heading)",
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                margin: 0,
                lineHeight: 1.55,
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

        {/* CARTE HERO : DERNIÈRE RELEASE MAJEURE EN VEDETTE */}
        {latestRelease ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.65rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="badge" style={{ fontSize: "0.75rem", padding: "0.15rem 0.55rem" }}>
                  {t.featuredReleaseBadge}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-heading)", fontFamily: "monospace" }}>
                  {latestRelease.slug}
                </span>
              </div>
              {latestRelease.publishedAt && (
                <time style={{ color: "var(--text-dim)", fontSize: "0.825rem", fontWeight: 500 }}>
                  {new Date(latestRelease.publishedAt).toLocaleDateString(
                    locale === "fr" ? "fr-FR" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
              )}
            </div>

            <h2 style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.65rem)", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 0.65rem 0", lineHeight: 1.3 }}>
              <Link
                href={`/${locale}/blog/${encodeURIComponent(latestRelease.slug)}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {latestRelease.title}
              </Link>
            </h2>

            {latestRelease.slug.startsWith("V2.0.1") || latestRelease.slug.startsWith("v2.0.1") ? (
              <ul style={{ margin: "0 0 1.25rem 0", paddingLeft: "1.25rem", color: "var(--text-main)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                <li>{locale === "en" ? "Full hardware video acceleration for both Intel QuickSync (iHD) and AMD Radeon (mesa-va-drivers) under 8% CPU" : "Accélération matérielle complète pour Intel QuickSync (iHD) et AMD Radeon (mesa-va-drivers) sous 8% CPU"}</li>
                <li>{locale === "en" ? "New 1-line auto-installer (curl -sSL https://bobine.fit/install.sh | bash) with clean & verbose (-v) modes" : "Nouvel installateur automatique en 1 ligne (curl -sSL https://bobine.fit/install.sh | bash) avec modes épuré et verbeux (-v)"}</li>
                <li>{locale === "en" ? "Smart update handling for existing directories without conflicts, auto hardware driver setup" : "Gestion intelligente des mises à jour des dossiers existants sans collision et installation automatique des pilotes"}</li>
                <li>{locale === "en" ? "Official links to web documentation, 3D interactive studio demo, and Ko-fi community support" : "Liens officiels vers la documentation web, la démo 3D interactive et le soutien communautaire Ko-fi"}</li>
              </ul>
            ) : (
              <ul style={{ margin: "0 0 1.25rem 0", paddingLeft: "1.25rem", color: "var(--text-main)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                <li>{locale === "en" ? "Full MPV video playback with Intel QuickSync & VA-API hardware decoding" : "Moteur vidéo MPV avec décodage matériel Intel QuickSync et VA-API (moins de 8% CPU)"}</li>
                <li>{locale === "en" ? "Automated TV power on/off scheduling via HDMI-CEC signals" : "Allumage et extinction automatique des téléviseurs via protocole HDMI-CEC"}</li>
                <li>{locale === "en" ? "On-demand member touch kiosk and instant smartphone remote via local QR code" : "Borne tactile membre à la demande & télécommande smartphone via QR code local"}</li>
                <li>{locale === "en" ? "24/7 background plateau music radio with seamless gapless crossfading" : "Radio d'ambiance plateau 24/7 avec fondu musical sans aucun blanc sonore"}</li>
              </ul>
            )}

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
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
        ) : (
          <p style={{ color: "var(--text-muted)" }}>{t.empty}</p>
        )}
      </section>

      {/* HISTORIQUE DES VERSIONS / RELEASES GITHUB */}
      {releases.length > 1 && (
        <div style={{ paddingTop: "2rem", borderTop: "1px solid var(--border-subtle)" }}>
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


