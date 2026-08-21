"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import GitHubBadge from "@/components/GitHubBadge";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  locale,
  dict,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);

  const isAllowedBaamix = (() => {
    if (!pathname) return false;
    const cleanPath = pathname.replace(/\/$/, "");
    if (cleanPath === `/${locale}`) return true;
    if (cleanPath.startsWith(`/${locale}/fonctionnalites`)) return true;
    if (cleanPath.startsWith(`/${locale}/documentation`)) return true;
    return false;
  })();

  const mainLinks: Array<{ href: string; label: string; tag?: string }> = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/fonctionnalites`, label: dict.nav.features },
    { href: `/${locale}/demo-3d`, label: dict.nav.demo, tag: "3D" },
    { href: `/${locale}/documentation`, label: dict.nav.documentation },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/soutenir`, label: dict.nav.support },
    { href: `/${locale}/a-propos`, label: dict.nav.about },
  ];

  const docSubLinks: Array<{ href: string; label: string }> = [
    {
      href: `/${locale}/documentation/demarrage-rapide`,
      label: locale === "en" ? "Quick Start Guide" : "Démarrage rapide",
    },
    {
      href: `/${locale}/documentation/utilisation`,
      label: locale === "en" ? "User Manual" : "Manuel d'utilisation",
    },
    {
      href: `/${locale}/documentation/faq`,
      label: locale === "en" ? "FAQ & Troubleshooting" : "FAQ & Dépannage",
    },
    {
      href: `/${locale}/documentation/developpeurs`,
      label: locale === "en" ? "Developer & API" : "Développeurs & API",
    },
    {
      href: `/${locale}/documentation/manifeste`,
      label: locale === "en" ? "Manifesto & Identity" : "Manifeste & Identité",
    },
  ];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mobile-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="mobile-drawer-panel"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drawer */}
        <div className="mobile-drawer-header">
          <Link href={`/${locale}`} onClick={onClose} className="site-header__brand">
            <Image
              src="/logo-bobine.png"
              alt="Bobine"
              width={125}
              height={46}
              priority
              style={{ filter: "var(--logo-filter)" }}
            />
          </Link>
          <button
            type="button"
            className="mobile-drawer-close-btn"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corps du Drawer Scrollable */}
        <div className="mobile-drawer-body">
          {/* Navigation Principale */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">
              {locale === "en" ? "Navigation" : "Navigation"}
            </span>
            <nav className="mobile-drawer-nav" aria-label="Menu principal">
              {mainLinks.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${locale}` && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-drawer-link ${isActive ? "is-active" : ""}`}
                    onClick={onClose}
                  >
                    <span className="mobile-drawer-link__text">{item.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {item.tag && (
                        <span className="mobile-drawer-link__tag">{item.tag}</span>
                      )}
                      {isActive && <span className="mobile-drawer-active-dot" />}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sous-Menu Rapide Documentation (Si l'utilisateur consulte la doc ou souhaite un accès direct) */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">
              {locale === "en" ? "Documentation Sections" : "Guides & Documentation"}
            </span>
            <div className="mobile-drawer-subgrid">
              {docSubLinks.map((item) => {
                const isSubActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-drawer-sublink ${isSubActive ? "is-active" : ""}`}
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    {isSubActive && <span className="mobile-drawer-active-dot" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Personnalisation & Actions */}
          <div className="mobile-drawer-section mobile-drawer-section--settings">
            <span className="mobile-drawer-section-title">
              {locale === "en" ? "Settings & Social" : "Réglages & Communauté"}
            </span>
            <div className="mobile-drawer-switchers-grid">
              <div className="mobile-drawer-setting-box">
                <span className="mobile-drawer-setting-title">
                  {locale === "en" ? "Theme" : "Thème"}
                </span>
                <ThemeSwitcher />
              </div>
              <div className="mobile-drawer-setting-box">
                <span className="mobile-drawer-setting-title">
                  {locale === "en" ? "Language" : "Langue"}
                </span>
                <LocaleSwitcher locale={locale} dict={dict} />
              </div>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {isAllowedBaamix && (
                <button
                  type="button"
                  className="mobile-drawer-baamix-btn"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent("open-baamix"));
                  }}
                >
                  <Image
                    src="/images/baamix.jpg"
                    alt="Baamix"
                    width={22}
                    height={22}
                    className="chatbot-avatar-img"
                  />
                  <span>Baamix</span>
                </button>
              )}
              <div style={{ display: "flex", justifyContent: "center", marginTop: "0.25rem" }}>
                <GitHubBadge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

