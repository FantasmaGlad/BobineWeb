import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { LANDING_PAGES, getLanding } from "@/content/landing";
import TorShowcasePage from "@/components/tor/TorShowcasePage";

const ID = "tor";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = getLanding(ID, locale);
  return buildMetadata({ locale, pathname: LANDING_PAGES[ID].path, title: c.title, description: c.description, keywords: c.keywords });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <TorShowcasePage locale={locale as Locale} />;
}
