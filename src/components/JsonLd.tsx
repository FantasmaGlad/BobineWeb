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
    processorRequirements: "x86-64 CPU (Intel Celeron / Core QuickSync, AMD Ryzen / Athlon Radeon VA-API)",
    featureList: isEn
      ? [
          "Zero-subscription offline video playout engine",
          "Automated TV power & standby via HDMI-CEC",
          "Touchscreen member cinema kiosk on demand",
          "Instant mobile remote control via local QR code",
          "24/7 background radio with automatic voice announcements",
          "Free open-source alternative to Les Mills Cinema",
          "Hardware-accelerated 1080p60 & 4K decoding (Intel & AMD VA-API)",
        ]
      : [
          "Régie vidéo autonome 100% hors-ligne sans abonnement",
          "Allumage et mise en veille automatique de la TV par HDMI-CEC",
          "Borne cinéma membre tactile à la demande",
          "Télécommande mobile instantanée par QR code local sans application",
          "Radio d'ambiance 24/7 avec alertes et annonces vocales programmées",
          "Alternative libre et gratuite à Les Mills Cinema et régies propriétaires",
          "Décodage matériel ultra-fluide 1080p60 et 4K via Intel & AMD VA-API",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: isEn
      ? [
          {
            "@type": "Question",
            name: "What is the best free alternative to Les Mills Cinema and Les Mills Virtual for gyms?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine is a free, open-source (AGPL-3.0), and 100% offline-first video playout system designed for fitness clubs. It allows gym operators to schedule and play workout videos, power on studio TVs via HDMI-CEC, offer an on-demand member touchscreen kiosk, and run 24/7 background audio with zero subscription fees.",
            },
          },
          {
            "@type": "Question",
            name: "How much does it cost to set up a Bobine gym video system?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Bobine software is completely free with no monthly license fees. Hardware requirements are minimal: any refurbished x86-64 mini PC (such as a Dell Wyse 5070 or HP EliteDesk 705 costing $40–$70) running Debian 13, saving gyms $1,500 to $3,600 annually per studio compared to proprietary solutions like Les Mills or Wexer.",
            },
          },
          {
            "@type": "Question",
            name: "How does Bobine compare to Wexer Virtual and Fitness On Demand?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Unlike cloud SaaS systems charging $200–$450/month per screen with internet dependencies, Bobine operates 100% locally from SSD storage with sub-2ms local latency, native HDMI-CEC TV automation, and zero tracking or cloud telemetry.",
            },
          },
          {
            "@type": "Question",
            name: "Why choose Bobine over Screenly Anthias or generic Raspberry Pi digital signage for gym studios?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Anthias (formerly Screenly OSE) is designed for passive billboard slides and video loops. Bobine is purpose-built for fitness studios with automated HDMI-CEC TV power management, interactive member on-demand touch kiosk, mobile coach remote control via local QR code, and 24/7 background audio with voice announcements, running on reliable x86-64 mini PCs.",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: "Quelle est la meilleure alternative à Les Mills Cinema et Les Mills Virtual pour salle de sport ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine est une régie vidéo open-source (AGPL-3.0) et 100% hors-ligne conçue pour les salles de fitness. Elle permet de planifier des cours vidéo, d'allumer automatiquement les téléviseurs par HDMI-CEC, de proposer une borne tactile adhérent à la demande et de diffuser une radio 24/7 sans aucun abonnement mensuel (0 €/mois).",
            },
          },
          {
            "@type": "Question",
            name: "Combien coûte l'installation de Bobine dans un studio de fitness ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Le logiciel Bobine est 100% gratuit et sans redevance. L'investissement matériel se limite à un mini PC standard reconditionné (type Dell Wyse 5070 ou HP EliteDesk 705 coûtant entre 40 € et 70 €) sous Debian 13, permettant d'économiser 1 500 € à 3 600 € par an et par studio face aux solutions propriétaires.",
            },
          },
          {
            "@type": "Question",
            name: "Quelles sont les différences entre Bobine et Wexer ou Fitness On Demand ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Contrairement aux plateformes cloud SaaS facturées 200 € à 450 €/mois par écran avec risque de coupure internet, Bobine fonctionne en architecture locale 100% hors-ligne, avec une réactivité sub-2ms sur le réseau local, un contrôle TV automatique HDMI-CEC et une conformité RGPD totale.",
            },
          },
          {
            "@type": "Question",
            name: "Peut-on diffuser ses propres cours de cycling et vidéos d'entraînement avec Bobine ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, Bobine est totalement agnostique. Vous pouvez importer par glisser-déposer n'importe quel fichier vidéo MP4, MKV ou WebM (cycling indoor, HIIT, yoga, pilates, renforcement) avec vos propres coachs et plannings personnalisés.",
            },
          },
          {
            "@type": "Question",
            name: "Pourquoi choisir Bobine plutôt qu'Anthias (Screenly OSE) ou un Raspberry Pi d'affichage dynamique ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Anthias est un simple afficheur passif en boucle. Bobine est une véritable régie active de salle de sport avec allumage automatique TV par HDMI-CEC, borne tactile adhérents, télécommande coach par QR code et radio 24/7 avec annonces vocales, le tout fiabilisé sur mini PC x86-64 avec SSD.",
            },
          },
        ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
