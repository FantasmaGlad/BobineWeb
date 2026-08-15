"use client";

import { useEffect, useRef } from "react";
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
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    // Le footer est en position fixe (cf. globals.css) ; on mesure sa
    // hauteur réelle en continu — elle varie selon la largeur d'écran et la
    // langue — pour que `main` réserve toujours assez d'espace en bas et
    // qu'aucun contenu ne se retrouve caché derrière au dernier scroll.
    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--footer-height",
        `${el.offsetHeight}px`
      );
    };
    setHeight();

    const observer = new ResizeObserver(setHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="site-footer">
      <div className="site-footer__inner">
        <p>{dict.footer.tagline}</p>
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
