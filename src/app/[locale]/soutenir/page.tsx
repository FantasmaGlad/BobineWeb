"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GitHubIcon from "@/components/icons/GitHubIcon";
import KofiIcon from "@/components/icons/KofiIcon";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { type Locale } from "@/lib/i18n";

export default function SupportPage() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "fr";
  const isEn = locale === "en";

  const [coffeeCount, setCoffeeCount] = useState<number>(3);

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "Support" : "Soutenir", url: `/${locale}/soutenir` },
  ];

  const coffeeAmounts = [1, 3, 5, 10];

  return (
    <div className="container" style={{ maxWidth: "72rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* =========================================================================
          1. ÉCRAN INITIAL SANS SCROLL : LES DEUX INTERFACES CÔTE À CÔTE
          ========================================================================= */}
      <section
        className="support-hero-viewport"
        style={{
          minHeight: "calc(100svh - 110px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingBlock: "clamp(1.5rem, 3vh, 3rem)",
          boxSizing: "border-box",
        }}
      >
        <div className="support-dual-grid">
          {/* =====================================================================
              COLONNE GAUCHE : Style GitHub Pull Request / Profil Maintainer
              ===================================================================== */}
          <div className="github-pr-card">
            <div className="github-pr-card__header">
              <div className="github-pr-card__status-row">
                <span className="github-pr-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="18" r="3"/>
                    <circle cx="6" cy="6" r="3"/>
                    <path d="M13 6h3a2 2 0 0 1 2 2v7"/>
                    <line x1="6" y1="9" x2="6" y2="21"/>
                  </svg>
                  <span>Open</span>
                </span>
                <span className="github-pr-repo">FantasmaGlad / Bobine</span>
              </div>

              {/* Profil GitHub du Maintainer avec avatar officiel */}
              <div className="github-profile-author-row">
                <div className="github-profile-avatar-box">
                  <Image
                    src="/images/github-profile.png"
                    alt="FantasmaGlad"
                    width={34}
                    height={34}
                    className="github-profile-img"
                  />
                </div>
                <div className="github-profile-author-info">
                  <span className="github-profile-name">FantasmaGlad</span>
                  <span className="github-profile-role">
                    {isEn ? "Lead Maintainer & Author" : "Auteur & Développeur Principal"}
                  </span>
                </div>
              </div>

              <h2 className="github-pr-card__title">
                {isEn
                  ? "PR #42: Contribute Code, Drivers & Local Feedback"
                  : "PR #42 : Contribuer au Code, Pilotes & Retours Club"}
              </h2>

              <div className="github-pr-card__branch-info">
                <span className="github-pr-branch">main</span>
                <span className="github-pr-branch-sep">{isEn ? "from" : "depuis"}</span>
                <span className="github-pr-branch is-feature">feature/your-contribution</span>
              </div>
            </div>

            <div className="github-pr-card__body">
              <div className="github-pr-checklist">
                <div className="github-pr-checkitem">
                  <div className="github-pr-checkicon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="github-pr-checktext">
                    <strong>{isEn ? "Star the Repository" : "Ajouter une étoile (Star)"}</strong>
                    <span>{isEn ? "Support project visibility across GitHub." : "Augmentez la notoriété du projet open-source."}</span>
                  </div>
                </div>

                <div className="github-pr-checkitem">
                  <div className="github-pr-checkicon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="github-pr-checktext">
                    <strong>{isEn ? "Share Club Feedback (Issues)" : "Retours d'expérience (Issues)"}</strong>
                    <span>{isEn ? "Report your gym hardware setup and feature requests." : "Partagez votre configuration de salle et suggestions."}</span>
                  </div>
                </div>

                <div className="github-pr-checkitem">
                  <div className="github-pr-checkicon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="github-pr-checktext">
                    <strong>{isEn ? "Submit Pull Requests" : "Soumettre des Pull Requests"}</strong>
                    <span>{isEn ? "Improve Intel VA-API, CEC drivers or i18n." : "Améliorez le code, le contrôle TV ou les traductions."}</span>
                  </div>
                </div>
              </div>

              <div className="github-pr-code-snippet">
                <code>git clone https://github.com/FantasmaGlad/Bobine.git</code>
              </div>
            </div>

            <div className="github-pr-card__footer">
              <a
                className="btn-secondary"
                href="https://github.com/FantasmaGlad/Bobine"
                target="_blank"
                rel="noreferrer"
                style={{ width: "100%", justifyContent: "center", minHeight: "44px" }}
              >
                <GitHubIcon size={18} />
                {isEn ? "Open Pull Request on GitHub" : "Rejoindre le Dépôt GitHub"}
              </a>
            </div>
          </div>

          {/* =====================================================================
              COLONNE DROITE : Style Widget Créateur Ko-fi
              ===================================================================== */}
          <div className="kofi-widget-card">
            <div className="kofi-widget-card__header">
              <div className="kofi-widget-avatar-row">
                <div className="kofi-avatar-box">
                  <KofiIcon size={22} />
                </div>
                <div className="kofi-creator-info">
                  <span className="kofi-creator-title">
                    {isEn ? "Support Bobine on Ko-fi" : "Offrir un café à Bobine"}
                  </span>
                  <span className="kofi-creator-handle">@fantasmaglad</span>
                </div>
              </div>
            </div>

            <div className="kofi-widget-card__body">
              {/* Sélecteur de cafés interactif */}
              <div className="kofi-amount-selector">
                <span className="kofi-selector-label">
                  {isEn ? "Choose your support tier:" : "Choisissez votre contribution :"}
                </span>
                <div className="kofi-amount-pills">
                  {coffeeAmounts.map((amt) => {
                    const isSelected = coffeeCount === amt;
                    const price = amt * 3;
                    return (
                      <button
                        key={amt}
                        type="button"
                        className={`kofi-amount-pill ${isSelected ? "is-selected" : ""}`}
                        onClick={() => setCoffeeCount(amt)}
                      >
                        <span className="kofi-amount-qty">
                          {amt} {amt > 1 ? (isEn ? "coffees" : "cafés") : (isEn ? "coffee" : "café")}
                        </span>
                        <span className="kofi-amount-price">{price} €</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transparence des dépenses */}
              <div className="kofi-breakdown-box">
                <span className="kofi-breakdown-title">
                  {isEn ? "Direct funding usage:" : "Usage direct des fonds :"}
                </span>
                <ul className="kofi-breakdown-list">
                  <li>{isEn ? "Test mini PCs (Dell Wyse 5070 / ~40-50 €)" : "Mini PC reconditionnés pour banc d'essai (~40-50 €)"}</li>
                  <li>{isEn ? "HDMI-CEC adapters & wireless air-mouse remotes" : "Clés HDMI-CEC, cartes son et télécommandes"}</li>
                  <li>{isEn ? "Domain renewal & CI continuous build servers" : "Nom de domaine bobine.fit & serveurs de build CI"}</li>
                </ul>
              </div>
            </div>

            <div className="kofi-widget-card__footer">
              <a
                className="btn-primary"
                href="https://ko-fi.com/fantasmaglad"
                target="_blank"
                rel="noreferrer"
                style={{ width: "100%", justifyContent: "center", minHeight: "44px" }}
              >
                <KofiIcon size={18} />
                {isEn
                  ? `Donate ${coffeeCount * 3} € on Ko-fi`
                  : `Faire un don de ${coffeeCount * 3} € sur Ko-fi`}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SECTION AU DÉFILEMENT : TITRE & DÉVELOPPEMENT DÉTAILLÉ
          ========================================================================= */}
      <section id="community-details" style={{ paddingBlock: "clamp(3rem, 6vh, 5rem)", maxWidth: "52rem", marginInline: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span className="feature-category-label">
            {isEn ? "Community & Funding" : "Communauté & Financement"}
          </span>
          <h2
            style={{
              fontSize: "clamp(1.85rem, 3.8vw, 2.6rem)",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              marginBlock: "0.5rem 0.85rem",
              color: "var(--text-heading)",
            }}
          >
            {isEn ? "Supporting the Bobine Project" : "Soutenir le Projet Bobine"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
            {isEn
              ? "Bobine is 100% free and open-source software (AGPL-3.0), with zero subscriptions, zero ads, and zero vendor lock-in."
              : "Bobine est un logiciel 100% libre et gratuit (AGPL-3.0), sans abonnement récurrent, sans publicité et sans dépendance propriétaire."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.5rem" }}>
              {isEn ? "1. Why Free & Self-Hosted Playout?" : "1. Pourquoi une Régie Libre & Auto-Hébergée ?"}
            </h3>
            <p style={{ color: "var(--text-main)", fontSize: "0.975rem", lineHeight: 1.65, margin: 0 }}>
              {isEn
                ? "Proprietary fitness cinema solutions charge recurring subscriptions between $150 and $400 monthly per display. Bobine gives sports clubs, studio coaches, and gym owners total digital sovereignty by eliminating software rents and running 100% offline on standard affordable mini PCs."
                : "Les régies vidéo propriétaires imposent des abonnements mensuels récurrents de 150 € à 400 € par écran. Bobine redonne une souveraineté numérique totale aux clubs, gérants et coachs en supprimant toute rente logicielle et en fonctionnant à 100% hors-ligne sur du matériel standard reconditionné."}
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.5rem" }}>
              {isEn ? "2. Financial Transparency & Independence" : "2. Transparence Budgétaire & Indépendance"}
            </h3>
            <p style={{ color: "var(--text-main)", fontSize: "0.975rem", lineHeight: 1.65, margin: 0 }}>
              {isEn
                ? "Bobine has no external corporate investors and collects zero user data. Every donation received via Ko-fi directly pays for hardware testing benches (Dell Wyse units, Intel Celeron mini PCs, HDMI-CEC USB keys), domain renewals, and automated CI/CD runners."
                : "Bobine ne dépend d'aucun investisseur privé et ne collecte aucune donnée personnelle. Chaque euro reçu sur Ko-fi sert exclusivement à financer le banc d'essai matériel (mini PC Dell Wyse, clés HDMI-CEC, cartes son), le renouvellement du nom de domaine et les serveurs de compilation continue."}
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.5rem" }}>
              {isEn ? "3. How You Can Help the Project" : "3. Comment Contribuer Concrètement ?"}
            </h3>
            <p style={{ color: "var(--text-main)", fontSize: "0.975rem", lineHeight: 1.65, margin: 0 }}>
              {isEn
                ? "Whether you are a developer, gym manager, or fitness enthusiast, starring our GitHub repository, reporting compatibility with TV screens, improving the Debian install script, or translating documentation helps the ecosystem grow."
                : "Que vous soyez développeur, gérant de salle ou passionné de fitness, ajouter une étoile sur GitHub, tester la compatibilité d'un téléviseur, traduire la documentation ou optimiser les scripts d'installation aide directement la communauté."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

