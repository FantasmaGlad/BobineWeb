import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { LANDING_PAGES, getLanding } from "@/content/landing";
import LandingPage from "@/components/LandingPage";

const ID = "google-book";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = getLanding(ID, locale);
  return buildMetadata({ locale, pathname: LANDING_PAGES[ID].path, title: c.title, description: c.description, keywords: c.keywords });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LandingPage locale={locale as Locale} id={ID} />;
}
