"use client";

import React, { useEffect, useState } from "react";

interface SecurityHeaderProps {
  lang: "fr" | "en";
  langLinks: [string, string];
}

export default function SecurityHeader({ lang, langLinks }: SecurityHeaderProps) {
  const isFr = lang === "fr";
  const [theme, setTheme] = useState("lavande");

  useEffect(() => {
    try {
      const match = document.cookie.match(/(?:^|; )bobine-theme=([\w-]+)/);
      const stored = (match && match[1]) || localStorage.getItem("bobineweb-theme") || "lavande";
      document.documentElement.setAttribute("data-theme", stored);
      requestAnimationFrame(() => setTheme(stored));
    } catch {
      // ignore
    }
  }, []);

  const cycleTheme = () => {
    const themes = ["lavande", "orchidee", "charbon", "clair", "ciel", "menthe", "automne", "lune"];
    const idx = themes.indexOf(theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("bobineweb-theme", next);
      document.cookie = `bobine-theme=${next};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href={isFr ? "https://bobine.fit/fr" : "https://bobine.fit/en"} className="brand" aria-label="Bobine">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo_bobine_entier.png" alt="Bobine" width={112} height={28} />
          <span>{isFr ? "Sécurité & Divulgation" : "Security & Disclosure"}</span>
        </a>

        <nav className="header-nav" aria-label={isFr ? "Navigation" : "Navigation"}>
          <a href={isFr ? "/fr/snake/" : "/snake/"}>Snake</a>
          <a href="/security.asc" download="security.asc">
            security.asc
          </a>
          <a href="/.well-known/security.txt">
            security.txt
          </a>

          <div className="header-controls">
            <nav className="locale-switcher" aria-label="Langue / Language">
              <a
                className={`locale-switcher__link${lang === "en" ? " is-active" : ""}`}
                href={langLinks[0]}
                aria-current={lang === "en" ? "true" : undefined}
              >
                EN
              </a>
              <a
                className={`locale-switcher__link${isFr ? " is-active" : ""}`}
                href={langLinks[1]}
                aria-current={isFr ? "true" : undefined}
              >
                FR
              </a>
            </nav>

            <button
              type="button"
              className="theme-switcher-btn"
              onClick={cycleTheme}
              aria-label={isFr ? "Changer de thème" : "Change theme"}
            >
              <span className="theme-swatch-icon" data-theme={theme} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
