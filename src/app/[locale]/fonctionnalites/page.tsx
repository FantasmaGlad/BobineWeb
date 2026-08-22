import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";

const copy = {
  fr: {
    title: "Architecture & Capacités Techniques de Bobine",
    intro:
      "Une suite logicielle locale et modulaire qui transforme un simple mini PC standard en régie vidéo autonome, borne tactile adhérent et radio d'ambiance 24/7.",
    modules: [
      {
        id: "video-engine",
        badge: "Diffusion & Vidéo",
        title: "Moteur de Lecture MPV & Accélération Matérielle",
        desc: "Bobine intègre un moteur de rendu vidéo optimisé pour les processeurs Intel et AMD (Intel QuickSync / iHD, AMD Ryzen / Radeon VA-API) exploitant le décodage matériel VA-API pour une fluidité totale et un usage CPU minime.",
        specs: [
          { label: "Résolution & Fluidité", value: "1080p et 4K jusqu'à 60 images/seconde" },
          { label: "Charge Processeur", value: "Moins de 8% d'usage CPU en lecture active" },
          { label: "Codecs supportés", value: "H.264, HEVC (H.265), VP9, AV1, WebM" },
          { label: "Double affichage", value: "Sortie HDMI principale + flux réseau secondaire" },
        ],
      },
      {
        id: "scheduler-cec",
        badge: "Automatisation & Télévision",
        title: "Planificateur Intelligent & Contrôle HDMI-CEC",
        desc: "Fini les allumages manuels ou les télécommandes égarées. Bobine pilote directement l'écran de la salle grâce au protocole HDMI-CEC.",
        specs: [
          { label: "Allumage TV", value: "Allumage automatique 2 minutes avant le cours" },
          { label: "Mise en veille", value: "Extinction automatique de l'écran en fin de séance" },
          { label: "Grille hebdomadaire", value: "Créneaux récurrents configurables à la seconde" },
          { label: "Décompte visuel", value: "Affichage d'un compte à rebours d'échauffement" },
        ],
      },
      {
        id: "kiosk-controls",
        badge: "Adhérents & Contrôle",
        title: "Borne Tactile À la Demande & WebSockets Locaux",
        desc: "Entre deux cours planifiés, la salle reste vivante : les adhérents peuvent lancer des séances individuelles ou en petits groupes sur l'écran tactile ou depuis leur smartphone.",
        specs: [
          { label: "Interface Borne", value: "Interface plein écran épurée et navigable au doigt" },
          { label: "Télécommande smartphone", value: "Scan de QR code Wi-Fi local sans installer d'application" },
          { label: "Télécommandes sans fil", value: "Support plug-and-play des télécommandes USB air-mouse" },
          { label: "Contrôle du volume", value: "Gestion centralisée du volume sono et vidéo" },
        ],
      },
      {
        id: "audio-watchdog",
        badge: "Sonorisation & Robustesse",
        title: "Radio d'Ambiance 24/7 & Chien de Garde Résilient",
        desc: "Bobine assure une ambiance continue sur le plateau ou dans le studio avec un lecteur musical intégré et une résilience matérielle absolue.",
        specs: [
          { label: "Fondu musical (Crossfade)", value: "Transitions douces sans aucun blanc sonore" },
          { label: "Annonces programmées", value: "Diffusion de messages vocaux horaires (fermeture, consignes)" },
          { label: "Chien de garde (Watchdog)", value: "Surveillance continue systemd avec relance automatique" },
          { label: "Reprise sur coupure", value: "Redémarrage instantané et autonome après coupure de courant" },
        ],
      },
    ],
  },
  en: {
    title: "Technical Architecture & Core Capabilities of Bobine",
    intro:
      "A modular, local-first software suite that transforms standard budget mini PCs into an autonomous gym playout system, member kiosk, and 24/7 background audio station.",
    modules: [
      {
        id: "video-engine",
        badge: "Playout & Video",
        title: "MPV Playout Engine & Hardware Acceleration",
        desc: "Bobine embeds a dedicated video player engine optimized for Intel and AMD processors (Intel QuickSync / iHD, AMD Ryzen / Radeon VA-API) leveraging hardware decoding for smooth playout with minimal CPU usage.",
        specs: [
          { label: "Resolution & Frame Rate", value: "1080p and 4K up to 60 frames per second" },
          { label: "CPU Utilization", value: "Under 8% CPU usage during active video playout" },
          { label: "Supported Codecs", value: "H.264, HEVC (H.265), VP9, AV1, WebM" },
          { label: "Dual Displays", value: "Main wired HDMI output + secondary networked stream" },
        ],
      },
      {
        id: "scheduler-cec",
        badge: "Automation & Display",
        title: "Smart Weekly Scheduler & Native HDMI-CEC",
        desc: "No more misplaced remotes. Bobine powers on and controls the workout room TV screen automatically via native HDMI-CEC protocol.",
        specs: [
          { label: "TV Auto-Power", value: "Screen powers on 2 minutes before the workout" },
          { label: "Auto-Standby", value: "Automatic TV standby when workout finishes" },
          { label: "Weekly Schedule", value: "Recurring timetable slots configured to the exact second" },
          { label: "Visual Countdown", value: "Warm-up countdown overlay before session starts" },
        ],
      },
      {
        id: "kiosk-controls",
        badge: "Members & Interaction",
        title: "On-Demand Member Kiosk & Local WebSockets",
        desc: "Between scheduled classes, members can browse workouts and start on-demand sessions directly from a touch display or their own mobile phones.",
        specs: [
          { label: "Kiosk UI", value: "Touch-optimized full-screen interface for fast browsing" },
          { label: "Mobile Remote", value: "Local Wi-Fi QR code scan with no app installation needed" },
          { label: "Wireless Remotes", value: "Plug-and-play USB air-mouse / remote support" },
          { label: "Volume Control", value: "Centralized volume management for video and voice audio" },
        ],
      },
      {
        id: "audio-watchdog",
        badge: "Audio & Resilience",
        title: "24/7 Background Music & Watchdog Supervisor",
        desc: "Bobine provides continuous background sound across the gym floor with an integrated audio player and bulletproof crash recovery.",
        specs: [
          { label: "Audio Crossfade", value: "Smooth transitions with zero audio silence gaps" },
          { label: "Scheduled Spoken Alerts", value: "Automated announcements (gym closing, safety guidelines)" },
          { label: "Systemd Watchdog", value: "Continuous process supervision with automatic recovery" },
          { label: "Power Cut Resilience", value: "Instant automatic reboot and resume after power cuts" },
        ],
      },
    ],
  },
} as const;

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
    pathname: "/fonctionnalites",
    title: isEn
      ? "Features & Playout Architecture — Bobine | Les Mills Cinema Alternative"
      : "Fonctionnalités & Architecture Technique — Bobine | Alternative Les Mills Cinema",
    description: isEn
      ? "Discover the modular capabilities of Bobine: MPV hardware decoding, automated HDMI-CEC TV control, on-demand touch kiosk, and 24/7 background audio without monthly subscription."
      : "Découvrez les fonctionnalités de Bobine face aux solutions comme Les Mills Cinema : décodage matériel Intel VA-API, pilotage TV automatique HDMI-CEC, borne tactile et radio 24/7 sans abonnement.",
    keywords: [
      "Fonctionnalités Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Décodage matériel MPV VA-API",
      "Contrôle TV HDMI-CEC fitness",
      "Borne tactile cours collectif",
      "Radio ambiance salle de sport",
      "Architecture streaming autonome",
      "Virtual fitness player features",
    ],
  });
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const isEn = locale === "en";

  return (
    <div className="container">
      {/* 1. Hero Section — Plein écran sans coupure */}
      <section className="page-hero page-hero--fullscreen" style={{ maxWidth: "56rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span className="feature-category-label">
              {isEn ? "Playout Engine & Hardware" : "Moteur de Diffusion & Matériel"}
            </span>
            <ShareButton
              locale={locale as Locale}
              pathname="/fonctionnalites"
              title={t.title}
              description={t.intro}
              hashtags={["Bobine", "OpenSource", "FitnessTech", "VideoStreaming"]}
            />
          </div>

          <h1 className="page-hero__title">
            {t.title}
          </h1>
          <p className="page-hero__intro">
            {t.intro}
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <a href="#video-engine" className="btn-primary">
              {isEn ? "Explore Features" : "Découvrir les Capacités"}
            </a>
          </div>
        </div>

        <div className="page-hero__scroll">
          <span>{locale === "en" ? "Scroll down to explore features" : "Défiler pour découvrir"}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* 2. Modules Techniques Épurés — Séparation par traits fins */}
      <div className="features-list" style={{ paddingTop: "clamp(2.5rem, 5vh, 4rem)" }}>
        {t.modules.map((mod) => (
          <section key={mod.id} id={mod.id} className="feature-section">
            <div className="feature-section__header">
              <span className="feature-category-label">{mod.badge}</span>
              <h2 className="feature-section__title">{mod.title}</h2>
              <p className="feature-section__desc">{mod.desc}</p>
            </div>

            <div className="feature-specs-grid">
              {mod.specs.map((sp, idx) => (
                <div key={idx} className="feature-spec-item">
                  <div className="feature-spec-label">{sp.label}</div>
                  <div className="feature-spec-value">{sp.value}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
