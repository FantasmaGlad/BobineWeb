import type { NextConfig } from "next";
import { EN_SLUG_MAP } from "./src/lib/slugs";

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

const EN_PAGES = Object.entries(EN_SLUG_MAP).filter(([fr, en]) => fr !== en);

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  pageExtensions: ["ts", "tsx"],
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      { source: "/commandes", destination: "/fr/commandes", permanent: true },
      { source: "/commands", destination: "/en/commands", permanent: true },
      { source: "/fr/securite", destination: "https://security.bobine.fit/fr/", permanent: true },
      { source: "/en/securite", destination: "https://security.bobine.fit/", permanent: true },
      { source: "/en/security", destination: "https://security.bobine.fit/", permanent: true },
      { source: "/securite", destination: "https://security.bobine.fit/fr/", permanent: true },
      { source: "/security", destination: "https://security.bobine.fit/", permanent: true },
      { source: "/security.txt", destination: "/.well-known/security.txt", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bobine.fit" }],
        destination: "https://bobine.fit/:path*",
        permanent: true,
      },
      ...EN_PAGES.map(([fr, en]) => ({ source: `/en${fr}`, destination: `/en${en}`, permanent: true })),
    ];
  },
  async rewrites() {
    return [
      ...EN_PAGES.map(([fr, en]) => ({ source: `/en${en}`, destination: `/en${fr}` })),
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
        source: "/.well-known/csaf/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/.well-known/openpgpkey/:path*",
        headers: [
          { key: "Content-Type", value: "application/octet-stream" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
      {
        source: "/install.ps1",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
