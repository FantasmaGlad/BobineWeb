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
        headline: "Économisez 1 500 € à 3 600 € par an sans sacrifier l'expérience immersive en studio.",
        description:
          "Comparatif direct entre le modèle de licence par programme Les Mills (BodyPump, RPM, The Trip, formation coachs à 500 €) et l'autonomie totale 100% hors-ligne de Bobine.",
        points: [
          "0 € / mois vs 150 € à 350 € / mois par programme",
          "Mini PC reconditionné standard (~50 €) vs projecteurs certifiés imposés",
          "Liberté totale de catalogue (cours maison, cycling, HIIT, yoga)",
          "100% Hors-ligne : zéro freeze en cas de panne internet",
        ],
      },
      {
        slug: "wexer-fitness-on-demand",
        target: "Wexer Virtual & Fitness On Demand",
        badge: "SaaS B2B Cloud",
        headline: "Reprenez le contrôle de vos écrans face aux plateformes cloud par abonnement mensuel.",
        description:
          "Mise en parallèle du modèle d'abonnement récurrent Wexer / FOD (200 € à 450 € / mois par écran) face à la solution souveraine locale et sans latence Bobine.",
        points: [
          "Aucun abonnement mensuel perpétuel",
          "Données 100% locales et privées (zéro télémétrie cloud)",
          "Réactivité instantanée sur le réseau local Wi-Fi (< 2 ms)",
          "Contrôle TV automatique par HDMI-CEC natif",
        ],
      },
      {
        slug: "radical-fitness-yako",
        target: "Radical Fitness & Programmes Franchises (Yako)",
        badge: "Franchises & Catalogues Liés",
        headline: "Offrez à votre studio indépendant une régie vidéo de niveau franchise sans redevance.",
        description:
          "Comment diffuser vos propres cours collectifs, cours de biking et séances vidéo sans être enfermé dans un réseau de franchise ou un forfait imposé.",
        points: [
          "Accessible à tous les indépendants sans affiliation",
          "Import libre glisser-déposer de n'importe quel fichier vidéo MP4/MKV",
          "Gestion libre des catégories de cours et des plannings",
          "Télécommande coach instantanée sur smartphone par QR code",
        ],
      },
      {
        slug: "affichage-dynamique-fitness",
        target: "Affichage Dynamique Générique (TouchPlayer, Waves, Screenly)",
        badge: "Digital Signage vs Régie Métier",
        headline: "Pourquoi un simple lecteur d'affichage dynamique ne remplace pas une régie fitness dédiée.",
        description:
          "Les limites des outils de digital signage généralistes face aux fonctions métiers indispensables de Bobine (HDMI-CEC, borne tactile adhérent, radio 24/7).",
        points: [
          "Pilotage matériel des écrans TV par HDMI-CEC (Allumage 2 min avant)",
          "Borne tactile adhérent avec compte à rebours de créneau",
          "Radio plateau 24/7 avec fondu enchaîné et annonces vocales",
          "Reprise automatique après coupure de courant (Watchdog systemd)",
        ],
      },
    ],
  },
  en: {
    badge: "Comparative Studies & Alternatives",
    title: "Comparative Guide to Virtual Fitness & Gym Playout Solutions",
    subtitle:
      "An objective breakdown of software licensing costs, content freedom, hardware lock-in, and offline reliability across major gym video solutions.",
    cards: [
      {
        slug: "les-mills-cinema",
        target: "Les Mills Cinema & Les Mills Virtual",
        badge: "Premium Royalties & Locked Box",
        headline: "Save $1,500 to $3,600 annually per studio with complete playout autonomy.",
        description:
          "Direct comparison between Les Mills per-program licensing fees (BodyPump, RPM, The Trip, instructor certification costs) and Bobine's 100% offline open-source model.",
        points: [
          "$0 / month vs $150–$350 / month per program",
          "Standard refurbished mini PC (~$50) vs mandatory certified hardware",
          "Full content freedom (indoor cycling, HIIT, yoga, custom videos)",
          "100% Offline: zero freezing during internet outages",
        ],
      },
      {
        slug: "wexer-fitness-on-demand",
        target: "Wexer Virtual & Fitness On Demand",
        badge: "Cloud B2B SaaS",
        headline: "Regain ownership of your studio screens against recurring cloud fees.",
        description:
          "Side-by-side analysis of recurring Wexer / FOD SaaS subscriptions ($200–$450/month per screen) vs Bobine's local-first zero-latency playout engine.",
        points: [
          "Zero perpetual subscription fees",
          "100% Local and private data (zero cloud telemetry)",
          "Instant LAN Wi-Fi responsiveness (< 2 ms roundtrip)",
          "Automatic TV power management via native HDMI-CEC",
        ],
      },
      {
        slug: "radical-fitness-yako",
        target: "Radical Fitness & Franchise Programs",
        badge: "Franchise & Tied Content",
        headline: "Equip independent fitness clubs with franchise-grade virtual video without lock-in.",
        description:
          "How independent gym owners can schedule and play custom workout videos, indoor cycling, and cardio without being locked into expensive franchise contracts.",
        points: [
          "Available for any gym or studio without franchise affiliation",
          "Drag-and-drop import for standard MP4/MKV video files",
          "Unrestricted custom categories and timetable management",
          "Instant coach mobile remote via local Wi-Fi QR code scan",
        ],
      },
      {
        slug: "affichage-dynamique-fitness",
        target: "Generic Digital Signage (TouchPlayer, Waves, Screenly)",
        badge: "Digital Signage vs Dedicated Gym Playout",
        headline: "Why generic digital signage players fail to meet gym studio requirements.",
        description:
          "Understanding the gap between generic slide/video loopers and Bobine's purpose-built fitness features (HDMI-CEC TV control, member touch kiosk, 24/7 gym radio).",
        points: [
          "Automated TV power via HDMI-CEC (Turn on 2 min before workout)",
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

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <header style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem", textAlign: "center", maxWidth: "860px", margin: "0 auto" }}>
        <span className="feature-category-label">{data.badge}</span>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, marginTop: "0.75rem", marginBottom: "1rem", color: "var(--text-heading)", lineHeight: 1.2 }}>
          {data.title}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {data.subtitle}
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {data.cards.map((card) => (
          <article
            key={card.slug}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.85rem",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "var(--shadow-sm)",
              transition: "transform 0.15s ease, border-color 0.15s ease",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent-primary)", background: "var(--accent-subtle)", padding: "0.25rem 0.6rem", borderRadius: "0.35rem" }}>
                  {card.badge}
                </span>
              </div>

              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.6rem", lineHeight: 1.3 }}>
                {card.target}
              </h2>

              <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-body)", marginBottom: "0.75rem", lineHeight: 1.4 }}>
                {card.headline}
              </p>

              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                {card.description}
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {card.points.map((pt, pIdx) => (
                  <li key={pIdx} style={{ fontSize: "0.825rem", color: "var(--text-body)", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ color: "var(--accent-primary)", flexShrink: 0, marginTop: "2px" }}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={`/${locale}/comparatif/${card.slug}`}
              className="btn-primary"
              style={{ width: "100%", textAlign: "center", justifyContent: "center" }}
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
    </div>
  );
}
