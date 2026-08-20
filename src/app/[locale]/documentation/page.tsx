import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Documentation",
    intro: "Pour bien démarrer, configurer vos écrans et exploiter Bobine au quotidien.",
    sections: [
      {
        slug: "manifeste",
        badge: "Vision & DA",
        title: "Manifeste & Identité",
        body: "L'histoire, le pourquoi, la philosophie libre, la direction artistique et l'origine de la mascotte Baamix.",
      },
      {
        slug: "demarrage-rapide",
        badge: "Tutoriel",
        title: "Démarrage rapide",
        body: "Le guide d'installation étape par étape sur Debian 13 pour votre mini PC, sans connaissances techniques approfondies.",
      },
      {
        slug: "utilisation",
        badge: "Guide Pratique",
        title: "Utilisation & Exploitation",
        body: "Le fonctionnement complet du panneau d'administration, de la borne cinéma membre, de la radio et des télécommandes.",
      },
      {
        slug: "faq",
        badge: "Support",
        title: "FAQ / Dépannage",
        body: "Les réponses aux questions courantes, résolution de problèmes réseau et astuces d'optimisation.",
      },
      {
        slug: "developpeurs",
        badge: "Technique",
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
        title: "Manifesto & Identity",
        body: "The story, why Bobine was built, open-source values, art direction, and the origin of Baamix.",
      },
      {
        slug: "demarrage-rapide",
        badge: "Tutorial",
        title: "Quick Start Guide",
        body: "Step-by-step installation guide on Debian 13 for your mini PC, no prior Linux expertise required.",
      },
      {
        slug: "utilisation",
        badge: "User Manual",
        title: "Daily Usage & Operations",
        body: "Complete manual for the admin interface, the member-facing cinema kiosk, background radio, and remotes.",
      },
      {
        slug: "faq",
        badge: "Support",
        title: "FAQ / Troubleshooting",
        body: "Answers to common questions, local network troubleshooting, and performance tuning tips.",
      },
      {
        slug: "developpeurs",
        badge: "Technical",
        title: "Developers & Architecture",
        body: "Internal software architecture, REST API endpoints, systemd services, and contribution guidelines.",
      },
    ],
  },
} as const;


import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";

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
    title: isEn ? "Documentation & Guides — Bobine" : "Documentation & Guides Techniques — Bobine",
    description: isEn
      ? "Official documentation for Bobine: quick start setup, system manual, troubleshooting FAQ, developer reference, and software architecture."
      : "Documentation officielle de Bobine : guide d'installation Debian, manuel d'exploitation en salle, FAQ dépannage, architecture logicielle et manifeste.",
    keywords: [
      "Documentation Bobine",
      "Guide régie vidéo salle de sport",
      "Tutoriel installation Bobine",
      "FAQ Bobine",
      "Manuel exploitation fitness",
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

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.2rem)", marginBottom: "0.35rem" }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
            {t.intro}
          </p>
        </div>
        <ShareButton
          locale={locale as Locale}
          pathname="/documentation"
          title={t.title}
          description={t.intro}
        />
      </div>


      <div style={{ display: "grid", gap: "0.75rem" }}>
        {t.sections.map((section) => (
          <Link
            key={section.slug}
            href={`/${locale}/documentation/${section.slug}`}
            className="card-interactive"
            style={{ textDecoration: "none", padding: "1rem 1.15rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <span className="badge" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                {section.badge}
              </span>
              <span style={{ color: "var(--accent-primary)", fontSize: "1.1rem", fontWeight: 700 }}>
                →
              </span>
            </div>
            <h3 className="card-title" style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>
              {section.title}
            </h3>
            <p className="card-desc" style={{ fontSize: "0.875rem" }}>{section.body}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
