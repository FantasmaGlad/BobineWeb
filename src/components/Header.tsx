"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();

  const links: Array<[string, string]> = [
    [`/${locale}/fonctionnalites`, dict.nav.features],
    [`/${locale}/documentation`, dict.nav.documentation],
    [`/${locale}/blog`, dict.nav.blog],
    [`/${locale}/demo-3d`, dict.nav.demo],
    [`/${locale}/soutenir`, dict.nav.support],
    [`/${locale}/a-propos`, dict.nav.about],
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={`/${locale}`} className="site-header__brand" aria-label="Bobine - Accueil">
          <Image
            src="/logo-bobine.png"
            alt="Bobine"
            width={140}
            height={51}
            priority
            style={{ filter: "var(--logo-filter)" }}
          />
        </Link>
        <nav aria-label="Navigation principale" className="site-header__nav">
          {links.map(([href, label]) => {
            const isActive = pathname === href || (href !== `/${locale}` && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? "is-active" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <ThemeSwitcher />
          <LocaleSwitcher locale={locale} dict={dict} />
        </div>
      </div>
    </header>
  );
}
