import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import DocsSidebar from "@/components/DocsSidebar";
import DocsSearch from "@/components/DocsSearch";

const sections: Record<Locale, ReadonlyArray<readonly [string, string]>> = {
  fr: [
    ["", "Vue d'ensemble"],
    ["manifeste", "Manifeste & Identité"],
    ["demarrage-rapide", "Démarrage rapide"],
    ["utilisation", "Utilisation"],
    ["faq", "FAQ / Dépannage"],
    ["developpeurs", "Développeurs"],
  ],
  en: [
    ["", "Overview"],
    ["manifeste", "Manifesto & Identity"],
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "en" ? "Home" : "Accueil",
        item: `https://bobine.fit/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Documentation",
        item: `https://bobine.fit/${locale}/documentation`,
      },
    ],
  };

  return (
    <div className="docs-page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="docs-layout">
        <aside className="docs-sidebar-panel">
          <div className="docs-sidebar-sticky">
            <DocsSearch locale={locale} />
            <div className="docs-sidebar-nav-wrapper">
              <span className="docs-sidebar-section-title">
                {locale === "en" ? "Documentation" : "Navigation"}
              </span>
              <DocsSidebar locale={locale} items={sections[locale]} />
            </div>
          </div>
        </aside>

        <main className="docs-main-panel">
          <article className="docs-content">
            <div className="docs-content__inner">{children}</div>
          </article>
        </main>
      </div>
    </div>
  );
}
