import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import PowerDemoLoader from "@/components/three/PowerDemoLoader";

const copy = {
  fr: {
    title: "Démo — Wyse 5070 en 3D",
    intro:
      "Un test de faisabilité : un modèle 3D interactif du mini PC qui fait tourner Bobine. Cliquez dessus pour l'« allumer ».",
    hint: "Glisser pour tourner · molette pour zoomer · clic sur l'appareil pour l'allumer",
    note: "Page de test, pas encore reliée à la navigation du site.",
  },
  en: {
    title: "Demo — Wyse 5070 in 3D",
    intro:
      "A feasibility test: an interactive 3D model of the mini PC that runs Bobine. Click it to turn it “on”.",
    hint: "Drag to rotate · scroll to zoom · click the device to power it on",
    note: "Test page, not yet linked from the site navigation.",
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
      <p style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>{t.note}</p>
    </div>
  );
}
