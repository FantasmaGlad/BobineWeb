"use client";

import type { Locale } from "@/lib/i18n";

export default function ComparisonTable({ locale }: { locale: Locale }) {
  const isEn = locale === "en";

  const rows = isEn
    ? [
        {
          feature: "Monthly license fee per screen",
          bobine: "0 EUR / month (AGPL-3.0)",
          proprietary: "150 to 400 EUR / month",
          diy: "0 EUR",
          bobineHighlight: true,
        },
        {
          feature: "Offline resilience & Internet dependency",
          bobine: "100% Offline (Local SSD)",
          proprietary: "Cloud dependent (Freezes on outage)",
          diy: "Unreliable / Manual",
          bobineHighlight: true,
        },
        {
          feature: "Automated TV standby & power (HDMI-CEC)",
          bobine: "Yes (Native automatic control)",
          proprietary: "Proprietary hardware only",
          diy: "No (Manual TV remote)",
          bobineHighlight: true,
        },
        {
          feature: "Automated weekly workout scheduler",
          bobine: "Yes (Second-precise automation)",
          proprietary: "Yes (Closed ecosystem)",
          diy: "No / Complex scripts",
          bobineHighlight: true,
        },
        {
          feature: "Content freedom (Coach videos / MP4 / MKV)",
          bobine: "Full freedom (Your own videos)",
          proprietary: "Locked to provider catalog",
          diy: "Manual files",
          bobineHighlight: true,
        },
        {
          feature: "Hardware investment",
          bobine: "Standard Mini PC (~40-50 EUR)",
          proprietary: "Expensive proprietary box",
          diy: "Consumer TV stick",
          bobineHighlight: true,
        },
        {
          feature: "Auditable open-source code & privacy",
          bobine: "Yes (AGPL-3.0 on GitHub)",
          proprietary: "No (Closed proprietary)",
          diy: "Variable",
          bobineHighlight: true,
        },
      ]
    : [
        {
          feature: "Coût de licence par écran",
          bobine: "0 € / mois (Libre AGPL-3.0)",
          proprietary: "150 à 400 € / mois",
          diy: "0 €",
          bobineHighlight: true,
        },
        {
          feature: "Résilience hors-ligne & Panne internet",
          bobine: "100% Hors-ligne (SSD local)",
          proprietary: "Dépendance cloud (Coupure si panne)",
          diy: "Aléatoire / Bricolé",
          bobineHighlight: true,
        },
        {
          feature: "Allumage / Extinction TV auto (HDMI-CEC)",
          bobine: "Oui (Gestion automatique native)",
          proprietary: "Selon boîtier propriétaire",
          diy: "Non (Télécommande manuelle)",
          bobineHighlight: true,
        },
        {
          feature: "Planificateur hebdomadaire de cours",
          bobine: "Oui (Précis à la seconde)",
          proprietary: "Oui (Écosystème fermé)",
          diy: "Non / Scripts manuels",
          bobineHighlight: true,
        },
        {
          feature: "Liberté des vidéos (Vidéos coachs / MP4)",
          bobine: "Liberté totale (Vos propres cours)",
          proprietary: "Verrouillé catalogue éditeur",
          diy: "Fichiers manuels",
          bobineHighlight: true,
        },
        {
          feature: "Investissement matériel",
          bobine: "Mini PC standard (~40-50 €)",
          proprietary: "Boîtier propriétaire surfacturé",
          diy: "Clé HDMI grand public",
          bobineHighlight: true,
        },
        {
          feature: "Code source ouvert & Confidentialité",
          bobine: "Oui (AGPL-3.0 sur GitHub)",
          proprietary: "Non (Boîte noire fermée)",
          diy: "Variable",
          bobineHighlight: true,
        },
      ];

  return (
    <section className="comparison-section">
      <div className="comparison-header">
        <span className="feature-category-label">
          {isEn ? "Detailed Comparison" : "Comparatif Détaillé"}
        </span>
        <h3 className="comparison-title">
          {isEn
            ? "Bobine vs Les Mills Cinema & Proprietary Fitness Virtual Playout"
            : "Bobine face à Les Mills Cinema et aux régies propriétaires"}
        </h3>
        <p className="comparison-desc">
          {isEn
            ? "An objective comparison of features, license costs, offline autonomy, and hardware reliability for gym video studios."
            : "Une comparaison objective des fonctionnalités, des coûts de licence, de l'autonomie hors-ligne et de la fiabilité pour vos studios vidéo fitness."}
        </p>
      </div>

      {/* Vue Tableau pour Desktop & Tablette */}
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col" className="col-feature">
                {isEn ? "Feature / Metric" : "Critère & Métrique"}
              </th>
              <th scope="col" className="col-bobine">
                <strong>Bobine</strong>
                <span>{isEn ? "Open-Source & Local" : "Open-Source & Autonome"}</span>
              </th>
              <th scope="col" className="col-proprietary">
                <strong>{isEn ? "Les Mills / Proprietary" : "Les Mills & Régies Fermées"}</strong>
                <span>{isEn ? "Les Mills Cinema / Virtual" : "Les Mills Cinema / Virtual"}</span>
              </th>
              <th scope="col" className="col-diy">
                <strong>{isEn ? "DIY Solutions" : "Bricolage DIY"}</strong>
                <span>{isEn ? "VLC / Chromecast" : "VLC / Chromecast / Clé USB"}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="cell-feature">{row.feature}</td>
                <td className="cell-bobine">
                  <div className="cell-bobine-content">
                    <svg
                      className="icon-check"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{row.bobine}</span>
                  </div>
                </td>
                <td className="cell-proprietary">{row.proprietary}</td>
                <td className="cell-diy">{row.diy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vue Cartes Tactiles pour Mobile (< 768px) */}
      <div className="comparison-cards-mobile" aria-hidden="true">
        {rows.map((row, idx) => (
          <div key={idx} className="comparison-card-mobile">
            <div className="comparison-card-mobile__header">
              <span className="comparison-card-mobile__feature">{row.feature}</span>
            </div>
            <div className="comparison-card-mobile__body">
              {/* Bobine */}
              <div className="comparison-card-mobile__row is-bobine">
                <span className="comparison-card-mobile__label">Bobine :</span>
                <div className="comparison-card-mobile__val">
                  <svg className="icon-check" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <strong>{row.bobine}</strong>
                </div>
              </div>
              {/* Proprietary */}
              <div className="comparison-card-mobile__row">
                <span className="comparison-card-mobile__label">
                  {isEn ? "Proprietary :" : "Régies fermées :"}
                </span>
                <span className="comparison-card-mobile__val">{row.proprietary}</span>
              </div>
              {/* DIY */}
              <div className="comparison-card-mobile__row">
                <span className="comparison-card-mobile__label">
                  {isEn ? "DIY / VLC :" : "Bricolage DIY :"}
                </span>
                <span className="comparison-card-mobile__val">{row.diy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
