import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import SupportView from "@/components/SupportView";

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
    pathname: "/soutenir",
    title: isEn
      ? "Support Bobine — Open Source Gym Playout"
      : "Soutenir le Projet Bobine — Régie Vidéo Libre",
    description: isEn
      ? "Bobine is free and open source, with no subscription for gyms and no tracking. Donations on Ko-fi pay for test hardware, the domain name and build servers."
      : "Bobine est libre, sans abonnement ni suivi. Les dons sur Ko-fi financent le banc d'essai matériel, le nom de domaine et les serveurs de compilation.",
    image: "/images/marketing/laptop-og.webp",
    keywords: [
      "Soutenir Bobine",
      "Don Bobine",
      "Ko-fi Bobine",
      "Financer logiciel libre fitness",
    ],
  });
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SupportView locale={locale as Locale} />;
}
