import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import GitHubIcon from "@/components/icons/GitHubIcon";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { buildMetadata } from "@/lib/seo";

const copy = {
  fr: {
    badge: "À Propos & Présentation",
    title: "Le projet Bobine, son auteur et ses engagements",
    intro:
      "Bobine est une suite logicielle libre et autonome créée pour affranchir les salles de sport, studios de fitness, hôtels et coachs indépendants de la rente des régies vidéo propriétaires.",
    sections: [
      {
        title: "La Mission : Redonner la souveraineté aux gérants de salle",
        desc: "Pendant des années, les clubs de fitness ont été contraints de payer des abonnements mensuels de 150 € à 400 € par écran pour des boîtiers fermés qui se bloquent à la moindre panne internet. Bobine élimine définitivement ces redevances récurrentes et permet à chaque salle de piloter sa propre régie vidéo avec une totale indépendance.",
      },
      {
        title: "L'Auteur & La Gouvernance Open Source",
        desc: "Initié et développé par Clément Barillot (FantasmaGlad), Bobine est publié sous licence libre AGPL-3.0. L'intégralité du code source est publique, auditable et pérenne sur GitHub, garantissant qu'aucune fonctionnalité essentielle ne sera jamais verrouillée derrière un péage propriétaire.",
      },
      {
        title: "L'Engagement Écologique & Matériel Frugal",
        desc: "À contre-courant de l'obsolescence programmée, Bobine est optimisé pour tourner sur des mini PC reconditionnés professionnels (type Dell Wyse 5070 ou HP EliteDesk) à moins de 50 €. Avec une consommation électrique active inférieure à 10 Watts, la solution allie sobriété énergétique et performances 1080p60/4K sans saccade.",
      },
      {
        title: "L'Identité & La Mascotte Baamix",
        desc: "Le nom 'Bobine' rend hommage à la mécanique infatigable des bobines de cinéma 35mm. Notre mascotte 'Baamix' — un petit hamster blanc agile et endurant — symbolise l'énergie sportive, l'ingéniosité des architectures locales et l'autonomie face aux géants du cloud.",
      },
    ],
    ctaGithub: "Code source sur GitHub",
    ctaManifesto: "Lire le manifeste complet",
    ctaDoc: "Documentation technique",
  },
  en: {
    badge: "About & Overview",
    title: "The Bobine Project, Author & Core Commitments",
    intro:
      "Bobine is a free, local-first gym playout suite designed to emancipate fitness studios, independent gyms, hotels, and trainers from proprietary streaming rental models.",
    sections: [
      {
        title: "The Mission: Empowering Gyms with Digital Sovereignty",
        desc: "For years, fitness studios have been locked into recurring monthly fees ($150 to $400/mo per screen) for closed streaming boxes that freeze during network drops. Bobine permanently removes these software royalties, giving gym managers total control over their video timetables and screens.",
      },
      {
        title: "The Author & Open Source Governance",
        desc: "Created and maintained by Clément Barillot (FantasmaGlad), Bobine is released under the copyleft AGPL-3.0 license. The entire codebase is publicly auditable and transparent on GitHub, guaranteeing that core playback and automation capabilities remain free forever.",
      },
      {
        title: "Frugal Hardware & Eco-Responsible Playout",
        desc: "Fighting against planned obsolescence, Bobine is engineered to run on standard refurbished enterprise mini PCs (like the Dell Wyse 5070 or HP EliteDesk) costing under $50. Consuming under 10 Watts of active power, it delivers high-performance 1080p60/4K playout with minimal carbon footprint.",
      },
      {
        title: "Identity & The Baamix Mascot",
        desc: "The name 'Bobine' pays homage to classic 35mm cinema film reels. Our mascot 'Baamix' — a nimble, determined white hamster — represents athletic stamina, local-first resilience, and decentralized ingenuity.",
      },
    ],
    ctaGithub: "Source Code on GitHub",
    ctaManifesto: "Read the Full Manifesto",
    ctaDoc: "Technical Documentation",
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
    pathname: "/a-propos",
    title: isEn
      ? "About Bobine — Author, Open Source Mission & Core Values"
      : "À Propos de Bobine — Auteur, Mission Libre & Engagements",
    description: isEn
      ? "Learn about the mission, governance, and author behind Bobine: empowering gyms with a sovereign, local-first alternative to proprietary video subscriptions."
      : "Découvrez la genèse, l'auteur et les engagements de Bobine : redonner l'autonomie aux gérants de salle avec une régie vidéo libre, sobre et 100% hors-ligne.",
    keywords: [
      "À propos Bobine",
      "Histoire Bobine",
      "Clément Barillot Bobine",
      "FantasmaGlad GitHub",
      "Mission Bobine régie vidéo",
      "Alternative Les Mills Cinema",
      "Logiciel libre salle de sport",
      "Vision Bobine fitness",
    ],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "About" : "À propos", url: `/${locale}/a-propos` },
  ];

  return (
    <div className="container" style={{ paddingBottom: "4rem", maxWidth: "60rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* 1. En-tête de page propre & aéré */}
      <header style={{ paddingTop: "2.5rem", paddingBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span className="feature-category-label">{t.badge}</span>
          <ShareButton
            locale={locale as Locale}
            pathname="/a-propos"
            title={t.title}
            description={t.intro}
          />
        </div>

        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, color: "var(--text-heading)", lineHeight: 1.2, margin: "0 0 1rem 0" }}>
          {t.title}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 1.75rem 0" }}>
          {t.intro}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link className="btn-primary" href={`/${locale}/documentation/manifeste`}>
            {t.ctaManifesto}
          </Link>
          <a
            className="btn-secondary"
            href="https://github.com/FantasmaGlad/Bobine"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon size={16} />
            {t.ctaGithub}
          </a>
        </div>
      </header>

      {/* 2. Cartes de présentation des piliers du projet */}
      <div id="about-sections" style={{ display: "flex", flexDirection: "column", gap: "1.75rem", paddingTop: "1rem" }}>
        {t.sections.map((sec, idx) => (
          <article
            key={idx}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.75rem",
              padding: "1.75rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-heading)",
                marginTop: 0,
                marginBottom: "0.65rem",
              }}
            >
              {sec.title}
            </h2>
            <p
              style={{
                color: "var(--text-main)",
                fontSize: "0.975rem",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {sec.desc}
            </p>
          </article>
        ))}

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
          <Link className="btn-primary" href={`/${locale}/documentation/demarrage-rapide`}>
            {isEn ? "Install Bobine" : "Installer Bobine"}
          </Link>
          <Link className="btn-secondary" href={`/${locale}/documentation`}>
            {t.ctaDoc}
          </Link>
          <Link className="btn-secondary" href={`/${locale}/comparatif`}>
            {isEn ? "View Comparisons" : "Consulter les Comparatifs"}
          </Link>
        </div>
      </div>
    </div>
  );
}
