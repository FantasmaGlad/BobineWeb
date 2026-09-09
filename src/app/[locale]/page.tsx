import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import OsDownloadGrid from "@/components/OsDownloadGrid";
import HeadlessInstallSection from "@/components/HeadlessInstallSection";
import ScrollIndicator from "@/components/ScrollIndicator";
import AndroidIcon from "@/components/icons/AndroidIcon";

const copy = {
  fr: {
    title: "Bobine — La régie vidéo & streaming libre pour votre salle de sport",
    subtitle:
      "Bobine transforme un Mac mini, un laptop ou un mini PC reconditionné en régie vidéo pour votre salle de sport : cours planifiés, borne cinéma à la demande, radio 24/7 — sans abonnement, sans cloud, sans coupure.",
  },
  en: {
    title: "Bobine — The open-source video & streaming system for your fitness club",
    subtitle:
      "Bobine turns a Mac mini, a laptop, or a budget mini PC into a complete video system for your fitness club: scheduled classes, on-demand cinema kiosk, 24/7 radio — no fees, no cloud lock-in, no downtime.",
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
        {/* Composition décorative Android Release en fond à droite */}
        <div className="hero-fullscreen__backdrop-art" aria-hidden="true">
          <div className="hero-fullscreen__android-badge">
            <AndroidIcon size={16} color="var(--android-badge-fg)" className="hero-fullscreen__android-badge-icon" />
            <span>
              {locale === "en"
                ? "Now available on Android! 09/09/2026"
                : "Désormais disponible sur Android ! 09/09/2026"}
            </span>
          </div>
          <img
            src="/images/AndroidRelease.png"
            alt=""
            className="hero-fullscreen__backdrop-img"
            width={720}
            height={720}
            loading="eager"
          />
        </div>

        <div className="hero-fullscreen__content">
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
