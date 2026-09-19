import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { IS_ONION } from "@/lib/onion";
import OnionMirrorNotice from "@/components/OnionMirrorNotice";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import HardwareBundleTabs from "@/components/hardware/HardwareBundleTabs";
import HardwareCartBar from "@/components/hardware/HardwareCartBar";
import { ALIEXPRESS_ENABLED_OS, ALIEXPRESS_UNAVAILABLE_OS } from "@/content/aliexpressHardware";
import { getAliexpressCatalog } from "@/lib/aliexpress/catalog";

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
    title: isEn
      ? "AliExpress Hardware Picks for Bobine — Mini PC, Laptops & Tablets"
      : "Matériel AliExpress pour Bobine — Mini PC, PC Portables & Tablettes",
    description: isEn
      ? "Windows and Linux mini PCs and laptops plus Android tablets sourced on AliExpress for Bobine, in four tiers with several brands each, plus connectivity from brand stores. Prices refreshed live."
      : "Mini PC et PC portables Windows et Linux, tablettes Android trouvés sur AliExpress pour Bobine, en quatre gammes avec plusieurs marques chacune, plus la connectique de boutiques officielles. Prix rafraîchis en direct.",
    keywords: ["Bobine AliExpress", "Mini PC Windows AliExpress", "Matériel fitness AliExpress", "Mini PC Ryzen AliExpress"],
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

  if (IS_ONION) {
    return <OnionMirrorNotice locale={currentLocale} topic="materiel" clearnetPath="/materiel/aliexpress" />;
  }

  const { bundles, checkedAt } = await getAliexpressCatalog();

  const breadcrumbs = [
    { name: "Bobine", url: `/${currentLocale}` },
    {
      name: isEn ? "Hardware Guide" : "Guide Matériel",
      url: `/${currentLocale}/materiel/aliexpress`,
    },
  ];

  return (
    <div className="container" style={{ maxWidth: "82rem", paddingBottom: "3rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <HardwareBundleTabs
        locale={currentLocale}
        bundles={bundles}
        platform="aliexpress"
        checkedAt={checkedAt}
        enabledOs={ALIEXPRESS_ENABLED_OS}
        unavailableOs={ALIEXPRESS_UNAVAILABLE_OS}
      />

      <HardwareCartBar locale={currentLocale} />
    </div>
  );
}
