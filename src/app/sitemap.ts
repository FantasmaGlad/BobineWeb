import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";
import { EN_SLUG_MAP } from "@/lib/seo";
import { CLEARNET_URL } from "@/lib/onion";
import { ROUTES } from "@/lib/siteMap";

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Date de dernière modification réelle (AAAA-MM-JJ). Absent : date du build. */
  lastModified?: string;
}

// Les routes statiques viennent du plan du site (src/lib/siteMap.json) : une seule liste pour la navigation et le sitemap.
const staticRoutes: RouteConfig[] = ROUTES.filter((route) => !route.redirectTo).map(({ path, priority, changeFrequency }) => ({ path, priority, changeFrequency }));

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
