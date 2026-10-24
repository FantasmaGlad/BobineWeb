import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { IS_ONION } from "@/lib/onion";
import OnionMirrorNotice from "@/components/OnionMirrorNotice";
import { buildMetadata, lp } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import HardwareBundleTabs from "@/components/hardware/HardwareBundleTabs";
import HardwareCartBar from "@/components/hardware/HardwareCartBar";
import "@/styles/split/pages-hardware.css";

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
      ? "Hardware Guide & Gym Playout Bundles — Bobine"
      : "Guide Matériel & Packs — Bobine | Régie Fitness",
    description: isEn
      ? "Browse hardware ideas for Bobine by operating system and budget. Catalogue under review: check specifications, compatibility, prices and availability before buying."
      : "Parcourez des idées de matériel pour Bobine par système et budget. Catalogue en révision : caractéristiques, compatibilité, prix et disponibilité à vérifier avant achat.",
    keywords: [
      "Matériel Bobine",
      "Pack Dell Wyse 5070 J5005",
      "Dell Wyse 5070 fitness",
      "Mini PC salle de sport",
      "PC ARM Snapdragon fitness",
      "Snapdragon X Elite salle de sport",
      "Raspberry Pi 5 fitness",
      "NVIDIA DGX Spark régie",
      "Tablettes Android salle de sport",
      "Android TV fitness box",
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

  if (IS_ONION) {
    return <OnionMirrorNotice locale={currentLocale} topic="materiel" clearnetPath="/materiel/amazon" />;
  }

  const breadcrumbs = [
    { name: "Bobine", url: `/${currentLocale}` },
    {
      name: isEn ? "Hardware Guide" : "Guide Matériel",
      url: lp(currentLocale, `/materiel/amazon`),
    },
  ];


  return (
    <div
      className="container hw-div-1"
    >
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <aside className="hw-div-20" aria-label={isEn ? "Amazon affiliate disclosure" : "Affiliation Amazon"}>
        <p>
          <strong>{isEn ? "Affiliate links. " : "Liens d’affiliation. "}</strong>
          {isEn
            ? "As an Amazon Associate, bobine.fit earns from qualifying purchases."
            : "En tant que Partenaire Amazon, le site bobine.fit réalise un bénéfice sur les achats remplissant les conditions requises."}
        </p>
        <p>
          {isEn
            ? "This catalogue is being reviewed. Check prices, availability and specifications on the seller’s page before buying. A listing here does not mean the device has been tested with Bobine."
            : "Ce catalogue est en cours de révision. Vérifiez les prix, la disponibilité et les caractéristiques sur la fiche du vendeur avant tout achat. Une présence dans ce guide ne signifie pas que l’appareil a été testé avec Bobine."}
        </p>
      </aside>

      {/* 1. Les Bundles par OS (Linux, Windows, macOS, Android), avec accessoires filtrés intégrés */}
      <HardwareBundleTabs locale={currentLocale} />

      {/* 2. Panier persistant "Mon Pack" — flottant, disponible mobile & desktop */}
      <HardwareCartBar locale={currentLocale} />
    </div>
  );
}
