"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

export default function LocaleSwitcher({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname() || `/${locale}`;

  function getTargetHref(targetLocale: Locale) {
    if (targetLocale === locale) return pathname;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      segments[0] = targetLocale;
      return "/" + segments.join("/");
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
