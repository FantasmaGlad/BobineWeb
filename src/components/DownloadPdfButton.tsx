"use client";

import type { Locale } from "@/lib/i18n";
import PdfIcon from "@/components/icons/PdfIcon";

export default function DownloadPdfButton({ locale }: { locale: Locale }) {
  const isEn = locale === "en";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      type="button"
      className="share-trigger-btn download-pdf-btn"
      onClick={handlePrint}
      title={isEn ? "Save or print this documentation as PDF" : "Enregistrer ou imprimer cette documentation au format PDF"}
      aria-label={isEn ? "Download documentation as PDF" : "Télécharger la documentation en PDF"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.45rem",
        cursor: "pointer",
      }}
    >
      <PdfIcon size={16} />
      <span>{isEn ? "PDF Export" : "Exporter en PDF"}</span>
    </button>
  );
}
