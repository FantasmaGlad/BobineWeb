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
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bobine.fit" }],
        destination: "https://bobine.fit/:path*",
        permanent: true,
      },
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
        source: "/sitemap.xml",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "CDN-Cache-Control", value: "max-age=0" },
          { key: "Cloudflare-CDN-Cache-Control", value: "max-age=0" },
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
