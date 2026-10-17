import type { Metadata } from "next";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import OsDownloadGrid from "@/components/OsDownloadGrid";
import HeadlessInstallSection from "@/components/HeadlessInstallSection";
import ScrollIndicator from "@/components/ScrollIndicator";

const copy = {
  fr: {
    title: "Bobine — La régie vidéo & streaming libre pour votre salle\u00A0de\u00A0sport",
    subtitle:
      "Bobine transforme un Google Book, un PC ARM Snapdragon, un Mac mini ou un mini PC reconditionné en régie vidéo pour votre salle de sport : cours planifiés, borne cinéma à la demande, radio 24/7 — sans abonnement, sans cloud, sans\u00A0coupure.",
  },
  en: {
    title: "Bobine — The open-source video & streaming system for your fitness club",
    subtitle:
      "Bobine turns a Google Book, a Snapdragon ARM PC, a Mac mini, or a budget mini PC into a complete video system for your fitness club: scheduled classes, on-demand cinema kiosk, 24/7 radio — no fees, no cloud lock-in, no\u00A0downtime.",
  },
} as const;

import { buildMetadata } from "@/lib/seo";
import { IS_ONION } from "@/lib/onion";

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
      ? "Transform a Google Book (Aluminium OS), Qualcomm Snapdragon ARM64 laptop, Apple Silicon Mac mini, Android tablet, or budget mini PC into an autonomous, 100% offline video playout suite for gyms. The free, self-hosted alternative to Les Mills Cinema."
      : "Transformez un Google Book (Aluminium OS), un PC ARM Qualcomm Snapdragon, un Mac mini, une tablette Android ou un mini PC standard en régie vidéo autonome et 100% hors-ligne pour votre salle de sport. L'alternative libre et sans abonnement à Les Mills Cinema.",
    keywords: isEn
      ? [
          "Bobine",
          "Bobine Fit",
          "Bobine playout",
          "Google Book",
          "Googlebook",
          "Aluminium OS",
          "Bobine Google Book",
          "Application salle de sport Google Book",
          "Google Book gym app",
          "PC ARM Qualcomm Snapdragon",
          "Snapdragon X Elite",
          "Snapdragon X Plus",
          "Windows 11 ARM64",
          "Linux ARM64",
          "NVIDIA DGX Spark",
          "Mini PC ARM salle de sport",
          "Raspberry Pi 5 salle de sport",
          "Orange Pi 5 RK3588",
          "Gym video playout",
          "Les Mills Cinema alternative",
          "Les Mills Virtual alternative",
          "Wexer alternative",
          "Fitness digital signage",
          "Gym streaming playout",
          "Virtual fitness kiosk",
          "Group fitness video player",
          "Dell Wyse 5070 gym",
          "Open-source fitness software",
        ]
      : [
          "Bobine",
          "Bobine Fit",
          "Google Book",
          "Googlebook",
          "Aluminium OS",
          "Bobine Google Book",
          "Application salle de sport Google Book",
          "PC ARM Qualcomm Snapdragon",
          "Snapdragon X Elite",
          "Snapdragon X Plus",
          "Windows 11 ARM64",
          "Linux ARM64",
          "NVIDIA DGX Spark",
          "Mini PC ARM salle de sport",
          "Raspberry Pi 5 salle de sport",
          "Orange Pi 5 RK3588",
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
        {/* Illustration décorative en fond à gauche : Google Book compatible Bobine (via APK Android et bientôt Google Play Store natif) */}
        {!IS_ONION && (
          <div className="hero-fullscreen__backdrop-art hero-fullscreen__backdrop-art--left" aria-hidden="true">
            <Image
              src="/images/googlebooks.webp"
              alt={locale === "en" ? "Google Book compatible with Bobine" : "Google Book compatible avec Bobine"}
              className="hero-fullscreen__backdrop-img hero-fullscreen__backdrop-img--googlebook"
              width={1024}
              height={1024}
              sizes="(max-width: 639px) 220px, (max-width: 1023px) 380px, 540px"
              priority
            />
          </div>
        )}

        {/* Illustration décorative en fond à droite : le renard Firefox et Baamix (soutien au projet Firefox) ; le miroir Tor garde son visuel dédié */}
        <div className="hero-fullscreen__backdrop-art" aria-hidden="true">
          <Image
            src={IS_ONION ? "/images/baamix-tor.webp" : "/images/FirefoxBaamix.webp"}
            alt={IS_ONION ? "Bobine sur Android TV & Grand Écran" : "Le renard Firefox et Baamix, la mascotte de Bobine"}
            className={IS_ONION ? "hero-fullscreen__backdrop-img" : "hero-fullscreen__backdrop-img hero-fullscreen__backdrop-img--mascot"}
            width={IS_ONION ? 1280 : 1000}
            height={IS_ONION ? 720 : 895}
            sizes="(max-width: 639px) 240px, (max-width: 1023px) 480px, 640px"
            priority
          />
        </div>

        <div className="hero-fullscreen__content">
          <OsDownloadGrid
            locale={locale as Locale}
            title={t.title}
            subtitle={t.subtitle}
          />
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
