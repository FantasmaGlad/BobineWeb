import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const routes = [
  "",
  "/fonctionnalites",
  "/documentation",
  "/documentation/demarrage-rapide",
  "/documentation/utilisation",
  "/documentation/faq",
  "/documentation/developpeurs",
  "/blog",
  "/soutenir",
  "/a-propos",
  "/mentions-legales",
  "/confidentialite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bobine.fit";
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
    }))
  );
}
