import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const copy = {
  fr: {
    title: "Documentation",
    intro: "Pour bien démarrer, puis pour aller plus loin.",
    sections: [
      ["demarrage-rapide", "Démarrage rapide", "Le tutoriel pas-à-pas pour installer Bobine sur votre mini PC, sans prérequis technique."],
      ["utilisation", "Utilisation", "Le guide de l'admin, de la borne membre, de la radio et de la télécommande."],
      ["faq", "FAQ / Dépannage", "Réponses aux questions les plus fréquentes."],
      ["developpeurs", "Développeurs", "Architecture technique, API, et guide de contribution."],
    ],
  },
  en: {
    title: "Documentation",
    intro: "Everything to get started, then to go further.",
    sections: [
      ["demarrage-rapide", "Quick start", "The step-by-step tutorial to install Bobine on your mini PC, no technical background required."],
      ["utilisation", "Usage", "The guide to the admin panel, member kiosk, radio and remote."],
      ["faq", "FAQ / Troubleshooting", "Answers to the most common questions."],
      ["developpeurs", "Developers", "Technical architecture, API reference, and contribution guide."],
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

export default async function DocumentationIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "3rem" }}>
      <h1>{t.title}</h1>
      <p style={{ color: "var(--text-muted)" }}>{t.intro}</p>
      <div style={{ display: "grid", gap: "1rem", marginTop: "2rem", maxWidth: "40rem" }}>
        {t.sections.map(([slug, title, body]) => (
          <Link
            key={slug}
            href={`/${locale}/documentation/${slug}`}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              textDecoration: "none",
              color: "var(--text)",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>{body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
