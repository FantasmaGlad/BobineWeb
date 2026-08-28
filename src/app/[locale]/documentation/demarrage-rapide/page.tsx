import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import QuickStartStepper from "@/components/QuickStartStepper";

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
    pathname: "/documentation/demarrage-rapide",
    title: isEn
      ? "Quick Start Guide & Debian Setup — Bobine | Les Mills Alternative"
      : "Guide de Démarrage Rapide & Installation Debian — Bobine | Alternative Les Mills",
    description: isEn
      ? "Interactive step-by-step setup guide for Bobine on Debian 13: hardware selection (Dell Wyse 5070), automated 1-command installer, and first workout screen playout."
      : "Guide d'installation interactif pas à pas de Bobine sur Debian 13 : choix du mini PC (Dell Wyse 5070), commande d'installation automatisée et premier lancement en salle.",
    keywords: [
      "Installation Bobine",
      "Alternative Les Mills Cinema",
      "Alternative Les Mills Virtual",
      "Démarrage rapide régie vidéo",
      "Debian 13 mini PC fitness",
      "Dell Wyse 5070 installation",
      "Script install.sh Bobine",
      "Gym playout installer",
    ],
  });
}

export default async function DemarrageRapidePage({
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
    { name: isEn ? "Quick Start" : "Démarrage rapide", url: `/${locale}/documentation/demarrage-rapide` },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <span className="feature-category-label">
            {isEn ? "Tutorial & Setup Wizard" : "Tutoriel & Guide Interactif"}
          </span>
          <h1 style={{ margin: 0 }}>
            {isEn ? "Quick Start Guide" : "Démarrage rapide"}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="demarrage-rapide" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/demarrage-rapide"
            title={isEn ? "Bobine Quick Start Guide" : "Guide de Démarrage Rapide Bobine"}
            description={isEn ? "Interactive step-by-step setup guide for Bobine on Debian 13." : "Guide interactif d'installation étape par étape de Bobine sur Debian 13."}
          />
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "1.025rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        {isEn
          ? "This interactive guide walks you step-by-step from choosing your hardware to having your fitness room actively broadcasting virtual classes — with no prior Linux or system administration experience needed. Validate each step as you progress, or switch to continuous view anytime."
          : "Ce guide interactif vous accompagne pas à pas, du choix de votre mini PC jusqu'à la diffusion de vos premiers cours virtuels en salle — sans aucune connaissance Linux préalable requise. Validez chaque étape à votre rythme ou passez en mode lecture continue."}
      </p>

      {/* Guide Interactif Étape par Étape */}
      <QuickStartStepper locale={locale as Locale} />
    </>
  );
}
