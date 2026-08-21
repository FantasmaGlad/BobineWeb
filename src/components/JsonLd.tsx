export default function JsonLd({ locale = "fr" }: { locale?: string }) {
  const isEn = locale === "en";

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bobine",
    alternateName: ["Bobine fit", "bobine.fit", "Bobine Fit", "Bobine Playout"],
    operatingSystem: "Linux (Debian 13, Ubuntu, x86-64)",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Gym Video Playout & Virtual Fitness Automation",
    url: "https://bobine.fit",
    description: isEn
      ? "Open-source, self-hosted streaming and video automation system for gyms and fitness clubs. Offline alternative to Les Mills Cinema and Virtual systems."
      : "Régie vidéo et système de streaming open-source et auto-hébergé pour salles de sport et studios fitness. Alternative hors-ligne à Les Mills Cinema et Les Mills Virtual.",
    memoryRequirements: "4 GB",
    storageRequirements: "16 GB SSD",
    processorRequirements: "Intel Celeron / Pentium / Core x86-64 with Intel QuickSync (VA-API)",
    featureList: isEn
      ? [
          "Zero-subscription offline video playout engine",
          "Automated TV power & standby via HDMI-CEC",
          "Touchscreen member cinema kiosk on demand",
          "Instant mobile remote control via local QR code",
          "24/7 background radio with automatic voice announcements",
          "Free open-source alternative to Les Mills Cinema",
          "Hardware-accelerated 1080p60 & 4K decoding (Intel VA-API)",
        ]
      : [
          "Régie vidéo autonome 100% hors-ligne sans abonnement",
          "Allumage et mise en veille automatique de la TV par HDMI-CEC",
          "Borne cinéma membre tactile à la demande",
          "Télécommande mobile instantanée par QR code local sans application",
          "Radio d'ambiance 24/7 avec alertes et annonces vocales programmées",
          "Alternative libre et gratuite à Les Mills Cinema et régies propriétaires",
          "Décodage matériel ultra-fluide 1080p60 et 4K via Intel VA-API",
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
      ratingCount: "34",
      bestRating: "5",
      worstRating: "1",
    },
    screenshot: "https://bobine.fit/opengraph-image",
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    downloadUrl: "https://github.com/FantasmaGlad/Bobine",
    softwareVersion: "2.0.0",
    author: {
      "@type": "Person",
      name: "FantasmaGlad",
      url: "https://github.com/FantasmaGlad",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bobine",
    alternateName: ["Bobine fit", "bobine.fit"],
    url: "https://bobine.fit",
    logo: "https://bobine.fit/icon.png",
    description: isEn
      ? "Open-source autonomous video playout and gym entertainment systems."
      : "Système de régie vidéo autonome et open-source pour salles de sport et studios fitness.",
    sameAs: [
      "https://github.com/FantasmaGlad/Bobine",
      "https://github.com/FantasmaGlad/BobineWeb",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bobine",
    alternateName: ["Bobine fit", "bobine.fit", "Bobine Fit"],
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
