import type { Locale } from "@/lib/i18n";
import { docChapters } from "@/content/docs/chapters";
import { DocumentationPdf } from "./DocumentationPdf";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateDocumentationPdf({
  locale,
  chapterId,
  version,
}: {
  locale: Locale;
  chapterId?: string;
  version?: string;
}) {
  const allChapters = docChapters[locale];
  const chapters = chapterId
    ? allChapters.filter((c) => c.id === chapterId)
    : allChapters;

  if (chapters.length === 0) {
    throw new Error(`Unknown documentation chapter: ${chapterId}`);
  }

  const { pdf } = await import("@react-pdf/renderer");
  const blob = await pdf(
    <DocumentationPdf locale={locale} chapters={chapters} version={version} />
  ).toBlob();

  const filename = chapterId
    ? `Bobine_Guide_${chapterId.toUpperCase()}_${locale.toUpperCase()}.pdf`
    : `Bobine_Documentation_Complete_${locale.toUpperCase()}.pdf`;

  downloadBlob(blob, filename);
}
