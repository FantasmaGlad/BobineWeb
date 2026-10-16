import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// Miroir Tor : export statique (voir scripts/prepare-onion.mjs et le workflow onion-mirror).
const isOnion = process.env.NEXT_PUBLIC_BOBINE_ONION === "1";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  ...(isOnion ? { output: "export" as const, trailingSlash: true } : {}),
  images: isOnion ? { unoptimized: true } : { formats: ["image/avif", "image/webp"] },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      "@react-three/drei",
      "@react-three/fiber",
      "three",
      "jspdf",
      "openai",
      "react-markdown",
      "remark-gfm",
    ],
  },
  // Ignorés par un export statique : les redirections et en-têtes du miroir vivent dans Caddy.
  ...(isOnion ? {} : { async redirects() {
    return [
      // Emplacement historique de security.txt (RFC 9116, section 3)
      { source: "/security.txt", destination: "/.well-known/security.txt", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bobine.fit" }],
        destination: "https://bobine.fit/:path*",
        permanent: true,
      },
      // Slugs localisés EN (redirection 308 des anciens chemins français sous /en)
      { source: "/en/fonctionnalites", destination: "/en/features", permanent: true },
      { source: "/en/comparatif", destination: "/en/compare", permanent: true },
      { source: "/en/comparatif/les-mills-cinema", destination: "/en/compare/les-mills-cinema", permanent: true },
      { source: "/en/comparatif/wexer-fitness-on-demand", destination: "/en/compare/wexer-fitness-on-demand", permanent: true },
      { source: "/en/comparatif/radical-fitness-yako", destination: "/en/compare/radical-fitness-yako", permanent: true },
      { source: "/en/comparatif/affichage-dynamique-fitness", destination: "/en/compare/digital-signage-fitness", permanent: true },
      { source: "/en/materiel/amazon", destination: "/en/hardware/amazon", permanent: true },
      { source: "/en/materiel/aliexpress", destination: "/en/hardware/aliexpress", permanent: true },
      { source: "/en/materiel", destination: "/en/hardware/amazon", permanent: true },
      { source: "/en/documentation/utilisation", destination: "/en/documentation/user-guide", permanent: true },
      { source: "/en/documentation/developpeurs", destination: "/en/documentation/developers", permanent: true },
      { source: "/en/a-propos", destination: "/en/about", permanent: true },
      { source: "/en/soutenir", destination: "/en/support", permanent: true },
      { source: "/en/mentions-legales", destination: "/en/legal-notice", permanent: true },
      { source: "/en/confidentialite", destination: "/en/privacy", permanent: true },
      { source: "/en/securite", destination: "/en/security", permanent: true },
    ];
  },
  // Même sitemap sous une seconde adresse : Search Console conserve l'état « Impossible de lire » d'une
  // adresse déjà en échec, la soumettre sous un nouveau nom force une lecture neuve.
  async rewrites() {
    return [
      { source: "/sitemap-bobine.xml", destination: "/sitemap.xml" },
      // Slugs localisés anglais mappés vers les handlers Next.js existants
      { source: "/en/features", destination: "/en/fonctionnalites" },
      { source: "/en/compare", destination: "/en/comparatif" },
      { source: "/en/compare/les-mills-cinema", destination: "/en/comparatif/les-mills-cinema" },
      { source: "/en/compare/wexer-fitness-on-demand", destination: "/en/comparatif/wexer-fitness-on-demand" },
      { source: "/en/compare/radical-fitness-yako", destination: "/en/comparatif/radical-fitness-yako" },
      { source: "/en/compare/digital-signage-fitness", destination: "/en/comparatif/affichage-dynamique-fitness" },
      { source: "/en/hardware", destination: "/en/materiel/amazon" },
      { source: "/en/hardware/amazon", destination: "/en/materiel/amazon" },
      { source: "/en/hardware/aliexpress", destination: "/en/materiel/aliexpress" },
      { source: "/en/documentation/user-guide", destination: "/en/documentation/utilisation" },
      { source: "/en/documentation/developers", destination: "/en/documentation/developpeurs" },
      { source: "/en/about", destination: "/en/a-propos" },
      { source: "/en/support", destination: "/en/soutenir" },
      { source: "/en/legal-notice", destination: "/en/mentions-legales" },
      { source: "/en/privacy", destination: "/en/confidentialite" },
      { source: "/en/security", destination: "/en/securite" },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "max-age=0" },
          { key: "Cloudflare-CDN-Cache-Control", value: "max-age=0" },
        ],
      },
      {
        source: "/:sitemap(sitemap|sitemap-bobine).xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" },
          { key: "CDN-Cache-Control", value: "max-age=86400" },
          { key: "Cloudflare-CDN-Cache-Control", value: "max-age=86400" },
        ],
      },
      {
        source: "/.well-known/security.asc",
        headers: [
          { key: "Content-Type", value: "application/pgp-keys" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        // Web Key Directory (méthode directe) : les clients PGP exigent un type binaire et CORS ouvert
        source: "/.well-known/openpgpkey/:path*",
        headers: [
          { key: "Content-Type", value: "application/octet-stream" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/install.sh",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  } }),
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
