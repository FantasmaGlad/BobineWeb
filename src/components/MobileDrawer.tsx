"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Dictionary, Locale } from "@/lib/i18n";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import GitHubBadge from "@/components/GitHubBadge";
import { lp } from "@/lib/seo";
import "@/styles/split/site-chrome.css";

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
  const isEn = locale === "en";

  const mainLinks: Array<{ href: string; label: string; tag?: string }> = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: lp(locale, `/fonctionnalites`), label: dict.nav.features },
    { href: lp(locale, `/materiel/aliexpress`), label: dict.nav.hardware, tag: isEn ? "Selection" : "Sélection" },
    { href: `/${locale}/documentation`, label: dict.nav.documentation },
    { href: lp(locale, `/comparatif`), label: dict.nav.comparisons },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: lp(locale, `/soutenir`), label: dict.nav.support },
    { href: lp(locale, `/a-propos`), label: dict.nav.about },
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
              priority className="site-image-2"
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
          {/* 1. Assistance & Contact — Tout en haut */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">
              {isEn ? "Assistance & Support" : "Assistance"}
            </span>
            <div className="site-div-6">
              {/* Bouton Baamix */}
              <button
                type="button"
                className="mobile-drawer-baamix-btn"
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent("open-baamix"));
                }}
              >
                <div className="mobile-drawer-baamix-avatar">
                  <Image
                    src="/images/baamix.jpg"
                    alt="Baamix"
                    width={32}
                    height={32} className="site-image-3"
                  />
                  <span className="baamix-header-dot" />
                </div>
                <div className="site-div-7">
                  <span className="site-span-2">
                    Baamix
                  </span>
                  <span className="site-span-3">
                    {isEn ? "Interactive AI Assistant" : "Mascotte & Assistant IA"}
                  </span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="site-svg-1">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Module contact */}
              <div className="mobile-drawer-contact-card">
                <span className="site-span-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {isEn ? "Direct Developer Contact" : "Contact Développeur"}
                </span>
                <p className="site-p-2">
                  {isEn
                    ? "Question, feedback, or custom feature request?"
                    : "Une question, un retour de club ou une suggestion ?"}
                </p>
                <a
                  href="mailto:clement.barillot@bobine.fit?subject=Contact%20Bobine"
                  className="btn-secondary site-a-3"
                  onClick={onClose}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>{isEn ? "Send an email" : "Envoyer un e-mail"}</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Réglages (Thème & Langue) — Au-dessus de Navigation */}
          <div className="mobile-drawer-section mobile-drawer-section--settings">
            <span className="mobile-drawer-section-title">
              {isEn ? "Settings" : "Réglages"}
            </span>
            <div className="mobile-drawer-switchers-grid">
              <div className="mobile-drawer-setting-box">
                <span className="mobile-drawer-setting-title">
                  {isEn ? "Theme" : "Thème"}
                </span>
                <ThemeSwitcher />
              </div>
              <div className="mobile-drawer-setting-box">
                <span className="mobile-drawer-setting-title">
                  {isEn ? "Language" : "Langue"}
                </span>
                <LocaleSwitcher locale={locale} dict={dict} />
              </div>
            </div>
          </div>

          {/* 3. Navigation Principale */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">
              {isEn ? "Navigation" : "Navigation"}
            </span>
            <nav className="mobile-drawer-nav" aria-label="Menu principal">
              {mainLinks.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${locale}` && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-drawer-link mobile-drawer-link--enter ${isActive ? "is-active" : ""}`}
                    style={{ animationDelay: `${40 + index * 30}ms` }}
                    onClick={onClose}
                  >
                    <span className="mobile-drawer-link__text">{item.label}</span>
                    <div className="site-div-8">
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

          {/* 4. Communauté & Légal — Tout en bas */}
          <div className="mobile-drawer-section site-div-9">
            <div className="site-div-10">
              <div className="site-div-11">
                <Link
                  href={lp(locale, `/mentions-legales`)}
                  onClick={onClose} className="site-link-3"
                >
                  {dict.footer.legal}
                </Link>
                <span className="site-span-5">•</span>
                <Link
                  href={lp(locale, `/confidentialite`)}
                  onClick={onClose} className="site-link-3"
                >
                  {dict.footer.privacy}
                </Link>
              </div>
              <div className="site-div-12">
                <GitHubBadge />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


