import type { Dictionary, Locale } from "@/lib/i18n";

export default function Footer({
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__tagline">{dict.footer.tagline}</p>
      </div>
    </footer>
  );
}

