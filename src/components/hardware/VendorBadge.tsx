"use client";

import React from "react";
import AmazonLogo from "@/components/icons/AmazonLogo";

interface VendorBadgeProps {
  size?: "sm" | "md";
}

export default function VendorBadge({ size = "md" }: VendorBadgeProps) {
  const isSm = size === "sm";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSm ? "0.35rem" : "0.45rem",
        padding: isSm ? "0.2rem 0.5rem" : "0.3rem 0.65rem",
        borderRadius: "0.35rem",
        background: "var(--bg-inset)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <AmazonLogo height={isSm ? 13 : 16} />
    </span>
  );
}
