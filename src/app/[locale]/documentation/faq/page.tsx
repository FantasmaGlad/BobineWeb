import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import DocsFaqView from "@/components/DocsFaqView";
import { FAQ_ITEMS } from "@/content/docs/faq-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEn = locale === "en";
  return buildMetadata({
    locale: locale as Locale,
    pathname: "/documentation/faq",
    title: isEn
      ? "FAQ & Troubleshooting Guide — Bobine | Les Mills Cinema Alternative"
      : "FAQ & Guide de Dépannage — Bobine | Alternative Les Mills Cinema",
    description: isEn
      ? "Frequently asked questions, common error troubleshooting matrix, diagnostic commands, and resilience guides for Bobine."
      : "Foire aux questions, tableau de résolution des erreurs courantes, commandes de diagnostic et résilience de Bobine face aux régies comme Les Mills Cinema.",
    keywords: [
      "FAQ Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Dépannage régie vidéo",
      "Erreurs courantes Bobine",
      "Commandes diagnostic Linux Bobine",
      "HDMI-CEC dépannage",
      "Virtual gym troubleshooting",
    ],
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: isEn ? "FAQ & Troubleshooting" : "FAQ & Dépannage", url: `/${locale}/documentation/faq` },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <FaqJsonLd items={FAQ_ITEMS[locale as Locale]} />
      <DocsFaqView locale={locale as Locale} />
    </>
  );
}
