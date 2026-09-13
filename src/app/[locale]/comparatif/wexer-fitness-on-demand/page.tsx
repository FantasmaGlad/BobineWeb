import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";

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
    pathname: "/comparatif/wexer-fitness-on-demand",
    title: isEn
      ? "Alternative to Wexer Virtual & Fitness On Demand — Sovereign Local-First Playout"
      : "Alternative à Wexer & Fitness On Demand — Régie Vidéo Fitness Locale & Sans Abonnement",
    description: isEn
      ? "Compare Wexer Virtual and Fitness On Demand with Bobine. Eliminate heavy SaaS subscriptions ($200–$450/mo), regain local network sovereignty, and avoid cloud playback latency."
      : "Comparatif complet entre Wexer, Fitness On Demand et Bobine. Supprimez les abonnements SaaS récurrents (200 € à 450 €/mois), gagnez en souveraineté locale et éliminez la latence cloud.",
    keywords: [
      "Alternative Wexer",
      "Alternative Wexer Virtual",
      "Alternative Fitness On Demand",
      "Wexer prix salle de sport",
      "Fitness on demand tarif",
      "Régie vidéo fitness local-first",
      "Affichage dynamique salle de sport sans cloud",
      "Bobine vs Wexer",
    ],
  });
}

const CONTENT = {
  fr: {
    breadcrumb: "Comparatifs / Wexer & Fitness On Demand",
    badge: "Étude SaaS B2B",
    title: "Bobine face à Wexer Virtual & Fitness On Demand",
    subtitle:
      "Pourquoi payer des abonnements mensuels récurrents de 200 € à 450 € par écran alors qu'une architecture locale sans cloud garantit zéro panne et zéro latence ?",
    summaryCards: [
      { label: "Coût Mensuel Récurrent", value: "0 € vs 250 €+", desc: "Économie directe chaque mois par écran" },
      { label: "Architecture", value: "100% Locale", desc: "Zéro dépendance aux serveurs cloud" },
      { label: "Latence Réseau", value: "< 2 ms (LAN)", desc: "WebSockets locaux, sans serveur intermédiaire" },
      { label: "Protection Données", value: "Conforme RGPD", desc: "Zéro collecte, zéro tracker externe" },
    ],
    table: {
      title: "Comparatif Technique & Financier",
      headers: ["Critère d'Évaluation", "Bobine (Local-First)", "Wexer & Fitness On Demand (Cloud SaaS)"],
      rows: [
        {
          criterion: "Abonnement Logiciel par Écran",
          bobine: "0 € / mois (Licence libre AGPL-3.0)",
          competitor: "200 € à 450 € / mois par écran",
        },
        {
          criterion: "Fonctionnement en Cas de Coupure Internet",
          bobine: "100% Opérationnel (Lecture directe sur SSD local)",
          competitor: "Blocage ou mode dégradé (Vérification cloud obligatoire)",
        },
        {
          criterion: "Boîtier / Matériel de Lecture",
          bobine: "Mini PC standard x86-64 (Dell Wyse, HP, Lenovo ~50 €)",
          competitor: "Player propriétaire ou boîtier certifié imposé",
        },
        {
          criterion: "Gestion des Données & Vie Privée",
          bobine: "Zéro télémétrie, zéro cookie, données 100% souveraines",
          competitor: "Collecte de données d'usage et analytics cloud tiers",
        },
        {
          criterion: "Installation Multi-Plateforme",
          bobine: "1 clic sur Windows, macOS et Linux, ou appliance Debian dédiée",
          competitor: "Boîtier certifié imposé par l'éditeur",
        },
        {
          criterion: "Télécommande Coach sans Application",
          bobine: "Scan QR code Wi-Fi local instantané (Web App réactive)",
          competitor: "Application mobile à télécharger ou portail cloud lourd",
        },
        {
          criterion: "Radio Plateau 24/7 & Annonces",
          bobine: "Lecteur musical avec crossfade et annonces vocales inclus",
          competitor: "Non inclus (Service vidéo uniquement)",
        },
      ],
    },
    sections: [
      {
        title: "1. Le piège de la rente SaaS pour les écrans de studio",
        text: "Les acteurs comme Wexer et Fitness On Demand ont bâti leur modèle sur un abonnement mensuel facturé par écran ou par borne. Pour un club disposant de deux studios (un studio cycling et un studio cours collectifs), la facture logicielle atteint rapidement 5 000 € à 9 000 € par an. Cet investissement récurrent ne crée aucune valeur patrimoniale pour la salle : dès que l'abonnement s'arrête, les écrans s'éteignent.",
      },
      {
        title: "2. La puissance du Local-First : zéro latence, zéro coupure",
        text: "En déplaçant l'intégralité du moteur de diffusion sur un mini PC local, Bobine supprime tout intermédiaire cloud. La réactivité des commandes (lancement d'un cours depuis la borne tactile ou la télécommande mobile) s'effectue en moins de 2 millisecondes via WebSockets locaux. Les vidéos 1080p60 et 4K démarrent instantanément sans temps de chargement (buffering).",
      },
      {
        title: "3. Souveraineté totale et conformité RGPD",
        text: "Bobine ne collecte aucune donnée personnelle d'adhérent, n'intègre aucun traceur publicitaire et ne dépend d'aucun serveur distant. Vos plannings, vos vidéos et vos statistiques d'utilisation restent strictement confinés à votre réseau local.",
      },
    ],
    cta: {
      title: "Adoptez une infrastructure locale et économique",
      desc: "Installez Bobine en une ligne de commande sur votre mini PC et reprenez le contrôle complet de vos écrans de diffusion.",
      btnInstall: "Guide d'installation Debian",
      btnFeatures: "Explorer les fonctionnalités",
    },
  },
  en: {
    breadcrumb: "Comparisons / Wexer & Fitness On Demand",
    badge: "B2B SaaS Analysis",
    title: "Bobine vs Wexer Virtual & Fitness On Demand",
    subtitle:
      "Why pay recurring SaaS fees of $200–$450/month per display when local-first architecture delivers zero downtime and sub-2ms latency?",
    summaryCards: [
      { label: "Recurring Software Cost", value: "$0 vs $250+/mo", desc: "Direct monthly savings per screen" },
      { label: "System Architecture", value: "100% Local", desc: "Zero cloud server dependencies" },
      { label: "Network Latency", value: "< 2 ms (LAN)", desc: "Local WebSockets, no middleman server" },
      { label: "Data Protection", value: "GDPR Sovereign", desc: "Zero tracking, zero external telemetry" },
    ],
    table: {
      title: "Technical & Financial Comparison",
      headers: ["Evaluation Metric", "Bobine (Local-First)", "Wexer & Fitness On Demand (Cloud SaaS)"],
      rows: [
        {
          criterion: "Monthly License per Display",
          bobine: "$0 / month (Perpetual AGPL-3.0)",
          competitor: "$200 to $450 / month per screen",
        },
        {
          criterion: "Offline Behavior (Internet Outage)",
          bobine: "100% Functional (Direct playback from local SSD)",
          competitor: "Playback freezes or degraded mode (Cloud verification)",
        },
        {
          criterion: "Media Player Hardware",
          bobine: "Standard x86-64 mini PC (Dell Wyse, HP, Lenovo ~$50)",
          competitor: "Proprietary locked box or certified appliance",
        },
        {
          criterion: "Privacy & Data Sovereignty",
          bobine: "Zero telemetry, zero cookies, 100% private data",
          competitor: "Usage tracking and third-party cloud analytics",
        },
        {
          criterion: "Cross-Platform Installation",
          bobine: "1-click on Windows, macOS and Linux, or a dedicated Debian appliance",
          competitor: "Locked to a vendor-certified box",
        },
        {
          criterion: "Staff Mobile Remote",
          bobine: "Instant local Wi-Fi QR scan (No app download required)",
          competitor: "Mobile app download or heavy cloud portal",
        },
        {
          criterion: "24/7 Background Music & Alerts",
          bobine: "Built-in continuous music player with voice announcements",
          competitor: "Not included (Video playback service only)",
        },
      ],
    },
    sections: [
      {
        title: "1. The Recurring SaaS Tax on Studio Displays",
        text: "Providers like Wexer and Fitness On Demand charge recurring monthly fees per screen or kiosk. Operating two studios (e.g. indoor cycling and group cardio) easily results in $5,000 to $9,000 in annual software expenses. These recurring fees build no equity for the club: once the subscription lapses, the displays go black.",
      },
      {
        title: "2. The Power of Local-First: Zero Latency, Zero Buffer",
        text: "By hosting the entire playout engine on a dedicated in-club mini PC, Bobine eliminates cloud bottlenecks. Triggering a class from the touch kiosk or coach mobile remote takes less than 2 milliseconds over local WebSockets. High-bitrate 1080p60 and 4K video files start playing instantly with zero buffering.",
      },
      {
        title: "3. Complete Privacy & GDPR Compliance",
        text: "Bobine does not collect member data, tracks no external analytics, and requires no remote cloud pinging. Your timetables, media assets, and playback logs remain strictly inside your private local network.",
      },
    ],
    cta: {
      title: "Deploy a sovereign and cost-effective playout stack",
      desc: "Install Bobine in a single command on your mini PC and regain complete control over your studio screens.",
      btnInstall: "Installation Guide",
      btnFeatures: "Explore All Features",
    },
  },
} as const;

