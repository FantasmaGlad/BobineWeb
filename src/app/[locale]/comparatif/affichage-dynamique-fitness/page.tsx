import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
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
    pathname: "/comparatif/affichage-dynamique-fitness",
    title: isEn
      ? "Bobine vs Anthias (Screenly OSE) & Digital Signage (TouchPlayer, Waves, Yodeck)"
      : "Bobine face à Anthias (Screenly OSE) & l'Affichage Dynamique (TouchPlayer, Waves, Yodeck)",
    description: isEn
      ? "Why Screenly Anthias and generic digital signage players fail in gym environments. Compare scheduled class playout, member touch kiosk, coach mobile remote, and 24/7 background radio."
      : "Pourquoi Anthias (Screenly OSE) et les afficheurs passifs ne conviennent pas aux salles de sport. Comparatif planning de cours, borne tactile adhérent, télécommande coach QR code et radio 24/7.",
    keywords: [
      "Alternative Anthias",
      "Alternative Screenly Anthias",
      "Alternative Screenly OSE",
      "Anthias digital signage fitness",
      "Affichage dynamique salle de sport",
      "Alternative TouchPlayer Fitness",
      "Alternative Waves System fitness",
      "Alternative Yodeck salle de sport",
      "Alternative Xibo fitness",
      "Régie vidéo fitness vs Anthias",
      "Borne tactile cours de sport",
      "Bobine vs Anthias",
    ],
  });
}

