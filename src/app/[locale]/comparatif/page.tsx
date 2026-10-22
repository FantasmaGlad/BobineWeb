import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import ScrollIndicator from "@/components/ScrollIndicator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import "@/styles/split/pages-comparison.css";

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
    pathname: "/comparatif",
    title: isEn
      ? "Gym Streaming & Playout Comparisons — Bobine vs Les Mills, Wexer & Proprietary Systems"
      : "Comparatifs & Alternatives Régies Vidéo Fitness — Bobine face à Les Mills, Wexer et aux solutions propriétaires",
    description: isEn
      ? "Compare Bobine with Les Mills Cinema, Wexer Virtual, Fitness On Demand, Radical Fitness, and generic digital signage. Discover savings, offline autonomy, and hardware sovereignty."
      : "Comparez Bobine face à Les Mills Cinema, Wexer, Fitness On Demand, Radical Fitness et l'affichage dynamique. Découvrez les économies de licence, l'autonomie hors-ligne et la liberté matérielle.",
    keywords: [
      "Comparatif régie vidéo fitness",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Alternative Wexer",
      "Alternative Fitness On Demand",
      "Alternative Radical Fitness",
      "Alternative Yako",
      "Alternative TouchPlayer Fitness",
      "Logiciel cours virtuels salle de sport",
      "Streaming salle de sport sans abonnement",
    ],
  });
}

const COMPARISONS_DATA = {
  fr: {
    badge: "Études Comparatives & Alternatives",
    title: "Guide Comparatif des Solutions de Cours Virtuels & Régies Vidéo",
    subtitle:
      "Analysez objectivement les coûts de licence, l'indépendance de catalogue, les contraintes matérielles et la fiabilité hors-ligne entre Bobine et les acteurs du marché.",
    cards: [
      {
        slug: "les-mills-cinema",
        target: "Les Mills Cinema & Les Mills Virtual",
        badge: "Modèle Premium & Redevances",
        headline: "Économisez 1 500 € à 3 600 € / an par studio sans sacrifier l'expérience immersive.",
        description:
          "Comparatif détaillé entre le modèle à royalties cumulées de Les Mills (BodyPump, RPM, The Trip) et la régie libre Bobine sur mini PC reconditionné standard.",
        points: [
          "0 € / mois de licence (AGPL-3.0) vs 150 € à 350 € / mois par programme",
          "0 € de formation obligatoire vs 500 € HT / module par coach",
          "100% hors-ligne sur SSD local sans coupure en cas de panne internet",
          "Installation 1 clic sur Windows, macOS, Linux ou mini PC reconditionné",
        ],
      },
      {
        slug: "wexer-fitness-on-demand",
        target: "Wexer Virtual & Fitness On Demand (FOD)",
        badge: "Local-First vs SaaS Cloud",
        headline: "Dites adieu aux abonnements SaaS cloud à 250 €+/mois par écran.",
        description:
          "Pourquoi choisir une architecture décentralisée locale avec bus temps réel plutôt qu'un lecteur cloud tributaire de la bande passante et des pannes de serveurs distants.",
        points: [
          "Zéro abonnement récurrent vs 200 € à 450 € / mois par écran",
          "Réactivité sub-2ms sur réseau local vs latence et mise en mémoire cloud",
          "Souveraineté totale RGPD : zéro collecte de données adhérents",
          "Télécommande coach instantanée par QR code sur Wi-Fi local",
        ],
      },
      {
        slug: "radical-fitness-yako",
        target: "Radical Fitness & Cours de Franchise (Yako)",
        badge: "Liberté des Clubs Indépendants",
        headline: "Diffusez vos propres cours et valorisez vos coachs sans franchise imposée.",
        description:
          "Comment les gérants de clubs indépendants peuvent proposer une grille de cours virtuels de haute qualité (Cycling, HIIT, Yoga, Renfo) sans affiliation ni redevance de marque.",
        points: [
          "Import libre par glisser-déposer de vos vidéos personnalisées (MP4, MKV)",
          "Zéro affiliation franchise requise (indépendance opérationnelle totale)",
          "Mise en avant de votre propre marque et de vos coachs résidents",
          "Radio d'ambiance 24/7 intégrée avec fondu Web Audio continu",
        ],
      },
      {
        slug: "affichage-dynamique-fitness",
        target: "Anthias (Screenly OSE) & Affichage Dynamique (TouchPlayer, Waves, Yodeck)",
        badge: "Régie Métier vs Signalétique",
        headline: "Pourquoi un afficheur passif comme Anthias ne remplace pas une régie vidéo fitness.",
        description:
          "Comprendre la différence fondamentale entre des boucles d'images passives et les fonctions métier de Bobine (planning de cours programmés, borne tactile adhérent, radio 24/7).",
        points: [
          "Lecture automatique des cours à l'heure planifiée, à la seconde près",
          "Borne tactile plein écran pour lancement de cours à la demande avec décompte",
          "Radio d'ambiance 24/7 avec annonces programmées de bienséance",
          "Reprise autonome après coupure électrique via watchdog systemd",
        ],
      },
    ],
  },
  en: {
    badge: "Comparative Studies & Alternatives",
    title: "Virtual Fitness & Video Playout Comparison Guide",
    subtitle:
      "Objectively analyze licensing costs, content freedom, hardware constraints, and offline reliability between Bobine and commercial market solutions.",
    cards: [
      {
        slug: "les-mills-cinema",
        target: "Les Mills Cinema & Les Mills Virtual",
        badge: "Premium Royalties vs Open Playout",
        headline: "Save $1,500 to $3,600 / year per studio with zero recurring license fees.",
        description:
          "Detailed breakdown between Les Mills cumulative royalties (BodyPump, RPM, The Trip) and Bobine's free sovereign playout engine running on budget mini PCs.",
        points: [
          "$0 / month license (AGPL-3.0) vs $150–$350 / month per program",
          "$0 coach certifications vs $500+ per module per instructor",
          "100% offline from local SSD with zero freezes during internet drops",
          "1-click installer on Windows, macOS, Linux, or a refurbished mini PC",
        ],
      },
      {
        slug: "wexer-fitness-on-demand",
        target: "Wexer Virtual & Fitness On Demand (FOD)",
        badge: "Local-First vs Cloud SaaS",
        headline: "Say goodbye to $250+/month per screen cloud SaaS subscriptions.",
        description:
          "Why decentralized local-first playout delivers superior reliability compared to cloud streaming appliances vulnerable to network outages.",
        points: [
          "Zero recurring SaaS fee vs $200–$450 / month per screen",
          "Sub-2ms local latency vs cloud streaming buffering",
          "Complete GDPR compliance: zero member data harvesting",
          "Instant coach mobile remote via local Wi-Fi QR code scan",
        ],
      },
      {
        slug: "radical-fitness-yako",
        target: "Radical Fitness & Franchise Programs",
        badge: "Independent Studio Sovereignty",
        headline: "Broadcast custom workout videos and elevate your trainers with zero franchise lock-in.",
        description:
          "How independent gym owners deliver studio-grade virtual workouts (Cycling, HIIT, Yoga, Strength) without paying third-party franchise brand fees.",
        points: [
          "Unrestricted drag-and-drop import for custom workout videos (MP4, MKV)",
          "No franchise affiliation required (complete catalog freedom)",
          "Full ownership of gym branding, instructors, and timetables",
          "Integrated 24/7 background audio with seamless Web Audio crossfade",
        ],
      },
      {
        slug: "affichage-dynamique-fitness",
        target: "Anthias (Screenly OSE) & Generic Signage (TouchPlayer, Waves, Yodeck)",
        badge: "Dedicated Playout vs Generic Signage",
        headline: "Why passive players like Anthias fail to meet gym studio requirements.",
        description:
          "Understanding the gap between generic slide/video loopers and Bobine's purpose-built fitness features (scheduled class playout, member touch kiosk, 24/7 gym radio).",
        points: [
          "Automatic playout at the exact scheduled second, not a loop",
          "Fullscreen member touch kiosk with live countdown timer",
          "24/7 Gym background radio with crossfade and etiquette voice alerts",
          "Autonomous boot recovery post power cut (systemd watchdog)",
        ],
      },
    ],
  },
} as const;

