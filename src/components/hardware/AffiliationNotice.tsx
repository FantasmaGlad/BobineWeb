"use client";

import React from "react";
import Link from "next/link";
import { type Locale } from "@/lib/i18n";

export default function AffiliationNotice({ locale }: { locale: Locale }) {
  const isEn = locale === "en";

  return (
    <div
      style={{
        marginTop: "2.5rem",
        marginBottom: "2rem",
        padding: "1rem 1.25rem",
        borderRadius: "0.5rem",
        background: "var(--bg-inset)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-muted)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0, marginTop: "0.15rem" }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
        <p style={{ margin: 0, fontWeight: 500, color: "var(--text-heading)" }}>
          {isEn
            ? "Affiliate Transparency & Open-Source Sustainability"
            : "Transparence d'Affiliation & Soutien au Projet Libre"}
        </p>
        <p style={{ margin: "0.25rem 0 0 0" }}>
          {isEn
            ? "As an Amazon Associate, bobine.fit earns from qualifying purchases made through the links on this page, at absolutely no additional cost to you. Hardware pricing and availability are indicative and updated regularly. Deliveries, guarantees, and returns are handled directly by Amazon and its merchants."
            : "En tant que Partenaire Amazon, le site bobine.fit réalise un bénéfice sur les achats remplissant les conditions requises via les liens affiliés de cette page, sans aucun surcoût pour votre établissement. Les prix et disponibilités sont indicatifs. Les garanties, livraisons et retours sont assurés directement par Amazon et ses vendeurs partenaires."}{" "}
          <Link
            href={`/${locale}/mentions-legales`}
            style={{ color: "var(--accent-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            {isEn ? "Read legal disclosure" : "Consulter nos mentions légales"}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
