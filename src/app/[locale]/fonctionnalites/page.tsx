import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Fonctionnalités",
    intro: "Ce que Bobine fait tourner sur un seul mini PC, en local.",
    features: [
      ["Planification vidéo", "Construisez une timetable hebdomadaire ; les cours démarrent automatiquement au bon moment sur le bon écran."],
      ["Borne cinéma à la demande", "Un écran plein écran côté membre pour choisir et lancer un cours soi-même."],
      ["Deux sorties d'écran indépendantes", "Un écran câblé (HDMI) et un écran réseau, chacun avec son propre contenu."],
      ["Télécommande mobile", "Contrôlez la lecture depuis n'importe quel téléphone du réseau local."],
      ["Télécommande physique", "Compatible avec une télécommande USB « air remote » — vue comme un clavier, sans pilote ni appairage."],
      ["Mode coach audio", "Cours audio-seul diffusés sur les enceintes, avec un fond visuel animé ou fixe."],
      ["Radio intégrée", "Un lecteur de musique d'ambiance 24/7 façon Spotify, avec fondu enchaîné et rappels vocaux programmés."],
      ["Gestion de bibliothèque", "Import glisser-déposer, envoi en lot, catégories libres, miniatures automatiques."],
      ["Local-first et résilient", "Backend multi-worker, reprise automatique après coupure, chien de garde qui redémarre un composant en panne."],
    ],
  },
  en: {
    title: "Features",
    intro: "What Bobine runs on a single mini PC, entirely on your local network.",
    features: [
      ["Video scheduling", "Build a weekly timetable; classes start automatically at the right time on the right screen."],
      ["On-demand cinema kiosk", "A member-facing full-screen browser to pick and start a class."],
      ["Two independent display outputs", "A wired screen (HDMI) and a networked screen, each with its own content."],
      ["Mobile remote", "Control playback from any phone on the local network."],
      ["Physical remote support", "Works with a plug-and-play USB air remote — seen as a keyboard, no driver, no pairing."],
      ["Coach audio mode", "Audio-only classes played over the speakers, with an animated or still visual background."],
      ["Built-in radio", "A Spotify-style 24/7 background-music player with crossfade and scheduled spoken reminders."],
      ["Library management", "Drag-and-drop import, bulk upload, free-form categories, automatic thumbnails."],
      ["Local-first and resilient", "Multi-worker backend, automatic recovery after a power cut, a watchdog that restarts a dead component."],
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
    <div className="container" style={{ paddingBlock: "3rem" }}>
      <h1>{t.title}</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "40rem" }}>{t.intro}</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {t.features.map(([title, body]) => (
          <div key={title} style={{ border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1.25rem" }}>
            <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
