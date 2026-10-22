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
import "@/styles/split/pages-docs.css";

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
      <div className="dx-div-4">
        <div>
          <span className="feature-category-label">
            {isEn ? "Support & Knowledge Base" : "Support & Connaissances"}
          </span>
          <h1 className="dx-h1-2">
            {isEn ? "FAQ & Troubleshooting" : "FAQ & Dépannage"}
          </h1>
        </div>
        <div className="dx-div-2">
          <DownloadPdfButton locale={locale} chapterId="faq" />
          <ShareButton
            locale={locale}
            pathname="/documentation/faq"
            title={isEn ? "Bobine FAQ & Troubleshooting" : "FAQ & Dépannage Bobine"}
            description={isEn ? "Answers to common questions and troubleshooting guide for Bobine." : "Réponses aux questions fréquentes et guide de résolution des erreurs."}
          />
        </div>
      </div>

      <p className="dx-p-4">
        {isEn
          ? "Find fast answers to frequently asked questions and step-by-step diagnostic solutions for common hardware and network inquiries."
          : "Retrouvez les réponses aux questions fréquentes ainsi que les solutions pas-à-pas pour diagnostiquer et résoudre rapidement vos besoins d'exploitation."}
      </p>

      {/* Onglets principaux de navigation */}
      <div
        role="tablist"
        aria-label={isEn ? "FAQ Sections" : "Sections FAQ"} className="dx-div-6"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mainTab === "faq"}
          onClick={() => setMainTab("faq")}
          className="dx-tab"
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
          className="dx-tab"
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
          className="dx-tab"
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
        <section className="dx-section-1">
          {mainTab === "all" && (
            <div className="dx-div-7">
              <h2 className="dx-h2-1">
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
          <div className="dx-div-8">
            {filteredFaqList.map((item, idx) => {
              const isOpen = !!openIndexes[idx];
              return (
                <article
                  key={item.q} className="dx-article-1"
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(idx)}
                    aria-expanded={isOpen} className="dx-button-1"
                  >
                    <span>
                      <span className="docs-faq-item-category">{categoryLabels[item.category]}</span>
                      <h3 className="dx-h3-1">
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
                      className={`chevron-flip dx-chevron${isOpen ? " is-open" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="dx-div-9">
                      <p className="dx-h1-1">{item.a}</p>
                    </div>
                  )}
                </article>
              );
            })}
            {filteredFaqList.length === 0 && (
              <p className="dx-p-5">
                {isEn ? "No questions in this category yet." : "Aucune question dans cette catégorie pour le moment."}
              </p>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2 : TABLEAU DE DÉPANNAGE & DIAGNOSTICS */}
      {(mainTab === "troubleshoot" || mainTab === "all") && (
        <section className="dx-section-1">
          {mainTab === "all" && (
            <div className="dx-div-10">
              <h2 className="dx-h2-1">
                {isEn ? "Part 2 — Troubleshooting Matrix & Diagnostics" : "Partie 2 — Dépannage & Diagnostics"}
              </h2>
            </div>
          )}

          <h2 id="troubleshooting-matrix" className="dx-h2-2">
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

          <h2 id="diagnostic-commands" className="dx-h2-3">
            {isEn ? "Interactive Diagnostic Console" : "Commandes de Diagnostic & Résolution Interactive"}
          </h2>
          <p className="dx-p-5">
            {isEn
              ? "Simulate diagnostic checks or run them over SSH directly on your Bobine mini PC:"
              : "Simulez les vérifications de diagnostic ou exécutez-les via SSH directement sur votre mini PC Bobine :"}
          </p>

          <InteractiveTerminal
            locale={locale}
            preset="troubleshooting"
            title={isEn ? "bash — bobine diagnostic console" : "bash — console de diagnostic bobine"}
          />

          <div className="docs-callout docs-callout--tip dx-div-11">
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
