import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import OsDownloadGrid from "@/components/OsDownloadGrid";
import HeadlessInstallSection from "@/components/HeadlessInstallSection";
import ScrollIndicator from "@/components/ScrollIndicator";

const copy = {
  fr: {
    title: "Bobine — La régie vidéo & streaming libre pour votre salle de sport",
    subtitle:
      "Bobine transforme un mini PC bon marché en système vidéo complet pour votre espace fitness : cours planifiés, borne cinéma à la demande, radio d'ambiance 24/7 — sans abonnement, sans dépendance au cloud, sans coupure.",
  },
  en: {
    title: "Bobine — The open-source video & streaming system for your fitness club",
    subtitle:
      "Bobine turns a low-cost mini PC into a complete in-club multimedia system: scheduled classes, on-demand cinema kiosk, 24/7 background radio — no monthly fees, no cloud lock-in, no downtime.",
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
    pathname: "",
    title: isEn
      ? "Bobine Fit — Open-Source Gym Video Playout & Streaming"
      : "Bobine Fit — Régie vidéo & streaming open-source pour salle de sport",
    description: isEn
      ? "Transform standard budget mini PCs into an autonomous, 100% offline video playout suite for gyms. The free, self-hosted alternative to Les Mills Cinema."
      : "Transformez un mini PC standard en régie vidéo autonome et 100% hors-ligne pour votre salle de sport. L'alternative libre et sans abonnement à Les Mills Cinema.",
    keywords: [
      "Bobine",
      "Régie vidéo salle de sport",
      "Alternative Les Mills Cinema",
      "Affichage dynamique fitness",
      "Streaming vidéo salle de sport",
      "Cours collectifs vidéo fitness",
      "Dell Wyse 5070 streaming",
      "Logiciel libre sport",
    ],
  });
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
    <div className="container">
      {/* 1. Hero Section — Plein écran propre sur Desktop et Mobile */}
      <section className="hero-fullscreen">
        <div>
          <h1 className="hero-fullscreen__title">
            {t.title}
          </h1>

          <p className="hero-fullscreen__subtitle">
            {t.subtitle}
          </p>

          {/* Grille de téléchargement direct pour les 4 OS (Linux, Windows, macOS, Android) */}
          <OsDownloadGrid locale={locale as Locale} />
        </div>

        <ScrollIndicator
          locale={locale as Locale}
          label={locale === "en" ? "Other installation methods" : "Autres méthodes d'installation"}
          targetId="headless-installation"
        />
      </section>

      {/* 2. Installation Headless & Démonstrations Dédiées (Bash CLI & Bobine Assistant Tauri) */}
      <HeadlessInstallSection locale={locale as Locale} />
    </div>
  );
}
