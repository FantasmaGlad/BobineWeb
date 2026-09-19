import { getBobineReleases } from "@/lib/github-releases";

const AUTHOR_EMAIL = "clement.barillot@bobine.fit";

export default async function JsonLd({ locale = "fr" }: { locale?: string }) {
  const isEn = locale === "en";

  // Dernière version stable publiée (cache 30 min) ; absente si l'API est injoignable.
  let latestVersion: string | undefined;
  try {
    const releases = await getBobineReleases();
    const stable = releases.find((r) => !r.isPrerelease && /\d/.test(r.slug));
    latestVersion = stable?.slug.replace(/^v/i, "");
  } catch {
    latestVersion = undefined;
  }

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
    ...(latestVersion ? { softwareVersion: latestVersion } : {}),
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
      email: AUTHOR_EMAIL,
      url: "https://github.com/FantasmaGlad",
    },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://bobine.fit/#author",
    name: "Clément Barillot",
    alternateName: "FantasmaGlad",
    jobTitle: isEn ? "Developer and author of Bobine" : "Développeur et auteur de Bobine",
    email: AUTHOR_EMAIL,
    url: "https://github.com/FantasmaGlad",
    sameAs: ["https://github.com/FantasmaGlad", "https://github.com/FantasmaGlad/Bobine"],
    worksFor: { "@type": "Organization", name: "Bobine Fit", url: "https://bobine.fit" },
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
    founder: { "@id": "https://bobine.fit/#author" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: AUTHOR_EMAIL,
      availableLanguage: ["fr", "en"],
    },
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

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: isEn
      ? [
          {
            "@type": "Question",
            name: "What is Bobine Fit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine Fit is a free, open-source (AGPL-3.0) self-hosted video playout and streaming automation suite designed for gyms, fitness clubs, and cycling studios. It turns low-cost mini PCs or tablets into fully autonomous 24/7 video controllers featuring scheduled classes, an on-demand member kiosk, a coach mobile remote, and 24/7 background audio with crossfade.",
            },
          },
          {
            "@type": "Question",
            name: "Who developed Bobine and who maintains it?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine was created and is actively developed and maintained by independent developer Clément Barillot (FantasmaGlad). The project is 100% community-driven, copyleft (AGPL-3.0), and accepts zero recurring software subscription fees.",
            },
          },
          {
            "@type": "Question",
            name: "How does Bobine replace proprietary systems like Les Mills Cinema or Wexer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Proprietary fitness cinema solutions charge between €150 and €400 per month per screen and require an active internet connection. Bobine delivers the same premium studio experience with 100% offline playback from local SSD storage, zero monthly fees, freedom of class catalog, and universal hardware support on low-cost refurbished computers (from ~€40-€80) or Android tablets.",
            },
          },
          {
            "@type": "Question",
            name: "What hardware does Bobine recommend and where can I buy it?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine provides an interactive hardware selection guide and store at https://bobine.fit/en/materiel. It curates verified, energy-efficient equipment across 4 tiers (Essential, Recommended, Pro, Premium) on Amazon and AliExpress, including refurbished x86-64 mini PCs (~€40-€80), Android tablets, and HDMI-CEC accessories with a shared cart.",
            },
          },
          {
            "@type": "Question",
            name: "What is Baamix and how does it help?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Baamix is Bobine's free, dedicated conversational AI assistant accessible at https://bobine.fit/en/baamix. It answers setup questions from the official documentation, provides live hardware recommendations, and compares 2 to 4 products side-by-side with objective verdicts.",
            },
          },
          {
            "@type": "Question",
            name: "Is Bobine available over the Tor network (.onion)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Bobine is distributed over the Tor network with two dedicated onion services: an official static mirror of the website (http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/) and an official GPG-signed APT repository (tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/) allowing gym owners to install and update software without revealing their public IP address.",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: "Qu'est-ce que Bobine Fit ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine Fit est une régie vidéo et un système de streaming libre (AGPL-3.0) conçu pour les salles de sport et studios fitness. Elle transforme un mini PC économique ou une tablette en régie autonome 24/7 : cours programmés à la seconde, borne tactile libre-service adhérents, télécommande smartphone locale et radio d'ambiance 24/7 sans abonnement.",
            },
          },
          {
            "@type": "Question",
            name: "Qui a développé Bobine et qui assure sa maintenance ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine est conçu, développé et maintenu par Clément Barillot (alias FantasmaGlad) depuis début 2026. Le projet est 100% libre et souverain sous licence copyleft AGPL-3.0, sans aucun abonnement logiciel.",
            },
          },
          {
            "@type": "Question",
            name: "Pourquoi choisir Bobine face à Les Mills Cinema ou Wexer ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Les solutions propriétaires coûtent de 150 à 400 €/mois par écran et dépendent du cloud. Bobine supprime tout abonnement (0 €), fonctionne 100% hors-ligne depuis un SSD local, laisse la salle maîtresse de ses vidéos et tourne sur du matériel reconditionné abordable (~40-80 €) ou tablettes Android.",
            },
          },
          {
            "@type": "Question",
            name: "Quel matériel choisir pour faire tourner Bobine et où l'acheter ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bobine propose une boutique et un guide matériel interactif sur https://bobine.fit/fr/materiel. Il référence des configurations vérifiées et sobres en énergie réparties en 4 gammes (Essentiel, Recommandé, Pro, Premium) sur Amazon et AliExpress, incluant des mini PC reconditionnés (~40-80 €), tablettes Android et connectique HDMI-CEC avec panier partagé.",
            },
          },
          {
            "@type": "Question",
            name: "Qu'est-ce que Baamix et comment l'utiliser ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Baamix est l'assistant IA dédié et gratuit de Bobine disponible sur https://bobine.fit/fr/baamix. Il guide les utilisateurs dans l'installation, répond d'après la documentation officielle et compare en direct 2 à 4 produits matériels avec fiches détaillées.",
            },
          },
          {
            "@type": "Question",
            name: "Bobine est-il disponible sur le réseau Tor (.onion) ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui. Bobine propose deux services onion v3 officiels : un miroir statique du site (http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/) et un dépôt APT signé GPG (tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/) pour permettre l'installation et les mises à jour sans exposer l'adresse IP de la salle.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
    </>
  );
}
