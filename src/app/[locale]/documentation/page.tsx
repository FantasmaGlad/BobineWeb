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
      ? "Official Bobine V5.0.0 setup guide: native 1-click installers for Windows 11/10 (x86_64 & Snapdragon ARM64), macOS Apple Silicon, Linux (x86_64 & ARM64), Google Books (Aluminium OS), Android tablets and Android TV, local network orchestration with Bobine Assistant, and 24/7 dedicated gym appliance on Debian 13 (Mini PC x86_64, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5)."
      : "Guide d'installation officiel de Bobine V5.0.0 : installeurs natifs 1 clic pour Windows 11/10 (x86_64 & PC ARM Snapdragon), macOS Apple Silicon, Linux (x86_64 & ARM64), Google Books (Aluminium OS), tablettes Android et Android TV, orchestration réseau avec Bobine Assistant, et régie autonome 24/7 sur mini PC Debian 13 (x86_64, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi 5).",
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <span className="feature-category-label">
            {isEn ? "Getting Started & Multi-OS Setup" : "Installation & Mise en Route Multi-OS"}
          </span>
          <h1 style={{ margin: 0 }}>
            {isEn ? "Installation & Quick Start" : "Guide de Démarrage & Installation"}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation"
            title={isEn ? "Bobine Installation & Quick Start Guide" : "Guide de Démarrage & Installation Bobine"}
            description={isEn ? "Official setup guide for Bobine across Windows (x86_64 & ARM64), macOS, Linux (x86_64 & ARM64), Google Books, Android, Android TV, and dedicated appliances." : "Guide d'installation officiel de Bobine sur Windows (x86_64 & ARM64), macOS, Linux (x86_64 & ARM64), Google Books, Android, Android TV et mini PC dédiés."}
          />
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "1.025rem", lineHeight: 1.6, marginBottom: "0.75rem" }}>
        {isEn
          ? "Bobine V5.0.0 adapts to your setup: choose between 1-click applications for standard computers (Windows x86_64 & Snapdragon ARM64, Mac Apple Silicon, Linux x86_64 & ARM64, Google Books under Aluminium OS, Android tablets & TV) or deploy a dedicated 24/7 appliance (x86_64 or ARM64 mini PC) for uninterrupted studio playout with automatic recovery after power cuts."
          : "Bobine V5.0.0 s'adapte à vos besoins : choisissez entre les applications en 1 clic pour vos ordinateurs et tablettes (Windows x86_64 & PC ARM Snapdragon, Mac Apple Silicon, Linux x86_64 & ARM64, Google Books sous Aluminium OS, tablettes Android & Android TV), ou déployez une appliance dédiée 24/7 (mini PC x86_64 ou ARM64) pour une diffusion ininterrompue en studio avec reprise automatique après coupure de courant."}
      </p>
      </div>

      <p style={{ fontSize: "0.9rem", marginBottom: "1.75rem" }}>
        <Link href={lp(locale, `/fonctionnalites`)} style={{ color: "var(--accent-primary)", fontWeight: 600, textDecoration: "none" }}>
          {isEn ? "See also: What Bobine does for your gym →" : "Voir aussi : ce que Bobine change pour votre salle →"}
        </Link>
      </p>

      <div className="docs-callout docs-callout--info" style={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div className="docs-callout__content">
          <div className="docs-callout__title">
            {isEn ? "Complete offline manual" : "Manuel complet hors-ligne"}
          </div>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
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
