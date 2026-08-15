import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Confidentialité",
    sections: [
      ["Aucun suivi", "Ce site ne dépose aucun cookie de suivi et n'utilise aucun outil d'analyse d'audience (pas de Google Analytics, pas d'équivalent). Aucune donnée de navigation n'est collectée."],
      ["Contact", "Le seul moyen de contact est un lien e-mail direct (clement.barillot3901@gmail.com) — aucun formulaire ne collecte de données sur ce site."],
      ["Hébergement", "Le site est hébergé par Vercel Inc., qui peut traiter des données techniques (adresse IP, journaux serveur) dans le cadre normal de la fourniture du service d'hébergement."],
    ],
  },
  en: {
    title: "Privacy",
    sections: [
      ["No tracking", "This site sets no tracking cookies and uses no audience-analytics tool (no Google Analytics, no equivalent). No browsing data is collected."],
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
