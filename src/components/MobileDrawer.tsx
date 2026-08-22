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
  const isEn = locale === "en";

  const mainLinks: Array<{ href: string; label: string; tag?: string }> = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/fonctionnalites`, label: dict.nav.features },
    { href: `/${locale}/demo-3d`, label: dict.nav.demo, tag: "3D" },
    { href: `/${locale}/documentation`, label: dict.nav.documentation },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/soutenir`, label: dict.nav.support },
    { href: `/${locale}/a-propos`, label: dict.nav.about },
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
          {/* 1. Assistance & Contact — Tout en haut */}
          <div className="mobile-drawer-section">
            <span className="mobile-drawer-section-title">
              {isEn ? "Assistance & Support" : "Assistance"}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
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
                    height={32}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span className="baamix-header-dot" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.925rem", color: "var(--text-heading)" }}>
                    Baamix
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {isEn ? "Interactive AI Assistant" : "Mascotte & Assistant IA"}
                  </span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Module Contact Gmail */}
              <div className="mobile-drawer-contact-card">
                <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {isEn ? "Direct Developer Contact" : "Contact Développeur"}
                </span>
                <p style={{ fontSize: "0.775rem", color: "var(--text-muted)", margin: "0 0 0.5rem 0", lineHeight: 1.4 }}>
                  {isEn
                    ? "Question, feedback, or custom feature request?"
                    : "Une question, un retour de club ou une suggestion ?"}
                </p>
                <a
                  href="mailto:clement.barillot3901@gmail.com?subject=Contact%20Bobine"
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.65rem",
                    fontSize: "0.8rem",
                    justifyContent: "center",
                    borderRadius: "0.45rem",
                    textDecoration: "none",
                  }}
                  onClick={onClose}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>{isEn ? "Send email on Gmail" : "Envoyer un message sur Gmail"}</span>
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

          {/* 4. Communauté & Légal — Tout en bas */}
          <div className="mobile-drawer-section" style={{ borderBottom: "none", paddingBottom: "1rem" }}>
            <span className="mobile-drawer-section-title">
              {isEn ? "Community & Legal" : "Communauté & Légal"}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <GitHubBadge />
              </div>
              <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", alignItems: "center", fontSize: "0.8rem" }}>
                <Link
                  href={`/${locale}/mentions-legales`}
                  onClick={onClose}
                  style={{ color: "var(--text-muted)", textDecoration: "none" }}
                >
                  {dict.footer.legal}
                </Link>
                <span style={{ color: "var(--border-subtle)" }}>•</span>
                <Link
                  href={`/${locale}/confidentialite`}
                  onClick={onClose}
                  style={{ color: "var(--text-muted)", textDecoration: "none" }}
                >
                  {dict.footer.privacy}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


