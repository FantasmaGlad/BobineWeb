import { permanentRedirect, notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { IS_ONION } from "@/lib/onion";
import OnionMirrorNotice from "@/components/OnionMirrorNotice";

export default async function HardwarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (IS_ONION) {
    return <OnionMirrorNotice locale={locale} topic="materiel" clearnetPath="/materiel" />;
  }
  permanentRedirect(`/${locale}/materiel/amazon`);
}
