import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Confidentialité",
    sections: [
      ["Mesure d'audience", "Ce site utilise Vercel Web Analytics pour compter les visites et les pages consultées. Cet outil ne dépose aucun cookie et n'identifie pas les visiteurs individuellement (pas d'adresse IP stockée, pas de profil, pas de suivi entre sites) — aucun bandeau de consentement n'est donc nécessaire. Aucun autre outil de suivi n'est utilisé (pas de Google Analytics, pas d'équivalent)."],
      ["Contact", "Le seul moyen de contact est un lien e-mail direct (clement.barillot3901@gmail.com) — aucun formulaire ne collecte de données sur ce site."],
      ["Hébergement", "Le site est hébergé par Vercel Inc., qui peut traiter des données techniques (adresse IP, journaux serveur) dans le cadre normal de la fourniture du service d'hébergement."],
    ],
  },
  en: {
    title: "Privacy",
    sections: [
      ["Audience measurement", "This site uses Vercel Web Analytics to count visits and page views. This tool sets no cookies and does not identify individual visitors (no stored IP address, no profile, no cross-site tracking) — so no consent banner is required. No other tracking tool is used (no Google Analytics, no equivalent)."],
      ["Contact", "The only contact method is a direct email link (clement.barillot3901@gmail.com) — no form on this site collects data."],
      ["Hosting", "The site is hosted by Vercel Inc., which may process technical data (IP address, server logs) as part of normally providing the hosting service."],
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
  return { title: copy[locale].title };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "3rem", maxWidth: "40rem" }}>
      <h1>{t.title}</h1>
      {t.sections.map(([heading, body]) => (
        <section key={heading} style={{ marginBlock: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>{heading}</h2>
          <p style={{ color: "var(--text-muted)" }}>{body}</p>
        </section>
      ))}
    </div>
  );
}
