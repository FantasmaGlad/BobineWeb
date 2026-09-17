import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import HardwareBundleTabs from "@/components/hardware/HardwareBundleTabs";
import HardwareCartBar from "@/components/hardware/HardwareCartBar";

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
    pathname: "/materiel/amazon",
    title: isEn
      ? "Hardware Guide & Recommended Gym Playout Bundles — Bobine"
      : "Guide Matériel & Packs Recommandés — Bobine | Régie Fitness",
    description: isEn
      ? "Explore vetted gym hardware for Bobine: turnkey OS bundles (Linux Wyse J5005, Windows Mini PC, Mac Mini, Android tablet), certified cabling, studio remotes, and ROI comparison vs Les Mills Cinema."
      : "Découvrez le matériel testé pour faire tourner Bobine sans bug : packs par OS (Linux Wyse J5005, Windows Mini PC, Mac Mini, tablette Android), câblage certifié, télécommandes studio et comparatif budgétaire face à Les Mills Cinema.",
    keywords: [
      "Matériel Bobine",
      "Pack Dell Wyse 5070 J5005",
      "Dell Wyse 5070 fitness",
      "Mini PC salle de sport",
      "Alternative Les Mills Cinema matériel",
      "Borne tactile fitness matériel",
      "Régie vidéo fitness équipement",
      "Télécommande régie fitness 2.4GHz",
      "Câble DisplayPort HDMI 4K salle de sport",
      "Support mural antivol tablette fitness",
      "Gym playout hardware guide",
      "Open-source fitness automation hardware",
    ],
  });
}

export default async function HardwareAmazonPage({
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
      url: `/${currentLocale}/materiel/amazon`,
    },
  ];

  // Schéma structuré ItemList Schema.org pour le SEO / GEO
  const hardwareSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn
      ? "Bobine Certified Gym Playout Hardware Bundles"
      : "Packs Matériels Certifiés Régie Bobine Fit",
    description: isEn
      ? "Curated hardware setups for gyms and fitness studios running Bobine open-source playout."
      : "Sélection de configurations matérielles testées pour équiper les studios de fitness avec Bobine.",
    itemListElement: [
      {
        "@type": "Product",
        position: 1,
        name: "Pack Linux Appliance — Mini PC Industriel Fanless N100",
        description:
          "Mini PC industriel 100% fanless Intel N100, 8 Go DDR4, 256 Go NVMe SSD, double sortie HDMI + DisplayPort, câble vidéo et télécommande 2.4 GHz USB.",
        offers: {
          "@type": "Offer",
          price: "592.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        position: 2,
        name: "Pack Windows Desktop — Beelink Mini S12 Pro Intel N100",
        description:
          "Mini PC Intel N100, 16 Go RAM, 512 Go SSD NVMe, Windows 11 Pro, câble HDMI 2.1 48 Gbps et télécommande 2.4 GHz USB.",
        offers: {
          "@type": "Offer",
          price: "359.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "Product",
        position: 3,
        name: "Pack Android Tactile — Samsung Galaxy Tab A9+ & Support Mural Antivol",
        description:
          "Tablette Samsung Galaxy Tab A9+ 11 pouces, support mural antivol verrouillable et câble d'alimentation continue 100W.",
        offers: {
          "@type": "Offer",
          price: "285.00",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "82rem", paddingBottom: "3rem" }}
    >
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hardwareSchema) }}
      />

      {/* 1. Les Bundles par OS (Linux, Windows, macOS, Android), avec accessoires filtrés intégrés */}
      <HardwareBundleTabs locale={currentLocale} />

      {/* 2. Panier persistant "Mon Pack" — flottant, disponible mobile & desktop */}
      <HardwareCartBar locale={currentLocale} />
    </div>
  );
}