const CONTENT = {
  fr: {
    breadcrumb: "Comparatifs / Anthias & Affichage Dynamique Fitness",
    badge: "Étude Métier & Matériel",
    title: "Bobine face à Anthias (Screenly OSE) & l'Affichage Dynamique",
    subtitle:
      "Pourquoi Anthias (ex-Screenly OSE), TouchPlayer, Waves System ou Yodeck sont insuffisants pour piloter une vraie salle de fitness ?",
    summaryCards: [
      { label: "Planification", value: "Cours Programmés", desc: "Lecture automatique à l'heure planifiée, pas une boucle" },
      { label: "Borne Adhérents", value: "Kiosque Tactile", desc: "Sélection à la demande avec compte à rebours" },
      { label: "Contrôle Coach", value: "QR Code Local", desc: "Télécommande smartphone sans installer d'app" },
      { label: "Radio Plateau", value: "24/7 avec Fondu", desc: "Crossfade continu et annonces vocales" },
    ],
    table: {
      title: "Régie Métier Bobine vs Anthias & Afficheurs Standards",
      headers: ["Fonctionnalité Métier Fitness", "Bobine (Régie Fitness Dédiée)", "Anthias & Affichage Dynamique"],
      rows: [
        {
          criterion: "Planning Hebdomadaire de Cours Programmés",
          bobine: "Oui (Lecture automatique à l'heure planifiée, à la seconde près)",
          competitor: "Non (Simple boucle de diaporama ou de vidéos sans horaire)",
        },
        {
          criterion: "Borne Tactile Adhérents à la Demande",
          bobine: "Interface tactile plein écran avec décompte inter-cours",
          competitor: "Non (Boucle vidéo passive non interactive)",
        },
        {
          criterion: "Télécommande Coach Mobile par QR Code",
          bobine: "Scan instantané sur le Wi-Fi local sans application",
          competitor: "Non (Gestion uniquement via dashboard admin)",
        },
        {
          criterion: "Télécommandes Physiques USB 2.4 GHz",
          bobine: "Support clavier HID plug-and-play immédiat",
          competitor: "Non pris en charge",
        },
        {
          criterion: "Radio d'Ambiance 24/7 avec Annonces Vocales",
          bobine: "Intégrée avec fondu Web Audio et rappels de bienséance",
          competitor: "Non (Lecteur vidéo / image uniquement)",
        },
        {
          criterion: "Décodage Matériel Haute Performance (VA-API)",
          bobine: "< 8% CPU en 1080p60 sur mini PC standard Intel/AMD",
          competitor: "Variable selon players (Saccades fréquentes)",
        },
        {
          criterion: "Coût Mensuel Récurrent",
          bobine: "0 € / mois (Licence libre AGPL-3.0)",
          competitor: "Souvent un abonnement par écran connecté (selon l'offre)",
        },
      ],
    },
    sections: [
      {
        title: "1. La différence fondamentale entre affichage passif et régie active",
        text: "Un logiciel d'affichage dynamique traditionnel (comme Yodeck, Screenly ou Xibo) est conçu pour faire tourner en boucle des images publicitaires, des menus de restaurant ou des vidéos simples. Il ne comprend pas la logique d'une salle de sport : démarrer une séance à la seconde près, allumer l'écran deux minutes avant pour accueillir les participants, et laisser les membres choisir leur cours entre deux créneaux.",
      },
      {
        title: "2. Une gestion complète de la chaîne visuelle et sonore",
        text: "Bobine ne se contente pas d'afficher des vidéos : il prend en charge la sonorisation du plateau grâce à son module Radio 24/7. Le fondu enchaîné (crossfade) élimine les blancs sonores inconfortables, et les annonces programmées rappellent automatiquement les règles de bienséance (remise en place des haltères, serviette obligatoire, avertissement de fermeture).",
      },
      {
        title: "3. Robustesse matérielle et reprise sur incident",
        text: "Les lecteurs d'affichage génériques sur Raspberry Pi ou clés HDMI grand public plantent régulièrement lors de coupures réseau ou électriques. Bobine est conçu pour tourner sur des mini PC professionnels Debian 13 avec supervision continue par chien de garde (systemd watchdog). Même après un arrêt brutal, le système redémarre et reprend son planning en totale autonomie.",
      },
    ],
    cta: {
      title: "Installez une véritable régie fitness autonome",
      desc: "Découvrez la simplicité de déploiement de Bobine et donnez vie à vos écrans de salle sans frais mensuels.",
      btnInstall: "Démarrage rapide Debian",
      btnFeatures: "Explorer toutes les fonctionnalités",
    },
  },
  en: {
    breadcrumb: "Comparisons / Anthias & Gym Digital Signage",
    badge: "Hardware & Vertical Analysis",
    title: "Bobine vs Anthias (Screenly OSE) & Digital Signage",
    subtitle:
      "Why Anthias (formerly Screenly OSE), TouchPlayer, Waves System, or Yodeck fail to meet the operational demands of fitness studios?",
    summaryCards: [
      { label: "Scheduling", value: "Scheduled Classes", desc: "Auto playout at the exact scheduled time, not a loop" },
      { label: "Member Kiosk", value: "Touchscreen Ready", desc: "On-demand class selection with countdown timer" },
      { label: "Coach Remote", value: "Local QR Code", desc: "Smartphone control with no app installation" },
      { label: "Gym Radio", value: "24/7 Crossfade", desc: "Continuous music and automated voice alerts" },
    ],
    table: {
      title: "Gym Playout vs Anthias & Generic Signage",
      headers: ["Fitness Operational Feature", "Bobine (Dedicated Gym Playout)", "Anthias & Generic Digital Signage"],
      rows: [
        {
          criterion: "Weekly Scheduled Class Timetable",
          bobine: "Yes (Auto playout at the exact scheduled second)",
          competitor: "No (Plain slideshow or video loop with no timetable)",
        },
        {
          criterion: "Member On-Demand Touchscreen Kiosk",
          bobine: "Fullscreen touch interface with interval countdown",
          competitor: "No (Passive video looping only)",
        },
        {
          criterion: "Coach Mobile Remote via QR Code",
          bobine: "Instant local Wi-Fi scan with no mobile app needed",
          competitor: "No (Managed solely through desktop dashboard)",
        },
        {
          criterion: "2.4 GHz USB Wireless Hardware Remotes",
          bobine: "Plug-and-play HID keyboard input supported natively",
          competitor: "Not supported",
        },
        {
          criterion: "24/7 Background Music & Voice Reminders",
          bobine: "Built-in with Web Audio crossfade & etiquette alerts",
          competitor: "No (Video/Image playback only)",
        },
        {
          criterion: "Hardware Acceleration (VA-API)",
          bobine: "< 8% CPU in 1080p60 on standard Intel/AMD mini PCs",
          competitor: "Variable by player hardware (Frequent stuttering)",
        },
        {
          criterion: "Monthly Subscription per Display",
          bobine: "$0 / month (Free AGPL-3.0)",
          competitor: "Often a subscription per connected screen (depends on the offer)",
        },
      ],
    },
    sections: [
      {
        title: "1. The Fundamental Gap: Passive Looping vs Active Gym Automation",
        text: "Generic digital signage platforms (such as Yodeck, Screenly, or Xibo) are designed to loop restaurant menus, corporate billboards, or promo slides. They lack gym intelligence: triggering workouts at the exact second, waking up TV displays before class, and allowing members to self-select on-demand sessions between scheduled slots.",
      },
      {
        title: "2. Comprehensive Audio and Video Environment",
        text: "Bobine orchestrates both screen visuals and studio audio. Its 24/7 Gym Radio module features seamless track crossfading to eliminate awkward silence, along with scheduled voice announcements to remind members about gym etiquette (re-racking weights, towel usage, closing warnings).",
      },
      {
        title: "3. Hardware Resilience and Auto-Recovery",
        text: "Generic signage players running on consumer TV sticks or micro-controllers often crash during power fluctuations or network drops. Bobine runs on durable x86-64 mini PCs powered by Debian 13, supervised 24/7 by a systemd watchdog that recovers playout instantly after unexpected blackouts.",
      },
    ],
    cta: {
      title: "Equip your gym with an autonomous playout suite",
      desc: "Experience Bobine's streamlined deployment and transform your studio displays with zero recurring costs.",
      btnInstall: "Installation Guide",
      btnFeatures: "Explore All Features",
    },
  },
} as const;

