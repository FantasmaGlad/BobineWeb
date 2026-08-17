export default function JsonLd({ locale = "fr" }: { locale?: string }) {
  const isEn = locale === "en";

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bobine",
    operatingSystem: "Linux (Ubuntu, Debian)",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Video Streaming & Cinema Automation",
    description: isEn
      ? "Open-source, self-hosted streaming and video automation system for gyms and fitness clubs. Offline alternative to Les Mills Cinema."
      : "Régie vidéo et système de streaming open-source et auto-hébergé pour salles de sport et studios fitness. Alternative hors-ligne à Les Mills Cinema.",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
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
    url: "https://bobine.fit",
    logo: "https://bobine.fit/icon.png",
    sameAs: [
      "https://github.com/FantasmaGlad/Bobine",
      "https://github.com/FantasmaGlad/BobineWeb",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bobine",
    url: "https://bobine.fit",
    inLanguage: [locale === "en" ? "en-US" : "fr-FR"],
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
