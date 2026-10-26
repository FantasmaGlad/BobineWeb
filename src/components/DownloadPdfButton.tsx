"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import PdfIcon from "@/components/icons/PdfIcon";
import { useReleaseData } from "@/components/ReleaseProvider";
import "@/styles/split/pages-misc.css";

export default function DownloadPdfButton({
  locale,
  chapterId,
  variant = "chapter",
}: {
  locale: Locale;
  chapterId?: string;
  variant?: "chapter" | "manual";
}) {
  const isEn = locale === "en";
  const version = useReleaseData()?.stable.version;
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    try {
      setIsGenerating(true);
      setHasError(false);
      // Le moteur PDF et les chapitres ne sont utiles qu’après la demande du lecteur.
      const { generateDocumentationPdf } = await import("@/lib/pdf/generate");
      await generateDocumentationPdf({ locale, chapterId, version });
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setHasError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="download-pdf-button-div-1">
      <button
        type="button"
        className="share-trigger-btn download-pdf-btn"
        onClick={handleDownload}
        disabled={isGenerating}
        title={
          variant === "manual"
            ? isEn
              ? "Download the complete documentation manual, with cover page and table of contents"
              : "Télécharger le manuel complet de documentation, avec page de garde et sommaire"
            : isEn
            ? "Download this chapter as a PDF document"
            : "Télécharger ce chapitre en document PDF"
        }
        aria-label={
          variant === "manual"
            ? isEn
              ? "Download the complete documentation manual as PDF"
              : "Télécharger le manuel complet de documentation en PDF"
            : isEn
            ? "Download this chapter as PDF"
            : "Télécharger ce chapitre en PDF"
        }
      >
        <PdfIcon size={15} />
        <span className="download-pdf-label--full">
          {isGenerating
            ? isEn
              ? "Generating PDF..."
              : "Génération du PDF..."
            : variant === "manual"
            ? isEn
              ? "Download complete manual"
              : "Télécharger le manuel complet"
            : isEn
            ? "Download PDF"
            : "Télécharger en PDF"}
        </span>
        <span className="download-pdf-label--short">
          {isGenerating ? "PDF..." : "PDF"}
        </span>
      </button>
      {hasError && (
        <span role="alert" className="download-pdf-button-span-1">
          {isEn
            ? "PDF generation failed. Please retry."
            : "Échec de la génération du PDF. Veuillez réessayer."}
        </span>
      )}
    </div>
  );
}
