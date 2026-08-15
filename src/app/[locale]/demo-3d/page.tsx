import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import PowerDemoLoader from "@/components/three/PowerDemoLoader";

const copy = {
  fr: {
    title: "Démo — Bobine en 3D",
    intro:
      "Un test de faisabilité : le mini PC et l'écran qui font tourner Bobine, en 3D. Cliquez sur le Wyse pour lancer la démo du kiosk sur l'écran.",
    hint: "Glisser pour tourner · molette pour zoomer · repères en bas à droite pour changer de vue · clic sur le Wyse pour lancer la démo",
  },
  en: {
    title: "Demo — Bobine in 3D",
    intro:
      "A feasibility test: the mini PC and screen that run Bobine, in 3D. Click the Wyse to play the kiosk demo on screen.",
    hint: "Drag to rotate · scroll to zoom · bottom-right gizmo to switch views · click the Wyse to start the demo",
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
    <div className="container" style={{ paddingBlock: "3rem" }}>
      <h1>{t.title}</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "40rem" }}>{t.intro}</p>
      <div className="power-demo__card">
        <PowerDemoLoader />
      </div>
      <p className="power-demo__hint">{t.hint}</p>
    </div>
  );
}
