import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import GitHubIcon from "@/components/icons/GitHubIcon";
import ProfileTabs from "@/components/ProfileTabs";
import ComparisonTable from "@/components/ComparisonTable";
import HardwareDiagram from "@/components/HardwareDiagram";
import RoiCalculator from "@/components/RoiCalculator";

const copy = {
  fr: {
    title: "La régie vidéo & streaming open-source pour votre salle de sport",
    subtitle:
      "Bobine transforme un mini PC bon marché en système vidéo complet pour votre espace fitness : cours planifiés, borne cinéma à la demande, radio d'ambiance 24/7 — sans abonnement, sans dépendance au cloud, sans coupure.",
    ctaPrimary: "Installer Bobine",
    ctaSecondary: "Voir sur GitHub",
    ctaDocs: "Consulter la documentation →",
  },
  en: {
    title: "The open-source video & streaming system for your fitness club",
    subtitle:
      "Bobine turns a low-cost mini PC into a complete in-club multimedia system: scheduled classes, on-demand cinema kiosk, 24/7 background radio — no monthly fees, no cloud lock-in, no downtime.",
    ctaPrimary: "Install Bobine",
    ctaSecondary: "View on GitHub",
    ctaDocs: "Explore documentation →",
  },
} as const;

import { buildMetadata } from "@/lib/seo";

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
    pathname: "",
    title: isEn
      ? "Bobine — Open-Source Playout & Video Streaming for Gyms"
      : "Bobine — Régie vidéo & streaming open-source pour salles de sport",
    description: isEn
      ? "Transform standard budget mini PCs into an autonomous, 100% offline video playout suite for gyms. The free, self-hosted alternative to Les Mills Cinema."
      : "Transformez un mini PC standard en régie vidéo autonome et 100% hors-ligne pour votre salle de sport. L'alternative libre et sans abonnement à Les Mills Cinema.",
    keywords: [
      "Bobine",
      "Régie vidéo salle de sport",
      "Alternative Les Mills Cinema",
      "Affichage dynamique fitness",
      "Streaming vidéo salle de sport",
      "Cours collectifs vidéo fitness",
      "Dell Wyse 5070 streaming",
      "Logiciel libre sport",
    ],
  });
}


export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container">
      {/* 1. Hero Section — Plein écran au chargement */}
      <section
        className="hero-fullscreen"
        style={{
          minHeight: "calc(100svh - 130px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "56rem",
          paddingBlock: "clamp(2rem, 8vh, 5rem)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.1rem, 4.8vw, 3.3rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            marginBottom: "1.25rem",
            color: "var(--text-heading)",
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(1.05rem, 2.1vw, 1.25rem)",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "48rem",
            marginBottom: "2.25rem",
          }}
        >
          {t.subtitle}
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.85rem",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          <Link
            className="btn-primary"
            href={`/${locale}/documentation/demarrage-rapide`}
          >
            {t.ctaPrimary}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <a
            className="btn-secondary"
            href="https://github.com/FantasmaGlad/Bobine"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon size={16} />
            {t.ctaSecondary}
          </a>

          <Link
            href={`/${locale}/documentation`}
            style={{
              padding: "0.45rem 0.85rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--accent-primary)",
              textDecoration: "none",
            }}
          >
            {t.ctaDocs}
          </Link>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            color: "var(--text-dim)",
            fontSize: "0.825rem",
            fontWeight: 500,
          }}
        >
          <span>{locale === "en" ? "Scroll down to explore" : "Défiler pour découvrir"}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>


      {/* 2. Les 3 Profils — Onglets Interactifs */}
      <ProfileTabs locale={locale as Locale} />

      {/* 3. Tableau Comparatif Détaillé */}
      <ComparisonTable locale={locale as Locale} />

      {/* 4. Schéma Matériel & Terminal Linux */}
      <HardwareDiagram locale={locale as Locale} />

      {/* 5. Simulateur d'Économies & Calculateur de ROI */}
      <RoiCalculator locale={locale as Locale} />
    </div>
  );
}
