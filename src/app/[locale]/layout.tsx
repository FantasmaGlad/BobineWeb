import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { THEME_STORAGE_KEY } from "@/lib/themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Demo3DPreloader from "@/components/three/Demo3DPreloader";
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
    default: "Bobine",
    template: "%s · Bobine",
  },
  description:
    "Bobine — l'alternative open-source et auto-hébergée à LesMills Cinema pour salles de sport.",
  icons: {
    icon: "/icon.png",
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
        <Header locale={locale} dict={dict} />
        <main>{children}</main>
        <Footer locale={locale} dict={dict} />
        <Analytics />
        <Demo3DPreloader />
      </body>
    </html>
  );
}
