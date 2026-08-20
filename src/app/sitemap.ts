import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getBobineReleases } from "@/lib/github-releases";

interface RouteConfig {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

const staticRoutes: RouteConfig[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/fonctionnalites", priority: 0.95, changeFrequency: "weekly" },
  { path: "/documentation", priority: 0.9, changeFrequency: "weekly" },
  { path: "/documentation/manifeste", priority: 0.9, changeFrequency: "weekly" },
  { path: "/documentation/demarrage-rapide", priority: 0.9, changeFrequency: "weekly" },
  { path: "/documentation/utilisation", priority: 0.85, changeFrequency: "weekly" },
  { path: "/documentation/faq", priority: 0.85, changeFrequency: "weekly" },
  { path: "/documentation/developpeurs", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.85, changeFrequency: "daily" },
  { path: "/demo-3d", priority: 0.75, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.8, changeFrequency: "monthly" },
  { path: "/soutenir", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://bobine.fit";

  // Récupération des releases pour les pages de blog dynamiques
  let dynamicBlogRoutes: RouteConfig[] = [];
  try {
    const releases = await getBobineReleases();
    dynamicBlogRoutes = releases.map((rel) => ({
      path: `/blog/${rel.slug}`,
      priority: 0.75,
      changeFrequency: "monthly",
    }));
  } catch {
    // Fallback silencieux en cas de problème de connexion
  }

  const allRoutes = [...staticRoutes, ...dynamicBlogRoutes];

  return locales.flatMap((locale) =>
    allRoutes.map(({ path, priority, changeFrequency }) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
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
