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


export default function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const links: Array<[string, string]> = [
    [`/${locale}/fonctionnalites`, dict.nav.features],
    [`/${locale}/documentation`, dict.nav.documentation],
    [`/${locale}/blog`, dict.nav.blog],
    [`/${locale}/demo-3d`, dict.nav.demo],
    [`/${locale}/soutenir`, dict.nav.support],
    [`/${locale}/a-propos`, dict.nav.about],
  ];

  const isAllowedBaamix = (() => {
    if (!pathname) return false;
    const cleanPath = pathname.replace(/\/$/, "");
    if (cleanPath === `/${locale}`) return true;
    if (cleanPath.startsWith(`/${locale}/fonctionnalites`)) return true;
    if (cleanPath.startsWith(`/${locale}/documentation`)) return true;
    return false;
  })();

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link href={`/${locale}`} className="site-header__brand" aria-label="Bobine - Accueil">
            <Image
              src="/logo-bobine.png"
              alt="Bobine"
              width={155}
              height={56}
              priority
              style={{ filter: "var(--logo-filter)" }}
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
                    src="/images/baamix.jpg"
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
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

