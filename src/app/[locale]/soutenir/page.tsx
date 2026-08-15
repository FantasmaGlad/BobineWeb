import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Soutenir Bobine",
    body: [
      "Bobine est un projet gratuit et open-source (AGPL-3.0), sans abonnement ni service payant.",
      "La façon la plus utile de le soutenir aujourd'hui : mettre une étoile sur le dépôt GitHub, remonter un bug ou une idée dans les Issues, ou en parler autour de vous.",
      "Un lien de don (GitHub Sponsors ou équivalent) sera ajouté ici dès qu'il sera en place.",
    ],
    cta: "Voir le dépôt sur GitHub",
  },
  en: {
    title: "Support Bobine",
    body: [
      "Bobine is a free, open-source project (AGPL-3.0), with no subscription and no paid service.",
      "The most useful way to support it today: star the GitHub repository, report a bug or an idea in the Issues, or tell people about it.",
      "A donation link (GitHub Sponsors or similar) will be added here once it's set up.",
    ],
    cta: "View the repository on GitHub",
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

export default async function SupportPage({
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
      {t.body.map((paragraph) => (
        <p key={paragraph} style={{ color: "var(--text-muted)" }}>
          {paragraph}
        </p>
      ))}
      <a className="button" href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noreferrer">
        {t.cta}
      </a>
    </div>
  );
}
