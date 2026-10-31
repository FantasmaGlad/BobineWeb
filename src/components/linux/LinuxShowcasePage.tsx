import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { lp, SITE_NAME, AUTHOR_NAME } from "@/lib/seo";
import { CLEARNET_URL } from "@/lib/onion";
import { OPERATING_SYSTEMS, REQUIREMENTS } from "@/lib/productFacts";
import { getLanding } from "@/content/landing";
import { getRepoStats } from "@/lib/releaseChannels";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import LinuxHero from "@/components/linux/LinuxHero";
import LinuxTerminal from "@/components/linux/LinuxTerminal";
import LinuxDistroGrid from "@/components/linux/LinuxDistroGrid";
import LinuxBento from "@/components/linux/LinuxBento";
import FrameworkShowcase from "@/components/linux/FrameworkShowcase";
import LinuxSecurityCard from "@/components/linux/LinuxSecurityCard";
import "@/styles/split/landing.css";
import "@/styles/split/linux-showcase.css";

const BASE_URL = CLEARNET_URL;

export default async function LinuxShowcasePage({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const c = getLanding("linux", locale);
  const stats = await getRepoStats();
  const updated = stats.stable.publishedAt;
  const url = `${BASE_URL}${lp(locale, "/linux")}`;

  const breadcrumbs = [
    { name: isEn ? "Home" : "Accueil", url: `/${locale}` },
    { name: "Linux", url: lp(locale, "/linux") },
  ];

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: c.h1,
    description: c.description,
    url,
    inLanguage: locale,
    dateModified: updated,
    author: { "@type": "Person", name: AUTHOR_NAME, url: "https://github.com/FantasmaGlad" },
    publisher: { "@type": "Organization", name: SITE_NAME, url: BASE_URL, logo: `${BASE_URL}/icon.png` },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL },
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bobine pour Linux",
    applicationCategory: "MultimediaApplication",
    operatingSystem: OPERATING_SYSTEMS.join(", "),
    softwareRequirements: REQUIREMENTS.linux[isEn ? "en" : "fr"],
    softwareVersion: stats.stable.version,
    dateModified: updated,
    downloadUrl: stats.stable.downloads.linux,
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    url,
    offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
  };

  return (
    <div className="linux-showcase">
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <FaqJsonLd items={c.faq.map((f) => ({ ...f, category: "updates" as const }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <nav aria-label={isEn ? "Breadcrumb" : "Fil d'Ariane"} className="landing-breadcrumb linux-showcase__breadcrumb">
        {breadcrumbs.map((b, i) => (
          <span key={b.url}>
            {i > 0 && " / "}
            {i < breadcrumbs.length - 1 ? <Link href={b.url}>{b.name}</Link> : <span aria-current="page">{b.name}</span>}
          </span>
        ))}
      </nav>

      {/* 1. Hero Matériel & Logiciel Immersif avec Framework Laptop */}
      <LinuxHero locale={locale} />

      {/* 2. Terminal Glassmorphic Interactif avec sélecteur d'OS et de canaux */}
      <LinuxTerminal locale={locale} />

      {/* 3. Grille Écosystème des 16 Distributions Officielles */}
      <LinuxDistroGrid locale={locale} />

      {/* 4. Bento Grid : 4 Piliers Performance et Résilience 24/7 */}
      <LinuxBento locale={locale} />

      {/* 5. Showcase Matériel Recommandé Framework Laptop */}
      <FrameworkShowcase locale={locale} />

      {/* 6. Sécurité Cryptographique OpenPGP */}
      <LinuxSecurityCard locale={locale} />

      {/* 7. Questions Fréquentes */}
      <section className="linux-section linux-showcase__faq">
        <header className="linux-section-header">
          <h2 className="linux-section-header__title">{isEn ? "Frequently asked questions" : "Questions fréquentes"}</h2>
        </header>
        <div className="landing-faq landing-faq--grid">
          {c.faq.map((item) => (
            <details key={item.q} className="landing-card">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 8. Pages Liées */}
      <nav aria-label={isEn ? "Related pages" : "Pages liées"} className="linux-section linux-showcase__related-nav">
        <h2 className="linux-section-header__tag linux-showcase__related-title">
          {isEn ? "Explore more" : "Pour aller plus loin"}
        </h2>
        <ul className="landing-related linux-showcase__related-list">
          {c.related.map((l) => (
            <li key={l.path}>
              <Link href={lp(locale, l.path)} className="landing-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
