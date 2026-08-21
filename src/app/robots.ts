import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "GoogleOther",
          "Applebot-Extended",
          "cohere-ai",
          "Meta-ExternalAgent",
          "FacebookBot",
          "DuckAssistBot",
          "Amazonbot",
          "Bytespider",
          "YouBot",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://bobine.fit/sitemap.xml",
    host: "https://bobine.fit",
  };
}
