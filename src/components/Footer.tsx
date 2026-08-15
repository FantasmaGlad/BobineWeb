import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>{dict.footer.tagline}</p>
        <nav aria-label="Liens légaux" className="site-footer__nav">
          <a
            href="https://github.com/FantasmaGlad/Bobine"
            target="_blank"
            rel="noreferrer"
          >
            {dict.footer.github}
          </a>
          <Link href={`/${locale}/mentions-legales`}>{dict.footer.legal}</Link>
          <Link href={`/${locale}/confidentialite`}>{dict.footer.privacy}</Link>
        </nav>
      </div>
    </footer>
  );
}
