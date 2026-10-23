import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { buildMetadata, lp } from "@/lib/seo";
import ScrollIndicator from "@/components/ScrollIndicator";
import "@/styles/split/pages-about.css";

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
      ? "About & Manifesto — Bobine | Open Source Vision, Identity & Values"
      : "À Propos & Manifeste — Bobine | Vision Libre, Identité & Engagements",
    description: isEn
      ? "Discover the story, open-source manifesto, author, and aesthetic identity behind Bobine: emancipating gyms with sovereign, local-first video playout."
      : "Découvrez la genèse, le manifeste libre, l'auteur et l'identité esthétique de Bobine : redonner la souveraineté aux salles de sport avec une régie vidéo 100% hors-ligne.",
    keywords: [
      "À propos Bobine",
      "Manifeste Bobine",
      "Vision Bobine libre",
      "Clément Barillot",
      "FantasmaGlad",
      "Mascotte Baamix",
      "Alternative Les Mills Cinema",
      "Logiciel libre fitness",
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
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "About & Manifesto" : "À propos & Manifeste", url: lp(locale, `/a-propos`) },
  ];

  return (
    <div className="container about-div-1">
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* 1. Hero Section — Plein écran propre sur Desktop et Mobile */}
      <section className="hero-fullscreen">
        <div>
          <span className="feature-category-label about-span-1">
            {isEn ? "Manifesto, Identity & Author" : "Manifeste, Identité & Auteur"}
          </span>

          <h1 className="hero-fullscreen__title">
            {isEn ? "The Story, Manifesto & Commitments behind Bobine" : "L'Histoire, le Manifeste et les Engagements de Bobine"}
          </h1>

          <p className="hero-fullscreen__subtitle">
            {isEn
              ? "Bobine is a free, local-first cinema playout suite engineered to emancipate gym owners, fitness studios, hotels, and independent trainers from proprietary subscription lock-in."
              : "Bobine est une suite logicielle libre et autonome créée pour affranchir les gérants de salle, studios de fitness, hôtels et coachs indépendants de la rente des régies vidéo propriétaires."}
          </p>
        </div>

        <ScrollIndicator locale={locale as Locale} />
      </section>

      {/* Sections ouvertes avec délimitations de lignes fines (zéro syndrome box-in-a-box) */}
      <div className="about-div-2">
        {/* Section 1 : Le Pourquoi */}
        <section className="about-section-1">
          <h2 className="about-h2-1">
            {isEn ? "The \"Why\": Ending the Proprietary Playout Royalty" : "Le Pourquoi : En finir avec la rente des régies fermées"}
          </h2>
          <div className="about-div-3">
            <p className="about-p-1">
              {isEn
                ? "For years, fitness studios have been forced to pay recurring monthly subscription fees ranging from $150 to $400 per screen for closed proprietary black boxes. If the gym's internet connection stutters during peak hours, workout screens freeze mid-session. When hardware is phased out by the vendor, gym managers have no choice but to purchase mandatory replacements."
                : "Pendant des années, les gérants de salle et les coachs ont été contraints de verser des abonnements mensuels de 150 € à 400 € par écran pour des boîtiers propriétaires fermés. Si la connexion fibre du club a un hoquet en pleine heure de pointe, les cours collectifs se figent. Et quand l'éditeur déclare le matériel obsolète, le club est contraint de repayer un équipement complet."}
            </p>
            <p className="about-p-2">
              {isEn
                ? "Bobine was born to end this absurdity. A video screen broadcasting workouts in an athletic room does not require a perpetual cloud rental fee."
                : "Bobine est né pour briser cette dépendance. Une régie diffusant des séances de sport dans une salle n'a pas besoin d'un abonnement cloud perpétuel."}
            </p>
          </div>
        </section>

        {/* Section 2 : Les Piliers Fondateurs */}
        <section className="about-section-1">
          <h2 className="about-h2-2">
            {isEn ? "Frugality, Local-First Autonomy & Digital Commons" : "Frugalité, Autonomie Hors-Ligne & Communs Numériques"}
          </h2>

          <div className="about-div-4">
            <div className="about-div-5">
              <strong className="about-strong-1">
                {isEn ? "100% Offline-First & Playout Sovereignty" : "100% Hors-Ligne & Souveraineté Totale"}
              </strong>
              <p className="about-p-3">
                {isEn
                  ? "All videos, schedules, and configurations live locally on SSD. Internet is only required once during the initial install. If network drops occur, classes keep playing with zero glitch."
                  : "Toutes les vidéos, grilles horaires et réglages sont stockés localement sur le disque SSD du mini PC. Internet n'est requis qu'une seule fois à l'installation : aucune coupure réseau ne perturbe vos cours."}
              </p>
            </div>

            <div className="about-div-5">
              <strong className="about-strong-1">
                {isEn ? "Anti-Obsolescence & Frugal Hardware (<10W Power)" : "Sobriété Matérielle & Frugalité Énergétique (<10W)"}
              </strong>
              <p className="about-p-3">
                {isEn
                  ? "Bobine runs smoothly on refurbished enterprise mini PCs (like the Dell Wyse 5070 costing ~$40-50). Consuming under 10 Watts of active power, it provides smooth 1080p60/4K hardware decoding without e-waste."
                  : "Optimisé pour des mini PC reconditionnés professionnels (comme le Dell Wyse 5070 à ~40-50 €), Bobine consomme moins de 10 Watts en pleine lecture 1080p60/4K, alliant performance et durabilité."}
              </p>
            </div>

            <div className="about-div-5">
              <strong className="about-strong-1">
                {isEn ? "Open-Source Copyleft License (AGPL-3.0)" : "Licence Libre Copyleft (AGPL-3.0)"}
              </strong>
              <p className="about-p-3">
                {isEn
                  ? "The entire codebase is transparent, public, and auditable on GitHub. No lock-in, no telemetry, and guaranteed free access to core automation capabilities for the athletic community."
                  : "L'intégralité du code source est ouverte, auditable et garantie libre pour toujours. Aucune télémétrie cachée, aucun verrouillage propriétaire."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 : Identité & Direction Artistique */}
        <section className="about-section-1">
          <h2 className="about-h2-3">
            {isEn ? "Cinema Craftsmanship & The Mascot Baamix" : "L'Artisanat Cinéma & La Mascotte Baamix"}
          </h2>
          <div className="about-div-3">
            <p className="about-p-1">
              <strong>{isEn ? "The Name « Bobine » : " : "Le Nom « Bobine » : "}</strong>
              {isEn
                ? "A tribute to 35mm film reels and to Bobine, my grandmother's dog."
                : "Un hommage à la bobine de film 35mm et à Bobine la chienne de ma grand-mère."}
            </p>
            <p className="about-p-1">
              <strong>{isEn ? "The Mascot « Baamix » : " : "La Mascotte « Baamix » : "}</strong>
              {isEn
                ? "My little white hamster who got me into computing in 2024 when I created a game in his likeness."
                : "Mon petit Hamster Blanc qui m'a lancé dans le monde de l'informatique en 2024 pour lui créer un jeu à son effigie."}
            </p>
            <p className="about-p-1">
              <strong>{isEn ? "Visual Discipline : " : "Épure Visuelle : "}</strong>
              {isEn
                ? "A dark cinema studio atmosphere, 16 contrasted dual-tone themes. An iconic logo."
                : "Une atmosphère studio cinéma sombre, 16 thèmes bicolores contrastés. Un logo iconique."}
            </p>
          </div>
        </section>

        {/* Section 4 : L'Auteur & Gouvernance */}
        <section className="about-section-2">
          <h2 className="about-h2-1">
            {isEn ? "Created by Clément Barillot (FantasmaGlad)" : "Développé par Clément Barillot (FantasmaGlad)"}
          </h2>
          <p className="about-p-4">
            {isEn
              ? "Bobine is designed and maintained with passion as an independent open-source contribution to the fitness, sports, and digital sovereignty movements."
              : "Bobine est conçu et maintenu avec rigueur comme une contribution open-source pérenne au service des gérants de salle et des passionnés de sport."}
          </p>
        </section>
      </div>
    </div>
  );
}
