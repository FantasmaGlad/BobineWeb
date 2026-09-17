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

  const categoryLabels = isEn
    ? ["Mini PC", "Laptop", "Tablet", "Accessories"]
    : ["Mini PC", "PC Portable", "Tablette", "Accessoires"];
  const tierLabels = isEn
    ? ["Essential", "Recommended", "Pro", "Premium"]
    : ["Essentiel", "Recommandé", "Gamme Pro", "Premium"];

  return (
    <div className="container" style={{ maxWidth: "82rem", paddingBottom: "3rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div className="platform-skeleton">
        <div className="platform-skeleton__tabs" aria-hidden="true">
          {categoryLabels.map((label) => (
            <span key={label} className="platform-skeleton__pill">
              {label}
            </span>
          ))}
        </div>

        <div className="platform-skeleton__card" aria-hidden="true">
          <div className="platform-skeleton__tiers">
            {tierLabels.map((label) => (
              <span key={label} className="platform-skeleton__pill platform-skeleton__pill--sm">
                {label}
              </span>
            ))}
          </div>

          <div className="platform-skeleton__body">
            <div className="platform-skeleton__image platform-skeleton__shimmer" />
            <div className="platform-skeleton__lines">
              <div className="platform-skeleton__line platform-skeleton__shimmer" style={{ width: "70%", height: "1.1rem" }} />
              <div className="platform-skeleton__line platform-skeleton__shimmer" style={{ width: "45%" }} />
              <div className="platform-skeleton__line platform-skeleton__shimmer" style={{ width: "90%" }} />
              <div className="platform-skeleton__line platform-skeleton__shimmer" style={{ width: "60%" }} />
              <div className="platform-skeleton__actions">
                <div className="platform-skeleton__button platform-skeleton__shimmer" />
                <div className="platform-skeleton__button platform-skeleton__shimmer" style={{ width: "40%" }} />
              </div>
            </div>
          </div>

          <div className="platform-skeleton__overlay">
            <span className="platform-construction__badge">AliExpress</span>
            <h1 className="platform-construction__title">
              {isEn ? "Under construction" : "En construction"}
            </h1>
            <p className="platform-construction__text">
              {isEn
                ? "This is where AliExpress bundles will appear, mirroring the Amazon layout. Switch to Amazon in the meantime to browse the current bundles."
                : "C'est ici que les packs AliExpress apparaîtront, dans la même mise en page que côté Amazon. En attendant, retrouvez les packs disponibles côté Amazon."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
