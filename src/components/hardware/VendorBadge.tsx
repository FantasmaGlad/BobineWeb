"use client";

import React from "react";

interface VendorBadgeProps {
  channel: "amazon" | "reconditionne" | "aliexpress";
  label?: string;
  size?: "sm" | "md";
}

export default function VendorBadge({ channel, label, size = "md" }: VendorBadgeProps) {
  const isSm = size === "sm";

  if (channel === "amazon") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: isSm ? "0.25rem" : "0.35rem",
          fontSize: isSm ? "0.7rem" : "0.775rem",
          fontWeight: 700,
          letterSpacing: "0.02em",
          padding: isSm ? "0.15rem 0.45rem" : "0.25rem 0.6rem",
          borderRadius: "0.35rem",
          background: "var(--bg-inset)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-heading)",
          textTransform: "uppercase",
        }}
      >
        <svg
          width={isSm ? "12" : "14"}
          height={isSm ? "12" : "14"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span>{label || "Amazon Partenaire"}</span>
      </span>
    );
  }

  if (channel === "reconditionne") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: isSm ? "0.25rem" : "0.35rem",
          fontSize: isSm ? "0.7rem" : "0.775rem",
          fontWeight: 600,
          padding: isSm ? "0.15rem 0.45rem" : "0.25rem 0.6rem",
          borderRadius: "0.35rem",
          background: "var(--bg-inset)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
        }}
      >
        <svg
          width={isSm ? "12" : "14"}
          height={isSm ? "12" : "14"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        <span>{label || "Reconditionné / AfB / eBay"}</span>
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSm ? "0.25rem" : "0.35rem",
        fontSize: isSm ? "0.7rem" : "0.775rem",
        fontWeight: 600,
        padding: isSm ? "0.15rem 0.45rem" : "0.25rem 0.6rem",
        borderRadius: "0.35rem",
        background: "var(--bg-inset)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-muted)",
      }}
    >
      <svg
        width={isSm ? "12" : "14"}
        height={isSm ? "12" : "14"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span>{label || "AliExpress Direct Usine"}</span>
    </span>
  );
}
