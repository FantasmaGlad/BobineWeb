import { permanentRedirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function ManifesteRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) permanentRedirect("/fr/a-propos");
  permanentRedirect(`/${locale}/a-propos`);
}
