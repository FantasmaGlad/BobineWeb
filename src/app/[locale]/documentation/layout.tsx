import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import DocsSidebar from "@/components/DocsSidebar";

const sections: Record<Locale, ReadonlyArray<readonly [string, string]>> = {
  fr: [
    ["", "Vue d'ensemble"],
    ["demarrage-rapide", "Démarrage rapide"],
    ["utilisation", "Utilisation"],
    ["faq", "FAQ / Dépannage"],
    ["developpeurs", "Développeurs"],
  ],
  en: [
    ["", "Overview"],
    ["demarrage-rapide", "Quick start"],
    ["utilisation", "Usage"],
    ["faq", "FAQ / Troubleshooting"],
    ["developpeurs", "Developers"],
  ],
};

export default async function DocumentationLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="container docs-layout">
      <DocsSidebar locale={locale} items={sections[locale]} />
      <div className="docs-content__inner">{children}</div>
    </div>
  );
}
