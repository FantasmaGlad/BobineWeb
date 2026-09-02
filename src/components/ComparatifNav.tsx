"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

interface ComparatifNavProps {
  locale: Locale;
  currentTitle?: string;
}

export default function ComparatifNav({ locale, currentTitle }: ComparatifNavProps) {
  const pathname = usePathname();
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "Comparisons" : "Comparatifs", url: `/${locale}/comparatif` },
    ...(pathname !== `/${locale}/comparatif`
      ? [{ name: currentTitle || (isEn ? "Comparison" : "Comparatif"), url: pathname }]
      : []),
  ];

  // Métadonnées SEO uniquement — l'arborescence visuelle est masquée pour une vue épurée
  return <BreadcrumbsJsonLd items={breadcrumbs} />;
}
