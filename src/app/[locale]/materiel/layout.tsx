import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import PlatformSelectorSidebar from "@/components/hardware/PlatformSelectorSidebar";

export default async function MaterielLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: Locale = isLocale(locale) ? locale : "fr";

  return (
    <div className="platform-shell">
      <PlatformSelectorSidebar locale={currentLocale} />
      <div className="platform-shell__content">{children}</div>
    </div>
  );
}
