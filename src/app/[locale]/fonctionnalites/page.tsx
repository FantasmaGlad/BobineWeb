import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";

const copy = {
  fr: {
    title: "Tout ce que Bobine fait tourner en local",
    intro:
      "Une suite logicielle complète pour transformer un mini PC en régie vidéo, borne à la demande et radio de salle de sport.",
    categories: {
      video: "Vidéo & Diffusion",
      audio: "Audio & Ambiance",
      control: "Pilotage & Contrôle",
      system: "Système & Exploitation",
    },
    features: [
      {
        category: "video",
        title: "Planification vidéo automatisée",
        desc: "Construisez votre planning hebdomadaire avec des créneaux récurrents. Les cours se lancent automatiquement à la seconde près sur l'écran assigné.",
      },
      {
        category: "video",
        title: "Borne cinéma à la demande",
        desc: "Un mode plein écran interactif pensé pour vos adhérents. Ils parcourent le catalogue de cours et démarrent leur séance en un geste.",
      },
      {
        category: "video",
        title: "Double sortie écran indépendante",
        desc: "Gérez un écran câblé en HDMI (ex: vidéo dans la salle de cours) et un écran réseau (ex: radio ou affichage dans l'espace accueil) sur la même machine.",
      },
      {
        category: "audio",
        title: "Radio d'ambiance intégrée 24/7",
        desc: "Lecteur musical continu avec fondu enchaîné réglable (crossfade), lecture aléatoire, playlists dédiées et messages vocaux programmables.",
      },
      {
        category: "audio",
        title: "Mode coach audio",
        desc: "Diffusez des cours purement audio sur les enceintes de la salle, accompagnés d'un fond visuel apaisant ou animé sur les écrans.",
      },
      {
        category: "control",
        title: "Télécommande mobile web",
        desc: "Ouvrez l'application sur n'importe quel smartphone connecté au Wi-Fi de la salle pour piloter la lecture, le volume et passer les cours.",
      },
      {
        category: "control",
        title: "Télécommande physique sans fil",
        desc: "Compatible avec les télécommandes USB plug-and-play « air remote ». Vos coachs et membres peuvent naviguer sans écran tactile.",
      },
      {
        category: "system",
        title: "Gestion de bibliothèque multimédia",
        desc: "Import rapide par glisser-déposer, téléversement en lot, catégorisation libre et génération instantanée de miniatures vidéo.",
      },
      {
        category: "system",
        title: "Architecture locale & auto-guérison",
        desc: "Fonctionne sans internet. Un chien de garde interne surveille les processus et redémarre automatiquement le kiosque et les services en cas de panne.",
      },
    ],
    ctaTitle: "Découvrez Bobine en action",
    ctaDesc: "Explorez notre démo 3D interactive ou installez Bobine sur votre matériel dès aujourd'hui.",
    ctaPrimary: "Installer Bobine",
    ctaSecondary: "Voir la démo 3D",
  },
  en: {
    title: "Everything Bobine runs locally",
    intro:
      "A complete software suite turning any budget mini PC into a video playout system, on-demand kiosk, and gym radio.",
    categories: {
      video: "Video & Playout",
      audio: "Audio & Music",
      control: "Controls & Remotes",
      system: "System & Reliability",
    },
    features: [
      {
        category: "video",
        title: "Automated Video Scheduling",
        desc: "Build a recurring weekly timetable. Classes start and stop automatically on time on the designated display screen.",
      },
      {
        category: "video",
        title: "On-Demand Cinema Kiosk",
        desc: "A member-facing full-screen interactive interface. Members can browse available classes and start workouts autonomously.",
      },
      {
        category: "video",
        title: "Dual Independent Screen Outputs",
        desc: "Drive a direct HDMI wired display and a networked display simultaneously with separate contents from a single mini PC.",
      },
      {
        category: "audio",
        title: "Integrated 24/7 Gym Radio",
        desc: "Continuous background music player featuring smooth crossfade, custom playlists, and scheduled automated voice announcements.",
      },
      {
        category: "audio",
        title: "Audio Coach Mode",
        desc: "Play audio-only guided workout sessions over the gym sound system with ambient visual backgrounds on screens.",
      },
      {
        category: "control",
        title: "Mobile Web Remote Control",
        desc: "Open the control interface on any mobile browser on the local network to pause, skip, and manage volumes effortlessly.",
      },
      {
        category: "control",
        title: "Physical Wireless Remote",
        desc: "Works out of the box with standard USB air remotes. Instructors and members can control classes without touching the PC.",
      },
      {
        category: "system",
        title: "Media Library Management",
        desc: "Fast drag-and-drop imports, bulk video uploads, custom categories, and automatic video thumbnail extraction.",
      },
      {
        category: "system",
        title: "Local-First & Self-Healing",
        desc: "Runs 100% offline. An integrated watchdog supervisor continuously monitors services and restarts components automatically if needed.",
      },
    ],
    ctaTitle: "See Bobine in Action",
    ctaDesc: "Try our interactive 3D demo or install Bobine on your mini PC today.",
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
    <div className="container" style={{ paddingBlock: "1.25rem" }}>
      {/* En-tête */}
      <div style={{ maxWidth: "46rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", marginBottom: "0.5rem" }}>{t.title}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>{t.intro}</p>
      </div>

      {/* Grille des fonctionnalités */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
          gap: "0.85rem",
          marginBottom: "1.75rem",
        }}
      >
        {t.features.map((feat) => {
          const categoryName =
            t.categories[feat.category as keyof typeof t.categories] || feat.category;
          return (
            <div key={feat.title} className="card-interactive" style={{ padding: "0.95rem 1.15rem" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <span
                  className="badge"
                  style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}
                >
                  {categoryName}
                </span>
              </div>
              <h3 className="card-title" style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{feat.title}</h3>
              <p className="card-desc" style={{ fontSize: "0.85rem", lineHeight: 1.45 }}>{feat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div
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
          <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>{t.ctaTitle}</h3>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.875rem" }}>{t.ctaDesc}</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link className="btn-primary" href={`/${locale}/documentation/demarrage-rapide`}>
            {t.ctaPrimary}
          </Link>
          <Link className="btn-secondary" href={`/${locale}/demo-3d`}>
            {t.ctaSecondary}
          </Link>
        </div>
      </div>
    </div>
  );
}