export default async function WexerComparisonPage({
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
    { name: isEn ? "Comparisons" : "Comparatifs", url: `/${locale}/comparatif` },
    { name: "Wexer & Fitness On Demand", url: `/${locale}/comparatif/wexer-fitness-on-demand` },
  ];

  const faqItems = [
    {
      category: "compare" as const,
      q: isEn
        ? "How much can a gym save by choosing Bobine over Wexer or Fitness On Demand?"
        : "Combien une salle de sport économise-t-elle en choisissant Bobine plutôt que Wexer ou Fitness On Demand ?",
      a: isEn
        ? "Wexer and Fitness On Demand charge between $200 and $450 per screen every month, representing $2,400 to $5,400 per year per room in software subscriptions alone. Bobine is 100% free open-source software (AGPL-3.0) with zero monthly fees, saving clubs thousands of euros every year."
        : "Wexer et Fitness On Demand facturent entre 200 € et 450 € par écran et par mois, soit 2 400 € à 5 400 € par an et par studio en abonnement logiciel. Bobine est 100% libre et gratuit (licence AGPL-3.0) sans aucun abonnement récurrent, économisant des milliers d'euros chaque année aux clubs.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Why is a local-first architecture superior to cloud streaming for fitness studios?"
        : "Pourquoi une architecture locale est-elle supérieure au streaming cloud pour un club ?",
      a: isEn
        ? "Cloud streaming solutions rely on external servers and high-bandwidth WAN connections. If internet drops or slows down during peak hours, workouts buffer, stutter, or fail completely. Bobine runs all media directly from the local machine's NVMe/SSD with zero cloud latency (< 2 ms LAN WebSockets) and 100% offline resilience."
        : "Les solutions cloud dépendent de serveurs distants et de la bande passante internet. En cas de coupure ou de congestion réseau aux heures de pointe, les cours saccadent ou s'arrêtent. Bobine lit tous les flux directement depuis le SSD local de la borne, avec une latence quasi nulle (< 2 ms via WebSockets LAN) et une continuité 100% hors-ligne.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Can clubs host and broadcast their own custom fitness video content with Bobine?"
        : "Les clubs peuvent-ils diffuser leurs propres contenus vidéo avec Bobine ?",
      a: isEn
        ? "Yes. Unlike Wexer or FOD which lock you into their curated proprietary catalogs, Bobine gives you complete freedom to import your own coach videos, cycling masterclasses, HIIT routines, and visual backgrounds in MP4/MKV up to 4K 60fps."
        : "Oui. Contrairement à Wexer ou FOD qui imposent leurs catalogues propriétaires fermés, Bobine vous laisse libre d'importer vos propres vidéos de coachs, cours de cycling, séances de HIIT et ambiances visuelles en MP4/MKV jusqu'à la 4K 60fps.",
    },
    {
      category: "compare" as const,
      q: isEn
        ? "Is Bobine compliant with privacy and GDPR regulations?"
        : "Bobine est-il conforme au RGPD et au respect de la vie privée ?",
      a: isEn
        ? "Completely. Bobine processes everything strictly within your gym's local area network (LAN). No member viewing habits, no telemetry, and no private data are sent to third-party cloud servers, guaranteeing strict GDPR compliance."
        : "Totalement. Bobine s'exécute exclusivement sur le réseau local (LAN) de votre salle. Aucune donnée d'assiduité des adhérents ni aucune télémétrie n'est envoyée à des tiers sur le cloud, garantissant une conformité RGPD absolue.",
    },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <FaqJsonLd items={faqItems} />

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
            pathname="/comparatif/wexer-fitness-on-demand"
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
                  <span>{isEn ? "Open Source & Local-First" : "Local-First & Zéro Abonnement"}</span>
                </th>
                <th scope="col" className="col-proprietary">
                  <strong>{c.table.headers[2]}</strong>
                  <span>{isEn ? "Cloud B2B SaaS" : "SaaS Cloud Propriétaire"}</span>
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
