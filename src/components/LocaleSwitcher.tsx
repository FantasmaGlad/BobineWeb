import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

export default function LocaleSwitcher({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <nav aria-label="Langue / Language" className="locale-switcher">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}`}
          aria-current={loc === locale ? "true" : undefined}
          className={loc === locale ? "locale-switcher__link is-active" : "locale-switcher__link"}
        >
          {dict.localeSwitcher[loc]}
        </Link>
      ))}
    </nav>
  );
}
