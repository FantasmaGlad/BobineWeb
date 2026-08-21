import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bobine — Régie vidéo & streaming pour salles de sport",
    short_name: "Bobine",
    description:
      "L'alternative open-source et autonome à Les Mills Cinema pour la diffusion de cours vidéo en salle de sport.",
    start_url: "/fr",
    display: "standalone",
    background_color: "#eef2ff",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Documentation",
        url: "/fr/documentation",
        description: "Guide d'installation et d'utilisation",
      },
      {
        name: "Démo 3D",
        url: "/fr/demo-3d",
        description: "Découverte interactive du matériel Bobine",
      },
      {
        name: "Fonctionnalités",
        url: "/fr/fonctionnalites",
        description: "Toutes les capacités de la régie Bobine",
      },
    ],
  };
}
