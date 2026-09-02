import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import RoiCalculator from "@/components/RoiCalculator";
import ShareButton from "@/components/ShareButton";

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
          criterion: "Contrôle Automatisé des Écrans",
          bobine: "HDMI-CEC natif (Allumage 2 min avant, veille post-cours)",
          competitor: "Selon boîtiers propriétaires",
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
        text: "Bobine casse cette dépendance. En installant Debian 13 et Bobine sur un mini PC reconditionné bon marché (type Dell Wyse 5070 à 45 € ou HP EliteDesk 705 à 65 €), vous disposez d'une régie vidéo de niveau professionnel. Vous importez vos propres vidéos de cours en MP4 ou MKV, organisez vos grilles horaires à la seconde près, et pilotez automatiquement l'allumage des téléviseurs de la salle par HDMI-CEC.",
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
          criterion: "Automated TV Screen Control",
          bobine: "Native HDMI-CEC (Turn on 2 min before, standby post-class)",
          competitor: "Varies by proprietary appliance",
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
        text: "Bobine eliminates recurring costs entirely. By installing Debian 13 and Bobine on an affordable refurbished mini PC (such as a Dell Wyse 5070 for $45 or an HP EliteDesk 705 for $65), you unlock an enterprise-grade video playout engine. Import standard MP4 or MKV videos, schedule timetable slots with second-precision, and control TV power via native HDMI-CEC.",
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

  return (
    <>
      {/* En-tête */}
      <header style={{ paddingTop: "1rem", paddingBottom: "2rem", maxWidth: "860px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          <span className="feature-category-label">{c.badge}</span>
          <ShareButton
            locale={locale as Locale}
            pathname="/comparatif/les-mills-cinema"
            title={c.title}
            description={c.subtitle}
          />
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, marginTop: "0.5rem", marginBottom: "1rem", color: "var(--text-heading)", lineHeight: 1.2 }}>
          {c.title}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {c.subtitle}
        </p>
      </header>

      {/* Cartes Chiffres Clés */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        {c.summaryCards.map((sc, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              {sc.label}
            </span>
            <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "var(--accent-primary)", margin: "0.35rem 0" }}>
              {sc.value}
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-body)", margin: 0 }}>
              {sc.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tableau Comparatif */}
      <section style={{ marginBottom: "3.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "1.25rem" }}>
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
      <section style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3.5rem", maxWidth: "860px" }}>
        {c.sections.map((sec, sIdx) => (
          <article key={sIdx} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "0.85rem", padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.75rem" }}>
              {sec.title}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-body)", lineHeight: 1.65, margin: 0 }}>
              {sec.text}
            </p>
          </article>
        ))}
      </section>

      {/* Simulateur d'Économies & Calculateur de ROI */}
      <div style={{ marginBottom: "3.5rem" }}>
        <RoiCalculator locale={locale as Locale} />
      </div>

      {/* Bloc CTA */}
      <section style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "1rem", padding: "2.5rem 2rem", textAlign: "center", maxWidth: "860px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "0.75rem" }}>
          {c.cta.title}
        </h2>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: "600px", margin: "0 auto 1.5rem auto" }}>
          {c.cta.desc}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/${locale}/documentation`} className="btn-primary">
            {c.cta.btnInstall}
          </Link>
          <Link href={`/${locale}/fonctionnalites`} className="btn-secondary">
            {c.cta.btnFeatures}
          </Link>
        </div>
      </section>
    </>
  );
}
