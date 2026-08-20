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
      "Bobine Github",
      "Bobine Open Source",
      "Régie vidéo salle de sport",
      "Alternative Les Mills Cinema",
      "Streaming fitness hors-ligne",
      "Cours collectifs vidéo",
      "Dell Wyse 5070 fitness",
      "Affichage dynamique salle de sport",
      "Logiciel libre sport",
    ],
    alternates: {
      canonical: currentUrl,
      languages: {
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
