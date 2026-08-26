import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import ComparatifNav from "@/components/ComparatifNav";

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
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <ComparatifNav locale={locale as Locale} />
      {children}
    </div>
  );
}
