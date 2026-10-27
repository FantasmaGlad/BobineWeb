import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import ResourceIndex from "@/components/resources/ResourceIndex";
import "@/styles/components/page.css";

const TEXT = {
  fr: {
    title: "Ressources Bobine : index alphabétique et recherche",
    description:
      "Blog, canaux de mise à jour, documentation, sécurité, guides matériels et outils Bobine : index complet par ordre alphabétique avec recherche instantanée.",
    keywords: ["ressources Bobine", "index Bobine", "recherche ressources", "documentation", "canaux de mise à jour"],
    heading: "Ressources & Documentation",
    lead: "Explorez l'ensemble des pages, documentations, comparatifs et guides du projet Bobine par ordre alphabétique ou utilisez la barre de recherche instantanée.",
  },
  en: {
    title: "Bobine resources: alphabetical index and instant search",
    description:
      "Blog, update channels, documentation, security, hardware guides and Bobine tools: complete alphabetical index with instant search.",
    keywords: ["Bobine resources", "Bobine index", "resource search", "documentation", "update channels"],
    heading: "Resources & Documentation",
    lead: "Explore all pages, documentation, comparisons, and guides of the Bobine ecosystem in alphabetical order or filter instantly using the search bar.",
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
  const currentLocale = locale as Locale;
  const t = TEXT[currentLocale];
  return (
    <div className="pg-page">
      <Breadcrumbs locale={currentLocale} id="resources" />
      <header className="pg-hero">
        <h1 className="pg-hero__title">{t.heading}</h1>
        <p className="pg-hero__lead">{t.lead}</p>
      </header>
      <ResourceIndex locale={currentLocale} id="resources" />
    </div>
  );
}

