"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import GitHubIcon from "@/components/icons/GitHubIcon";
import CoffeeCupIcon from "@/components/icons/CoffeeCupIcon";
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
    <div className="container" style={{ paddingBlock: "clamp(2rem, 5vw, 4rem)", maxWidth: "72rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      {/* En-tête de la page */}
      <div style={{ textAlign: "center", maxWidth: "44rem", marginInline: "auto", marginBottom: "clamp(2rem, 4vw, 3.25rem)" }}>
        <span className="feature-category-label">
          {isEn ? "Community & Funding" : "Communauté & Financement"}
        </span>
        <h1
          style={{
            fontSize: "clamp(2rem, 4.2vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBlock: "0.4rem 0.85rem",
            color: "var(--text-heading)",
          }}
        >
          {isEn ? "Support the Bobine Project" : "Soutenir le Projet Bobine"}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
          {isEn
            ? "Bobine is 100% free and open-source software (AGPL-3.0) with zero subscriptions, zero ads, and zero vendor lock-in."
            : "Bobine est un logiciel 100% libre et gratuit (AGPL-3.0), sans abonnement récurrent, sans publicité et sans dépendance propriétaire."}
        </p>
      </div>

      {/* Grille 2 Colonnes : Gauche = GitHub PR / Droite = Ko-fi Widget */}
      <div className="support-dual-grid">
        {/* =========================================================================
            COLONNE GAUCHE : Style GitHub Pull Request / Contribution
            ========================================================================= */}
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
              <span className="github-pr-repo">FantasmaGlad / Bobine #PR</span>
            </div>

            <h2 className="github-pr-card__title">
              {isEn
                ? "Contribute Code, Documentation & Feedback"
                : "Contribuer au Code, à la Doc & aux Retours"}
            </h2>

            <div className="github-pr-card__branch-info">
              <span className="github-pr-branch">main</span>
              <span className="github-pr-arrow">←</span>
              <span className="github-pr-branch is-feature">feature/your-contribution</span>
            </div>
          </div>

          <div className="github-pr-card__body">
            <p className="github-pr-card__intro">
              {isEn
                ? "Bobine thrives thanks to community contributions. Here is how you can directly help build the future of open-source gym media:"
                : "Bobine grandit grâce à la communauté libre. Voici comment vous pouvez concrètement faire progresser la régie fitness :"
              }
            </p>

            <div className="github-pr-checklist">
              <div className="github-pr-checkitem">
                <div className="github-pr-checkicon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="github-pr-checktext">
                  <strong>{isEn ? "Star the Repository" : "Ajouter une étoile (Star)"}</strong>
                  <span>{isEn ? "Boost project visibility across the open-source fitness community." : "Augmentez la visibilité du projet sur GitHub."}</span>
                </div>
              </div>

              <div className="github-pr-checkitem">
                <div className="github-pr-checkicon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="github-pr-checktext">
                  <strong>{isEn ? "Share Club Feedback" : "Retours d'expérience en salle"}</strong>
                  <span>{isEn ? "Open an issue with your real-world gym equipment configuration." : "Partagez vos retours d'installation et suggestions d'évolutions."}</span>
                </div>
              </div>

              <div className="github-pr-checkitem">
                <div className="github-pr-checkicon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="github-pr-checktext">
                  <strong>{isEn ? "Code & Translations (PR)" : "Code & Traductions (Pull Requests)"}</strong>
                  <span>{isEn ? "Help with HDMI-CEC drivers, audio crossfade or i18n locales." : "Améliorez les pilotes CEC, l'UI tactile ou les traductions."}</span>
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
              style={{ width: "100%", justifyContent: "center", minHeight: "48px" }}
            >
              <GitHubIcon size={18} />
              {isEn ? "Open Pull Request on GitHub" : "Rejoindre le Dépôt GitHub"}
            </a>
          </div>
        </div>

        {/* =========================================================================
            COLONNE DROITE : Style Widget Créateur Ko-fi
            ========================================================================= */}
        <div className="kofi-widget-card">
          <div className="kofi-widget-card__header">
            <div className="kofi-widget-avatar-row">
              <div className="kofi-avatar-box">
                <CoffeeCupIcon size={24} />
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
            <p className="kofi-widget-card__intro">
              {isEn
                ? "Your financial support directly covers real hardware testing, domain renewal, and continuous integration infrastructure."
                : "Vos dons ponctuels ou mensuels financent directement l'achat de matériel de test, le nom de domaine et les serveurs d'intégration."
              }
            </p>

            {/* Sélecteur de cafés interactif */}
            <div className="kofi-amount-selector">
              <span className="kofi-selector-label">
                {isEn ? "Choose your coffee tier:" : "Choisissez votre contribution :"}
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
                {isEn ? "Where does your donation go?" : "Transparence sur l'usage des fonds :"}
              </span>
              <ul className="kofi-breakdown-list">
                <li>{isEn ? "Dell Wyse & mini PC test benches (~40-50 € / unit)" : "Mini PC de test reconditionnés (~40-50 € / machine)"}</li>
                <li>{isEn ? "HDMI-CEC adapters & wireless air-mouse remotes" : "Clés HDMI-CEC, cartes audio et télécommandes"}</li>
                <li>{isEn ? "bobine.fit domain name and CI build runner servers" : "Nom de domaine bobine.fit & serveurs de compilation CI"}</li>
              </ul>
            </div>
          </div>

          <div className="kofi-widget-card__footer">
            <a
              className="btn-primary"
              href="https://ko-fi.com/fantasmaglad"
              target="_blank"
              rel="noreferrer"
              style={{ width: "100%", justifyContent: "center", minHeight: "48px" }}
            >
              <CoffeeCupIcon size={18} />
              {isEn
                ? `Donate ${coffeeCount * 3} € on Ko-fi`
                : `Faire un don de ${coffeeCount * 3} € sur Ko-fi`}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

