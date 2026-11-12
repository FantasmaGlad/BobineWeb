import type { MetadataRoute } from "next";

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

export const dynamic = "force-static";

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
    sitemap: ["https://bobine.fit/sitemap.xml"],
  };
}
