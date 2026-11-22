import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { EN_SLUG_MAP, SITE_URL } from "@/lib/seo";
import { ROUTES } from "@/lib/siteMap";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    ROUTES.filter((route) => !route.redirectTo).map(({ path, priority, changeFrequency }) => {
      const frUrl = `${SITE_URL}/fr${path}`;
      const enUrl = `${SITE_URL}/en${EN_SLUG_MAP[path] ?? path}`;
      return {
        url: locale === "en" ? enUrl : frUrl,
        changeFrequency,
        priority,
        alternates: { languages: { fr: frUrl, en: enUrl, "fr-FR": frUrl, "en-US": enUrl, "x-default": enUrl } },
      };
    }),
  );
}
