import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import PowerDemoLoader from "@/components/three/PowerDemoLoader";

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
    pathname: "/demo-3d",
    title: isEn ? "Interactive 3D Hardware Demo — Bobine" : "Démo Matériel Interactive 3D — Bobine",
    description: isEn
      ? "Interactive 3D demonstration of the Dell Wyse 5070 mini PC and TV display running the Bobine video playout engine."
      : "Démonstration 3D interactive du mini PC Dell Wyse 5070 et de l'écran pilotant la régie vidéo autonome Bobine.",
  });
}


export default async function Demo3DPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="container" style={{ paddingBlock: "clamp(1rem, 2.5vw, 2rem)", maxWidth: "100%" }}>
      <div className="power-demo__card">
        <PowerDemoLoader />
      </div>
    </div>
  );
}

