"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { lp, toFrenchPath } from "@/lib/seo";

export default function LocaleSwitcher({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname() || `/${locale}`;

  function getTargetHref(targetLocale: Locale) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      // usePathname() rend le chemin interne (dossier français) ou celui de la barre d'adresse
      // (slug anglais) : on repart toujours du chemin français pour viser le bon slug de la langue cible.
      const rest = segments.length > 1 ? `/${segments.slice(1).join("/")}` : "";
      return lp(targetLocale, toFrenchPath(rest));
    }
    return `/${targetLocale}`;
  }

  return (
    <nav aria-label="Langue / Language" className="locale-switcher">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={getTargetHref(loc)}
          aria-current={loc === locale ? "true" : undefined}
          className={loc === locale ? "locale-switcher__link is-active" : "locale-switcher__link"}
        >
          {dict.localeSwitcher[loc]}
        </Link>
      ))}
    </nav>
  );
}
