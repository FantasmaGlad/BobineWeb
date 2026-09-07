"use client";

import { useMemo, useState } from "react";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import ShareButton from "@/components/ShareButton";
import type { Locale } from "@/lib/i18n";
import {
  FAQ_ITEMS,
  FAQ_CATEGORY_LABELS,
  TROUBLESHOOTING_ROWS,
  type FaqCategory,
} from "@/content/docs/faq-data";

const CATEGORY_ORDER: FaqCategory[] = ["license", "compare", "hardware", "offline", "updates"];

export default function DocsFaqView({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [mainTab, setMainTab] = useState<"faq" | "troubleshoot" | "all">("faq");
  // Le premier élément est ouvert par défaut : évite une page entièrement
  // repliée au premier affichage (meilleure ergonomie et meilleur SEO —
  // Google indexe plus volontiers un contenu visible au chargement).
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({ 0: true });
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "all">("all");

  const toggleQuestion = (idx: number) => {
    setOpenIndexes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqList = FAQ_ITEMS[locale] || FAQ_ITEMS.fr;
  const troubleList = TROUBLESHOOTING_ROWS[locale] || TROUBLESHOOTING_ROWS.fr;
  const categoryLabels = FAQ_CATEGORY_LABELS[locale] || FAQ_CATEGORY_LABELS.fr;

  const filteredFaqList = useMemo(
    () => (activeCategory === "all" ? faqList : faqList.filter((item) => item.category === activeCategory)),
    [faqList, activeCategory]
  );

  return (
    <>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <span className="feature-category-label">
            {isEn ? "Support & Knowledge Base" : "Support & Connaissances"}
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-0.02em" }}>
            {isEn ? "FAQ & Troubleshooting" : "FAQ & Dépannage"}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale} chapterId="faq" />
          <ShareButton
            locale={locale}
            pathname="/documentation/faq"
            title={isEn ? "Bobine FAQ & Troubleshooting" : "FAQ & Dépannage Bobine"}
            description={isEn ? "Answers to common questions and troubleshooting guide for Bobine." : "Réponses aux questions fréquentes et guide de résolution des erreurs."}
          />
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "1.025rem", lineHeight: 1.6, margin: "0 0 1.5rem 0" }}>
        {isEn
          ? "Find fast answers to frequently asked questions and step-by-step diagnostic solutions for common hardware and network inquiries."
          : "Retrouvez les réponses aux questions fréquentes ainsi que les solutions pas-à-pas pour diagnostiquer et résoudre rapidement vos besoins d'exploitation."}
      </p>

      {/* Onglets principaux de navigation */}
      <div
        role="tablist"
        aria-label={isEn ? "FAQ Sections" : "Sections FAQ"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "4px",
          marginBottom: "1.75rem",
          background: "var(--bg-inset)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "0.6rem",
          maxWidth: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "faq"}
          onClick={() => setMainTab("faq")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "0.45rem",
            fontSize: "0.825rem",
            fontWeight: 600,
            cursor: "pointer",
            background: mainTab === "faq" ? "var(--bg-card)" : "transparent",
            color: mainTab === "faq" ? "var(--text-heading)" : "var(--text-muted)",
            border: mainTab === "faq" ? "1px solid var(--border-subtle)" : "1px solid transparent",
            boxShadow: mainTab === "faq" ? "var(--shadow-sm)" : "none",
            transition: "all 0.15s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>{isEn ? "1. FAQ" : "1. FAQ"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "troubleshoot"}
          onClick={() => setMainTab("troubleshoot")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "0.45rem",
            fontSize: "0.825rem",
            fontWeight: 600,
            cursor: "pointer",
            background: mainTab === "troubleshoot" ? "var(--bg-card)" : "transparent",
            color: mainTab === "troubleshoot" ? "var(--text-heading)" : "var(--text-muted)",
            border: mainTab === "troubleshoot" ? "1px solid var(--border-subtle)" : "1px solid transparent",
            boxShadow: mainTab === "troubleshoot" ? "var(--shadow-sm)" : "none",
            transition: "all 0.15s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span>{isEn ? "2. Troubleshooting" : "2. Dépannage"}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "all"}
          onClick={() => setMainTab("all")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "0.45rem",
            fontSize: "0.825rem",
            fontWeight: 600,
            cursor: "pointer",
            background: mainTab === "all" ? "var(--bg-card)" : "transparent",
            color: mainTab === "all" ? "var(--text-heading)" : "var(--text-muted)",
            border: mainTab === "all" ? "1px solid var(--border-subtle)" : "1px solid transparent",
            boxShadow: mainTab === "all" ? "var(--shadow-sm)" : "none",
            transition: "all 0.15s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>{isEn ? "View All" : "Tout afficher"}</span>
        </button>
      </div>

      {/* SECTION 1 : QUESTIONS FRÉQUENTES */}
      {(mainTab === "faq" || mainTab === "all") && (
        <section style={{ marginBottom: "3rem" }}>
          {mainTab === "all" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "2px solid var(--accent-primary)", paddingBottom: "0.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text-heading)" }}>
                {isEn ? "Part 1 — Frequently Asked Questions" : "Partie 1 — Questions Fréquemment Posées"}
              </h2>
            </div>
          )}

          {/* Filtres par catégorie — rend la donnée `category` utile pour naviguer vite */}
          <div className="docs-faq-filters" role="tablist" aria-label={isEn ? "Filter by category" : "Filtrer par catégorie"}>
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              className={`docs-faq-filter-chip ${activeCategory === "all" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              {isEn ? "All" : "Toutes"}
            </button>
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`docs-faq-filter-chip ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>

          {/* Liste épurée des questions/réponses sans boîte-dans-une-boîte */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredFaqList.map((item, idx) => {
              const isOpen = !!openIndexes[idx];
              return (
                <article
                  key={item.q}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    paddingBottom: "1rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(idx)}
                    aria-expanded={isOpen}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      padding: "0.35rem 0",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span>
                      <span className="docs-faq-item-category">{categoryLabels[item.category]}</span>
                      <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", lineHeight: 1.4 }}>
                        {item.q}
                      </h3>
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                        color: "var(--text-muted)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div style={{ marginTop: "0.65rem", color: "var(--text-base)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                      <p style={{ margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                </article>
              );
            })}
            {filteredFaqList.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                {isEn ? "No questions in this category yet." : "Aucune question dans cette catégorie pour le moment."}
              </p>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2 : TABLEAU DE DÉPANNAGE & DIAGNOSTICS */}
      {(mainTab === "troubleshoot" || mainTab === "all") && (
        <section style={{ marginBottom: "3rem" }}>
          {mainTab === "all" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "2px solid var(--accent-primary)", paddingBottom: "0.5rem", paddingTop: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "var(--text-heading)" }}>
                {isEn ? "Part 2 — Troubleshooting Matrix & Diagnostics" : "Partie 2 — Dépannage & Diagnostics"}
              </h2>
            </div>
          )}

          <h2 id="troubleshooting-matrix" style={{ fontSize: "1.3rem", fontWeight: 750, color: "var(--text-heading)", marginBottom: "0.75rem" }}>
            {isEn ? "Common Error Resolution Matrix" : "Tableau de Résolution des Erreurs Courantes"}
          </h2>

          <div className="docs-table-wrapper">
            <table className="docs-table docs-table--stack-mobile">
              <thead>
                <tr>
                  <th>{isEn ? "Issue / Symptom" : "Problème / Symptôme"}</th>
                  <th>{isEn ? "Probable Cause" : "Cause probable"}</th>
                  <th>{isEn ? "Step-by-Step Resolution" : "Solution pas-à-pas"}</th>
                </tr>
              </thead>
              <tbody>
                {troubleList.map((row) => (
                  <tr key={row.issue}>
                    <td data-label={isEn ? "Issue" : "Problème"}><code>{row.issue}</code></td>
                    <td data-label={isEn ? "Cause" : "Cause"}>{row.cause}</td>
                    <td data-label={isEn ? "Solution" : "Solution"}>{row.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="diagnostic-commands" style={{ fontSize: "1.3rem", fontWeight: 750, color: "var(--text-heading)", marginTop: "2rem", marginBottom: "0.75rem" }}>
            {isEn ? "Interactive Diagnostic Console" : "Commandes de Diagnostic & Résolution Interactive"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {isEn
              ? "Simulate diagnostic checks or run them over SSH directly on your Bobine mini PC:"
              : "Simulez les vérifications de diagnostic ou exécutez-les via SSH directement sur votre mini PC Bobine :"}
          </p>

          <InteractiveTerminal
            locale={locale}
            preset="troubleshooting"
            title={isEn ? "bash — bobine diagnostic console" : "bash — console de diagnostic bobine"}
          />

          <div className="docs-callout docs-callout--tip" style={{ marginTop: "2rem" }}>
            <div className="docs-callout__content">
              <div className="docs-callout__title">{isEn ? "Interactive AI Assistant & Community Support" : "Assistant IA Baamix & Support Communautaire"}</div>
              <div>
                {isEn ? (
                  <>You can ask technical questions to our AI assistant Baamix using the chat widget on the right, or open a ticket on <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">GitHub Issues</a>.</>
                ) : (
                  <>Vous pouvez poser vos questions techniques directement à Baamix via la bulle de discussion à droite, ou ouvrir un ticket sur <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">GitHub Issues</a>.</>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
