import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import RoiCalculator from "@/components/RoiCalculator";
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

function CardIcon({ slug }: { slug: string }) {
  switch (slug) {
    case "les-mills-cinema":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <polygon points="10 7 15 10 10 13 10 7" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "wexer-fitness-on-demand":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "radical-fitness-yako":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
        </svg>
      );
  }
}

const COMPARISONS_DATA = {
  fr: {
    badge: "Études Comparatives & Alternatives",
    title: "Guide Comparatif des Solutions de Cours Virtuels & Régies Vidéo",
    subtitle:
      "Analysez objectivement les coûts de licence, l'indépendance de catalogue, les contraintes matérielles et la fiabilité hors-ligne entre Bobine et les acteurs propriétaires du marché.",
    kpis: [
      { label: "Licence Logicielle Bobine", value: "0 € / mois", desc: "Open-source AGPL-3.0 perpétuel, sans redevance par programme ni par écran" },
      { label: "Économie par Studio", value: "1 800 € – 5 400 €", desc: "Économisés chaque année face aux abonnements SaaS et franchises" },
      { label: "Fiabilité Diffusion", value: "100 % Hors-ligne", desc: "Lecture directe sur SSD local sans coupure lors des pannes internet" },
      { label: "Souveraineté Matérielle", value: "PC, Mac, Linux & TV", desc: "Mini-PC reconditionné dès 45 €, Mac mini M4, Google Book ou Android TV" },
    ],
    cards: [
      {
        slug: "les-mills-cinema",
        target: "Les Mills Cinema & Les Mills Virtual",
        badge: "Modèle Premium & Redevances",
        image: "/images/hardware/geekom-it13-max-cutout.webp",
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
        image: "/images/BaamixInspector.webp",
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
        image: "/images/FirefoxBaamix.webp",
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
        image: "/images/hardware/tv-google-tv-streamer-cutout.webp",
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
    matrixTitle: "Matrice de Synthèse : Bobine face au Marché",
    matrixHeaders: ["Critère Opérationnel", "Bobine (AGPL-3.0)", "Les Mills / Franchises", "Wexer / FOD (Cloud SaaS)", "Affichage Dynamique"],
    matrixRows: [
      {
        label: "Coût mensuel récurrent",
        bobine: "0 € / mois (Perpétuel)",
        col2: "150 € à 400 € / mois / studio",
        col3: "200 € à 450 € / mois / écran",
        col4: "0 € à 80 € / mois / écran",
      },
      {
        label: "Fonctionnement 100 % hors-ligne",
        bobine: "Oui (SSD local autonome)",
        col2: "Vérification DRM périodique",
        col3: "Dépendance flux Cloud",
        col4: "Partiel (boucle locale)",
      },
      {
        label: "Liberté du catalogue vidéo",
        bobine: "100 % libre (MP4, MKV, sous-titres)",
        col2: "Catalogue éditeur verrouillé",
        col3: "Catalogue propriétaire fermé",
        col4: "Libre mais sans grille métier",
      },
      {
        label: "Borne tactile & Double écran HDMI",
        bobine: "Inclus (/grid + /cinema + /kiosk)",
        col2: "Matériel propriétaire dédié",
        col3: "Tablette propriétaire payante",
        col4: "Non (diffusion passive)",
      },
      {
        label: "Radio 24/7 & Annonces vocales",
        bobine: "Incluses avec ducking audio",
        col2: "Non inclus",
        col3: "Non inclus",
        col4: "Non inclus",
      },
      {
        label: "Matériel supporté",
        bobine: "PC, Mac M1-M4, Linux, Android TV, Tablette",
        col2: "Matériel imposé / certifié",
        col3: "Boîtier propriétaire imposé",
        col4: "Raspberry Pi / Player dédié",
      },
    ],
  },
  en: {
    badge: "Comparative Studies & Alternatives",
    title: "Virtual Fitness & Video Playout Comparison Guide",
    subtitle:
      "Objectively analyze licensing costs, content freedom, hardware constraints, and offline reliability between Bobine and proprietary market solutions.",
    kpis: [
      { label: "Bobine Software License", value: "$0 / month", desc: "Perpetual AGPL-3.0 open-source, zero per-program or per-screen royalties" },
      { label: "Studio Annual Savings", value: "$1,800 – $5,400", desc: "Saved every year per studio compared to cloud SaaS and franchises" },
      { label: "Playback Reliability", value: "100% Offline", desc: "Direct playback from local SSD with zero freezes during ISP outages" },
      { label: "Hardware Sovereignty", value: "PC, Mac, Linux & TV", desc: "Refurbished mini-PC from $45, M4 Mac mini, Google Book or Android TV" },
    ],
    cards: [
      {
        slug: "les-mills-cinema",
        target: "Les Mills Cinema & Les Mills Virtual",
        badge: "Premium Royalties vs Open Playout",
        image: "/images/hardware/geekom-it13-max-cutout.webp",
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
        image: "/images/BaamixInspector.webp",
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
        image: "/images/FirefoxBaamix.webp",
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
        image: "/images/hardware/tv-google-tv-streamer-cutout.webp",
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
    matrixTitle: "Executive Matrix: Bobine vs Market Solutions",
    matrixHeaders: ["Operational Criterion", "Bobine (AGPL-3.0)", "Les Mills / Franchises", "Wexer / FOD (Cloud SaaS)", "Digital Signage"],
    matrixRows: [
      {
        label: "Recurring monthly cost",
        bobine: "$0 / month (Perpetual)",
        col2: "$150 to $400 / month / studio",
        col3: "$200 to $450 / month / screen",
        col4: "$0 to $80 / month / screen",
      },
      {
        label: "100% offline operation",
        bobine: "Yes (Autonomous local SSD)",
        col2: "Periodic DRM check required",
        col3: "Cloud stream dependent",
        col4: "Partial (local loop)",
      },
      {
        label: "Video catalog freedom",
        bobine: "100% open (MP4, MKV, subtitles)",
        col2: "Locked publisher catalog",
        col3: "Closed proprietary catalog",
        col4: "Open but no class scheduler",
      },
      {
        label: "Touch kiosk & Dual HDMI display",
        bobine: "Included (/grid + /cinema + /kiosk)",
        col2: "Dedicated proprietary hardware",
        col3: "Paid proprietary tablet",
        col4: "No (passive playback)",
      },
      {
        label: "24/7 Radio & Voice announcements",
        bobine: "Included with audio ducking",
        col2: "Not included",
        col3: "Not included",
        col4: "Not included",
      },
      {
        label: "Supported hardware",
        bobine: "PC, M1-M4 Mac, Linux, Android TV, Tablet",
        col2: "Locked / certified hardware",
        col3: "Locked proprietary box",
        col4: "Raspberry Pi / Signage player",
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

  return (
    <div className="cmp-hub">
      {/* 1. En-tête Hero Apple Glassmorphism structuré */}
      <header className="cmp-header-1 cmp-hub__header">
        <div className="cmp-div-8">
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

        <h1 className="cmp-h1-1">
          {data.title}
        </h1>

        <p className="cmp-p-1">
          {data.subtitle}
        </p>
      </header>

      {/* 2. Bandeau Chiffres Clés (KPIs) */}
      <div className="cmp-div-2">
        {data.kpis.map((kpi) => (
          <div key={kpi.label} className="cmp-div-3">
            <span className="cmp-span-1">{kpi.label}</span>
            <div className="cmp-div-4">{kpi.value}</div>
            <p className="cmp-p-2">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* 3. Bandeau Visuel Multi-Plateforme */}
      <section className="cmp-showcase-banner" aria-label={isEn ? "Multi-platform architecture" : "Architecture multi-plateforme"}>
        <div className="cmp-showcase-banner__content">
          <span className="cmp-span-3">
            {isEn ? "Universal Hardware Sovereignty" : "Souveraineté Matérielle Universelle"}
          </span>
          <h2 className="cmp-h2-3">
            {isEn
              ? "One open-source playout engine across every device in your gym"
              : "Une seule régie libre compatible avec tout le matériel de votre salle"}
          </h2>
          <p className="cmp-p-7">
            {isEn
              ? "Unlike proprietary systems that lock you into leased hardware, Bobine runs natively on Windows 11/10 (x86-64 & ARM64 Snapdragon), Apple Silicon Macs, 16 Linux distributions, Google Book, Android tablets, and Android TV / Google TV boxes."
              : "Contrairement aux solutions propriétaires qui imposent la location d'un boîtier verrouillé, Bobine s'installe nativement sur PC Windows 11/10 (x86-64 et ARM64 Snapdragon), Mac Apple Silicon, 16 distributions Linux, Google Book, tablettes Android et boîtiers Android TV / Google TV."}
          </p>
          <div className="cmp-platform-pills">
            <Link href={lp(locale, "/ordinateur")} className="cmp-platform-pill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/os/windows.svg" alt="" width={16} height={16} />
              <span>{isEn ? "PC & Mac" : "Ordinateur (PC & Mac)"}</span>
            </Link>
            <Link href={lp(locale, "/linux")} className="cmp-platform-pill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/os/linux.svg" alt="" width={16} height={16} />
              <span>Linux (.deb, .rpm, pacman)</span>
            </Link>
            <Link href={lp(locale, "/google-book")} className="cmp-platform-pill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/os/android.svg" alt="" width={16} height={16} />
              <span>{isEn ? "Google Book & Tablets" : "Google Book & Tablettes"}</span>
            </Link>
            <Link href={lp(locale, "/android-tv")} className="cmp-platform-pill">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/os/android.svg" alt="" width={16} height={16} />
              <span>Android TV & Google TV</span>
            </Link>
          </div>
        </div>
        <div className="cmp-showcase-banner__visual">
          <Image
            src="/images/FrameworkBaamix-wide.webp"
            alt={isEn ? "Bobine running on a laptop with Baamix assistant" : "Bobine exécuté sur un ordinateur portable avec l'assistant Baamix"}
            width={640}
            height={360}
            className="cmp-showcase-banner__img"
            priority
          />
        </div>
      </section>

      {/* 4. Grille Bento 2x2 des 4 études comparatives */}
      <div className="cmp-div-9">
        {data.cards.map((card) => (
          <article key={card.slug} className="cmp-article-2">
            <div>
              <div className="cmp-card-visual">
                <Image
                  src={card.image}
                  alt={card.target}
                  width={480}
                  height={240}
                  className="cmp-card-visual__img"
                />
                <span className="cmp-card-visual__icon">
                  <CardIcon slug={card.slug} />
                </span>
              </div>

              <span className="cmp-span-3">{card.badge}</span>

              <h2 className="cmp-h2-3">{card.target}</h2>

              <p className="cmp-p-6">{card.headline}</p>

              <p className="cmp-p-7">{card.description}</p>

              <ul className="cmp-ul-1">
                {card.points.map((pt, pIdx) => (
                  <li key={pIdx} className="cmp-li-1">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cmp-svg-1" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
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
              <span>{isEn ? "Read full comparison" : "Lire le comparatif complet"}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </article>
        ))}
      </div>

      {/* 5. Matrice de Synthèse Globale */}
      <section className="cmp-section-1 cmp-hub__matrix">
        <h2 className="cmp-h2-1">{data.matrixTitle}</h2>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                {data.matrixHeaders.map((h, i) => (
                  <th key={h} scope="col" className={i === 1 ? "col-bobine" : undefined}>
                    <strong>{h}</strong>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.matrixRows.map((row) => (
                <tr key={row.label}>
                  <td className="cell-feature">{row.label}</td>
                  <td className="cell-bobine">
                    <div className="cell-bobine-content">
                      <svg className="icon-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <strong>{row.bobine}</strong>
                    </div>
                  </td>
                  <td className="cell-proprietary">{row.col2}</td>
                  <td className="cell-proprietary">{row.col3}</td>
                  <td className="cell-proprietary">{row.col4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Calculateur de ROI interactif */}
      <div className="cmp-section-1">
        <RoiCalculator locale={locale as Locale} />
      </div>

      {/* 7. Bloc CTA Matériel & Documentation */}
      <section className="cmp-section-4 cmp-hub__cta">
        <h2 className="cmp-h2-2">
          {isEn
            ? "Ready to equip your studio with zero recurring fees?"
            : "Prêt à équiper votre salle sans abonnement récurrent ?"}
        </h2>
        <p className="cmp-p-5">
          {isEn
            ? "Explore our verified hardware guide (mini-PCs, Apple Silicon Macs, tablets, Android TV boxes) or follow the 15-minute installation guide."
            : "Découvrez nos fiches matériel vérifiées (mini-PC, Mac Apple Silicon, tablettes, box Android TV) ou suivez notre guide d'installation en 15 minutes."}
        </p>
        <div className="cmp-div-6">
          <Link href={lp(locale, "/materiel/aliexpress")} className="btn-primary">
            {isEn ? "Recommended Hardware" : "Matériel Recommandé"}
          </Link>
          <Link href={lp(locale, "/ordinateur")} className="btn-secondary">
            {isEn ? "PC & Mac Compatibility" : "Compatibilité PC & Mac"}
          </Link>
          <Link href={`/${locale}/documentation`} className="btn-secondary">
            {isEn ? "Installation Guide" : "Guide d'Installation"}
          </Link>
        </div>
      </section>
    </div>
  );
}
