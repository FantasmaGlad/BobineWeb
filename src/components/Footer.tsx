import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import GitHubIcon from "@/components/icons/GitHubIcon";

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
        <p style={{ margin: 0 }}>{dict.footer.tagline}</p>
        <nav aria-label="Liens légaux" className="site-footer__nav">
          <a
            href="https://github.com/FantasmaGlad/Bobine"
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <GitHubIcon size={15} />
            {dict.footer.github}
          </a>
          <Link href={`/${locale}/mentions-legales`}>{dict.footer.legal}</Link>
          <Link href={`/${locale}/confidentialite`}>{dict.footer.privacy}</Link>
        </nav>
      </div>
    </footer>
  );
}
