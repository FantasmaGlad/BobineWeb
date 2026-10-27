import type { SecurityStrings } from "../content/security-content";

interface SecurityFooterProps {
  strings: SecurityStrings;
}

export default function SecurityFooter({ strings }: SecurityFooterProps) {
  const isFr = strings.lang === "fr";
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>{strings.footerLead}</div>
        <nav className="footer-links" aria-label="Footer">
          <a href={isFr ? "https://bobine.fit/fr" : "https://bobine.fit/en"}>bobine.fit</a>
          <a href="https://packages.bobine.fit">packages.bobine.fit</a>
          <a href={isFr ? "/fr/snake/" : "/snake/"}>Snake</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
