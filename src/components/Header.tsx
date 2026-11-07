"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import GitHubBadge from "@/components/GitHubBadge";
import MobileDrawer from "@/components/MobileDrawer";
import Icon from "@/components/ui/Icon";
import { navRoutes, routeHref } from "@/lib/siteMap";
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

  // Le téléchargement se choisit sur les cartes de l'accueil : l'en-tête ne le répète pas. Le tiroir mobile et le pied de page
  // gardent l'accès à la page Télécharger.
  const links: Array<[string, string]> = navRoutes()
    .filter((route) => route.id !== "download")
    .map((route) => [routeHref(locale, route.id), route.label[locale]]);


  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href={`/${locale}`} className="site-header__brand" aria-label="Bobine - Accueil">
            <Image
              src="/logo_bobine_b.webp"
              alt="Bobine"
              width={142}
              height={176}
              priority
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
            <GitHubBadge />
            <ThemeSwitcher />
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

