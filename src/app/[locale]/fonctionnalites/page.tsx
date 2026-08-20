import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import RoiCalculator from "@/components/RoiCalculator";



const copy = {
  fr: {
    title: "Architecture & Fonctionnalités Techniques de Bobine",
    intro:
      "Une suite logicielle locale et modulaire qui transforme un simple mini PC standard en régie vidéo autonome, borne tactile adhérent et radio d'ambiance 24/7.",
    modules: [
      {
        id: "video-engine",
        badge: "Diffusion & Vidéo",
        title: "Moteur de Lecture MPV & Accélération Matérielle",
        desc: "Bobine intègre un moteur de rendu vidéo optimisé pour les processeurs Intel (Celeron J4105 / N5105 / i3 / i5) exploitant le décodage matériel VA-API et Intel QuickSync.",
        specs: [
          { label: "Résolution & Fluidité", value: "1080p et 4K jusqu'à 60 images/seconde" },
          { label: "Charge Processeur", value: "Moins de 8% d'usage CPU en lecture active" },
          { label: "Codecs supportés", value: "H.264, HEVC (H.265), VP9, AV1, WebM" },
          { label: "Double affichage", value: "Sortie HDMI principale + affichage réseau secondaire" },
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
          { label: "Télécommandes sans fil", value: "Support plug-and-play des télécommandes USB air-remote" },
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
    ctaTitle: "Prêt à découvrir le fonctionnement en 3D ?",
    ctaDesc: "Manipulez le mini PC et l'écran TV en temps réel dans notre scène interactive 3D.",
    ctaPrimary: "Installer Bobine",
    ctaSecondary: "Voir la démo 3D",
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
        desc: "Bobine embeds a dedicated video player engine optimized for Intel processors (Celeron J4105 / N5105 / i3 / i5) leveraging VA-API and Intel QuickSync hardware decoding.",
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
    ctaTitle: "Ready to explore the 3D hardware interactive view?",
    ctaDesc: "Inspect the mini PC and TV display in real time in our interactive 3D scene.",
    ctaPrimary: "Install Bobine",
    ctaSecondary: "Try 3D Demo",
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

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "1.5rem" }}>
      {/* En-tête */}
      <div style={{ maxWidth: "48rem", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.85rem, 3.8vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: "0.65rem",
            color: "var(--text-heading)",
          }}
        >
          {t.title}
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1rem",
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {t.intro}
        </p>
      </div>

      {/* Modules Techniques Détaillés */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {t.modules.map((mod) => (
          <div key={mod.id} className="profile-tab-card">
            <div style={{ marginBottom: "1rem" }}>
              <span className="profile-tab-card__badge">{mod.badge}</span>
              <h2
                style={{
                  margin: "0.25rem 0 0.4rem 0",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text-heading)",
                }}
              >
                {mod.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-muted)",
                  fontSize: "0.925rem",
                  lineHeight: 1.5,
                  maxWidth: "48rem",
                }}
              >
                {mod.desc}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
                gap: "0.75rem",
                background: "var(--bg-surface-hover)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.65rem",
                padding: "1rem",
              }}
            >
              {mod.specs.map((sp, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {sp.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                    }}
                  >
                    {sp.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Simulateur d'Économies & Calculateur de ROI */}
      <RoiCalculator locale={locale as Locale} />
    </div>
  );
}

