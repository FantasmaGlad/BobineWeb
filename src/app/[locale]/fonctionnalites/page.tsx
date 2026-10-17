import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import ScrollIndicator from "@/components/ScrollIndicator";

const copy = {
  fr: {
    title: "Ce que Bobine change au quotidien dans votre salle",
    intro:
      "Une régie vidéo qui tourne toute seule : les cours se lancent à l'heure, votre configuration se sauvegarde toute seule, et vos adhérents se servent sans vous déranger.",
    modules: [
      {
        id: "video-engine",
        badge: "Diffusion vidéo",
        title: "Vos cours se lancent tout seuls, à l'heure",
        desc: "Plus besoin qu'un salarié lance la vidéo au bon moment : Bobine diffuse chaque séance à l'heure prévue, en 1080p ou en 4K, sans saccade ni coupure, même sur un petit ordinateur d'occasion.",
        technicalTitle: "Détails techniques",
        specs: [
          { label: "Résolution & fluidité", value: "1080p et 4K jusqu'à 60 images par seconde" },
          { label: "Charge processeur", value: "Moins de 8% d'usage CPU en lecture active" },
          { label: "Codecs supportés", value: "H.264, HEVC (H.265), VP9, AV1, WebM" },
          { label: "Double affichage", value: "Sortie HDMI principale et flux réseau secondaire" },
        ],
      },
      {
        id: "backup-updates",
        badge: "Sauvegarde & mises à jour",
        title: "Votre régie se sauvegarde et se met à jour toute seule",
        desc: "Une erreur de manipulation ou un disque à remplacer ne fait pas tout perdre : exportez toute votre configuration en un clic, et restaurez-la en quelques secondes sur une nouvelle machine.",
        technicalTitle: "Détails techniques",
        specs: [
          { label: "Sauvegarde", value: "Export ZIP complet (vidéothèque, planning, réglages)" },
          { label: "Restauration", value: "Import en un clic avec vérification d'intégrité SQLite" },
          { label: "Réinitialisation", value: "Retour usine avec confirmation explicite requise" },
          { label: "Mises à jour", value: "Vérification automatique des nouvelles versions sur GitHub" },
        ],
      },
      {
        id: "kiosk-controls",
        badge: "Adhérents",
        title: "Vos adhérents se servent tout seuls",
        desc: "Entre deux cours, la salle reste vivante : un adhérent choisit sa séance sur l'écran tactile ou scanne un QR code pour la lancer depuis son téléphone, sans rien installer et sans vous demander de l'aide.",
        technicalTitle: "Détails techniques",
        specs: [
          { label: "Interface borne", value: "Interface plein écran épurée et navigable au doigt" },
          { label: "Télécommande smartphone", value: "Scan de QR code Wi-Fi local sans installer d'application" },
          { label: "Télécommandes sans fil", value: "Support plug-and-play des télécommandes USB air-mouse" },
          { label: "Temps de réponse", value: "WebSockets locaux, réaction quasi instantanée" },
        ],
      },
      {
        id: "audio-watchdog",
        badge: "Ambiance & fiabilité",
        title: "Une ambiance qui ne s'arrête jamais",
        desc: "Une musique de fond continue en dehors des cours, et une machine qui repart toute seule après une coupure de courant ou un redémarrage, sans que vous ayez à intervenir.",
        technicalTitle: "Détails techniques",
        specs: [
          { label: "Fondu musical (crossfade)", value: "Transitions douces sans aucun blanc sonore" },
          { label: "Annonces programmées", value: "Diffusion de messages vocaux horaires (fermeture, consignes)" },
          { label: "Chien de garde (watchdog)", value: "Surveillance continue systemd avec relance automatique" },
          { label: "Reprise sur coupure", value: "Redémarrage instantané et autonome après coupure de courant" },
        ],
      },
    ],
  },
  en: {
    title: "What Bobine changes day to day in your gym",
    intro:
      "A playout system that runs on its own: classes start on time, your setup backs itself up, and members help themselves without needing you.",
    modules: [
      {
        id: "video-engine",
        badge: "Video playout",
        title: "Your classes start on their own, on time",
        desc: "No more staff having to press play at the right moment: Bobine plays every session on schedule, in 1080p or 4K, with no stutter or freeze, even on a small refurbished computer.",
        technicalTitle: "Technical details",
        specs: [
          { label: "Resolution & frame rate", value: "1080p and 4K up to 60 frames per second" },
          { label: "CPU utilization", value: "Under 8% CPU usage during active video playout" },
          { label: "Supported codecs", value: "H.264, HEVC (H.265), VP9, AV1, WebM" },
          { label: "Dual displays", value: "Main wired HDMI output plus secondary networked stream" },
        ],
      },
      {
        id: "backup-updates",
        badge: "Backup & updates",
        title: "Your setup backs itself up and updates itself",
        desc: "A mistake or a failing drive doesn't have to mean starting over: export your entire configuration in one click, and restore it in seconds on a new machine.",
        technicalTitle: "Technical details",
        specs: [
          { label: "Backup", value: "Full ZIP export (video library, schedule, settings)" },
          { label: "Restore", value: "One-click import with SQLite integrity checks" },
          { label: "Factory reset", value: "Requires an explicit typed confirmation" },
          { label: "Updates", value: "Automatic check for new releases on GitHub" },
        ],
      },
      {
        id: "kiosk-controls",
        badge: "Members",
        title: "Members help themselves",
        desc: "Between scheduled classes, the room stays alive: a member picks a session on the touch screen or scans a QR code to start it from their phone, with nothing to install and no need to ask for help.",
        technicalTitle: "Technical details",
        specs: [
          { label: "Kiosk UI", value: "Touch-optimized full-screen interface for fast browsing" },
          { label: "Mobile remote", value: "Local Wi-Fi QR code scan with no app installation needed" },
          { label: "Wireless remotes", value: "Plug-and-play USB air-mouse / remote support" },
          { label: "Response time", value: "Local WebSockets, near-instant reaction" },
        ],
      },
      {
        id: "audio-watchdog",
        badge: "Ambiance & reliability",
        title: "An atmosphere that never stops",
        desc: "Continuous background music outside of classes, and a machine that comes back on its own after a power cut or restart, with nothing for you to do.",
        technicalTitle: "Technical details",
        specs: [
          { label: "Audio crossfade", value: "Smooth transitions with zero audio silence gaps" },
          { label: "Scheduled spoken alerts", value: "Automated announcements (gym closing, safety guidelines)" },
          { label: "Systemd watchdog", value: "Continuous process supervision with automatic recovery" },
          { label: "Power cut resilience", value: "Instant automatic reboot and resume after power cuts" },
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
      ? "Features — Bobine | Les Mills Cinema Alternative"
      : "Fonctionnalités — Bobine | Alternative Les Mills Cinema",
    description: isEn
      ? "What Bobine V5.0.0 does for your gym day to day on Google Books (Aluminium OS), Snapdragon ARM64 PCs, Apple Silicon Macs, Android tablets, and x86/ARM mini PCs: classes that start on their own, a setup that backs itself up, a self-service member kiosk, and 24/7 background audio without a monthly subscription."
      : "Ce que Bobine V5.0.0 change au quotidien pour votre salle sur Google Book (Aluminium OS), PC ARM Qualcomm Snapdragon, Mac mini, tablette Android ou mini PC x86/ARM : des cours qui se lancent tout seuls, une configuration qui se sauvegarde toute seule, une borne libre-service pour les adhérents et une ambiance sonore 24/7, sans abonnement.",
    keywords: isEn
      ? [
          "Bobine features",
          "Bobine Fit features",
          "Google Book",
          "Googlebook",
          "Aluminium OS",
          "Bobine Google Book",
          "Application salle de sport Google Book",
          "PC ARM Qualcomm Snapdragon",
          "Snapdragon X Elite",
          "Snapdragon X Plus",
          "Windows 11 ARM64",
          "Linux ARM64",
          "NVIDIA DGX Spark",
          "Mini PC ARM salle de sport",
          "Raspberry Pi 5 salle de sport",
          "Orange Pi 5 RK3588",
          "Les Mills Cinema alternative",
          "Les Mills Virtual alternative",
          "automated gym video playout",
          "fitness studio TV automation",
          "touchscreen fitness kiosk",
          "gym background radio",
          "autonomous video playout suite",
          "virtual fitness player features",
        ]
      : [
          "Fonctionnalités Bobine",
          "Google Book",
          "Googlebook",
          "Aluminium OS",
          "Bobine Google Book",
          "Application salle de sport Google Book",
          "PC ARM Qualcomm Snapdragon",
          "Snapdragon X Elite",
          "Snapdragon X Plus",
          "Windows 11 ARM64",
          "Linux ARM64",
          "NVIDIA DGX Spark",
          "Mini PC ARM salle de sport",
          "Raspberry Pi 5 salle de sport",
          "Orange Pi 5 RK3588",
          "Alternative Les Mills Cinema",
          "Alternative Les Mills Virtual",
          "Diffusion vidéo automatique salle de sport",
          "Contrôle TV automatique fitness",
          "Borne tactile cours collectif",
          "Radio ambiance salle de sport",
          "Régie vidéo autonome",
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
      {/* 1. Hero Section — Plein écran propre sur Desktop et Mobile */}
      <section className="hero-fullscreen">
        <div>
          <span className="feature-category-label" style={{ marginBottom: "0.75rem", display: "inline-block" }}>
            {isEn ? "Features" : "Fonctionnalités"}
          </span>

          <h1 className="hero-fullscreen__title">
            {t.title}
          </h1>

          <p className="hero-fullscreen__subtitle">
            {t.intro}
          </p>
        </div>

        <ScrollIndicator locale={locale as Locale} />
      </section>

      {/* 2. Modules Techniques Épurés — Séparation par traits fins */}
      <div className="features-list" style={{ paddingTop: "2rem" }}>
        {t.modules.map((mod) => (
          <section key={mod.id} id={mod.id} className="feature-section">
            <div className="feature-section__header">
              <span className="feature-category-label">{mod.badge}</span>
              <h2 className="feature-section__title">{mod.title}</h2>
              <p className="feature-section__desc">{mod.desc}</p>
            </div>

            <details className="feature-tech-details">
              <summary className="feature-tech-details__summary">
                {mod.technicalTitle}
              </summary>
              <div className="feature-specs-grid">
                {mod.specs.map((sp, idx) => (
                  <div key={idx} className="feature-spec-item">
                    <div className="feature-spec-label">{sp.label}</div>
                    <div className="feature-spec-value">{sp.value}</div>
                  </div>
                ))}
              </div>
            </details>
          </section>
        ))}
      </div>
    </div>
  );
}