export default async function SignageComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = CONTENT[locale as Locale];
  const isEn = locale === "en";
  const breadcrumbs = [
    { name: isEn ? "Home" : "Accueil", url: `/${locale}` },
    { name: isEn ? "Comparisons" : "Comparatifs", url: lp(locale, `/comparatif`) },
    { name: isEn ? "Anthias & Digital Signage" : "Anthias & Affichage Dynamique", url: lp(locale, `/comparatif/affichage-dynamique-fitness`) },
  ];

  const faqItems = [
    {
      category: "compare" as const,
      q: isEn
        ? "Why is Anthias (Screenly OSE) not adapted for fitness club studios?"
        : "Pourquoi Anthias (Screenly OSE) n'est-il pas adapté aux studios de fitness ?",
      a: isEn
        ? "Anthias is a digital signage slideshow/loop player, not a dedicated gym video playout system. It lacks weekly class schedule automation at fixed times, member interactive touch kiosk selection, countdown timers between classes, coach smartphone control, and 24/7 background audio radio."
        : "Anthias est un afficheur d'écrans passif en boucle, pas une régie vidéo de fitness. Il ne gère ni le planning hebdomadaire de cours automatisé à heure fixe, ni la borne tactile à la demande pour les adhérents, ni le décompte inter-cours, ni la télécommande coach sur smartphone, ni la radio d'ambiance 24/7.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Can Bobine replace proprietary systems like TouchPlayer, Waves System or Yodeck?"
        : "Bobine peut-il remplacer des systèmes comme TouchPlayer, Waves System ou Yodeck ?",
      a: isEn
        ? "Yes. Bobine provides the same touch kiosk interactivity, class scheduling, and audio/video playout as proprietary gym appliances, but with zero recurring SaaS subscription, zero vendor lock-in, and 100% offline local autonomy on standard refurbished mini PCs."
        : "Oui. Bobine apporte la même interactivité tactile, la planification de cours et la diffusion audiovisuelle que les bornes propriétaires, mais sans abonnement mensuel récurrent, sans dépendance commerciale et avec une autonomie 100% locale sur mini PC standard reconditionné.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "How does coach mobile remote control work without installing an application?"
        : "Comment fonctionne la télécommande mobile du coach sans installer d'application ?",
      a: isEn
        ? "Bobine runs a local web server on your club LAN. The coach scans a QR code displayed on the screen or enters the local IP address on their smartphone to control playback (play, pause, seek, volume, visual ambiances) directly in the mobile browser."
        : "Bobine intègre son propre serveur web local. Le coach scanne un QR code affiché à l'écran ou tape l'adresse IP locale sur son smartphone pour piloter la séance (lecture, pause, recherche, volume, ambiances) directement dans son navigateur web.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Does Bobine support physical remote controls and USB gamepads?"
        : "Bobine fonctionne-t-il avec des télécommandes physiques et des manettes USB ?",
      a: isEn
        ? "Yes. Bobine natively supports standard 2.4 GHz wireless presentation remotes (space/arrows keyboard emulation) and USB/Bluetooth gamepads (Xbox, PlayStation, 8BitDo) via the HTML5 Gamepad API for effortless studio operation."
        : "Oui. Bobine prend en charge nativement les télécommandes sans fil 2.4 GHz de présentation (touches clavier Espace/Flèches) et les manettes USB/Bluetooth (Xbox, PlayStation, 8BitDo) via l'API HTML5 Gamepad.",
    },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <FaqJsonLd items={faqItems} />

      {/* En-tête */}
      <header className="cmp-header-1">
        <div className="cmp-div-1"
        >
          <span className="feature-category-label">{c.badge}</span>
          <ShareButton
            locale={locale as Locale}
            pathname="/comparatif/affichage-dynamique-fitness"
            title={c.title}
            description={c.subtitle}
          />
        </div>
        <h1 className="cmp-h1-1">
          {c.title}
        </h1>
        <p className="cmp-p-1">
          {c.subtitle}
        </p>
      </header>

      {/* Cartes Chiffres Clés */}
      <div className="cmp-div-2">
        {c.summaryCards.map((sc, idx) => (
          <div
            key={idx} className="cmp-div-3"
          >
            <span className="cmp-span-1">
              {sc.label}
            </span>
            <div className="cmp-div-4">
              {sc.value}
            </div>
            <p className="cmp-p-2">
              {sc.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tableau Comparatif */}
      <section className="cmp-section-1">
        <h2 className="cmp-h2-1">
          {c.table.title}
        </h2>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-feature">{c.table.headers[0]}</th>
                <th scope="col" className="col-bobine">
                  <strong>{c.table.headers[1]}</strong>
                  <span>{isEn ? "Specialized Fitness Playout" : "Régie Fitness Dédiée"}</span>
                </th>
                <th scope="col" className="col-proprietary">
                  <strong>{c.table.headers[2]}</strong>
                  <span>{isEn ? "Generic Signage Players" : "Afficheurs Standard"}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {c.table.rows.map((r, rIdx) => (
                <tr key={rIdx}>
                  <td className="cell-feature">{r.criterion}</td>
                  <td className="cell-bobine">
                    <div className="cell-bobine-content">
                      <svg className="icon-check" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <strong>{r.bobine}</strong>
                    </div>
                  </td>
                  <td className="cell-proprietary">{r.competitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sections d'analyse textuelle */}
      <section className="cmp-section-2">
        {c.sections.map((sec, sIdx) => (
          <article key={sIdx} className="cmp-article-1">
            <h3 className="cmp-h3-1">
              {sec.title}
            </h3>
            <p className="cmp-p-3">
              {sec.text}
            </p>
          </article>
        ))}
      </section>

      {/* Foire Aux Questions (FAQ) — visible pour l'utilisateur & Rich Results Google */}
      <section className="cmp-section-3">
        <h2 className="cmp-h2-1">
          {isEn ? "Frequently Asked Questions" : "Questions Fréquentes"}
        </h2>
        <div className="cmp-div-5">
          {faqItems.map((item, idx) => (
            <details
              key={idx} className="cmp-details-1"
            >
              <summary className="cmp-summary-1"
              >
                {item.q}
              </summary>
              <p className="cmp-p-4"
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Bloc CTA */}
      <section className="cmp-section-4">
        <h2 className="cmp-h2-2">
          {c.cta.title}
        </h2>
        <p className="cmp-p-5">
          {c.cta.desc}
        </p>
        <div className="cmp-div-6">
          <Link href={`/${locale}/documentation`} className="btn-primary">
            {c.cta.btnInstall}
          </Link>
          <Link href={lp(locale, `/fonctionnalites`)} className="btn-secondary">
            {c.cta.btnFeatures}
          </Link>
        </div>
      </section>
    </>
  );
}
