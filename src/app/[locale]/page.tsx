import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import GitHubIcon from "@/components/icons/GitHubIcon";

const copy = {
  fr: {
    title: "La régie vidéo & streaming open-source pour votre salle de sport",
    subtitle:
      "Bobine transforme un mini PC bon marché en système vidéo complet pour votre espace fitness : cours planifiés, borne cinéma à la demande, radio d'ambiance 24/7 — sans abonnement, sans dépendance au cloud, sans coupure.",
    ctaPrimary: "Installer Bobine",
    ctaSecondary: "Voir sur GitHub",
    ctaDemo: "Découvrir la démo 3D →",
    pointsTitle: "Pourquoi choisir Bobine",
    pointsSubtitle:
      "Une alternative indépendante aux solutions propriétaires de streaming en salle.",
    points: [
      {
        tag: "0€ / mois",
        title: "Vous êtes propriétaire",
        body: "Vos vidéos, votre matériel, votre planning. Pas de redevance par écran ni d'abonnement mensuel.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
      },
      {
        tag: "100% Hors-ligne",
        title: "Résilience sans internet",
        body: "Une fois installé, le système diffuse sans aucune connexion internet. Zéro interruption de cours en cas de panne réseau.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        ),
      },
      {
        tag: "Licence AGPL-3.0",
        title: "Code ouvert & pérenne",
        body: "Code source transparent et auditable. L'avenir de vos écrans ne dépend d'aucun éditeur tiers ni d'un arrêt de service.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
      },
      {
        tag: "Mini PC standard",
        title: "Matériel économique",
        body: "Un thin client ou mini PC reconditionné (ex: Dell Wyse 5070) suffit largement, sans boîtier propriétaire surtaxé.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ),
      },
    ],
    featuresTitle: "Tout ce dont votre salle a besoin",
    featuresSubtitle: "Une suite multimédia intégrée prête pour l'exploitation quotidienne.",
    featuresList: [
      {
        title: "Planification automatique",
        desc: "Timetable hebdomadaire : lancement autonome des cours aux horaires voulus.",
      },
      {
        title: "Borne cinéma à la demande",
        desc: "Interface plein écran pensée pour les membres pour choisir un cours en autonomie.",
      },
      {
        title: "Radio d'ambiance 24/7",
        desc: "Lecteur audio permanent avec transitions douces et annonces vocales programmables.",
      },
      {
        title: "Double sortie écran",
        desc: "Diffusez deux contenus différents en simultané (ex: cours sur HDMI, radio sur réseau).",
      },
      {
        title: "Télécommandes web & USB",
        desc: "Contrôle immédiat depuis un smartphone ou une télécommande sans fil type air-remote.",
      },
      {
        title: "Chien de garde & auto-guérison",
        desc: "Redémarrage automatique après coupure de courant et surveillance continue des services.",
      },
    ],
    ctaBoxTitle: "Prêt à équiper votre salle ?",
    ctaBoxDesc: "Consultez notre tutoriel pas-à-pas pour installer Bobine en 30 à 45 minutes sur votre matériel.",
    ctaBoxButton: "Consulter le guide de démarrage →",
  },
  en: {
    title: "The open-source video & streaming system for your fitness club",
    subtitle:
      "Bobine turns a low-cost mini PC into a complete in-club multimedia system: scheduled classes, on-demand cinema kiosk, 24/7 background radio — no monthly fees, no cloud lock-in, no downtime.",
    ctaPrimary: "Install Bobine",
    ctaSecondary: "View on GitHub",
    ctaDemo: "Try the 3D demo →",
    pointsTitle: "Why choose Bobine",
    pointsSubtitle:
      "An independent, local-first alternative to proprietary in-club streaming platforms.",
    points: [
      {
        tag: "$0 / month",
        title: "You own it",
        body: "Your videos, your hardware, your schedule. No per-screen license fees, no mandatory cloud subscriptions.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
      },
      {
        tag: "100% Offline",
        title: "Offline resilience",
        body: "Once installed, the system plays classes with no internet connection required. No outages when the internet goes down.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        ),
      },
      {
        tag: "AGPL-3.0 License",
        title: "Open source & durable",
        body: "Transparent, auditable code. Your club's media screens will never depend on vendor discontinuation.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
      },
      {
        tag: "Standard Mini PC",
        title: "Runs on budget hardware",
        body: "A refurbished thin client or mini PC (e.g. Dell Wyse 5070) is all you need — no proprietary overpriced appliances.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ),
      },
    ],
    featuresTitle: "Everything your gym needs",
    featuresSubtitle: "An all-in-one multimedia suite designed for daily fitness club operations.",
    featuresList: [
      {
        title: "Automated Scheduling",
        desc: "Weekly timetable with automatic start and stop for scheduled classes.",
      },
      {
        title: "On-Demand Member Kiosk",
        desc: "A full-screen kiosk browser for members to browse and launch classes on demand.",
      },
      {
        title: "24/7 Background Radio",
        desc: "Continuous audio player with crossfade and scheduled spoken announcements.",
      },
      {
        title: "Dual Screen Outputs",
        desc: "Broadcast two distinct feeds simultaneously (e.g., video on HDMI, radio over network).",
      },
      {
        title: "Web & USB Remote Control",
        desc: "Instant remote control from any phone or plug-and-play wireless air remote.",
      },
      {
        title: "Watchdog & Auto-Recovery",
        desc: "Self-recovering system that automatically boots and restarts services after power cuts.",
      },
    ],
    ctaBoxTitle: "Ready to equip your fitness room?",
    ctaBoxDesc: "Follow our quick step-by-step guide to install Bobine in 30 to 45 minutes on your hardware.",
    ctaBoxButton: "View Quick Start Guide →",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: copy[locale].title };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "1.25rem" }}>
      {/* Hero Section */}
      <section style={{ maxWidth: "50rem", marginBottom: "2.25rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: "0.85rem",
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            lineHeight: 1.55,
            color: "var(--text-muted)",
            maxWidth: "44rem",
            marginBottom: "1.35rem",
          }}
        >
          {t.subtitle}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <Link className="btn-primary" href={`/${locale}/documentation/demarrage-rapide`}>
            {t.ctaPrimary}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <a
            className="btn-secondary"
            href="https://github.com/FantasmaGlad/Bobine"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon size={16} />
            {t.ctaSecondary}
          </a>

          <Link
            href={`/${locale}/demo-3d`}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--accent-primary)",
              textDecoration: "none",
            }}
          >
            {t.ctaDemo}
          </Link>
        </div>
      </section>

      {/* Pourquoi Bobine — 4 piliers */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div style={{ maxWidth: "40rem", marginBottom: "1.15rem" }}>
          <h2 style={{ fontSize: "clamp(1.35rem, 3vw, 1.75rem)", marginBottom: "0.35rem" }}>
            {t.pointsTitle}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", margin: 0 }}>
            {t.pointsSubtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
            gap: "1rem",
          }}
        >
          {t.points.map((point) => (
            <div key={point.title} className="card-interactive" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                <div className="card-icon-box" style={{ margin: 0, width: "2.1rem", height: "2.1rem" }}>
                  {point.icon}
                </div>
                <span className="badge" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                  {point.tag}
                </span>
              </div>
              <h3 className="card-title" style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{point.title}</h3>
              <p className="card-desc" style={{ fontSize: "0.85rem" }}>{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aperçu des Fonctionnalités clés */}
      <section style={{ marginBottom: "2.5rem" }}>
        <div style={{ maxWidth: "40rem", marginBottom: "1.15rem" }}>
          <h2 style={{ fontSize: "clamp(1.35rem, 3vw, 1.75rem)", marginBottom: "0.35rem" }}>
            {t.featuresTitle}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", margin: 0 }}>
            {t.featuresSubtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
            gap: "0.85rem",
          }}
        >
          {t.featuresList.map((feat) => (
            <div key={feat.title} className="card-interactive" style={{ padding: "0.9rem 1.1rem" }}>
              <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "0.975rem", color: "var(--text-heading)" }}>
                {feat.title}
              </h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "0.85rem",
          padding: "1.25rem 1.5rem",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>{t.ctaBoxTitle}</h3>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.875rem" }}>{t.ctaBoxDesc}</p>
        </div>
        <Link className="btn-primary" href={`/${locale}/documentation/demarrage-rapide`}>
          {t.ctaBoxButton}
        </Link>
      </section>
    </div>
  );
}

