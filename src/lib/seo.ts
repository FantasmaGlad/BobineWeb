import type { Metadata } from "next";
import { type Locale } from "./i18n";
import { IS_ONION } from "./onion";
import { EN_SLUG_MAP } from "./slugs";

import { CLEARNET_URL } from "./onion";

const BASE_URL = CLEARNET_URL;

/** Identité du site pour les données structurées. */
export const SITE_NAME = "Bobine Fit";
export const AUTHOR_NAME = "Clément Barillot";

export interface SeoProps {
  locale: Locale;
  pathname: string; // e.g. "", "/fonctionnalites", "/documentation/demarrage-rapide"
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

export { EN_SLUG_MAP };

/**
 * Adresse interne d'une page, avec le slug de sa langue : `lp("en", "/fonctionnalites")` donne
 * `/en/features`. Un lien vers le slug français sous `/en` passe par une redirection 308, que
 * Search Console compte comme « page avec redirection ».
 */
export function lp(locale: Locale, pathname: string): string {
  // L'export statique du miroir Tor ne porte ni réécriture ni redirection : seuls les dossiers
  // réels (slugs français) y existent.
  if (IS_ONION) return `/${locale}${pathname}`;
  return `/${locale}${getLocalizedPath(pathname, locale)}`;
}

const FR_FROM_EN = Object.fromEntries(
  Object.entries(EN_SLUG_MAP)
    .filter(([fr]) => fr !== "/materiel")
    .map(([fr, en]) => [en, fr])
);

/** Chemin français (dossier réel) d'un chemin sans préfixe de langue, qu'il soit français ou anglais. */
export function toFrenchPath(pathname: string): string {
  return FR_FROM_EN[pathname] ?? pathname;
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  if (locale === "en") {
    return EN_SLUG_MAP[pathname] ?? pathname;
  }
  return pathname;
}

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  keywords,
  image = `/${locale}/opengraph-image`,
  type = "website",
  publishedTime,
}: SeoProps): Metadata {
  const cleanTitle = title.replace(/\s*([·—|]\s*Bobine.*)$/i, "").trim() || title;
  const frPath = pathname;
  const enPath = EN_SLUG_MAP[pathname] ?? pathname;
  const currentPath = locale === "en" ? enPath : frPath;
  const currentUrl = `${BASE_URL}/${locale}${currentPath}`;
  const frUrl = `${BASE_URL}/fr${frPath}`;
  const enUrl = `${BASE_URL}/en${enPath}`;

  const defaultKeywords =
    locale === "en"
      ? [
          "Bobine",
          "Bobine Fit",
          "Bobine playout",
          "Bobine GitHub",
          "Bobine open source",
          "Google Book",
          "Googlebook",
          "Aluminium OS",
          "Bobine Google Book",
          "Google Book gym app",
          "Application salle de sport Google Book",
          "Qualcomm Snapdragon ARM PC",
          "PC ARM Qualcomm Snapdragon",
          "Snapdragon X Elite",
          "Snapdragon X Plus",
          "Windows 11 ARM64",
          "Linux ARM64",
          "NVIDIA DGX Spark",
          "ARM mini PC gym",
          "Mini PC ARM salle de sport",
          "Raspberry Pi 5 gym playout",
          "Raspberry Pi 5 salle de sport",
          "Orange Pi 5 RK3588",
          "Les Mills Cinema",
          "Les Mills Virtual",
          "Les Mills Cinema alternative",
          "Les Mills Virtual alternative",
          "Les Mills free alternative",
          "Wexer alternative",
          "Spivi alternative",
          "Fitness On Demand alternative",
          "gym video playout",
          "gym video player",
          "virtual fitness kiosk",
          "fitness studio video automation",
          "scheduled fitness classes video",
          "offline gym video playout",
          "gym digital signage",
          "self-hosted fitness software",
          "open source gym software",
          "free gym playout",
          "group fitness scheduler",
          "fitness kiosk on-demand",
        ]
      : [
          "Bobine",
          "Bobine fit",
          "Bobine Github",
          "Bobine Open Source",
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
          "Les Mills",
          "Les Mills Cinema",
          "Alternative Les Mills",
          "Alternative Les Mills Cinema",
          "Alternative Les Mills Virtual",
          "Les Mills sans abonnement",
          "Régie vidéo salle de sport",
          "Régie vidéo fitness",
          "Diffusion cours collectifs vidéo",
          "Cours vidéo fitness hors-ligne",
          "Borne tactile cinéma fitness",
          "Playout vidéo salle de sport",
          "Affichage dynamique fitness",
          "Affichage dynamique salle de sport",
          "Alternative Screenly Anthias",
          "Alternative Xibo fitness",
          "Alternative Yodeck sport",
          "Alternative Wexer fitness",
          "Alternative Spivi",
          "Digital signage salle de sport",
          "Logiciel libre sport",
          "Gym video playout",
          "Virtual fitness kiosk",
          "Open-source fitness automation",
        ];

  return {
    title: cleanTitle,
    description,
    authors: [{ name: "Clément Barillot", url: "https://github.com/FantasmaGlad" }],
    creator: "Clément Barillot (FantasmaGlad)",
    publisher: "Bobine Fit",
    keywords: keywords ?? defaultKeywords,
    alternates: {
      canonical: currentUrl,
      languages: {
        "fr": frUrl,
        "en": enUrl,
        "fr-FR": frUrl,
        "en-US": enUrl,
        "x-default": frUrl,
      },
      types: { "application/atom+xml": `${BASE_URL}/feed.xml` },
    },
    openGraph: {
      type,
      siteName: "Bobine",
      title: `${cleanTitle} · Bobine`,
      description,
      url: currentUrl,
      locale: locale === "en" ? "en_US" : "fr_FR",
      alternateLocale: locale === "en" ? "fr_FR" : "en_US",
      publishedTime,
      images: [
        {
          url: image.startsWith("http") ? image : `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} · Bobine`,
      description,
      images: [image.startsWith("http") ? image : `${BASE_URL}${image}`],
    },
  };
}
