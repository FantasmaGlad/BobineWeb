import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
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
    pathname: "/materiel/aliexpress",
    title: isEn ? "AliExpress Hardware Picks (Coming Soon) — Bobine" : "Matériel AliExpress (Bientôt) — Bobine",
    description: isEn
      ? "AliExpress-sourced hardware recommendations for Bobine are in preparation."
      : "La sélection matérielle AliExpress pour Bobine est en préparation.",
    keywords: ["Bobine AliExpress", "Matériel fitness AliExpress"],
  });
}

export default async function HardwareAliexpressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const currentLocale = locale as Locale;
  const isEn = currentLocale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${currentLocale}` },
    {
      name: isEn ? "Hardware Guide" : "Guide Matériel",
      url: `/${currentLocale}/materiel/aliexpress`,
    },
  ];

  return (
    <div
      className="container platform-theme-aliexpress"
      style={{ maxWidth: "82rem", paddingBottom: "3rem" }}
    >
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div className="platform-construction">
        <span className="platform-construction__badge">AliExpress</span>
        <h1 className="platform-construction__title">
          {isEn ? "Under construction" : "En construction"}
        </h1>
        <p className="platform-construction__text">
          {isEn
            ? "The AliExpress hardware selection for Bobine is being prepared. Switch to Amazon in the meantime to browse the current bundles."
            : "La sélection matérielle AliExpress pour Bobine est en préparation. En attendant, retrouvez les packs disponibles côté Amazon."}
        </p>
      </div>
    </div>
  );
}
