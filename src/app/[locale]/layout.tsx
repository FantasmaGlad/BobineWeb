import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import Header from "@/components/Header";
import TechTicker from "@/components/TechTicker";
import Footer from "@/components/Footer";

import JsonLd from "@/components/JsonLd";
import BobineChatbot from "@/components/BobineChatbot";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "../globals.css";


export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://bobine.fit"),
  title: {
    default: "Bobine — Régie vidéo & streaming libre pour salles de sport | Alternative Les Mills Cinema",
    template: "%s · Bobine",
  },
  description:
    "Bobine transforme un mini PC en régie vidéo autonome et 100% hors-ligne pour salles de sport. L'alternative libre, gratuite et sans abonnement à Les Mills Cinema et Les Mills Virtual.",
  keywords: [
    "Bobine",
    "Bobine fit",
    "Bobine Github",
    "Les Mills",
    "Les Mills Cinema",
    "Alternative Les Mills",
    "Alternative Les Mills Cinema",
    "Alternative Les Mills Virtual",
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
            __html: `(function(){try{var t=localStorage.getItem('bobineweb-theme')||'clair';document.documentElement.setAttribute('data-theme',t);var ua=navigator.userAgent||'';var p='linux';if(/Android/i.test(ua)){p='android';}else if(/iPhone|iPad|iPod/i.test(ua)||(navigator.maxTouchPoints>1&&/Macintosh/i.test(ua))){p='ios';}else if(/Windows/i.test(ua)){p='windows';}else if(/Macintosh|Mac OS X/i.test(ua)){p='macos';}document.documentElement.setAttribute('data-platform',p);}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeSync />
        <JsonLd locale={locale} />
        <Header locale={locale} dict={dict} />
        <TechTicker locale={locale as Locale} />
        <main>
          {children}
          <Footer locale={locale as Locale} dict={dict} />
        </main>

        <BobineChatbot locale={locale as Locale} />
        <ServiceWorkerRegistration locale={locale as Locale} />
        <Analytics />
      </body>
    </html>
  );
}

