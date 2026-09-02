"use client";

import dynamic from "next/dynamic";

const BaamixViewer = dynamic(() => import("./BaamixViewer"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        maxWidth: "340px",
        height: "280px",
        margin: "0 auto 1.5rem auto",
        borderRadius: "1rem",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "0.85rem",
      }}
    >
      Chargement de Baamix 3D…
    </div>
  ),
});

export default function BaamixViewerLoader() {
  return <BaamixViewer />;
}
