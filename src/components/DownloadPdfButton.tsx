"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import PdfIcon from "@/components/icons/PdfIcon";
import { generateDocumentationPdf } from "@/lib/pdf-generator";

export default function DownloadPdfButton({
  locale,
  chapterId,
}: {
  locale: Locale;
  chapterId?: string;
}) {
  const isEn = locale === "en";
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    try {
      setIsGenerating(true);
      await generateDocumentationPdf({ locale, chapterId });
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      if (typeof window !== "undefined") {
        window.print();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      className="share-trigger-btn download-pdf-btn"
      onClick={handleDownload}
      disabled={isGenerating}
      title={
        isEn
          ? "Download structured documentation as PDF document"
          : "Télécharger la documentation technique complète en document PDF"
      }
      aria-label={
        isEn
          ? "Download documentation as PDF"
          : "Télécharger la documentation en PDF"
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: isGenerating ? "wait" : "pointer",
        opacity: isGenerating ? 0.7 : 1,
      }}
    >
      <PdfIcon size={16} />
      <span>
        {isGenerating
          ? isEn
            ? "Generating PDF..."
            : "Génération du PDF..."
          : isEn
          ? "Download PDF"
          : "Télécharger en PDF"}
      </span>
    </button>
  );
}
