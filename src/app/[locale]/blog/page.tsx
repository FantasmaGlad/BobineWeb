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
import "@/styles/split/pages-blog.css";

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
    scrollOtherVersions: "Défiler pour découvrir d'autres versions",
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
    betaTitle: "Beta Version (Rolling beta): Early access to features under testing",
    betaDesc: "Rolling build updated continuously on GitHub tag beta. Installs in place over your existing app without creating duplicates.",
    betaAction: "View Beta Release & Changelog",
    releasesHeading: "Release History",
    scrollOtherVersions: "Scroll down to discover other versions",
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
  const historyReleases = stableReleases.filter(
    (r) => r.slug !== latestStable?.slug && r.slug.toLowerCase() !== "beta" && !r.isPrerelease
  );

  return (
    <div className="container blog-div-5">
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* 1. Hero Section — Plein écran avec la dernière release Stable en vedette */}
      <section className="blog-hero-section">
        <div>
          <span className="feature-category-label blog-span-2">
            {t.badge}
          </span>

          <h1 className="hero-fullscreen__title blog-h1-2">
            {t.title}
          </h1>

          <p className="hero-fullscreen__subtitle blog-p-1">
            {t.intro}
          </p>

          {/* DERNIÈRE RELEASE STABLE EN GROS DANS LE HERO */}
          {latestStable && (
            <div className="blog-hero-release-card blog-hero-release-card--stable">
              <div className="blog-div-6">
                <span
                  className="badge blog-span-3"
                >
                  {latestStable.slug}
                </span>
                <span className="blog-span-4"
                >
                  {t.featuredReleaseBadge}
                </span>
                {latestStable.publishedAt && (
                  <time className="blog-time-1">
                    {new Date(latestStable.publishedAt).toLocaleDateString(
                      locale === "fr" ? "fr-FR" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )}
                  </time>
                )}
              </div>

              <h2 className="blog-h2-1">
                <Link
                  href={`/${locale}/blog/${encodeURIComponent(latestStable.slug)}`} className="blog-link-2"
                >
                  {latestStable.title}
                </Link>
              </h2>

              {latestStable.slug.startsWith("V3") || latestStable.slug.startsWith("v3") ? (
                <ul className="blog-ul-1">
                  <li>{locale === "en" ? "Official native Android release (.apk): dual-screen touch & HDMI output with standalone embedded FastAPI server" : "Sortie officielle de l'application native Android (.apk) : double affichage tactile / HDMI et serveur FastAPI autonome embarqué"}</li>
                  <li>{locale === "en" ? "Multi-OS hardware accelerated transcoding (MediaCodec, Apple Silicon VideoToolbox, Linux VA-API)" : "Accélération matérielle multi-OS pour le réencodage vidéo (MediaCodec, Apple Silicon VideoToolbox, VA-API Linux)"}</li>
                  <li>{locale === "en" ? "Native 2K and 4K quality preservation without downscaling, reactive 1-click import cancellation & sharp 1080p thumbnails" : "Conservation intégrale des flux 2K et 4K natifs sans sous-échantillonnage, annulation réactive d'importation et miniatures nettes 1080p"}</li>
                </ul>
              ) : latestStable.slug.startsWith("V2.0.1") || latestStable.slug.startsWith("v2.0.1") ? (
                <ul className="blog-ul-1">
                  <li>{locale === "en" ? "Full hardware video acceleration for both Intel QuickSync (iHD) and AMD Radeon (mesa-va-drivers) under 8% CPU" : "Accélération matérielle complète pour Intel QuickSync (iHD) et AMD Radeon (mesa-va-drivers) sous 8% CPU"}</li>
                  <li>{locale === "en" ? "New 1-line auto-installer (curl -sSL https://bobine.fit/install.sh | bash) with clean & verbose (-v) modes" : "Nouvel installateur automatique en 1 ligne (curl -sSL https://bobine.fit/install.sh | bash) avec modes épuré et verbeux (-v)"}</li>
                  <li>{locale === "en" ? "Smart update handling for existing directories without conflicts, auto hardware driver setup" : "Gestion intelligente des mises à jour des dossiers existants sans collision et installation automatique des pilotes"}</li>
                </ul>
              ) : (
                <ul className="blog-ul-1">
                  <li>{locale === "en" ? "Full MPV video playback with Intel QuickSync & VA-API hardware decoding" : "Moteur vidéo MPV avec décodage matériel Intel QuickSync et VA-API (moins de 8% CPU)"}</li>
                  <li>{locale === "en" ? "One-click ZIP backup and restore of the full configuration" : "Sauvegarde et restauration ZIP en un clic de toute la configuration"}</li>
                  <li>{locale === "en" ? "On-demand member touch kiosk and instant smartphone remote via local QR code" : "Borne tactile membre à la demande & télécommande smartphone via QR code local"}</li>
                </ul>
              )}

              <div className="blog-div-7">
                <Link
                  href={`/${locale}/blog/${encodeURIComponent(latestStable.slug)}`}
                  className="btn-primary blog-link-3"
                >
                  <span>{t.readMore}</span>
                </Link>
                <a
                  href={latestStable.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary blog-link-3"
                >
                  <GitHubIcon size={16} />
                  <span>{t.viewOnGithub}</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* INDICATEUR DE DÉFILEMENT (PLACÉ EN BAS DE LA SECTION HERO) */}
        <div className="blog-hero-scroll-wrap">
          <ScrollIndicator
            locale={locale as Locale}
            label={t.scrollOtherVersions}
            targetId={betaRelease ? "beta-release" : "release-history"}
          />
        </div>
      </section>

      {/* 2. CARTE DÉDIÉE : CANAL BÊTA (ROLLING BETA) — PLACÉE HORS DU PREMIER ÉCRAN */}
      {betaRelease && (
        <section id="beta-release" className="blog-section-1">
          <div className="blog-hero-release-card blog-hero-release-card--beta">
            <div className="blog-div-8">
              <span
                className="badge blog-span-5"
              >
                beta
              </span>
              <span className="blog-span-6"
              >
                {t.betaBadge}
              </span>
              {betaRelease.publishedAt && (
                <time className="blog-time-2">
                  {new Date(betaRelease.publishedAt).toLocaleDateString(
                    locale === "fr" ? "fr-FR" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
              )}
            </div>

            <h3 className="blog-h3-1">
              <Link
                href={`/${locale}/blog/beta`} className="blog-link-2"
              >
                {t.betaTitle}
              </Link>
            </h3>

            <p className="blog-p-2">
              {t.betaDesc}
            </p>

            <div className="blog-div-9">
              <Link
                href={`/${locale}/blog/beta`}
                className="btn-secondary blog-link-4"
              >
                <span>{t.betaAction}</span>
              </Link>
              <a
                href={betaRelease.url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary blog-link-4"
              >
                <GitHubIcon size={15} />
                <span>{t.viewOnGithub}</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 2. HISTORIQUE DES VERSIONS / RELEASES GITHUB */}
      {historyReleases.length > 0 && (
        <div id="release-history" className="blog-div-10">
          <div className="blog-div-11">
            <h2 className="blog-h2-2">
              {t.releasesHeading}
            </h2>
          </div>

          <div className="blog-div-12">
            {historyReleases.map((release) => {
              const isBeta = release.isPrerelease || release.slug.toLowerCase() === "beta";
              return (
                <Link
                  key={release.slug}
                  href={`/${locale}/blog/${encodeURIComponent(release.slug)}`}
                  className="doc-open-row blog-link-5"
                >
                  <div className="blog-div-13">
                    <span className="badge blog-span-7">
                      {release.slug}
                    </span>
                    <span className={isBeta ? "blog-channel-tag blog-channel-tag--beta" : "blog-channel-tag"}>
                      {isBeta ? t.betaLabel : t.stableLabel}
                    </span>
                    <span className="blog-span-8">
                      {release.title}
                    </span>
                  </div>
                  <span className="blog-span-9">
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


