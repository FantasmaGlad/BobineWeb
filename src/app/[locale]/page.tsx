import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import GitHubIcon from "@/components/icons/GitHubIcon";
import StudioRPMScene from "@/components/three/StudioRPMScene";
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
    ctaDemo: "Découvrir la démo 3D →",
    kpis: [
      { value: "0 € / mois", label: "Aucune redevance par écran" },
      { value: "100% Hors-ligne", label: "Zéro coupure réseau" },
      { value: "~40-50 €", label: "Mini PC reconditionné standard" },
      { value: "< 10 W", label: "Consommation électrique sobre" },
    ],
    ctaBoxTitle: "Prêt à équiper votre salle sans abonnement ?",
    ctaBoxDesc:
      "Consultez notre tutoriel pas-à-pas pour installer Bobine en 30 à 45 minutes sur votre matériel standard.",
    ctaBoxButton: "Consulter le guide de démarrage →",
  },
  en: {
    title: "The open-source video & streaming system for your fitness club",
    subtitle:
      "Bobine turns a low-cost mini PC into a complete in-club multimedia system: scheduled classes, on-demand cinema kiosk, 24/7 background radio — no monthly fees, no cloud lock-in, no downtime.",
    ctaPrimary: "Install Bobine",
    ctaSecondary: "View on GitHub",
    ctaDemo: "Try the 3D demo →",
    kpis: [
      { value: "$0 / month", label: "Zero per-screen license fees" },
      { value: "100% Offline", label: "Zero downtime on outage" },
      { value: "~$40-50", label: "Standard refurbished mini PC" },
      { value: "< 10 W", label: "Ultra-low power consumption" },
    ],
    ctaBoxTitle: "Ready to equip your gym without subscriptions?",
    ctaBoxDesc:
      "Follow our step-by-step tutorial to install Bobine in 30 to 45 minutes on standard hardware.",
    ctaBoxButton: "View Quick Start Guide →",
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "1.5rem" }}>
      {/* 1. Hero Section */}
      <section style={{ maxWidth: "52rem", marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.9rem, 4.2vw, 2.85rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "0.85rem",
            color: "var(--text-heading)",
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            lineHeight: 1.55,
            color: "var(--text-muted)",
            maxWidth: "46rem",
            marginBottom: "1.35rem",
          }}
        >
          {t.subtitle}
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "1.75rem",
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
            href={`/${locale}/demo-3d`}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--accent-primary)",
              textDecoration: "none",
            }}
          >
            {t.ctaDemo}
          </Link>
        </div>

        {/* KPI Bar */}
        <div className="kpi-bar">
          {t.kpis.map((kpi, idx) => (
            <div key={idx} className="kpi-item">
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Scène 3D Interactive — Studio RPM & Régie Bobine */}
      <StudioRPMScene />

      {/* 3. Les 3 Profils — Onglets Interactifs */}
      <ProfileTabs locale={locale as Locale} />

      {/* 4. Tableau Comparatif Détaillé */}
      <ComparisonTable locale={locale as Locale} />

      {/* 5. Schéma Matériel & Terminal Linux */}
      <HardwareDiagram locale={locale as Locale} />

      {/* 6. Simulateur d'Économies & Calculateur de ROI */}
      <RoiCalculator locale={locale as Locale} />

      {/* 7. CTA Box */}

      <section
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "0.95rem",
          padding: "1.5rem 1.75rem",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <h3
            style={{
              margin: "0 0 0.35rem 0",
              fontSize: "1.2rem",
              color: "var(--text-heading)",
            }}
          >
            {t.ctaBoxTitle}
          </h3>
          <p
            style={{
              margin: 0,
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              lineHeight: 1.45,
            }}
          >
            {t.ctaBoxDesc}
          </p>
        </div>
        <Link
          className="btn-primary"
          href={`/${locale}/documentation/demarrage-rapide`}
        >
          {t.ctaBoxButton}
        </Link>
      </section>
    </div>
  );
}
