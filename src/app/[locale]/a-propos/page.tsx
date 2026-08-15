import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "À propos",
    body: [
      "Bobine est né du besoin d'une alternative à LesMills Cinema qui ne dépende ni d'un abonnement, ni d'une connexion internet permanente, ni d'un éditeur tiers.",
      "Le projet est publié sous licence libre AGPL-3.0 : le code source est ouvert et auditable, et toute version modifiée exploitée en réseau doit rester ouverte dans les mêmes conditions.",
      "Bobine est utilisé en production sur du matériel dédié. Les retours, tickets et contributions sont les bienvenus sur le dépôt GitHub.",
    ],
  },
  en: {
    title: "About",
    body: [
      "Bobine was born from the need for an alternative to LesMills Cinema that depends on no subscription, no permanent internet connection, and no third-party vendor.",
      "The project is released under the AGPL-3.0 free software license: the source code is open and auditable, and any modified version run as a network service must stay open under the same terms.",
      "Bobine is in active use in production on dedicated hardware. Feedback, issues and contributions are welcome on the GitHub repository.",
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

export default async function AboutPage({
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
    </div>
  );
}
