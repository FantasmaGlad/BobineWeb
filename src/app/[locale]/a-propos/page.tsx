import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import GitHubIcon from "@/components/icons/GitHubIcon";

const copy = {
  fr: {
    title: "L'histoire & la vision de Bobine",
    body: [
      "Bobine est né du besoin d'une alternative libre et locale aux systèmes propriétaires de streaming et de vidéo pour salles de sport, qui ne dépende ni d'un abonnement récurrent par écran, ni d'une connexion internet permanente, ni des décisions d'un éditeur tiers.",
      "Le projet est publié sous licence libre AGPL-3.0 : le code source est ouvert, auditable et pérenne. Toute version modifiée exploitée sur un réseau doit rester ouverte dans les mêmes conditions de transparence.",
      "Bobine est activement utilisé en production sur du matériel dédié. Les retours d'expérience en salle, les suggestions d'amélioration et les contributions de code sont les bienvenus sur le dépôt GitHub.",
    ],
    ctaGithub: "Explorer le code source sur GitHub",
    ctaDoc: "Lire la documentation",
  },
  en: {
    title: "The Story & Vision Behind Bobine",
    body: [
      "Bobine was created to provide a free, self-hosted alternative to proprietary in-club fitness video streaming platforms, removing recurring per-screen fees, cloud lock-in, and reliance on permanent internet connectivity.",
      "The project is released under the AGPL-3.0 free software license: source code is open, auditable, and durable. Any modified version operated over a network must remain open under the same transparent terms.",
      "Bobine is in active daily production use on dedicated on-premise hardware. Practical club feedback, feature suggestions, and code contributions are always welcome on GitHub.",
    ],
    ctaGithub: "Explore Source Code on GitHub",
    ctaDoc: "Read Documentation",
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "1.5rem", maxWidth: "48rem" }}>
      <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", marginBottom: "1rem" }}>{t.title}</h1>

      <div className="card-interactive" style={{ padding: "1.25rem", marginBottom: "1.25rem" }}>
        {t.body.map((paragraph, index) => (
          <p
            key={index}
            style={{
              color: "var(--text-main)",
              fontSize: "0.95rem",
              lineHeight: 1.55,
              marginBottom: index === t.body.length - 1 ? 0 : "0.75rem",
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <a
          className="btn-primary"
          href="https://github.com/FantasmaGlad/Bobine"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon size={16} />
          {t.ctaGithub}
        </a>
        <Link className="btn-secondary" href={`/${locale}/documentation`}>
          {t.ctaDoc}
        </Link>
      </div>
    </div>
  );
}

