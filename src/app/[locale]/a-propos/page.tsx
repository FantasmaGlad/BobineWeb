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
    badge: "Origine & Philosophie",
    title: "L'histoire, le cœur et la vision de Bobine",
    intro:
      "Bobine est né d'une volonté simple : libérer les salles de sport, clubs associatifs et coachs de la rente des régies vidéo propriétaires, en offrant une alternative 100% hors-ligne, sobre et sous licence libre.",
    sections: [
      {
        title: "Le Pourquoi : briser la rente des régies propriétaires",
        desc: "Pendant des années, les gérants de salle ont dû payer des abonnements exorbitants (150 € à 400 € / mois par écran) pour de simples players vidéo connectés qui gèlent à la moindre coupure réseau. Bobine élimine définitivement cette taxe récurrente et remet la souveraineté entre les mains des clubs.",
      },
      {
        title: "La Volonté Open Source & la Souveraineté Physique",
        desc: "Créer Bobine, c'est avant tout un engagement fort envers la communauté Open Source et la liberté d'utiliser un logiciel sans entraves. Nous défendons le droit fondamental de détenir et d'exécuter physiquement ses outils sur ses propres moyens informatiques locaux, sans dépendance au cloud ni rente imposée.",
      },
      {
        title: "Le Cœur & L'Idée : frugale et locale",
        desc: "Une solution 'Offline-First' résiliente qui tourne sur du matériel informatique standard reconditionné (~40-50 €) consommant moins de 10 Watts. Aucune boîte noire fermée, aucun traceur, aucun abonnement caché : le logiciel est publié sous licence AGPL-3.0.",
      },
      {
        title: "L'Identité & La Direction Artistique",
        desc: "Le nom 'Bobine' rend hommage à la bobine de cinéma 35mm et à sa mécanique infatigable. Notre mascotte 'Baamix' — un petit hamster blanc agile et travailleur — incarne l'énergie sportive, l'endurance et l'ingéniosité des solutions locales.",
      },
    ],
    ctaGithub: "Explorer le code source sur GitHub",
    ctaManifesto: "Lire le manifeste complet",
    ctaDoc: "Documentation technique",
  },
  en: {
    badge: "Origin & Philosophy",
    title: "The Story, Core Values & Vision of Bobine",
    intro:
      "Bobine was created with a clear goal: free gym owners, sports clubs, and fitness coaches from proprietary rental systems by offering a 100% offline-first, frugal, and open-source playout suite.",
    sections: [
      {
        title: "The 'Why': Breaking Free from Rental Models",
        desc: "For years, gym owners have been locked into expensive subscriptions ($150 to $400 / month per screen) for simple streaming players that freeze during internet outages. Bobine eliminates recurring licensing fees and restores autonomy to sports clubs.",
      },
      {
        title: "Open Source Commitment & Physical Ownership",
        desc: "Building Bobine is rooted in an unwavering dedication to the Open Source community and digital sovereignty. We champion the fundamental right to physically own, control, and execute software on your own local hardware, free from cloud lock-in and perpetual licensing fees.",
      },
      {
        title: "The Core & Concept: Frugal and Local-First",
        desc: "A resilient 'Offline-First' architecture powered by standard refurbished mini PCs (~$40-50) using under 10W of electricity. No proprietary black boxes, no telemetry, no recurring lock-in: the code is licensed under the AGPL-3.0 digital commons.",
      },
      {
        title: "Identity & Art Direction",
        desc: "The name 'Bobine' is a tribute to 35mm cinema reels and mechanical precision. Our mascot 'Baamix' — a nimble, dedicated white hamster — embodies relentless athletic stamina and frugal ingenuity.",
      },
    ],
    ctaGithub: "Explore Source Code on GitHub",
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
      ? "About Bobine — Story, Core Values & Vision | Open Source Gym"
      : "À Propos de Bobine — Histoire, Cœur & Vision | Régie Libre",
    description: isEn
      ? "Learn about the mission behind Bobine: empowering gym owners with an open-source, offline-first alternative to proprietary video subscriptions."
      : "Découvrez la genèse et la mission de Bobine : redonner l'autonomie aux gérants de salle avec une régie vidéo libre, sobre et 100% hors-ligne.",
    keywords: [
      "À propos Bobine",
      "Histoire Bobine",
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

      {/* 2. Sections de contenu détaillées */}
      <div id="about-sections" style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingTop: "1rem" }}>
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
