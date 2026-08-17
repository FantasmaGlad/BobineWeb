import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import PowerDemoLoader from "@/components/three/PowerDemoLoader";

const copy = {
  fr: {
    title: "Démo — Le matériel Bobine en 3D",
    intro:
      "Visualisez le mini PC (Dell Wyse 5070) et l'écran qui animent Bobine. Cliquez sur le boîtier pour allumer la machine et lancer la démo du kiosque vidéo sur l'écran.",
    hint: "Glisser pour tourner la vue · Molette pour zoomer · Clic sur le Wyse pour allumer / éteindre",
  },
  en: {
    title: "Demo — Bobine Hardware in 3D",
    intro:
      "Explore the thin client (Dell Wyse 5070) and display running Bobine. Click the PC unit to power it on and launch the video kiosk demo on screen.",
    hint: "Drag to rotate view · Scroll to zoom · Click the Wyse PC to turn on / off",
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

export default async function Demo3DPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "1.25rem" }}>
      <div style={{ maxWidth: "48rem", marginBottom: "0.75rem" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", marginBottom: "0.4rem" }}>{t.title}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>{t.intro}</p>
      </div>

      <div className="power-demo__card">
        <PowerDemoLoader />
      </div>
      <p className="power-demo__hint" style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>{t.hint}</p>
    </div>
  );
}

