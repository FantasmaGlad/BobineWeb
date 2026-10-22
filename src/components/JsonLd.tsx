import { getBobineReleases } from "@/lib/github-releases";
import { ANDROID } from "@/lib/productFacts";
import { CLEARNET_URL } from "@/lib/onion";

const AUTHOR_EMAIL = "clement.barillot@bobine.fit";

export default async function JsonLd({ locale = "fr" }: { locale?: string }) {
  const isEn = locale === "en";

  // Dernière version stable publiée (cache de deux minutes) ; absente si l'API est injoignable.
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
    alternateName: ["Bobine", "bobine.fit", "Bobine Playout", "Régie Bobine", "Bobine Fitness", "Bobine Virtual Fitness"],
    operatingSystem: `Debian 13 (Appliance Headless), Ubuntu, Linux Mint, Windows 11/10, macOS (Apple Silicon M1–M4), Android ${ANDROID.minVersion}–${ANDROID.maxVersion} (ARM 32/64-bit), Android TV, Google TV`,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Gym Video Playout & Virtual Fitness Automation",
    url: CLEARNET_URL,
    about: [
      { "@type": "Thing", name: "Fitness Center", sameAs: "https://www.wikidata.org/wiki/Q1060421" },
      { "@type": "Thing", name: "Software", sameAs: "https://www.wikidata.org/wiki/Q7397" },
      { "@type": "Thing", name: "GNU Affero General Public License", sameAs: "https://www.wikidata.org/wiki/Q131262" },
    ],
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
          "Native Android TV & Google TV APK with D-Pad navigation for smart displays",
          "Universal web remote control accessible on Firefox, Chrome, Safari, and Edge",
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
          "Support natif Android TV et Google TV avec navigation à la télécommande D-Pad",
          "Télécommande web universelle accessible sur Firefox, Chrome, Safari et Edge",
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
    screenshot: "https://bobine.fit/fr/opengraph-image",
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    downloadUrl: "https://github.com/FantasmaGlad/Bobine/releases/latest",
    ...(latestVersion ? { softwareVersion: latestVersion } : {}),
    brand: {
      "@type": "Brand",
      name: "Bobine Fit",
      url: CLEARNET_URL,
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
    sameAs: [
      "https://github.com/FantasmaGlad",
      "https://github.com/FantasmaGlad/Bobine",
      "https://www.linkedin.com/in/clement-barillot39",
    ],
    worksFor: { "@type": "Organization", name: "Bobine Fit", url: CLEARNET_URL },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bobine Fit",
    alternateName: ["Bobine", "bobine.fit", "Bobine Playout", "Bobine Fitness"],
    url: CLEARNET_URL,
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
      "https://security.bobine.fit",
      "https://alternativeto.net/software/fantasmaglad-bobine/",
      "https://www.linkedin.com/in/clement-barillot39",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bobine Fit",
    alternateName: ["Bobine", "bobine.fit", "Bobine Playout", "Bobine Fitness"],
    url: CLEARNET_URL,
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
    </>
  );
}
