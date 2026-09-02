"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

interface ComparatifNavProps {
  locale: Locale;
  currentTitle?: string;
}

export default function ComparatifNav({ locale, currentTitle }: ComparatifNavProps) {
  const pathname = usePathname();
  const isEn = locale === "en";

  const navItems = [
    {
      href: `/${locale}/comparatif`,
      label: isEn ? "Overview" : "Vue d'ensemble",
      shortLabel: isEn ? "Hub" : "Hub",
    },
    {
      href: `/${locale}/comparatif/les-mills-cinema`,
      label: "vs Les Mills Cinema",
      shortLabel: "Les Mills",
    },
    {
      href: `/${locale}/comparatif/wexer-fitness-on-demand`,
      label: "vs Wexer & FOD",
      shortLabel: "Wexer / FOD",
    },
    {
      href: `/${locale}/comparatif/radical-fitness-yako`,
      label: "vs Radical & Yako",
      shortLabel: "Radical / Yako",
    },
    {
      href: `/${locale}/comparatif/affichage-dynamique-fitness`,
      label: isEn ? "vs Digital Signage" : "vs Affichage Dynamique",
      shortLabel: isEn ? "Digital Signage" : "Affichage Dyn.",
    },
  ];

  const currentItem = navItems.find((item) => item.href === pathname);
  const pageName = currentTitle || currentItem?.label || (isEn ? "Comparisons" : "Comparatifs");

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "Comparisons" : "Comparatifs", url: `/${locale}/comparatif` },
    ...(pathname !== `/${locale}/comparatif`
      ? [{ name: pageName, url: pathname }]
      : []),
  ];

  // Sur la page d'accueil du comparatif, ne pas afficher l'arborescence "Accueil / Comparatifs"
  if (pathname === `/${locale}/comparatif`) {
    return <BreadcrumbsJsonLd items={breadcrumbs} />;
  }

  return (
    <div className="comparatif-nav-container" style={{ marginBottom: "1.5rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* Barre d'outils supérieure : Fil d'Ariane & Bouton Partager */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          paddingTop: "1rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <nav aria-label="Breadcrumb" style={{ fontSize: "0.835rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
          <Link href={`/${locale}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>
            {isEn ? "Home" : "Accueil"}
          </Link>
          <span>/</span>
          <Link
            href={`/${locale}/comparatif`}
            style={{
              color: pathname === `/${locale}/comparatif` ? "var(--accent-primary)" : "var(--text-muted)",
              fontWeight: pathname === `/${locale}/comparatif` ? 600 : 400,
              textDecoration: "none",
            }}
          >
            {isEn ? "Comparisons" : "Comparatifs"}
          </Link>
          {pathname !== `/${locale}/comparatif` && (
            <>
              <span>/</span>
              <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>
                {pageName}
              </span>
            </>
          )}
        </nav>

        <ShareButton
          locale={locale}
          pathname={pathname}
          title={pageName}
          description={isEn ? "Bobine gym video playout comparison" : "Comparatif régie vidéo fitness Bobine"}
        />
      </div>
    </div>
  );
}
