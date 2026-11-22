import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import DocsInstallHub from "@/components/DocsInstallHub";
import Link from "next/link";
import "@/styles/split/pages-docs.css";

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
    pathname: "/documentation",
    title: isEn
      ? "Setup Guide & Documentation — Bobine | Multi-OS Playout Suite"
      : "Guide de Démarrage & Installation — Bobine | Régie Vidéo Multi-OS",
    description: isEn
      ? "Official Bobine setup guide: native 1-click installers for Windows 11/10 (x86_64 & Snapdragon ARM64), macOS Apple Silicon, Linux (x86_64 & ARM64), Google Books (Aluminium OS), Android tablets and Android TV."
      : "Guide d'installation officiel de Bobine : installeurs natifs 1 clic pour Windows 11/10 (x86_64 & PC ARM Snapdragon), macOS Apple Silicon, Linux (x86_64 & ARM64), Google Books (Aluminium OS), tablettes Android et Android TV.",
    keywords: [
      "Documentation Bobine",
      "Démarrage rapide Bobine",
      "Installation Bobine",
      "Google Book",
      "Googlebook",
      "Aluminium OS",
      "Bobine Google Book",
      "Application salle de sport Google Book",
      "PC ARM Qualcomm Snapdragon",
      "Snapdragon X Elite",
      "Snapdragon X Plus",
      "Windows 11 ARM64",
      "Linux ARM64",
      "NVIDIA DGX Spark",
      "Mini PC ARM salle de sport",
      "Raspberry Pi 5 salle de sport",
      "Orange Pi 5 RK3588",
      "Bobine Windows",
      "Bobine macOS",
      "Bobine Linux",
      "Bobine Fedora",
      "Bobine Arch Linux",
      "Bobine Android",
      "Bobine Android TV",
    ],
  });
}

export default async function DocumentationPage({
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
    { name: isEn ? "Getting Started" : "Installation & Démarrage", url: `/${locale}/documentation` },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="dx-div-4">
        <div>
          <span className="feature-category-label">
            {isEn ? "Getting Started & Multi-OS Setup" : "Installation & Mise en Route Multi-OS"}
          </span>
          <h1 className="dx-h1-1">
            {isEn ? "Installation & Quick Start" : "Guide de Démarrage & Installation"}
          </h1>
        </div>
        <div className="dx-div-2">
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation"
            title={isEn ? "Bobine Installation & Quick Start Guide" : "Guide de Démarrage & Installation Bobine"}
            description={isEn ? "Official setup guide for Bobine across Windows (x86_64 & ARM64), macOS, Linux (x86_64 & ARM64), Google Books, Android and Android TV." : "Guide d'installation officiel de Bobine sur Windows (x86_64 & ARM64), macOS, Linux (x86_64 & ARM64), Google Books, Android et Android TV."}
          />
        </div>
      </div>

      <p className="dx-p-1">
        {isEn
          ? "Bobine adapts to your setup: install the 1-click application for your computer or tablet (Windows x86_64 & Snapdragon ARM64, Mac Apple Silicon, Linux x86_64 & ARM64, Google Books under Aluminium OS, Android tablets & TV)."
          : "Bobine s'adapte à vos besoins : installez l'application en 1 clic pour votre ordinateur ou votre tablette (Windows x86_64 & PC ARM Snapdragon, Mac Apple Silicon, Linux x86_64 & ARM64, Google Books sous Aluminium OS, tablettes Android & Android TV)."}
      </p>

      <p className="dx-p-2">
        <Link href={lp(locale, `/fonctionnalites`)} className="dx-link-1">
          {isEn ? "See also: What Bobine does for your gym >" : "Voir aussi : ce que Bobine change pour votre salle >"}
        </Link>
      </p>

      <DocsInstallHub locale={locale as Locale} />
    </>
  );
}