export default async function ComparatifHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = COMPARISONS_DATA[locale as Locale];
  const isEn = locale === "en";
  const breadcrumbs = [
    { name: isEn ? "Home" : "Accueil", url: `/${locale}` },
    { name: isEn ? "Comparisons" : "Comparatifs", url: lp(locale, `/comparatif`) },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* 1. Hero Section — Plein écran propre sur Desktop et Mobile */}
      <section className="hero-fullscreen">
        <div>
          <div className="cmp-div-8"
          >
            <span className="feature-category-label cmp-span-2">
              {data.badge}
            </span>
            <ShareButton
              locale={locale as Locale}
              pathname="/comparatif"
              title={data.title}
              description={data.subtitle}
            />
          </div>

          <h1 className="hero-fullscreen__title">
            {data.title}
          </h1>

          <p className="hero-fullscreen__subtitle">
            {data.subtitle}
          </p>
        </div>

        <ScrollIndicator locale={locale as Locale} />
      </section>

      {/* 2. Grille 2x2 des études comparatives */}
      <div className="cmp-div-9"
      >
        {data.cards.map((card) => (
          <article
            key={card.slug} className="cmp-article-2"
          >
            <div>
              <span className="cmp-span-3"
              >
                {card.badge}
              </span>

              <h2 className="cmp-h2-3">
                {card.target}
              </h2>

              <p className="cmp-p-6">
                {card.headline}
              </p>

              <p className="cmp-p-7">
                {card.description}
              </p>

              <ul className="cmp-ul-1">
                {card.points.map((pt, pIdx) => (
                  <li key={pIdx} className="cmp-li-1">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="cmp-svg-1">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={lp(locale, `/comparatif/${card.slug}`)}
              className="btn-primary cmp-link-1"
            >
              {isEn ? "Read full comparison" : "Lire le comparatif complet"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
