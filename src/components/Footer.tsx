import Link from "next/link";
import Image from "next/image";
import type { Dictionary, Locale } from "@/lib/i18n";
import FooterDetails from "@/components/FooterDetails";
import GitHubIcon from "@/components/icons/GitHubIcon";
import { FOOTER_GROUPS, footerRoutes, routeHref } from "@/lib/siteMap";
import "@/styles/components/site-footer.css";

/**
 * Pied de page : une colonne par hub du plan du site (environ vingt liens), repliée en accordéons sous 768 px, rendue
 * hors de `<main>` pour exposer le repère `contentinfo`.
 */
export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const isEn = locale === "en";

  return (
    <footer className="site-footer">
      <FooterDetails />
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link href={`/${locale}`} aria-label={isEn ? "Bobine - Home" : "Bobine - Accueil"} className="site-footer__logo">
            <Image src="/logo_bobine_entier.png" alt="Bobine" width={130} height={48} />
          </Link>
          <p>
            {isEn
              ? "The free, self-hosted, 100% offline video playout and gym streaming system."
              : "La régie vidéo et système de streaming libre, auto-hébergé et 100% hors-ligne pour salles de sport."}
          </p>
        </div>

        <nav aria-label={isEn ? "Site map" : "Plan du site"} className="site-footer__groups">
          {FOOTER_GROUPS.map((group) => {
            const routes = footerRoutes(group.id);
            return (
              <details key={group.id} className="site-footer__group" open>
                <summary>{group.label[locale]}</summary>
                <ul>
                  {routes.map((route) => (
                    <li key={route.id}>
                      <Link href={routeHref(locale, route.id)}>{route.label[locale]}</Link>
                    </li>
                  ))}
                  {group.id === "project" && (
                    <li>
                      <a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noreferrer">
                        <GitHubIcon size={14} />
                        <span>{dict.footer.github}</span>
                      </a>
                    </li>
                  )}
                  {group.id === "legal" && (
                    <li>
                      <a
                        href={isEn ? "https://security.bobine.fit/" : "https://security.bobine.fit/fr/"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {isEn ? "Security" : "Sécurité"}
                      </a>
                    </li>
                  )}
                </ul>
              </details>
            );
          })}
        </nav>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Bobine · {isEn ? "All rights reserved" : "Tous droits réservés"} · AGPL-3.0</span>
          <span>
            {isEn
              ? "The Open Source community is the driving force of technological independence."
              : "La communauté Open Source fait la force de l’indépendance technologique."}
          </span>
        </div>
      </div>
    </footer>
  );
}
