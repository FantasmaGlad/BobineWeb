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
        margin: "0 auto 1.25rem auto",
        background: "transparent",
      }}
    />
  ),
});

export default function BaamixViewerLoader() {
  return <BaamixViewer />;
}
