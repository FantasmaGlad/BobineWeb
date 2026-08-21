import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { THEME_STORAGE_KEY } from "@/lib/themes";
import Header from "@/components/Header";
import TechTicker from "@/components/TechTicker";
import Footer from "@/components/Footer";

import Demo3DPreloader from "@/components/three/Demo3DPreloader";
import JsonLd from "@/components/JsonLd";
import BobineChatbot from "@/components/BobineChatbot";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "../globals.css";



// Applique le thème persisté (localStorage) avant le premier rendu, avec
// "clair" comme thème par défaut.
const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)})||'clair';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','clair');}`;


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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
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
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <JsonLd locale={locale} />
        <Header locale={locale} dict={dict} />
        <TechTicker locale={locale as Locale} />
        <main>{children}</main>
        <Footer locale={locale} dict={dict} />

        <BobineChatbot locale={locale as Locale} />
        <ServiceWorkerRegistration locale={locale as Locale} />
        <Analytics />
        <Demo3DPreloader />
      </body>

    </html>
  );
}

