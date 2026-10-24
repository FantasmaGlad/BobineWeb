import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
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
      ? "Official Bobine setup guide: native 1-click installers for Windows 11/10 (x86_64 & Snapdragon ARM64), macOS Apple Silicon, Linux (x86_64 & ARM64), Google Books (Aluminium OS), Android tablets and Android TV, local network orchestration with Bobine Assistant, and 24/7 dedicated gym appliance on Debian 13 (Mini PC x86_64, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5)."
      : "Guide d'installation officiel de Bobine : installeurs natifs 1 clic pour Windows 11/10 (x86_64 & PC ARM Snapdragon), macOS Apple Silicon, Linux (x86_64 & ARM64), Google Books (Aluminium OS), tablettes Android et Android TV, orchestration réseau avec Bobine Assistant, et régie autonome 24/7 sur mini PC Debian 13 (x86_64, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5).",
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
      "Bobine Assistant",
      "Debian 13 mini PC fitness",
      "Script install.sh Bobine",
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
      {/* En-tête du guide : Baamix l'inspecteur en filigrane DERRIÈRE le titre et l'introduction (décor, jamais au premier plan) */}
      <div className="docs-intro-art-wrap">
        <Image
          src="/images/BaamixInspector.webp"
          alt=""
          aria-hidden="true"
          className="docs-intro-art"
          width={560}
          height={776}
          sizes="(max-width: 639px) 120px, 220px"
          priority
        />
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
            description={isEn ? "Official setup guide for Bobine across Windows (x86_64 & ARM64), macOS, Linux (x86_64 & ARM64), Google Books, Android, Android TV, and dedicated appliances." : "Guide d'installation officiel de Bobine sur Windows (x86_64 & ARM64), macOS, Linux (x86_64 & ARM64), Google Books, Android, Android TV et mini PC dédiés."}
          />
        </div>
      </div>

      <p className="dx-p-1">
        {isEn
          ? "Bobine adapts to your setup: choose between 1-click applications for standard computers (Windows x86_64 & Snapdragon ARM64, Mac Apple Silicon, Linux x86_64 & ARM64, Google Books under Aluminium OS, Android tablets & TV) or deploy a dedicated 24/7 appliance (x86_64 or ARM64 mini PC) for uninterrupted studio playout with automatic recovery after power cuts."
          : "Bobine s'adapte à vos besoins : choisissez entre les applications en 1 clic pour vos ordinateurs et tablettes (Windows x86_64 & PC ARM Snapdragon, Mac Apple Silicon, Linux x86_64 & ARM64, Google Books sous Aluminium OS, tablettes Android & Android TV), ou déployez une appliance dédiée 24/7 (mini PC x86_64 ou ARM64) pour une diffusion ininterrompue en studio avec reprise automatique après coupure de courant."}
      </p>
      </div>

      <p className="dx-p-2">
        <Link href={lp(locale, `/fonctionnalites`)} className="dx-link-1">
          {isEn ? "See also: What Bobine does for your gym >" : "Voir aussi : ce que Bobine change pour votre salle >"}
        </Link>
      </p>

      <div className="docs-callout docs-callout--info dx-div-5">
        <div className="docs-callout__content">
          <div className="docs-callout__title">
            {isEn ? "Complete offline manual" : "Manuel complet hors-ligne"}
          </div>
          <p className="dx-p-3">
            {isEn
              ? "One PDF document: cover page, table of contents, and every chapter (manifesto, setup, usage, features, FAQ, developer reference, roadmap) — kept ready for offline use if the site or network is ever unreachable."
              : "Un seul document PDF : page de garde, sommaire et tous les chapitres (manifeste, installation, utilisation, fonctionnalités, FAQ, référence développeurs, feuille de route) — à garder sous la main hors-ligne en cas de site ou réseau indisponible."}
          </p>
        </div>
        <DownloadPdfButton locale={locale as Locale} variant="manual" />
      </div>

      {/* Hub d'Installation Multi-Méthodes avec logos officiels */}
      <DocsInstallHub locale={locale as Locale} />
    </>
  );
}
