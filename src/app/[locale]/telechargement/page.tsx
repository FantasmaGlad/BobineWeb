import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import HubPage from "@/components/page/HubPage";
import OsDownloadGrid from "@/components/OsDownloadGrid";

const TEXT = {
  fr: {
    title: "Télécharger Bobine pour Windows, macOS, Linux et Android",
    description:
      "Téléchargez Bobine pour Windows, macOS, Linux, Android TV ou Google Book, choisissez Stable, Bêta ou Canary et vérifiez les fichiers avant installation.",
    keywords: ["télécharger Bobine", "Bobine Windows", "Bobine macOS", "Bobine Linux", "Bobine Android TV"],
    gridTitle: "Autres plateformes et installations",
    note: "Les paquets Linux passent par des dépôts signés (OpenPGP). Pour Windows, macOS et Android, chaque fichier est publié avec l'empreinte SHA-256 que GitHub affiche sur la page de la release : comparez-la à celle de votre téléchargement avant de l'installer.",
  },
  en: {
    title: "Download Bobine for Windows, macOS, Linux and Android",
    description:
      "Download Bobine for Windows, macOS, Linux, Android TV or Google Book, pick Stable, Beta or Canary and verify the files before you install them.",
    keywords: ["download Bobine", "Bobine Windows", "Bobine macOS", "Bobine Linux", "Bobine Android TV"],
    gridTitle: "Other platforms and installs",
    note: "Linux packages come from signed repositories (OpenPGP). For Windows, macOS and Android, each file is published with the SHA-256 checksum GitHub shows on the release page: compare it with your download before installing.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = TEXT[locale];
  return buildMetadata({ locale, pathname: "/telechargement", title: t.title, description: t.description, keywords: [...t.keywords] });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = TEXT[locale];
  return (
    <HubPage locale={locale as Locale} id="download" gridTitle={t.gridTitle}>
      <OsDownloadGrid locale={locale as Locale} />
      <p className="pg-note">{t.note}</p>
    </HubPage>
  );
}
