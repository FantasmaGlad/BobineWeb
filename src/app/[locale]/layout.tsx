import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { THEME_STORAGE_KEY } from "@/lib/themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

// Applique le thème persisté (localStorage) avant le premier rendu, pour
// éviter un flash du thème par défaut (Beige) suivi d'un changement brusque.
const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Header locale={locale} dict={dict} />
        <main>{children}</main>
        <Footer locale={locale} dict={dict} />
        <Analytics />
      </body>
    </html>
  );
}
