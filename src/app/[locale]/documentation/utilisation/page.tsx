import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import DocsUtilisationView from "@/components/DocsUtilisationView";

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
    pathname: "/documentation/utilisation",
    title: isEn
      ? "User Manual & Daily Operations — Bobine | Les Mills Cinema Alternative"
      : "Guide d'Utilisation & Exploitation Quotidienne — Bobine | Alternative Les Mills Cinema",
    description: isEn
      ? "Comprehensive usage manual for Bobine: Admin dashboard, video library management, weekly timetable scheduler, member touch kiosk, and 24/7 background radio."
      : "Manuel complet d'utilisation de Bobine : panneau d'administration, médiathèque vidéo, planificateur de cours hebdomadaire, borne tactile et radio 24/7.",
    keywords: [
      "Guide utilisation Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Panneau administration vidéo fitness",
      "Planificateur cours collectif",
      "Borne tactile membre fitness",
      "Télécommande smartphone QR code",
      "Gym video operations guide",
    ],
  });
}

export default async function UtilisationPage({
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
    { name: isEn ? "Operations Manual" : "Utilisation & Exploitation", url: `/${locale}/documentation/utilisation` },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <DocsUtilisationView locale={locale as Locale} />
    </>
  );
}
