import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function DemarrageRapideRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) redirect("/fr/documentation");
  redirect(`/${locale}/documentation`);
}
