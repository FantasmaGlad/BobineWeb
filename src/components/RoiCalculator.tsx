"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import "@/styles/split/pages-misc.css";

export default function RoiCalculator({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const screensInputId = useId();
  const costInputId = useId();
  const hardwareInputId = useId();
  const [screens, setScreens] = useState<number>(2);
  // Montants saisis par le visiteur : aucun tarif de fournisseur n'est présupposé (vide = 0).
  const [costPerScreen, setCostPerScreen] = useState<string>("");
  const [hardwarePerScreen, setHardwarePerScreen] = useState<string>("");

  const monthly = Math.max(0, Number(costPerScreen) || 0);
  const hardwareCost = screens * Math.max(0, Number(hardwarePerScreen) || 0);
  const yearlyProprietary = screens * monthly * 12;
  const savingsYear1 = yearlyProprietary - hardwareCost;
  const savingsYear3 = screens * monthly * 36 - hardwareCost;
  const savingsYear5 = screens * monthly * 60 - hardwareCost;

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
          {isEn ? "Cost calculator" : "Simulateur de coûts"}
        </span>
        <h2 className="roi-calculator-title">
          {isEn
            ? "Work out the gap with your own figures"
            : "Calculez l'écart avec vos propres montants"}
        </h2>
        <p className="roi-calculator-desc">
          {isEn
            ? "Enter what you pay today per screen and what a player would cost you. The result only reflects these amounts: no vendor rate is assumed."
            : "Saisissez ce que vous payez aujourd'hui par écran et le prix d'un lecteur pour vous. Le résultat ne reflète que ces montants : aucun tarif de fournisseur n'est supposé."}
        </p>
      </div>

      <div className="roi-calculator-card">
        {/* Sliders d'ajustement */}
        <div className="roi-sliders-grid">
          <div className="roi-slider-group">
            <div className="roi-slider-label">
              <label htmlFor={screensInputId} className="roi-calculator-label-1">
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
              <label htmlFor={costInputId} className="roi-calculator-label-1">
                {isEn ? "Current monthly cost per screen (€):" : "Coût mensuel actuel par écran (€) :"}
              </label>
            </div>
            <input
              id={costInputId}
              type="number"
              inputMode="decimal"
              min="0"
              step="1"
              placeholder="0"
              value={costPerScreen}
              onChange={(e) => setCostPerScreen(e.target.value)}
              className="roi-number-input"
            />
          </div>

          <div className="roi-slider-group">
            <div className="roi-slider-label">
              <label htmlFor={hardwareInputId} className="roi-calculator-label-1">
                {isEn ? "Cost of one player for you (€):" : "Coût d'un lecteur pour vous (€) :"}
              </label>
            </div>
            <input
              id={hardwareInputId}
              type="number"
              inputMode="decimal"
              min="0"
              step="1"
              placeholder="0"
              value={hardwarePerScreen}
              onChange={(e) => setHardwarePerScreen(e.target.value)}
              className="roi-number-input"
            />
          </div>
        </div>

        {/* Résultat des économies */}
        <div className="roi-results-grid">
          <div className="roi-result-card roi-result-card--featured">
            <span className="roi-result-period">{isEn ? "1st year gap" : "Écart sur 1 an"}</span>
            <div className="roi-result-amount">{formatCurrency(savingsYear1)}</div>
            <span className="roi-result-sub">
              {isEn
                ? `After ${formatCurrency(hardwareCost)} of players bought once`
                : `Après ${formatCurrency(hardwareCost)} de lecteurs achetés une fois`}
            </span>
          </div>

          <div className="roi-result-card">
            <span className="roi-result-period">{isEn ? "3-year gap" : "Écart sur 3 ans"}</span>
            <div className="roi-result-amount">{formatCurrency(savingsYear3)}</div>
            <span className="roi-result-sub">
              {isEn ? "No software subscription with Bobine" : "Aucun abonnement logiciel avec Bobine"}
            </span>
          </div>

          <div className="roi-result-card">
            <span className="roi-result-period">{isEn ? "5-year gap" : "Écart sur 5 ans"}</span>
            <div className="roi-result-amount">{formatCurrency(savingsYear5)}</div>
            <span className="roi-result-sub">
              {isEn ? "You own the hardware" : "Le matériel vous appartient"}
            </span>
          </div>
        </div>

        {/* Pied de carte avec CTA */}
        <div className="roi-card-footer">
          <div className="roi-calculator-div-1">
            <p className="roi-calculator-p-1">
              {isEn
                ? "A simple projection from the amounts above; it ignores taxes, electricity and any other cost."
                : "Projection simple à partir des montants saisis ; elle ignore taxes, électricité et tout autre coût."}
            </p>
          </div>
          <Link
            className="btn-primary"
            href={`/${locale}/documentation`}
          >
            {isEn ? "Start Free Setup" : "Installer Bobine gratuitement"}
          </Link>
        </div>
      </div>
    </section>
  );
}
