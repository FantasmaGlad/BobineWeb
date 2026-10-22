import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import RoiCalculator from "@/components/RoiCalculator";
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
    pathname: "/comparatif/les-mills-cinema",
    title: isEn
      ? "Alternative to Les Mills Cinema & Virtual — Free Open-Source Gym Playout"
      : "Alternative à Les Mills Cinema & Virtual — Régie Vidéo Libre & Sans Abonnement pour Salle de Sport",
    description: isEn
      ? "Detailed comparison between Les Mills Cinema / Virtual and Bobine. Discover how to save $1,500 to $3,600 per year per studio, maintain 100% offline autonomy, and free your gym from recurring licensing fees."
      : "Comparatif complet entre Les Mills Cinema / Virtual et Bobine. Économisez 1 500 € à 3 600 € par an et par studio, gagnez une autonomie 100% hors-ligne et libérez votre salle des redevances par programme.",
    keywords: [
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Les Mills sans abonnement",
      "Prix Les Mills Cinema",
      "Tarif licence Les Mills salle de sport",
      "Alternative The Trip Les Mills",
      "Logiciel cours virtuels fitness",
      "Régie vidéo cycling indoor",
      "Bobine vs Les Mills",
    ],
  });
}

const CONTENT = {
  fr: {
    breadcrumb: "Comparatifs / Les Mills Cinema",
    badge: "Étude Comparative",
    title: "Bobine face à Les Mills Cinema & Les Mills Virtual",
    subtitle:
      "Pourquoi payer des redevances mensuelles par programme et subir des contraintes matérielles lourdes quand une régie libre auto-hébergée offre une autonomie totale à coût nul ?",
    summaryCards: [
      { label: "Économie Annuelle", value: "1 500 € à 3 600 €", desc: "Par studio chaque année" },
      { label: "Coût Logiciel Bobine", value: "0 € / mois", desc: "Licence libre perpétuelle AGPL-3.0" },
      { label: "Matériel Requis", value: "~40-70 €", desc: "Mini PC reconditionné standard" },
      { label: "Résilience Réseau", value: "100% Hors-ligne", desc: "Zéro coupure en cas de panne internet" },
    ],
    table: {
      title: "Tableau Comparatif Détaillé",
      headers: ["Critère d'Évaluation", "Bobine (Open-Source)", "Les Mills Cinema / Virtual"],
      rows: [
        {
          criterion: "Modèle Économique & Licences",
          bobine: "0 € / mois (Licence AGPL-3.0 sans frais cachés)",
          competitor: "150 € à 350 € / mois par programme cumulé",
        },
        {
          criterion: "Coût de Formation Coachs",
          bobine: "0 € (Vos coachs animent librement)",
          competitor: "479 € à 529 € HT par coach et par module",
        },
        {
          criterion: "Investissement Matériel (CAPEX)",
          bobine: "40 € à 70 € (Mini PC reconditionné standard)",
          competitor: "Élevé (Écrans géants certifiés, projecteurs pro imposés)",
        },
        {
          criterion: "Dépendance Réseau & Cloud",
          bobine: "100% Hors-ligne (Stockage SSD local, zéro DRM cloud)",
          competitor: "Dépendance internet (Coupures si le serveur distant ne répond pas)",
        },
        {
          criterion: "Liberté du Catalogue Vidéo",
          bobine: "Liberté totale (Cycling, HIIT, Yoga, Pilates, cours maison)",
          competitor: "Verrouillé aux sorties trimestrielles de l'éditeur",
        },
        {
          criterion: "Résilience & Redémarrage Automatique",
          bobine: "Chien de garde intégré : reprise instantanée après coupure secteur ou plantage",
          competitor: "Dépend du support technique et de la connexion au serveur distant",
        },
        {
          criterion: "Borne Adhérent à la Demande",
          bobine: "Borne tactile plein écran avec décompte inter-cours",
          competitor: "Borne propriétaire fermée ou option payante",
        },
        {
          criterion: "Radio d'Ambiance & Plateau",
          bobine: "Radio 24/7 intégrée avec fondu enchaîné et annonces vocales",
          competitor: "Non inclus (Nécessite un abonnement de musique tiers)",
        },
      ],
    },
    sections: [
      {
        title: "1. La réalité du modèle Les Mills : l'empilement des coûts",
        text: "Le modèle économique Les Mills repose sur une facturation à la carte par programme. Si votre salle souhaite proposer du BodyPump, du RPM et The Trip en virtuel, vous devez cumuler trois redevances mensuelles distinctes. À cela s'ajoute le coût récurrent des formations : chaque nouvel instructeur doit être certifié (environ 500 € HT par module) pour conserver les droits d'animation. Sur 3 ans d'exploitation, l'addition pour un seul studio dépasse couramment les 10 000 €.",
      },
      {
        title: "2. L'alternative souveraine : Bobine sur mini PC standard",
        text: "Bobine casse cette dépendance. Installez-le en 1 clic sur un PC Windows ou Mac existant, ou sur un mini PC reconditionné bon marché (type Dell Wyse 5070 à 45 € ou HP EliteDesk 705 à 65 €) : vous disposez d'une régie vidéo de niveau professionnel. Vous importez vos propres vidéos de cours en MP4 ou MKV, organisez vos grilles horaires à la seconde près, et le système reprend automatiquement après chaque coupure de courant, sans intervention.",
      },
      {
        title: "3. Résilience 100% Hors-ligne : zéro écran noir en plein cours",
        text: "Contrairement aux solutions cloud qui vérifient leurs droits DRM en permanence et coupent la diffusion lors d'un incident de box internet, Bobine stocke tous les médias sur le disque SSD local. Le système démarre automatiquement à la mise sous tension de la salle, reprend instantanément après une coupure secteur et fonctionne parfaitement même en l'absence totale de connexion internet.",
      },
    ],
    cta: {
      title: "Prêt à équiper votre salle sans abonnement ?",
      desc: "Suivez notre tutoriel d'installation pas-à-pas pour transformer votre mini PC en régie vidéo autonome en moins de 15 minutes.",
      btnInstall: "Tutoriel d'installation rapide",
      btnFeatures: "Voir toutes les fonctionnalités",
    },
  },
  en: {
    breadcrumb: "Comparisons / Les Mills Cinema",
    badge: "Comparative Analysis",
    title: "Bobine vs Les Mills Cinema & Les Mills Virtual",
    subtitle:
      "Why pay recurring royalties per fitness program when an open-source self-hosted playout engine delivers full studio autonomy with zero monthly fees?",
    summaryCards: [
      { label: "Annual Savings", value: "$1,500 to $3,600", desc: "Per studio every year" },
      { label: "Bobine Software License", value: "$0 / month", desc: "Perpetual AGPL-3.0 open source" },
      { label: "Hardware Investment", value: "~$40-70", desc: "Standard refurbished mini PC" },
      { label: "Network Resilience", value: "100% Offline", desc: "Zero playback freezes on internet loss" },
    ],
    table: {
      title: "Comprehensive Breakdown",
      headers: ["Evaluation Metric", "Bobine (Open-Source)", "Les Mills Cinema / Virtual"],
      rows: [
        {
          criterion: "Business Model & Licensing",
          bobine: "$0 / month (Perpetual AGPL-3.0, zero hidden fees)",
          competitor: "$150 to $350 / month per cumulative program",
        },
        {
          criterion: "Instructor Certification Cost",
          bobine: "$0 (Your staff teaches freely)",
          competitor: "$500+ per coach per module",
        },
        {
          criterion: "Hardware CAPEX",
          bobine: "$40 to $70 (Standard refurbished mini PC)",
          competitor: "Heavy CAPEX (Certified projectors & screens required)",
        },
        {
          criterion: "Network & Cloud Dependency",
          bobine: "100% Offline (Local SSD storage, zero cloud DRM checks)",
          competitor: "Cloud dependent (Freezes if internet drops)",
        },
        {
          criterion: "Video Content Freedom",
          bobine: "Full freedom (Indoor cycling, HIIT, yoga, custom workouts)",
          competitor: "Locked to quarterly releases from provider",
        },
        {
          criterion: "Resilience & Automatic Recovery",
          bobine: "Built-in watchdog: instant resume after a power cut or crash",
          competitor: "Depends on tech support and remote server connectivity",
        },
        {
          criterion: "Member On-Demand Kiosk",
          bobine: "Fullscreen touch kiosk with countdown timer",
          competitor: "Closed hardware or paid add-on",
        },
        {
          criterion: "24/7 Background Gym Audio",
          bobine: "Integrated 24/7 radio with crossfade & voice reminders",
          competitor: "Not included (Requires separate audio subscription)",
        },
      ],
    },
    sections: [
      {
        title: "1. The True Cost of Les Mills: Cumulative Royalties",
        text: "Les Mills charges clubs on a per-program basis. Offering BodyPump, RPM, and The Trip virtually requires stacking three separate monthly subscriptions. Furthermore, instructor turnover forces operators to pay around $500 per new certification to maintain official teaching status. Over a 3-year period, operating a single studio often exceeds $10,000 in software and training overhead.",
      },
      {
        title: "2. The Sovereign Alternative: Bobine on Budget Mini PCs",
        text: "Bobine eliminates recurring costs entirely. Install it in one click on an existing Windows or Mac computer, or on an affordable refurbished mini PC (such as a Dell Wyse 5070 for $45 or an HP EliteDesk 705 for $65), and unlock an enterprise-grade video playout engine. Import standard MP4 or MKV videos, schedule timetable slots with second-precision, and let the system resume automatically after every power cut, with no intervention.",
      },
      {
        title: "3. 100% Offline Resilience: Never Face Black Screens",
        text: "Unlike cloud platforms that constantly check DRM rights and freeze during ISP outages, Bobine plays all media directly from the local solid-state drive. The system boots automatically at gym opening, recovers autonomously after blackouts, and operates smoothly even without an active internet connection.",
      },
    ],
    cta: {
      title: "Ready to equip your studio without recurring fees?",
      desc: "Follow our step-by-step installation guide to transform your mini PC into an autonomous video playout hub in under 15 minutes.",
      btnInstall: "Quick Start Guide",
      btnFeatures: "Explore All Features",
    },
  },
} as const;

