import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import GitHubIcon from "@/components/icons/GitHubIcon";
import CoffeeCupIcon from "@/components/icons/CoffeeCupIcon";

const copy = {
  fr: {
    title: "Soutenir Bobine",
    subtitle: "Bobine est un logiciel libre (AGPL-3.0), gratuit, sans publicité et sans abonnement.",
    cards: [
      {
        title: "Contribuer financièrement",
        desc: "Un don ponctuel ou récurrent sur Ko-fi aide directement à financer le matériel de test (mini PC, télécommandes, cartes son), le nom de domaine et les serveurs d'intégration.",
      },
      {
        title: "Contribuer au code & aux retours",
        desc: "Une étoile sur le dépôt GitHub, un retour d'expérience en salle, une traduction ou une suggestion d'amélioration dans les Issues nous aide tout autant à faire grandir le projet.",
      },
    ],
    ctaKofi: "Faire un don sur Ko-fi",
    ctaGithub: "Rejoindre sur GitHub",
  },
  en: {
    title: "Support Bobine",
    subtitle: "Bobine is free, open-source software (AGPL-3.0) with no subscriptions and no ads.",
    cards: [
      {
        title: "Financial Support",
        desc: "A one-off or monthly donation on Ko-fi directly funds test hardware (mini PCs, wireless remotes, audio DACs), the domain name, and CI infrastructure.",
      },
      {
        title: "Code & Community Feedback",
        desc: "Starring the repository on GitHub, sharing your club deployment feedback, submitting a translation, or opening an issue helps us just as much.",
      },
    ],
    ctaKofi: "Donate on Ko-fi",
    ctaGithub: "Join on GitHub",
  },
} as const;

import { buildMetadata } from "@/lib/seo";

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
    pathname: "/soutenir",
    title: isEn ? "Support & Contribute — Bobine" : "Soutenir & Contribuer — Bobine",
    description: isEn
      ? "Support the development of Bobine, the free, open-source playout system for sports clubs. Donate on Ko-fi or contribute on GitHub."
      : "Soutenez le développement de Bobine, la régie vidéo open-source pour salles de sport. Faites un don sur Ko-fi ou contribuez sur GitHub.",
  });
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
    <div className="container" style={{ paddingBlock: "1.5rem", maxWidth: "48rem" }}>
      <h1 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", marginBottom: "0.5rem" }}>{t.title}</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
        {t.subtitle}
      </p>

      <div style={{ display: "grid", gap: "0.85rem", marginBottom: "1.25rem" }}>
        {t.cards.map((card) => (
          <div key={card.title} className="card-interactive" style={{ padding: "1.15rem" }}>
            <h3 className="card-title" style={{ fontSize: "1.05rem", marginBottom: "0.25rem" }}>
              {card.title}
            </h3>
            <p className="card-desc" style={{ fontSize: "0.9rem" }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <a
          className="btn-primary"
          href="https://ko-fi.com/fantasmaglad"
          target="_blank"
          rel="noreferrer"
        >
          <CoffeeCupIcon size={16} />
          {t.ctaKofi}
        </a>
        <a
          className="btn-secondary"
          href="https://github.com/FantasmaGlad/Bobine"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon size={16} />
          {t.ctaGithub}
        </a>
      </div>
    </div>
  );
}

