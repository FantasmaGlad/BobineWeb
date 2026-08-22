import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import QuickInstallSnippet from "@/components/QuickInstallSnippet";

const copy = {
  fr: {
    title: "Documentation",
    intro: "Pour bien démarrer, configurer vos écrans et exploiter Bobine au quotidien.",
    sections: [
      {
        slug: "manifeste",
        badge: "Vision & DA",
        readTime: "4 min",
        title: "Manifeste & Identité",
        body: "L'histoire, le pourquoi, la philosophie libre, la direction artistique et l'origine de la mascotte Baamix.",
      },
      {
        slug: "demarrage-rapide",
        badge: "Tutoriel",
        readTime: "6 min",
        title: "Démarrage rapide",
        body: "Le guide d'installation étape par étape sur Debian 13 pour votre mini PC, sans connaissances techniques approfondies.",
      },
      {
        slug: "utilisation",
        badge: "Guide Pratique",
        readTime: "8 min",
        title: "Utilisation & Exploitation",
        body: "Le fonctionnement complet du panneau d'administration, de la borne cinéma membre, de la radio et des télécommandes.",
      },
      {
        slug: "faq",
        badge: "Support",
        readTime: "5 min",
        title: "FAQ / Dépannage",
        body: "Les réponses aux questions courantes, résolution de problèmes réseau et astuces d'optimisation.",
      },
      {
        slug: "developpeurs",
        badge: "Technique",
        readTime: "7 min",
        title: "Développeurs & Architecture",
        body: "Architecture interne, endpoints d'API, services systemd, stack logicielle et guide de contribution.",
      },
    ],
  },
  en: {
    title: "Documentation",
    intro: "Everything to get started, configure your screens, and operate Bobine smoothly.",
    sections: [
      {
        slug: "manifeste",
        badge: "Vision & DA",
        readTime: "4 min",
        title: "Manifesto & Identity",
        body: "The story, why Bobine was built, open-source values, art direction, and the origin of Baamix.",
      },
      {
        slug: "demarrage-rapide",
        badge: "Tutorial",
        readTime: "6 min",
        title: "Quick Start Guide",
        body: "Step-by-step installation guide on Debian 13 for your mini PC, no prior Linux expertise required.",
      },
      {
        slug: "utilisation",
        badge: "User Manual",
        readTime: "8 min",
        title: "Daily Usage & Operations",
        body: "Complete manual for the admin interface, the member-facing cinema kiosk, background radio, and remotes.",
      },
      {
        slug: "faq",
        badge: "Support",
        readTime: "5 min",
        title: "FAQ / Troubleshooting",
        body: "Answers to common questions, local network troubleshooting, and performance tuning tips.",
      },
      {
        slug: "developpeurs",
        badge: "Technical",
        readTime: "7 min",
        title: "Developers & Architecture",
        body: "Internal software architecture, REST API endpoints, systemd services, and contribution guidelines.",
      },
    ],
  },
} as const;

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
    pathname: "/documentation",
    title: isEn
      ? "Documentation & Playout Guides — Bobine | Les Mills Cinema Alternative"
      : "Documentation & Guides Techniques — Bobine | Alternative Les Mills Cinema",
    description: isEn
      ? "Official documentation for Bobine: quick start setup, system manual, troubleshooting FAQ, developer reference, and software architecture."
      : "Documentation officielle de Bobine : guide d'installation Debian, manuel d'exploitation en salle, FAQ dépannage, architecture logicielle et manifeste.",
    keywords: [
      "Documentation Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Guide régie vidéo salle de sport",
      "Tutoriel installation Bobine",
      "FAQ Bobine",
      "Manuel exploitation fitness",
      "Gym video automation manual",
    ],
  });
}

export default async function DocumentationIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: t.title, url: `/${locale}/documentation` },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="doc-hero-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span className="feature-category-label">
            {locale === "en" ? "Knowledge Base & Guides" : "Base de Connaissances & Guides"}
          </span>
          <h1 className="doc-hero-title">
            {t.title}
          </h1>
          <p className="doc-hero-intro">
            {t.intro}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation"
            title={t.title}
            description={t.intro}
          />
        </div>
      </div>

      {/* Encart Commande d'installation rapide en 1 ligne */}
      <QuickInstallSnippet locale={locale as Locale} />

      {/* Liste des chapitres — Mise en page ouverte, lignes fines */}
      <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--border-subtle)" }}>
        {t.sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${locale}/documentation/${section.slug}`}
            className="doc-open-row"
            style={{
              textDecoration: "none",
              paddingBlock: "1.35rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1.5rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxWidth: "48rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="badge" style={{ fontSize: "0.725rem", padding: "0.15rem 0.5rem" }}>
                  {section.badge} · {section.readTime}
                </span>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "var(--text-heading)" }}>
                  {section.title}
                </h2>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.925rem", lineHeight: 1.55, margin: 0 }}>
                {section.body}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