export default async function LesMillsComparisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = CONTENT[locale as Locale];
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "Comparisons" : "Comparatifs", url: lp(locale, `/comparatif`) },
    { name: isEn ? "Alternative to Les Mills Cinema" : "Alternative Les Mills Cinema", url: lp(locale, `/comparatif/les-mills-cinema`) },
  ];

  const faqItems = [
    {
      category: "compare" as const,
      q: isEn
        ? "Why is Bobine 100% free while Les Mills Cinema costs €150 to €400 per month?"
        : "Pourquoi Bobine est-il 100% gratuit alors que Les Mills Cinema coûte 150 € à 400 € par mois ?",
      a: isEn
        ? "Bobine is open-source software under the copyleft AGPL-3.0 license. There are no software subscription fees or royalties per screen. You own your standard refurbished hardware (mini PC, HDMI TV)."
        : "Bobine est un logiciel libre sous licence AGPL-3.0. Il n'y a aucun abonnement logiciel ni redevance par écran. Vous êtes propriétaire de votre matériel standard (mini PC reconditionné, TV HDMI).",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Can I play custom workout videos and music on Bobine instead of a locked catalog?"
        : "Puis-je diffuser mes propres vidéos d'entraînement et musiques sur Bobine à la place d'un catalogue imposé ?",
      a: isEn
        ? "Yes. Bobine gives you total freedom to upload your own video files (MP4, MKV 1080p60/4K) and audio courses. There is no locked proprietary catalog or mandatory programming."
        : "Oui. Bobine vous donne une liberté totale pour importer vos propres vidéos (MP4, MKV 1080p60/4K) et cours audio. Aucun catalogue verrouillé ou imposé.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "How does Bobine guarantee playback during internet outages?"
        : "Comment Bobine garantit-il la lecture en cas de coupure internet ?",
      a: isEn
        ? "All media files, timetables, and kiosk interfaces run 100% locally from the mini PC's SSD. The system functions entirely offline without any external cloud dependency."
        : "Tous les médias, plannings et interfaces kiosques tournent à 100% en local sur le SSD du mini PC. La salle diffuse ses cours de manière autonome sans aucune dépendance au cloud.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "What hardware is required to replace a Les Mills Cinema kiosk?"
        : "Quel matériel est nécessaire pour remplacer une borne Les Mills Cinema ?",
      a: isEn
        ? "A standard refurbished x86-64 mini PC (such as Dell Wyse 5070 Celeron J4105 or HP EliteDesk 705 ~€40-€80), 4 to 8 GB RAM, and a standard HDMI screen."
        : "Un mini PC x86-64 reconditionné standard (comme un Dell Wyse 5070 Celeron J4105 ou HP EliteDesk 705 ~40-80 €), 4 à 8 Go de RAM et un écran HDMI standard.",
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
            pathname="/comparatif/les-mills-cinema"
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
                  <span>{isEn ? "Open Source & Local" : "Autonomie & Zéro Coût"}</span>
                </th>
                <th scope="col" className="col-proprietary">
                  <strong>{c.table.headers[2]}</strong>
                  <span>{isEn ? "Proprietary SaaS" : "Modèle Propriétaire"}</span>
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

      {/* Simulateur d'Économies & Calculateur de ROI */}
      <div className="cmp-section-1">
        <RoiCalculator locale={locale as Locale} />
      </div>

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
