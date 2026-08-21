import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import GitHubIcon from "@/components/icons/GitHubIcon";
import ShareButton from "@/components/ShareButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

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
    pathname: "/documentation/manifeste",
    title: isEn
      ? "Manifesto, Identity & Art Direction — Bobine | Open Source Playout"
      : "Manifeste, Identité & Direction Artistique — Bobine | Vision Libre",
    description: isEn
      ? "The story, why Bobine was built, open-source values (AGPL-3.0), art direction, and the origin of the Baamix mascot."
      : "L'histoire, le pourquoi de Bobine, les valeurs du logiciel libre (AGPL-3.0), la direction artistique et l'origine de la mascotte Baamix.",
    keywords: [
      "Manifeste Bobine",
      "Direction artistique Bobine",
      "Mascotte Baamix",
      "Pourquoi Bobine",
      "Valeurs open source fitness",
    ],
  });
}

export default async function ManifestePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: isEn ? "Manifesto & Identity" : "Manifeste & Identité", url: `/${locale}/documentation/manifeste` },
  ];

  return isEn ? (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Philosophy & Vision</span>
          <h1 style={{ margin: 0 }}>Manifesto, Identity & Art Direction</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="manifeste" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/manifeste"
            title="Bobine Manifesto, Identity & Art Direction"
            description="The story, core values, and aesthetic principles behind Bobine."
            hashtags={["Bobine", "Manifesto", "OpenSource", "DigitalCommons"]}
          />
        </div>
      </div>

      <p className="docs-lead">
        The story, core values, and aesthetic principles behind Bobine: a free, local-first cinema playout system engineered for independent gyms.
      </p>

      <h2 id="the-why">The &quot;Why&quot;: Breaking Free from Rental Models</h2>
      <p>
        For years, fitness clubs and gym studios have been held hostage by proprietary video streaming boxes. These closed platforms charge between <strong>150 and 400 EUR per screen every month</strong> just to display prerecorded workout sessions on a standard TV.
      </p>
      <p>
        Worse, when the gym&apos;s internet connection stutters, the whole workout room freezes mid-class. When the provider decides to increase licensing prices or discontinue older hardware, gym managers have no choice but to comply.
      </p>
      <p>
        <strong>Bobine was born to end this absurdity.</strong> A standard video player running in a room does not require an endless cloud subscription.
      </p>

      <h2 id="the-core">The Core Values: Frugality, Local-First & Freedom</h2>
      <ul>
        <li>
          <strong>100% Offline-First & Sovereignty</strong> : All media files, schedules, and configurations live locally on SSD. If the internet goes down, classes keep playing without a glitch. Your gym remains entirely sovereign.
        </li>
        <li>
          <strong>Anti-Obsolescence & Frugal Hardware</strong> : Bobine runs smoothly on standard refurbished mini PCs (such as the Dell Wyse 5070, costing around 40-50 EUR) with a power consumption under 10 Watts. No proprietary black boxes, no e-waste.
        </li>
        <li>
          <strong>Open-Source Digital Commons (AGPL-3.0)</strong> : The code belongs to the fitness and athletic community. No lock-in, no telemetry, no sudden price hikes.
        </li>
      </ul>

      <h2 id="the-identity">The Identity & Art Direction</h2>
      <p>
        Every detail of Bobine reflects simplicity, craftsmanship, and reliability:
      </p>
      <ul>
        <li>
          <strong>The Name &quot;Bobine&quot;</strong> : A tribute to classic 35mm film reels. Like a cinema projector, Bobine delivers authentic, continuous, and robust video playback without unnecessary complexity.
        </li>
        <li>
          <strong>The Mascot &quot;Baamix&quot;</strong> : An agile, energetic white hamster. Symbolizing unstoppable stamina, resourcefulness, and friendly dedication, Baamix represents the spirited drive of independent gym communities.
        </li>
        <li>
          <strong>Aesthetic Discipline</strong> : A dark, minimalist cinema atmosphere, clean typography, delicate hairline boundaries, and zero AI slop or marketing fluff.
        </li>
      </ul>

      <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <a
          className="btn-primary"
          href="https://github.com/FantasmaGlad/Bobine"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon size={16} />
          View Source Code on GitHub
        </a>
        <Link className="btn-secondary" href={`/${locale}/documentation/demarrage-rapide`}>
          Install Bobine →
        </Link>
      </div>
    </>
  ) : (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Philosophie & Vision</span>
          <h1 style={{ margin: 0 }}>Manifeste, Identité & Direction Artistique</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="manifeste" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/manifeste"
            title="Manifeste, Identité & Direction Artistique — Bobine"
            description="L'histoire, les valeurs fondatrices et les choix esthétiques qui animent Bobine."
            hashtags={["Bobine", "Manifeste", "OpenSource", "CommunsNumériques"]}
          />
        </div>
      </div>

      <p className="docs-lead">
        L&apos;histoire, les valeurs fondatrices et les choix esthétiques qui animent Bobine : un système de régie vidéo autonome et libre pour les salles de sport.
      </p>

      <h2 id="le-pourquoi">Le Pourquoi : En finir avec la rente des régies fermées</h2>
      <p>
        Pendant des années, les gérants de salle et les coachs ont été captifs de régies vidéo propriétaires. Ces plateformes fermées facturent entre <strong>150 et 400 € par mois et par écran</strong> pour diffuser de simples vidéos sur un téléviseur.
      </p>
      <p>
        Pire encore : dès que la fibre du club a un hoquet, le cours collectif se fige en plein effort. Et quand l&apos;éditeur change sa politique tarifaire ou déclare le matériel obsolète, le club est contraint de repayer.
      </p>
      <p>
        <strong>Bobine est né pour briser cette dépendance.</strong> Une régie vidéo en salle n&apos;a pas besoin d&apos;un abonnement cloud perpétuel.
      </p>

      <h2 id="le-coeur">Le Cœur & L&apos;Idée : Frugalité, Autonomie & Logiciel Libre</h2>
      <ul>
        <li>
          <strong>100% Hors-Ligne & Souveraineté</strong> : Tous les cours, médias et planifications sont stockés localement sur disque SSD NVMe. Si Internet coupe, la salle continue de tourner sans aucun écran noir. Vos vidéos et votre grille horaire vous appartiennent.
        </li>
        <li>
          <strong>Frugalité & Anti-Gaspillage Matériel</strong> : Bobine redonne vie à des mini PC bureautiques reconditionnés standard (ex. Dell Wyse 5070 à 40-50 €), avec une consommation électrique sobre inférieure à 10 Watts. Zéro boîtier propriétaire jetable.
        </li>
        <li>
          <strong>Commun Numérique sous Licence AGPL-3.0</strong> : Le code source est public, auditable et garanti libre pour toujours. Les améliorations profitent à l&apos;ensemble de la communauté sportive et des clubs indépendants.
        </li>
      </ul>

      <h2 id="l-identite">L&apos;Identité & La Direction Artistique</h2>
      <p>
        L&apos;univers de Bobine est pensé pour être direct, élégant et sans artifice :
      </p>
      <ul>
        <li>
          <strong>Le Nom « Bobine »</strong> : Hommage direct à la bobine de film cinéma et à la mécanique de précision. Une image d&apos;artisanat robuste, où la pellicule défile avec régularité et fiabilité.
        </li>
        <li>
          <strong>La Mascotte « Baamix »</strong> : Un petit hamster blanc vif et infatigable. Agile, travailleur et plein d&apos;énergie, Baamix incarne l&apos;esprit d&apos;endurance des sportifs et l&apos;ingéniosité des solutions locales.
        </li>
        <li>
          <strong>Épure & Sobriété Visuelle</strong> : Un design noir cinéma élégant, des séparateurs fins et doux, une typographie soignée et l&apos;absence totale de jargon commercial ou d&apos;effets superficiels.
        </li>
      </ul>

      <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <a
          className="btn-primary"
          href="https://github.com/FantasmaGlad/Bobine"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon size={16} />
          Explorer le code sur GitHub
        </a>
        <Link className="btn-secondary" href={`/${locale}/documentation/demarrage-rapide`}>
          Installer Bobine →
        </Link>
      </div>
    </>
  );
}
