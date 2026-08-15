"use client";

import { useState } from "react";

// Les pièces jointes GitHub (vidéos/images glissées-déposées dans les notes
// de release) n'ont pas d'extension dans leur URL — le type réel n'est connu
// qu'à la réponse HTTP. On tente <video>, et on bascule vers <img> puis vers
// un simple lien si le type ne correspond pas.
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
