import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { THEME_STORAGE_KEY } from "@/lib/themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Demo3DPreloader from "@/components/three/Demo3DPreloader";
import JsonLd from "@/components/JsonLd";
import BobineChatbot from "@/components/BobineChatbot";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import "../globals.css";



// Applique le thème persisté (localStorage) avant le premier rendu, avec
// "lavande" comme thème par défaut.
const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)})||'lavande';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','lavande');}`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://bobine.fit"),
  title: {
    default: "Bobine — Régie vidéo & streaming open-source pour salles de sport",
    template: "%s · Bobine",
  },
  description:
    "Bobine transforme un mini PC en régie vidéo autonome et 100% hors-ligne pour salles de sport. L'alternative libre et sans abonnement à Les Mills Cinema.",
  keywords: [
    "Bobine",
    "Bobine Github",
    "Bobine Open Source",
    "Bobine régie vidéo",
    "Alternative LesMills Cinema",
    "Les Mills Cinema open source",
    "Régie streaming salle de sport",
    "Streaming fitness autonome",
    "Dell Wyse 5070 streaming",
    "Cours collectifs vidéo fitness",
    "RPM studio biking régie vidéo",
    "Affichage dynamique salle de sport",
  ],
  authors: [{ name: "FantasmaGlad", url: "https://github.com/FantasmaGlad" }],
  creator: "FantasmaGlad",
  publisher: "Bobine",
  applicationName: "Bobine",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  alternates: {
    canonical: "https://bobine.fit/fr",
    languages: {
      "fr-FR": "https://bobine.fit/fr",
      "en-US": "https://bobine.fit/en",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Bobine",
    title: "Bobine — Régie vidéo & streaming open-source pour salles de sport",
    description:
      "Alternative libre, autonome et sans abonnement à Les Mills Cinema pour la diffusion de cours vidéo en salle de sport.",
    url: "https://bobine.fit",
    locale: "fr_FR",
    alternateLocale: "en_US",
    images: [
      {
        url: "/logo-bobine.png",
        width: 1200,
        height: 630,
        alt: "Bobine - Régie vidéo open-source",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bobine — Régie vidéo open-source pour salles de sport",
    description:
      "Alternative libre, autonome et sans abonnement à Les Mills Cinema pour salles de fitness et studios RPM.",
    images: ["/logo-bobine.png"],
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

