"use client";

import { useState } from "react";

type Mode = "video" | "image" | "link";

export default function GitHubAttachmentMedia({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("video");

  if (mode === "link") {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  if (mode === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- source distante, dimensions inconnues à l'avance
      <img
        src={href}
        alt=""
        className="release-body__attachment"
        onError={() => setMode("link")}
      />
    );
  }

  return (
    <video
      src={href}
      controls
      playsInline
      preload="metadata"
      className="release-body__attachment"
      onError={() => setMode("image")}
    />
  );
}
