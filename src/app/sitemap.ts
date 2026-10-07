import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";

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
  const base = "https://bobine.fit";

  // Pages de blog : une par release GitHub, datée de sa publication (jamais de la date du build).
  let dynamicBlogRoutes: RouteConfig[] = [];
  try {
    const releases = await getBobineReleases();
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
    });
  }

  const allRoutes = [...staticRoutes, ...dynamicBlogRoutes];

  // Date seule (AAAA-MM-JJ), format le plus sûr pour les moteurs : pas de millisecondes ni de fuseau.
  const buildDate = new Date().toISOString().slice(0, 10);

  return locales.flatMap((locale) =>
    allRoutes.map(({ path, priority, changeFrequency, lastModified }) => ({
      url: `${base}/${locale}${path}`,
      lastModified: lastModified ?? buildDate,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((loc) => [loc, `${base}/${loc}${path}`])
          ),
          "x-default": `${base}/fr${path}`,
        },
      },
    }))
  );
}
