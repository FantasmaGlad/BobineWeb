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

  const links: Array<[string, string]> = [
    [`/${locale}`, dict.nav.home],
    [`/${locale}/fonctionnalites`, dict.nav.features],
    [`/${locale}/documentation`, dict.nav.documentation],
    [`/${locale}/blog`, dict.nav.blog],
    [`/${locale}/demo-3d`, dict.nav.demo],
    [`/${locale}/soutenir`, dict.nav.support],
    [`/${locale}/a-propos`, dict.nav.about],
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
              width={120}
              height={44}
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

        {/* Navigation Links */}
        <nav className="mobile-drawer-nav" aria-label="Menu mobile">
          {links.map(([href, label]) => {
            const isActive =
              pathname === href ||
              (href !== `/${locale}` && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`mobile-drawer-link ${isActive ? "is-active" : ""}`}
                onClick={onClose}
              >
                <span>{label}</span>
                {isActive && <span className="mobile-drawer-active-dot" />}
              </Link>
            );
          })}
        </nav>

        {/* Switchers & Actions */}
        <div className="mobile-drawer-footer">
          <div className="mobile-drawer-switchers">
            <div className="mobile-drawer-switcher-row">
              <span className="mobile-drawer-switcher-label">
                {locale === "en" ? "Theme" : "Thème"} :
              </span>
              <ThemeSwitcher />
            </div>
            <div className="mobile-drawer-switcher-row">
              <span className="mobile-drawer-switcher-label">
                {locale === "en" ? "Language" : "Langue"} :
              </span>
              <LocaleSwitcher locale={locale} dict={dict} />
            </div>
          </div>

          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
            <GitHubBadge />
          </div>
        </div>
      </div>
    </div>
  );
}

