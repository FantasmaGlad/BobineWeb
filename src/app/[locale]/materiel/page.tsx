import { permanentRedirect, notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function HardwarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  permanentRedirect(`/${locale}/materiel/amazon`);
}
