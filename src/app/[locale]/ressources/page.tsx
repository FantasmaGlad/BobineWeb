import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HubPage from "@/components/page/HubPage";

const TEXT = {
  fr: {
    title: "Ressources Bobine : blog, nouveautés, canaux, sécurité",
    description:
      "Blog, nouveautés, canaux de mise à jour, sécurité et présentation du projet Bobine : tout ce qui accompagne le logiciel réuni en un seul endroit.",
    keywords: ["ressources Bobine", "blog Bobine", "nouveautés Bobine", "canaux de mise à jour"],
  },
  en: {
    title: "Bobine resources: blog, news, channels, security",
    description:
      "Blog, what's new, update channels, security and the Bobine project: everything that comes with the software, gathered in one place.",
    keywords: ["Bobine resources", "Bobine blog", "Bobine news", "update channels"],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = TEXT[locale];
  return buildMetadata({ locale, pathname: "/ressources", title: t.title, description: t.description, keywords: [...t.keywords] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HubPage locale={locale as Locale} id="resources" />;
}
