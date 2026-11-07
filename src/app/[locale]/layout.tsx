import "../globals.css"; // en premier : les feuilles de src/styles/split/*.css importées par les composants doivent venir après
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import JsonLd from "@/components/JsonLd";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import GlobalRippleEffect from "@/components/GlobalRippleEffect";
import { IS_ONION } from "@/lib/onion";
import { getRepoStats } from "@/lib/releaseChannels";
import { ReleaseProvider } from "@/components/ReleaseProvider";
import { CLEARNET_URL } from "@/lib/onion";
import { THEME_INIT_SNIPPET } from "@/lib/themes";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Fenêtre d'affichage : le contenu passe sous les encoches (viewport-fit=cover), l'en-tête et le pied de page les évitent. */
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    metadataBase: new URL(CLEARNET_URL),
    title: {
      default: isEn
        ? "Bobine — Open-Source Gym Video Playout & Cinema Suite | Proprietary Playout Alternative"
        : "Bobine — Régie vidéo & streaming libre pour salles de sport | Alternative aux régies propriétaires",
      template: "%s · Bobine",
    },
    description: isEn
      ? "Bobine turns Google Books (Aluminium OS), Qualcomm Snapdragon ARM64 PCs, Apple Silicon Macs, Android tablets, and budget x86/ARM64 mini PCs into an autonomous, 100% offline video playout system for fitness clubs. The free, copyleft alternative to proprietary per-screen playout subscriptions."
      : "Bobine transforme un Google Book (Aluminium OS), un PC ARM Qualcomm Snapdragon, un Mac mini, une tablette Android ou un mini PC x86/ARM64 en régie vidéo autonome et 100% hors-ligne pour salles de sport. L'alternative libre, gratuite et sans abonnement aux régies propriétaires facturées à l'écran.",
    keywords: isEn
      ? [
          "Bobine",
          "Bobine Fit",
          "Bobine playout",
          "Bobine GitHub",
          "Google Book",
          "Googlebook",
          "Aluminium OS",
          "Bobine Google Book",
          "Google Book gym app",
          "Qualcomm Snapdragon ARM PC",
          "Snapdragon X Elite",
          "Snapdragon X Plus",
          "Windows 11 ARM64",
          "Linux ARM64",
          "NVIDIA DGX Spark",
          "ARM mini PC gym",
          "Raspberry Pi 5 gym playout",
          "Orange Pi 5 RK3588",
          "gym video playout",
          "virtual fitness kiosk",
          "proprietary per-screen playout alternative",
          "fitness studio video player",
          "offline gym signage",
          "open source gym software",
          "group fitness video scheduler",
          "self-hosted fitness kiosk",
          "Dell Wyse 5070 gym playout",
        ]
      : [
          "Bobine",
          "Bobine fit",
          "Bobine Github",
          "Google Book",
          "Googlebook",
          "Aluminium OS",
          "Bobine Google Book",
          "Application salle de sport Google Book",
          "PC ARM Qualcomm Snapdragon",
          "Snapdragon X Elite",
          "Snapdragon X Plus",
          "Windows 11 ARM64",
          "Linux ARM64",
          "NVIDIA DGX Spark",
          "Mini PC ARM salle de sport",
          "Raspberry Pi 5 salle de sport",
          "Orange Pi 5 RK3588",
          "Alternative aux régies propriétaires par écran",
          "Régie vidéo salle de sport",
          "Régie vidéo fitness",
          "Diffusion cours collectifs vidéo",
          "Borne tactile fitness",
          "Dell Wyse 5070",
          "Affichage dynamique salle de sport",
          "Logiciel libre sport",
          "Gym video playout",
          "Virtual fitness kiosk",
        ],
    category: "technology",
    classification: "Fitness Video Playout & Gym Cinema Automation",
    authors: [{ name: "FantasmaGlad", url: "https://github.com/FantasmaGlad" }],
    creator: "FantasmaGlad",
    publisher: "Bobine",
    applicationName: "Bobine",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon.png", sizes: "512x512", type: "image/png" },
        { url: "/favicon.ico", sizes: "48x48" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}



import ThemeSync from "@/components/ThemeSync";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const repoStats = await getRepoStats();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{${THEME_INIT_SNIPPET}var ua=navigator.userAgent||'';var p='linux';if(/Android/i.test(ua)){p='android';}else if(/iPhone|iPad|iPod/i.test(ua)||(navigator.maxTouchPoints>1&&/Macintosh/i.test(ua))){p='ios';}else if(/Windows/i.test(ua)){p='windows';}else if(/Macintosh|Mac OS X/i.test(ua)){p='macos';}document.documentElement.setAttribute('data-platform',p);}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ReleaseProvider value={repoStats}>
        <ThemeSync />
        <GlobalRippleEffect />
        <JsonLd locale={locale} />
        <Header locale={locale} dict={dict} />
        <main>{children}</main>
        <Footer locale={locale as Locale} dict={dict} />

        {!IS_ONION && <ServiceWorkerRegistration locale={locale as Locale} />}
        {!IS_ONION && <Analytics />}
        </ReleaseProvider>
      </body>
    </html>
  );
}

