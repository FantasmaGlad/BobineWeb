import Link from "next/link";
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

const copy = {
  fr: {
    title: "L'alternative open-source à LesMills Cinema",
    subtitle:
      "Bobine transforme un mini PC bon marché en système vidéo complet pour votre salle de sport : cours planifiés, borne à la demande, radio d'ambiance — sans cloud, sans abonnement, sans dépendance à un éditeur.",
    ctaPrimary: "Installer Bobine",
    ctaSecondary: "Voir sur GitHub",
    pointsTitle: "Pourquoi Bobine",
    points: [
      ["Vous êtes propriétaire", "Vos vidéos, votre matériel, votre planning. Pas d'abonnement, pas de compte."],
      ["Ça marche hors ligne", "Une fois installé, la salle n'a besoin d'aucune connexion internet pour diffuser les cours."],
      ["Le code est ouvert", "Licence AGPL-3.0, auditable — l'avenir du système ne dépend pas d'un éditeur tiers."],
      ["Ça tourne sur du matériel bon marché", "Un thin client ou mini PC d'occasion suffit, sans licence récurrente par écran."],
    ],
  },
  en: {
    title: "The open-source alternative to LesMills Cinema",
    subtitle:
      "Bobine turns a low-cost mini PC into a complete in-club video system: scheduled classes, an on-demand kiosk, background radio — no cloud, no subscription, no vendor lock-in.",
    ctaPrimary: "Install Bobine",
    ctaSecondary: "View on GitHub",
    pointsTitle: "Why Bobine",
    points: [
      ["You own it", "Your videos, your hardware, your schedule. No monthly fee, no account."],
      ["It works offline", "Once installed, the club needs no internet connection to run classes."],
      ["The source is open", "AGPL-3.0-licensed and auditable — the system's future doesn't depend on a vendor."],
      ["It runs on cheap hardware", "A second-hand thin client or mini PC is enough — no per-screen licence fee."],
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];

  return (
    <div className="container" style={{ paddingBlock: "3rem" }}>
      <h1 style={{ fontSize: "2.5rem", maxWidth: "40rem" }}>{t.title}</h1>
      <p style={{ fontSize: "1.15rem", maxWidth: "40rem", color: "var(--text-muted)" }}>
        {t.subtitle}
      </p>
      <div style={{ display: "flex", gap: "1rem", marginBlock: "2rem", flexWrap: "wrap" }}>
        <Link className="button" href={`/${locale}/documentation/demarrage-rapide`}>
          {t.ctaPrimary}
        </Link>
        <a
          className="button"
          style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}
          href="https://github.com/FantasmaGlad/Bobine"
          target="_blank"
          rel="noreferrer"
        >
          {t.ctaSecondary}
        </a>
      </div>

      <h2 style={{ marginTop: "3rem" }}>{t.pointsTitle}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        {t.points.map(([title, body]) => (
          <div key={title} style={{ border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "1.25rem" }}>
            <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>{title}</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
