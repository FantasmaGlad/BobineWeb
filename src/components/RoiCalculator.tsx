"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export default function RoiCalculator({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const screensInputId = useId();
  const costInputId = useId();
  const [screens, setScreens] = useState<number>(2);
  const [costPerScreen, setCostPerScreen] = useState<number>(200);

  const hardwareCost = screens * 50; // ~50€ par mini PC Dell Wyse 5070 reconditionné
  const yearlyProprietary = screens * costPerScreen * 12;
  const savingsYear1 = yearlyProprietary - hardwareCost;
  const savingsYear3 = screens * costPerScreen * 36 - hardwareCost;
  const savingsYear5 = screens * costPerScreen * 60 - hardwareCost;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isEn ? "en-US" : "fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="roi-calculator-section">
      <div className="roi-calculator-header">
        <span className="feature-category-label">
          {isEn ? "Interactive ROI Calculator" : "Simulateur d'Économies & ROI"}
        </span>
        <h3 className="roi-calculator-title">

          {isEn
            ? "Calculate your gym's annual savings with Bobine"
            : "Calculez les économies réelles de votre salle avec Bobine"}
        </h3>
        <p className="roi-calculator-desc">
          {isEn
            ? "Compare the recurring fees of proprietary closed platforms against a one-off refurbished mini PC with Bobine."
            : "Comparez le coût des abonnements mensuels fermés avec l'investissement unique dans un mini PC Bobine."}
        </p>
      </div>

      <div className="roi-calculator-card">
        {/* Sliders d'ajustement */}
        <div className="roi-sliders-grid">
          <div className="roi-slider-group">
            <div className="roi-slider-label">
              <label htmlFor={screensInputId} style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                {isEn ? "Number of gym screens / studios:" : "Nombre d'écrans / studios équipés :"}
              </label>
              <span className="roi-slider-value">{screens} {isEn ? (screens > 1 ? "screens" : "screen") : (screens > 1 ? "écrans" : "écran")}</span>
            </div>
            <input
              id={screensInputId}
              type="range"
              min="1"
              max="10"
              step="1"
              value={screens}
              onChange={(e) => setScreens(Number(e.target.value))}
              className="roi-range-input"
            />
            <div className="roi-range-marks">
              <span>1</span>
              <span>3</span>
              <span>5</span>
              <span>8</span>
              <span>10</span>
            </div>
          </div>

          <div className="roi-slider-group">
            <div className="roi-slider-label">
              <label htmlFor={costInputId} style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                {isEn ? "Current monthly cost per screen:" : "Coût mensuel actuel par écran (Les Mills / SaaS) :"}
              </label>
              <span className="roi-slider-value">{costPerScreen} € / mois</span>
            </div>
            <input
              id={costInputId}
              type="range"
              min="100"
              max="400"
              step="25"
              value={costPerScreen}
              onChange={(e) => setCostPerScreen(Number(e.target.value))}
              className="roi-range-input"
            />
            <div className="roi-range-marks">
              <span>100 €</span>
              <span>200 €</span>
              <span>300 €</span>
              <span>400 €</span>
            </div>
          </div>
        </div>

        {/* Résultat des économies */}
        <div className="roi-results-grid">
          <div className="roi-result-card roi-result-card--featured">
            <span className="roi-result-period">{isEn ? "1st Year Net Savings" : "Économie Nette Année 1"}</span>
            <div className="roi-result-amount">{formatCurrency(savingsYear1)}</div>
            <span className="roi-result-sub">
              {isEn
                ? `Includes ${formatCurrency(hardwareCost)} one-time hardware purchase`
                : `Achat matériel déduit (${formatCurrency(hardwareCost)} au total)`}
            </span>
          </div>

          <div className="roi-result-card">
            <span className="roi-result-period">{isEn ? "3-Year Total Savings" : "Économie sur 3 ans"}</span>
            <div className="roi-result-amount">{formatCurrency(savingsYear3)}</div>
            <span className="roi-result-sub">
              {isEn ? "0 € software subscription" : "0 € d'abonnement logiciel"}
            </span>
          </div>

          <div className="roi-result-card">
            <span className="roi-result-period">{isEn ? "5-Year Total Savings" : "Économie sur 5 ans"}</span>
            <div className="roi-result-amount">{formatCurrency(savingsYear5)}</div>
            <span className="roi-result-sub">
              {isEn ? "Full hardware ownership" : "Matériel 100% amorti et possédé"}
            </span>
          </div>
        </div>

        {/* Pied de carte avec CTA */}
        <div className="roi-card-footer">
          <div style={{ maxWidth: "34rem" }}>
            <p style={{ margin: 0, fontSize: "0.925rem", color: "var(--text-muted)", lineHeight: 1.45 }}>
              {isEn
                ? "With Bobine, you retain 100% of your gym's margin and own your video playback equipment for life."
                : "Avec Bobine, vous conservez 100% de votre marge et devenez propriétaire définitif de votre matériel de diffusion."}
            </p>
          </div>
          <Link
            className="btn-primary"
            href={`/${locale}/documentation/demarrage-rapide`}
          >
            {isEn ? "Start Free Setup" : "Installer Bobine gratuitement"}
          </Link>
        </div>
      </div>
    </section>
  );
}
