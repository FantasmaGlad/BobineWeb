import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import PowerDemoLoader from "@/components/three/PowerDemoLoader";

import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

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
      ? "Interactive 3D demonstration of the Dell Wyse 5070 mini PC, studio bikes, and TV display running the Bobine video playout engine."
      : "Démonstration 3D interactive du mini PC Dell Wyse 5070, des vélos studio et de l'écran pilotant la régie vidéo autonome Bobine.",
    keywords: [
      "Démo 3D Bobine",
      "Studio RPM 3D",
      "Dell Wyse 5070 3D",
      "Régie vidéo fitness 3D",
    ],
  });
}

export default async function Demo3DPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Démo 3D", url: `/${locale}/demo-3d` },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div
        style={{
        width: "100%",
        maxWidth: "100%",
        height: "calc(100svh - 9.75rem)",
        minHeight: "440px",
        padding: "0.5rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        className="power-demo__card"
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          margin: 0,
          maxHeight: "none",
          aspectRatio: "auto",
        }}
      >
        <PowerDemoLoader />
      </div>
    </div>
    </>
  );
}

