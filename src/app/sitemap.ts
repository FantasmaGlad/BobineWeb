import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";
import { EN_SLUG_MAP } from "@/lib/seo";
import { CLEARNET_URL } from "@/lib/onion";

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Date de dernière modification réelle (AAAA-MM-JJ). Absent : date du build. */
  lastModified?: string;
}

const staticRoutes: RouteConfig[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/fonctionnalites", priority: 0.95, changeFrequency: "weekly" },
  { path: "/documentation", priority: 0.95, changeFrequency: "weekly" },
  { path: "/documentation/utilisation", priority: 0.85, changeFrequency: "weekly" },
  { path: "/documentation/faq", priority: 0.85, changeFrequency: "weekly" },
  { path: "/documentation/developpeurs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.85, changeFrequency: "daily" },
  { path: "/nouveautes", priority: 0.9, changeFrequency: "daily" },
  { path: "/canaux", priority: 0.9, changeFrequency: "weekly" },
  { path: "/canaux/stable", priority: 0.85, changeFrequency: "daily" },
  { path: "/canaux/beta", priority: 0.85, changeFrequency: "daily" },
  { path: "/canaux/canary", priority: 0.85, changeFrequency: "daily" },
  { path: "/linux", priority: 0.9, changeFrequency: "weekly" },
  { path: "/android-tv", priority: 0.9, changeFrequency: "weekly" },
  { path: "/google-book", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tor", priority: 0.8, changeFrequency: "monthly" },
  { path: "/comparatif", priority: 0.9, changeFrequency: "weekly" },
  { path: "/comparatif/les-mills-cinema", priority: 0.9, changeFrequency: "weekly" },
  { path: "/comparatif/wexer-fitness-on-demand", priority: 0.9, changeFrequency: "weekly" },
  { path: "/comparatif/radical-fitness-yako", priority: 0.9, changeFrequency: "weekly" },
  { path: "/comparatif/affichage-dynamique-fitness", priority: 0.9, changeFrequency: "weekly" },
  { path: "/materiel/amazon", priority: 0.9, changeFrequency: "weekly" },
  { path: "/materiel/aliexpress", priority: 0.7, changeFrequency: "weekly" },
  { path: "/baamix", priority: 0.85, changeFrequency: "weekly" },
  { path: "/a-propos", priority: 0.8, changeFrequency: "monthly" },
  { path: "/soutenir", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/securite", priority: 0.4, changeFrequency: "yearly" },
];

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = CLEARNET_URL;

  // Pages de blog : une par release GitHub, datée de sa publication (jamais de la date du build).
  let dynamicBlogRoutes: RouteConfig[] = [];
  let latestReleaseDate = "2026-10-15";
  try {
    const releases = await getBobineReleases();
    if (releases.length > 0 && releases[0].publishedAt) {
      latestReleaseDate = releases[0].publishedAt.slice(0, 10);
    }
    dynamicBlogRoutes = releases.map((rel) => ({
      path: `/blog/${rel.slug}`,
      priority: rel.slug.toLowerCase() === "beta" ? 0.8 : 0.75,
      changeFrequency: rel.slug.toLowerCase() === "beta" ? "daily" : "monthly",
      lastModified: rel.publishedAt.slice(0, 10),
    }));
  } catch {
    // GitHub injoignable au build : seul /blog/beta (ajouté ci-dessous) est listé
  }

  // /blog/beta doit toujours figurer au sitemap, même si l'API GitHub est indisponible au build
  if (!dynamicBlogRoutes.some((r) => r.path.toLowerCase() === "/blog/beta")) {
    dynamicBlogRoutes.push({
      path: "/blog/beta",
      priority: 0.8,
      changeFrequency: "daily",
      lastModified: latestReleaseDate,
    });
  }

  const allRoutes = [...staticRoutes, ...dynamicBlogRoutes];

  return locales.flatMap((locale) =>
    allRoutes.map(({ path, priority, changeFrequency, lastModified }) => {
      const frUrl = `${base}/fr${path}`;
      const enUrl = `${base}/en${EN_SLUG_MAP[path] ?? path}`;
      const currentUrl = locale === "en" ? enUrl : frUrl;

      return {
        url: currentUrl,
        lastModified: lastModified ?? latestReleaseDate,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            "fr": frUrl,
            "en": enUrl,
            "fr-FR": frUrl,
            "en-US": enUrl,
            "x-default": frUrl,
          },
        },
      };
    })
  );
}
