import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Soutenir Bobine",
    body: [
      "Bobine est un projet gratuit et open-source (AGPL-3.0), sans abonnement ni service payant.",
      "Un don ponctuel ou récurrent sur Ko-fi aide à couvrir l'hébergement, le nom de domaine et le matériel de test. Sinon, une étoile sur le dépôt GitHub ou un bug remonté dans les Issues aide tout autant.",
    ],
    ctaKofi: "Faire un don sur Ko-fi",
    ctaGithub: "Voir le dépôt sur GitHub",
  },
  en: {
    title: "Support Bobine",
    body: [
      "Bobine is a free, open-source project (AGPL-3.0), with no subscription and no paid service.",
      "A one-off or recurring donation on Ko-fi helps cover hosting, the domain, and test hardware. Otherwise, starring the GitHub repository or reporting a bug in the Issues helps just as much.",
    ],
    ctaKofi: "Donate on Ko-fi",
    ctaGithub: "View the repository on GitHub",
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
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <a className="button" href="https://ko-fi.com/fantasmaglad" target="_blank" rel="noreferrer">
          {t.ctaKofi}
        </a>
        <a
          className="button"
          style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
          href="https://github.com/FantasmaGlad/Bobine"
          target="_blank"
          rel="noreferrer"
        >
          {t.ctaGithub}
        </a>
      </div>
    </div>
  );
}
