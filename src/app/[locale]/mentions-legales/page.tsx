import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

const copy = {
  fr: {
    badge: "Transparence & Cadre Légal",
    title: "Mentions Légales",
    subtitle: "Informations légales relatives à l'éditeur, à l'hébergement et aux droits d'utilisation du projet open-source Bobine.",
    sections: [
      {
        heading: "1. Éditeur du Site & Direction de la Publication",
        body: "Le site bobine.fit est développé et maintenu à titre indépendant par Clément Barillot (FantasmaGlad), développeur et auteur du projet libre Bobine.",
        contact: "Contact direct : clement.barillot3901@gmail.com",
        subtext: "Dépôt officiel du code source et suivi des versions : github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "2. Hébergement de l'Infrastructure Web",
        body: "Le site web bobine.fit est hébergé sur le réseau mondial distribué Edge de la société Vercel Inc.",
        contact: "Siège social : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis",
        subtext: "Site officiel de l'hébergeur : vercel.com",
      },
      {
        heading: "3. Propriété Intellectuelle & Licence Logicielle",
        body: "L'ensemble du code source du logiciel Bobine est mis à disposition sous licence libre GNU Affero General Public License v3.0 (AGPL-3.0).",
        contact: "Liberté d'usage : Vous êtes libre d'utiliser, d'étudier, de modifier, de compiler et de redistribuer Bobine sans redevance.",
        subtext: "Les marques et logos cités (ex: Dell Wyse, Intel QuickSync, Les Mills) appartiennent à leurs propriétaires respectifs et sont utilisés uniquement à des fins d'interopérabilité technique et de comparaison descriptive.",
      },
      {
        heading: "4. Absence d'Activité Commerciale & Responsabilité",
        body: "Le site bobine.fit est une plateforme d'information, de téléchargement et de documentation technique. Aucune transaction financière, aucun abonnement payant et aucune vente de matériel ou de prestation n'est opérée sur ce site.",
        contact: "Le logiciel Bobine est fourni « en l'état », sans garantie expresse ou implicite, conformément aux termes de la licence AGPL-3.0.",
        subtext: "Les gérants de salle de sport et exploitants restent responsables de la conformité de leurs équipements de diffusion audiovisuelle.",
      },
    ],
  },
  en: {
    badge: "Transparency & Legal Framework",
    title: "Legal Notice",
    subtitle: "Legal information regarding the publisher, hosting provider, and terms of use of the open-source Bobine project.",
    sections: [
      {
        heading: "1. Site Publisher & Maintainer",
        body: "The website bobine.fit is independently created and maintained by Clément Barillot (FantasmaGlad), lead author and developer of the open-source Bobine project.",
        contact: "Direct contact: clement.barillot3901@gmail.com",
        subtext: "Official repository and version tracking: github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "2. Hosting Provider",
        body: "The website bobine.fit is deployed on the global distributed Edge network of Vercel Inc.",
        contact: "Headquarters: Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
        subtext: "Official hosting provider website: vercel.com",
      },
      {
        heading: "3. Intellectual Property & Software License",
        body: "The entire source code of Bobine is distributed under the GNU Affero General Public License v3.0 (AGPL-3.0).",
        contact: "Freedom of use: You are free to run, study, adapt, compile, and redistribute Bobine without license fees.",
        subtext: "Third-party trademarks and names mentioned (e.g., Dell Wyse, Intel QuickSync, Les Mills) remain the property of their respective owners and are referenced solely for technical interoperability and descriptive comparison.",
      },
      {
        heading: "4. Non-Commercial Status & Disclaimer",
        body: "The website bobine.fit is an informational showcase and documentation hub. No commercial subscriptions, paid transactions, or direct hardware sales are performed on this platform.",
        contact: "Bobine is provided 'as is' without warranty of any kind, in accordance with the AGPL-3.0 license.",
        subtext: "Gym owners and operators remain responsible for their local hardware installation and media broadcasting compliance.",
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
    pathname: "/mentions-legales",
    title: isEn ? "Legal Notice — Bobine" : "Mentions Légales — Bobine",
    description: isEn
      ? "Legal information and hosting details for the Bobine open-source project."
      : "Informations légales et hébergement du site vitrine et de documentation du projet libre Bobine.",
  });
}

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "Legal Notice" : "Mentions Légales", url: `/${locale}/mentions-legales` },
  ];

  return (
    <div className="container" style={{ paddingBlock: "clamp(1.25rem, 3vh, 2.5rem)", maxWidth: "52rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div style={{ textAlign: "center", marginBottom: "clamp(1.5rem, 3vw, 2.25rem)" }}>
        <span className="feature-category-label">{t.badge}</span>
        <h1
          style={{
            fontSize: "clamp(1.65rem, 3.8vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBlock: "0.35rem 0.65rem",
            color: "var(--text-heading)",
          }}
        >
          {t.title}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.55, margin: 0, maxWidth: "42rem", marginInline: "auto" }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
        {t.sections.map((sec) => (
          <div
            key={sec.heading}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.75rem",
              padding: "1.15rem 1.35rem",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--text-heading)",
                marginBottom: "0.45rem",
                letterSpacing: "-0.02em",
              }}
            >
              {sec.heading}
            </h2>
            <p style={{ color: "var(--text-main)", fontSize: "0.885rem", lineHeight: 1.6, margin: 0, marginBottom: "0.45rem" }}>
              {sec.body}
            </p>
            {sec.contact && (
              <p style={{ color: "var(--accent-primary)", fontSize: "0.825rem", fontWeight: 600, margin: 0, marginBottom: "0.3rem" }}>
                {sec.contact}
              </p>
            )}
            {sec.subtext && (
              <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", lineHeight: 1.45, margin: 0 }}>
                {sec.subtext}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
