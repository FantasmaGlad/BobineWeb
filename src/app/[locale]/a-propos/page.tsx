import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import GitHubIcon from "@/components/icons/GitHubIcon";

const copy = {
  fr: {
    badge: "Origine & Philosophie",
    title: "L'histoire, le cœur et la vision de Bobine",
    intro:
      "Bobine est né d'une volonté simple : libérer les salles de sport, clubs associatifs et coachs de la rente des régies vidéo propriétaires, en offrant une alternative 100% hors-ligne, sobre et sous licence libre.",
    sections: [
      {
        title: "Le Pourquoi",
        desc: "Pendant des années, les gérants de salle ont dû payer des abonnements exorbitants (150 € à 400 € / mois par écran) pour de simples players vidéo connectés qui gèlent à la moindre coupure réseau. Bobine élimine définitivement cette taxe récurrente et remet la souveraineté entre les mains des clubs.",
      },
      {
        title: "Le Cœur & L'Idée",
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
        title: "The 'Why'",
        desc: "For years, gym owners have been locked into expensive subscriptions ($150 to $400 / month per screen) for simple streaming players that freeze during internet outages. Bobine eliminates recurring licensing fees and restores autonomy to sports clubs.",
      },
      {
        title: "The Core & Concept",
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
  return { title: copy[locale].title };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "2rem", maxWidth: "50rem" }}>
      <span className="feature-category-label">{t.badge}</span>
      <h1
        style={{
          fontSize: "clamp(1.85rem, 3.8vw, 2.5rem)",
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
          marginBottom: "0.85rem",
          color: "var(--text-heading)",
        }}
      >
        {t.title}
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          marginBottom: "2.25rem",
        }}
      >
        {t.intro}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {t.sections.map((sec, idx) => (
          <div
            key={idx}
            style={{
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "1.25rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--text-heading)",
                marginBottom: "0.4rem",
              }}
            >
              {sec.title}
            </h2>
            <p
              style={{
                color: "var(--text-main)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {sec.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link className="btn-primary" href={`/${locale}/documentation/manifeste`}>
          {t.ctaManifesto} →
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
        <Link className="btn-secondary" href={`/${locale}/documentation`}>
          {t.ctaDoc}
        </Link>
      </div>
    </div>
  );
}
