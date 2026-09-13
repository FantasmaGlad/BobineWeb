export default function JsonLd({ locale = "fr" }: { locale?: string }) {
  const isEn = locale === "en";

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bobine Fit",
    alternateName: ["Bobine", "bobine.fit", "Bobine Playout", "Régie Bobine"],
    operatingSystem: "Debian 13, Ubuntu, Linux, Windows 11, macOS (Apple Silicon & Intel), Android (ARM64)",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Gym Video Playout & Virtual Fitness Automation",
    url: "https://bobine.fit",
    description: isEn
      ? "Open-source, self-hosted streaming and video playout automation system for gyms and fitness studios. Offline alternative to Les Mills Cinema, Anthias, Screenly, and Wexer."
      : "Régie vidéo et système de streaming open-source et auto-hébergé pour salles de sport et studios fitness. Alternative 100% hors-ligne à Les Mills Cinema, Anthias, Screenly et Wexer.",
    memoryRequirements: "4 GB",
    storageRequirements: "16 GB SSD",
    processorRequirements: "x86-64 CPU (Intel QuickSync / AMD Radeon VA-API) or ARM64 (Android, Apple Silicon)",
    featureList: isEn
      ? [
          "Zero-subscription offline video playout engine with Gapless A/B Deck crossfade",
          "Responsive Coach Console (/coach) with live 16:9 Stage Monitor and visual ambiance palette",
          "Visual Ambiances Hub (/backgrounds) with 16:9 dynamic preview and per-track assignment",
          "One-click ZIP backup and restore of the complete database and media configuration",
          "Touchscreen member cinema kiosk on demand with 2D spatial navigation",
          "Universal gamepad support (Xbox, PlayStation, Switch Pro, 8BitDo) via HTML5 Gamepad API",
          "Instant mobile remote control via local QR code without application install",
          "24/7 background radio with scheduled voice announcements and audio crossfade",
          "Real-time eco-designed hardware telemetry (instant Watts, CPU/GPU temperatures, RAM MT/s)",
          "Free open-source alternative to Les Mills Cinema, Anthias, and proprietary gym signage",
          "Hardware-accelerated 1080p60 & 4K decoding (Intel QuickSync, AMD VA-API, VideoToolbox, MediaCodec)",
        ]
      : [
          "Régie vidéo autonome 100% hors-ligne sans abonnement avec moteur Gapless A/B Deck",
          "Console Régie Coach responsive (/coach) avec Stage Monitor 16:9 en direct et palette d'ambiances",
          "Hub d'Ambiances Visuelles (/backgrounds) avec prévisualisation dynamique et assignation par piste",
          "Sauvegarde et restauration ZIP en un clic de toute la configuration et de la médiathèque",
          "Borne cinéma membre tactile à la demande avec navigation spatiale 2D",
          "Support universel des manettes de jeu (Xbox, PlayStation, Switch Pro, 8BitDo) via HTML5 Gamepad API",
          "Télécommande mobile instantanée par QR code local sans application à installer",
          "Radio d'ambiance 24/7 avec alertes et annonces vocales programmées et fondu sonore",
          "Télémétrie matérielle éco-conçue (puissance instantanée en Watts, températures CPU/GPU, RAM en MT/s)",
          "Alternative libre et gratuite à Les Mills Cinema, Anthias, Screenly et régies propriétaires",
          "Décodage matériel ultra-fluide 1080p60 et 4K via Intel QuickSync, AMD VA-API, VideoToolbox et MediaCodec",
        ],
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2030-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      ratingCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
    screenshot: "https://bobine.fit/opengraph-image",
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    downloadUrl: "https://github.com/FantasmaGlad/Bobine/releases/latest",
    softwareVersion: "3.0.5",
    brand: {
      "@type": "Brand",
      name: "Bobine Fit",
      url: "https://bobine.fit",
      logo: "https://bobine.fit/icon.png",
      slogan: isEn
        ? "Open-source gym video playout & streaming system"
        : "La régie vidéo & streaming libre pour salle de sport",
    },
    author: {
      "@type": "Person",
      name: "Clément Barillot",
      alternateName: "FantasmaGlad",
      email: "clement.barillot@bobine.fit",
      url: "https://github.com/FantasmaGlad",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bobine Fit",
    alternateName: ["Bobine", "bobine.fit", "Bobine Playout"],
    url: "https://bobine.fit",
    logo: "https://bobine.fit/icon.png",
    description: isEn
      ? "Open-source autonomous video playout and gym entertainment systems."
      : "Système de régie vidéo autonome et open-source pour salles de sport et studios fitness.",
    sameAs: [
      "https://github.com/FantasmaGlad/Bobine",
      "https://github.com/FantasmaGlad/BobineWeb",
      "https://apt.bobine.fit",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bobine Fit",
    alternateName: ["Bobine", "bobine.fit", "Bobine Playout"],
    url: "https://bobine.fit",
    inLanguage: ["fr-FR", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://bobine.fit/fr/documentation?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
