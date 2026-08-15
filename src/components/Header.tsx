import Link from "next/link";
import Image from "next/image";
import type { Dictionary, Locale } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const links: Array<[string, string]> = [
    [`/${locale}/fonctionnalites`, dict.nav.features],
    [`/${locale}/documentation`, dict.nav.documentation],
    [`/${locale}/blog`, dict.nav.blog],
    [`/${locale}/soutenir`, dict.nav.support],
    [`/${locale}/a-propos`, dict.nav.about],
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href={`/${locale}`} className="site-header__brand">
          <Image
            src="/logo-bobine.png"
            alt="Bobine"
            width={140}
            height={51}
            priority
          />
        </Link>
        <nav aria-label="Navigation principale" className="site-header__nav">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <LocaleSwitcher locale={locale} dict={dict} />
      </div>
    </header>
  );
}
