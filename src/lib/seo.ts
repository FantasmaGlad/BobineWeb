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

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  keywords,
  image = "/logo-bobine.png",
  type = "website",
  publishedTime,
}: SeoProps): Metadata {
  const currentUrl = `${BASE_URL}/${locale}${pathname}`;
  const frUrl = `${BASE_URL}/fr${pathname}`;
  const enUrl = `${BASE_URL}/en${pathname}`;

  return {
    title,
    description,
    keywords: keywords ?? [
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
    ],
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
      title: `${title} · Bobine`,
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
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · Bobine`,
      description,
      images: [image.startsWith("http") ? image : `${BASE_URL}${image}`],
    },
  };
}
