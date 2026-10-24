"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import GitHubBadge from "@/components/GitHubBadge";
import MobileDrawer from "@/components/MobileDrawer";
import Icon from "@/components/ui/Icon";
import { lp } from "@/lib/seo";
import { navRoutes, routeHref, routeLabel } from "@/lib/siteMap";
import "@/styles/split/site-chrome.css";


export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Le bouton « Télécharger » est mis en avant à droite : les liens de navigation sont les autres entrées du plan du site.
  const links: Array<[string, string]> = navRoutes()
    .filter((route) => route.id !== "download")
    .map((route) => [routeHref(locale, route.id), route.label[locale]]);

  const isAllowedBaamix = (() => {
    if (!pathname) return false;
    const cleanPath = pathname.replace(/\/$/, "");
    if (cleanPath === `/${locale}`) return true;
    if (cleanPath.startsWith(lp(locale, `/fonctionnalites`))) return true;
    if (cleanPath.startsWith(lp(locale, `/comparatif`))) return true;
    if (cleanPath.startsWith(lp(locale, `/materiel`))) return true;
    if (cleanPath.startsWith(`/${locale}/documentation`)) return true;
    return false;
  })();

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href={`/${locale}`} className="site-header__brand" aria-label="Bobine - Accueil">
            <Image
              src="/logo_bobine_entier.png"
              alt="Bobine"
              width={160}
              height={90}
              priority className="site-image-2"
            />
          </Link>

          {/* Navigation Desktop */}
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

          {/* Switchers & Badges Desktop */}
          <div className="site-header__actions">
            {isAllowedBaamix && (
              <button
                type="button"
                className="baamix-header-btn"
                onClick={() => window.dispatchEvent(new CustomEvent("toggle-baamix"))}
                title="Ouvrir l'assistant Baamix"
                aria-label="Ouvrir l'assistant Baamix"
              >
                <div className="baamix-header-avatar">
                  <Image
                    src="/images/baamix-cutout.webp"
                    alt="Baamix"
                    width={20}
                    height={20}
                    className="chatbot-avatar-img"
                  />
                  <span className="baamix-header-dot" />
                </div>
                <span>Baamix</span>
              </button>
            )}
            <Link href={routeHref(locale, "download")} className="btn-primary site-header__cta">
              {routeLabel(locale, "download")}
            </Link>
            <GitHubBadge />
            <ThemeSwitcher />
            <LocaleSwitcher locale={locale} dict={dict} />
          </div>


          {/* Bouton Burger Mobile */}
          <button
            type="button"
            className="mobile-burger-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Ouvrir le menu de navigation"
            aria-expanded={isDrawerOpen}
          >
            <Icon name="menu" size={22} />
          </button>
        </div>
      </header>

      {/* Drawer Mobile */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        locale={locale}
        dict={dict}
      />
    </>
  );
}

