import type { Metadata } from "next";
import { type Locale } from "./i18n";

const BASE_URL = "https://bobine.fit";

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

export const EN_SLUG_MAP: Record<string, string> = {
  "/fonctionnalites": "/features",
  "/comparatif": "/compare",
  "/comparatif/les-mills-cinema": "/compare/les-mills-cinema",
  "/comparatif/wexer-fitness-on-demand": "/compare/wexer-fitness-on-demand",
  "/comparatif/radical-fitness-yako": "/compare/radical-fitness-yako",
  "/comparatif/affichage-dynamique-fitness": "/compare/digital-signage-fitness",
  "/materiel": "/hardware/amazon",
  "/materiel/amazon": "/hardware/amazon",
  "/materiel/aliexpress": "/hardware/aliexpress",
  "/documentation/utilisation": "/documentation/user-guide",
  "/documentation/developpeurs": "/documentation/developers",
  "/a-propos": "/about",
  "/soutenir": "/support",
  "/mentions-legales": "/legal-notice",
  "/confidentialite": "/privacy",
  "/securite": "/security",
};

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
