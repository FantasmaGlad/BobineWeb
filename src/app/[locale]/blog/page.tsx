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
    badge: "Actualités & Mises à Jour",
    title: "Blog & Journal des Versions",
    intro: "Toutes les nouveautés, notes de mise à jour et articles d'architecture de Bobine, synchronisés en continu depuis GitHub.",
    featuredReleaseBadge: "Dernière Version Stable",
    releasesHeading: "Notes de Versions & Mises à Jour",
    articlesHeading: "Articles Techniques & Retours d'Expérience",
    empty: "Aucune version publiée pour le moment.",
    readMore: "Lire les détails de la version",
    readArticle: "Lire le guide complet",
    viewOnGithub: "Voir sur GitHub",
  },
  en: {
    badge: "News & Releases",
    title: "Blog & Release Changelog",
    intro: "Latest releases, update notes, and software architecture articles for Bobine, synchronized continuously from GitHub.",
    featuredReleaseBadge: "Latest Stable Release",
    releasesHeading: "Release Changelog & Updates",
    articlesHeading: "Technical Articles & Real-World Guides",
    empty: "No releases found yet.",
    readMore: "Read release details",
    readArticle: "Read full guide",
    viewOnGithub: "View on GitHub",
  },
} as const;

const technicalArticles = {
  fr: [
    {
      slug: "pourquoi-regie-locale-hors-ligne",
      link: "/fr/documentation/manifeste",
      category: "Architecture",
      readTime: "4 min de lecture",
      date: "18 août 2026",
      title: "Pourquoi une régie 100% hors-ligne est indispensable pour les salles de fitness",
      desc: "Les coupures de fibre et les pannes cloud ne doivent jamais interrompre les cours collectifs. Analyse des avantages de l'architecture locale face aux régies vidéo dépendantes d'Internet.",
    },
    {
      slug: "choisir-mini-pc-reconditionne-fitness",
      link: "/fr/documentation/demarrage-rapide",
      category: "Matériel & Frugalité",
      readTime: "6 min de lecture",
      date: "12 août 2026",
      title: "Guide Matériel : Quel mini PC reconditionné choisir à moins de 50 € (Dell Wyse, Celeron)",
      desc: "Benchmark des processeurs Intel Celeron J4105 et N5105 pour décoder du H.264 et HEVC en 1080p60 avec moins de 8% de charge CPU et 8W de consommation.",
    },
    {
      slug: "automatisation-tv-hdmi-cec",
      link: "/fr/documentation/utilisation",
      category: "Automatisation",
      readTime: "5 min de lecture",
      date: "5 août 2026",
      title: "Contrôle HDMI-CEC : Allumer et éteindre automatiquement les écrans de votre salle",
      desc: "Comment Bobine élimine les télécommandes perdues et les écrans laissés allumés la nuit grâce aux signaux CEC envoyés par la sortie HDMI du mini PC.",
    },
  ],
  en: [
    {
      slug: "why-offline-first-gym-playout",
      link: "/en/documentation/manifeste",
      category: "Architecture",
      readTime: "4 min read",
      date: "August 18, 2026",
      title: "Why 100% Offline-First Playout is Essential for Modern Sports Facilities",
      desc: "Internet outages and cloud downtime should never stop scheduled fitness classes. An in-depth analysis of local-first playout vs. proprietary cloud-dependent players.",
    },
    {
      slug: "choosing-budget-mini-pc-gym",
      link: "/en/documentation/demarrage-rapide",
      category: "Hardware & Frugality",
      readTime: "6 min read",
      date: "August 12, 2026",
      title: "Hardware Guide: Best Budget Refurbished Mini PCs Under $50 (Dell Wyse, Celeron)",
      desc: "Benchmarking Intel Celeron J4105 and N5105 for 1080p60 H.264 / HEVC video playback with under 8% CPU usage and 8W power draw.",
    },
    {
      slug: "automated-tv-control-hdmi-cec",
      link: "/en/documentation/utilisation",
      category: "Automation",
      readTime: "5 min read",
      date: "August 5, 2026",
      title: "HDMI-CEC Automation: Automatically Powering TV Screens On and Off",
      desc: "How Bobine eliminates lost remotes and overnight screen power waste by sending CEC commands directly over the mini PC's HDMI output.",
    },
  ],
};

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
  const articles = technicalArticles[locale as Locale];

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: t.title, url: `/${locale}/blog` },
  ];

  const latestRelease = releases[0];

  return (
    <div className="container" style={{ paddingBlock: "clamp(2rem, 4vh, 3.5rem)", maxWidth: "70rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* En-tête large et aéré */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1.5rem",
          paddingBottom: "1.75rem",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: "2rem",
        }}
      >
        <div style={{ maxWidth: "46rem" }}>
          <span className="feature-category-label">{t.badge}</span>
          <h1
            style={{
              fontSize: "clamp(2.1rem, 4.2vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBlock: "0.4rem 0.65rem",
              color: "var(--text-heading)",
            }}
          >
            {t.title}
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.05rem",
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

      {/* =========================================================================
          1. CARTE HERO : DERNIÈRE RELEASE MAJEURE EN VEDETTE (LAYOUT OUVERT)
          ========================================================================= */}
      {latestRelease && (
        <div
          style={{
            paddingBottom: "2.5rem",
            marginBottom: "2.5rem",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span className="badge" style={{ fontSize: "0.8rem", padding: "0.25rem 0.75rem" }}>
                {t.featuredReleaseBadge}
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-heading)", fontFamily: "monospace" }}>
                {latestRelease.slug}
              </span>
            </div>
            {latestRelease.publishedAt && (
              <time style={{ color: "var(--text-dim)", fontSize: "0.85rem", fontWeight: 500 }}>
                {new Date(latestRelease.publishedAt).toLocaleDateString(
                  locale === "fr" ? "fr-FR" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </time>
            )}
          </div>

          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 0.85rem 0", lineHeight: 1.25 }}>
            <Link
              href={`/${locale}/blog/${encodeURIComponent(latestRelease.slug)}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {latestRelease.title}
            </Link>
          </h2>

          <ul style={{ margin: "0 0 1.5rem 0", paddingLeft: "1.25rem", color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            <li>{locale === "en" ? "Full MPV video playback with Intel QuickSync & VA-API hardware decoding" : "Moteur vidéo MPV avec décodage matériel Intel QuickSync et VA-API (moins de 8% CPU)"}</li>
            <li>{locale === "en" ? "Automated TV power on/off scheduling via HDMI-CEC signals" : "Allumage et extinction automatique des téléviseurs via protocole HDMI-CEC"}</li>
            <li>{locale === "en" ? "On-demand member touch kiosk and instant smartphone remote via local QR code" : "Borne tactile membre à la demande & télécommande smartphone via QR code local"}</li>
            <li>{locale === "en" ? "24/7 background plateau music radio with seamless gapless crossfading" : "Radio d'ambiance plateau 24/7 avec fondu musical sans aucun blanc sonore"}</li>
          </ul>

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
      )}

      {/* =========================================================================
          2. ARTICLES TECHNIQUES & GUIDES DE FOND (LAYOUT OUVERT)
          ========================================================================= */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ marginBottom: "1.25rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
            {t.articlesHeading}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={art.link}
              className="doc-open-row"
              style={{
                textDecoration: "none",
                paddingBlock: "1.35rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1.5rem",
              }}
            >
              <div style={{ maxWidth: "48rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                  <span className="badge" style={{ fontSize: "0.725rem", padding: "0.15rem 0.5rem" }}>
                    {art.category}
                  </span>
                  <span style={{ fontSize: "0.775rem", color: "var(--text-dim)" }}>
                    {art.readTime}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 0.35rem 0", lineHeight: 1.35 }}>
                  {art.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.55, margin: 0 }}>
                  {art.desc}
                </p>
              </div>
              <span style={{ color: "var(--accent-primary)", fontSize: "0.85rem", fontWeight: 600, flexShrink: 0, marginTop: "0.5rem" }}>
                {t.readArticle}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. HISTORIQUE DES VERSIONS / RELEASES GITHUB
          ========================================================================= */}
      {releases.length > 1 && (
        <div>
          <div style={{ marginBottom: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
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
                  paddingBlock: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="badge" style={{ fontSize: "0.75rem" }}>
                    {release.slug}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "0.95rem" }}>
                    {release.title}
                  </span>
                </div>
                <span style={{ color: "var(--accent-primary)", fontSize: "0.85rem", fontWeight: 600 }}>
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

