import type { MetadataRoute } from "next";

// Robots d'indexation classiques et d'IA générative autorisés explicitement (SEO + GEO). Les points
// d'API du site (chat de Baamix, catalogue) ne sont pas du contenu : ils restent fermés aux robots.
const CRAWLERS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  "cohere-ai",
  "MistralAI-User",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "DuckAssistBot",
  "Amazonbot",
  "Bytespider",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: CRAWLERS,
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://bobine.fit/sitemap.xml",
    host: "https://bobine.fit",
  };
}
