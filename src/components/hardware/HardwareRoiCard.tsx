"use client";

import React from "react";
import { type Locale } from "@/lib/i18n";
import { ROI_DATA } from "@/content/hardware";

export default function HardwareRoiCard({ locale }: { locale: Locale }) {
  const isEn = locale === "en";

  return (
    <div
      style={{
        marginTop: "3.5rem",
        marginBottom: "2rem",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "0.75rem",
        padding: "1.75rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div style={{ maxWidth: "48rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.725rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.2rem 0.5rem",
              borderRadius: "0.35rem",
              background: "var(--bg-inset)",
              color: "var(--accent-primary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {isEn ? "Budget & ROI Comparison" : "Comparatif Budgétaire & Rentabilité"}
          </span>
        </div>
        <h2
          style={{
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "var(--text-heading)",
            lineHeight: 1.3,
            margin: "0 0 0.5rem 0",
          }}
        >
          {isEn
            ? "Save Over €13,000 per Studio vs Closed Proprietary Kiosks"
            : "Économisez plus de 13 000 € par studio face aux bornes propriétaires fermées"}
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5, margin: 0 }}>
          {isEn
            ? "Proprietary gym players force you into thousands of euros in upfront hardware and permanent monthly subscriptions. Bobine runs on standard hardware you own outright, with lifetime zero software subscription fees."
            : "Les régies propriétaires de fitness imposent des milliers d'euros de matériel propriétaire verrouillé et des abonnements mensuels obligatoires. Avec Bobine, le matériel vous appartient intégralement et le logiciel reste gratuit à vie (AGPL-3.0)."}
        </p>
      </div>

      {/* Tableau comparatif des coûts */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "0.85rem",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {isEn ? "Playout Solution" : "Solution de Régie"}
              </th>
              <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {isEn ? "Initial Hardware" : "Matériel Initial"}
              </th>
              <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {isEn ? "Monthly Fee" : "Abonnement Mensuel"}
              </th>
              <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {isEn ? "Cost Year 1" : "Coût Année 1"}
              </th>
              <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-heading)", fontWeight: 700 }}>
                {isEn ? "Total Cost (3 Years)" : "Coût Total (3 Ans)"}
              </th>
              <th style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {isEn ? "Hardware Ownership" : "Propriété du Matériel"}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Bobine */}
            <tr
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
              }}
            >
              <td style={{ padding: "0.85rem 0.5rem", fontWeight: 700, color: "var(--text-heading)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{ROI_DATA.bobineWyse.name}</span>
                </div>
              </td>
              <td style={{ padding: "0.85rem 0.5rem", fontWeight: 600, color: "var(--text-heading)" }}>
                ~{ROI_DATA.bobineWyse.hardwareUpfront} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", fontWeight: 700, color: "var(--accent-primary)" }}>
                0 € / {isEn ? "month" : "mois"}
              </td>
              <td style={{ padding: "0.85rem 0.5rem", fontWeight: 600, color: "var(--text-heading)" }}>
                ~{ROI_DATA.bobineWyse.costYear1} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", fontWeight: 800, color: "var(--accent-primary)", fontSize: "0.95rem" }}>
                ~{ROI_DATA.bobineWyse.costYear3} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {isEn ? "100% owned, reusable hardware" : "100% à vous, réutilisable librement"}
              </td>
            </tr>

            {/* Les Mills Cinema */}
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-heading)", fontWeight: 500 }}>
                {ROI_DATA.competitorLesMills.name}
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)" }}>
                {ROI_DATA.competitorLesMills.hardwareUpfront.toLocaleString()} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)" }}>
                {ROI_DATA.competitorLesMills.monthlySubscription} € / {isEn ? "month" : "mois"}
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)" }}>
                {ROI_DATA.competitorLesMills.costYear1.toLocaleString()} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", fontWeight: 700, color: "var(--text-heading)" }}>
                {ROI_DATA.competitorLesMills.costYear3.toLocaleString()} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {isEn ? "Proprietary kiosk, locked DRM" : "Borne propriétaire verrouillée"}
              </td>
            </tr>

            {/* Wexer */}
            <tr>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-heading)", fontWeight: 500 }}>
                {ROI_DATA.competitorWexer.name}
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)" }}>
                {ROI_DATA.competitorWexer.hardwareUpfront.toLocaleString()} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)" }}>
                {ROI_DATA.competitorWexer.monthlySubscription} € / {isEn ? "month" : "mois"}
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)" }}>
                {ROI_DATA.competitorWexer.costYear1.toLocaleString()} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", fontWeight: 700, color: "var(--text-heading)" }}>
                {ROI_DATA.competitorWexer.costYear3.toLocaleString()} €
              </td>
              <td style={{ padding: "0.85rem 0.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                {isEn ? "Cloud dependency, closed SaaS" : "Dépendance cloud totale, SaaS fermé"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "1.25rem",
          padding: "0.75rem 1rem",
          borderRadius: "0.45rem",
          background: "var(--bg-inset)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <span style={{ fontSize: "0.825rem", color: "var(--text-heading)", fontWeight: 600 }}>
          {isEn
            ? "Estimated savings over 3 years with Bobine :"
            : "Gain financier net estimé sur 3 ans avec Bobine :"}
        </span>
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 800,
            color: "var(--accent-primary)",
            letterSpacing: "0.02em",
          }}
        >
          + 13 145 € / {isEn ? "studio" : "salle"}
        </span>
      </div>
    </div>
  );
}
