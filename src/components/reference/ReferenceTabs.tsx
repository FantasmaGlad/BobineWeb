import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";

const LABELS = { fr: { commands: "Commandes", api: "API HTTP" }, en: { commands: "Commands", api: "HTTP API" } } as const;

export default function ReferenceTabs({ locale, current }: { locale: Locale; current: "commands" | "api" }) {
  const tabs = [["commands", "/commandes"], ["api", "/api"]] as const;
  return (
    <nav className="ref-tabs" aria-label={locale === "fr" ? "Référence" : "Reference"}>
      {tabs.map(([id, path]) => (
        <Link key={id} href={lp(locale, path)} className="ref-tab" aria-current={id === current ? "page" : undefined}>
          {LABELS[locale][id]}
        </Link>
      ))}
    </nav>
  );
}
