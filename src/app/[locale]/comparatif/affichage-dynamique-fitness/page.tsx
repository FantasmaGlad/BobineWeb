import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

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
      ? "Bobine vs Generic Digital Signage (TouchPlayer, Waves System, Screenly, Yodeck)"
      : "Bobine face à l'Affichage Dynamique Générique (TouchPlayer, Waves System, Screenly, Yodeck)",
    description: isEn
      ? "Why generic digital signage players fail to replace a dedicated gym playout system. Compare HDMI-CEC automation, member on-demand kiosks, coach remotes, and 24/7 background radio."
      : "Pourquoi un simple lecteur d'affichage dynamique ne remplace pas une régie vidéo de fitness dédiée. Comparatif HDMI-CEC, borne tactile adhérent, télécommande coach et radio 24/7.",
    keywords: [
      "Affichage dynamique salle de sport",
      "Alternative TouchPlayer Fitness",
      "Alternative Waves System fitness",
      "Alternative Screenly Anthias fitness",
      "Alternative Yodeck salle de sport",
      "Régie vidéo fitness vs digital signage",
      "Borne tactile cours de sport",
      "Bobine vs affichage dynamique",
    ],
  });
}

const CONTENT = {
  fr: {
    breadcrumb: "Comparatifs / Affichage Dynamique Fitness",
    badge: "Étude Métier & Matériel",
    title: "Bobine face à l'Affichage Dynamique Générique",
    subtitle:
      "Pourquoi les solutions de signalétique en boucle (TouchPlayer, Waves System, Screenly, Yodeck) sont insuffisantes pour animer une vraie salle de fitness ?",
    summaryCards: [
      { label: "Automatisation TV", value: "HDMI-CEC Natif", desc: "Allumage / veille sans télécommande" },
      { label: "Borne Adhérents", value: "Kiosque Tactile", desc: "Sélection à la demande avec compte à rebours" },
      { label: "Contrôle Coach", value: "QR Code Local", desc: "Télécommande smartphone sans installer d'app" },
      { label: "Radio Plateau", value: "24/7 avec Fondu", desc: "Crossfade continu et annonces vocales" },
    ],
    table: {
      title: "Régie Métier vs Affichage Dynamique Standard",
      headers: ["Fonctionnalité Métier Fitness", "Bobine (Régie Fitness Dédiée)", "Affichage Dynamique Générique"],
      rows: [
        {
          criterion: "Allumage & Veille TV Automatique (HDMI-CEC)",
          bobine: "Oui (Allumage 2 min avant, extinction en fin de cours)",
          competitor: "Non (Écran allumé 24/7 ou extinction manuelle)",
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
          competitor: "15 € à 50 € / mois par écran connecté",
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
    breadcrumb: "Comparisons / Fitness Digital Signage",
    badge: "Hardware & Vertical Analysis",
    title: "Bobine vs Generic Digital Signage Players",
    subtitle:
      "Why standard digital signage tools (TouchPlayer, Waves System, Screenly, Yodeck) fail to meet the operational demands of fitness studios?",
    summaryCards: [
      { label: "TV Automation", value: "Native HDMI-CEC", desc: "Auto power & standby with zero manual remotes" },
      { label: "Member Kiosk", value: "Touchscreen Ready", desc: "On-demand class selection with countdown timer" },
      { label: "Coach Remote", value: "Local QR Code", desc: "Smartphone control with no app installation" },
      { label: "Gym Radio", value: "24/7 Crossfade", desc: "Continuous music and automated voice alerts" },
    ],
    table: {
      title: "Gym Playout vs Generic Signage",
      headers: ["Fitness Operational Feature", "Bobine (Dedicated Gym Playout)", "Generic Digital Signage"],
      rows: [
        {
          criterion: "Automated TV Screen Power (HDMI-CEC)",
          bobine: "Yes (Turns TV on 2 min before, standby post-workout)",
          competitor: "No (Displays run 24/7 or require manual TV remote)",
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
          competitor: "$15 to $50 / month per connected screen",
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

  return (
    <>
      {/* En-tête */}
      <header style={{ paddingTop: "1rem", paddingBottom: "2rem", maxWidth: "860px" }}>
        <span className="feature-category-label">{c.badge}</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, marginTop: "0.75rem", marginBottom: "1rem", color: "var(--text-heading)", lineHeight: 1.2 }}>
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
          <Link href={`/${locale}/documentation/demarrage-rapide`} className="btn-primary">
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
