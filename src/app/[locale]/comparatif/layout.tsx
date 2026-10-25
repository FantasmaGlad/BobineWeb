import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import ComparatifNav from "@/components/ComparatifNav";
import "@/styles/split/comparison.css";
import "@/styles/components/compare-page.css";

export default async function ComparatifLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="container compare-layout">
      <ComparatifNav locale={locale as Locale} />
      {children}
    </div>
  );
}
