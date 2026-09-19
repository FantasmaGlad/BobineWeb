import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import PlatformSelectorSidebar from "@/components/hardware/PlatformSelectorSidebar";
import { IS_ONION } from "@/lib/onion";
import PlatformThemeShell from "@/components/hardware/PlatformThemeShell";

export default async function MaterielLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale: Locale = isLocale(locale) ? locale : "fr";

  if (IS_ONION) return <>{children}</>;

  return (
    <PlatformThemeShell>
      <PlatformSelectorSidebar locale={currentLocale} />
      <div className="platform-shell__content">{children}</div>
    </PlatformThemeShell>
  );
}
