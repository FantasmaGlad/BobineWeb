import type { MetadataRoute } from "next";

export const dynamic = "force-static";

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
        purpose: "any",
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Documentation",
        url: "/fr/documentation",
        description: "Guide d'installation et d'utilisation",
      },
      {
        name: "Matériel",
        url: "/fr/materiel/amazon",
        description: "Recommandations matérielles et packs par OS pour studio fitness",
      },
      {
        name: "Fonctionnalités",
        url: "/fr/fonctionnalites",
        description: "Toutes les capacités de la régie Bobine",
      },
    ],
  };
}
