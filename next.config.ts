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
    ];
  },
  // Même sitemap sous une seconde adresse : Search Console conserve l'état « Impossible de lire » d'une
  // adresse déjà en échec, la soumettre sous un nouveau nom force une lecture neuve.
  async rewrites() {
    return [{ source: "/sitemap-bobine.xml", destination: "/sitemap.xml" }];
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
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "max-age=0" },
          { key: "Cloudflare-CDN-Cache-Control", value: "max-age=0" },
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
