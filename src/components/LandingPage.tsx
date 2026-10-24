import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { lp, SITE_NAME, AUTHOR_NAME } from "@/lib/seo";
import { CLEARNET_URL } from "@/lib/onion";
import { OPERATING_SYSTEMS, REQUIREMENTS, ANDROID, type PlatformId } from "@/lib/productFacts";
import { LANDING_PAGES, LANDING_COMMON, getLanding, type LandingId, type LandingSectionIcon } from "@/content/landing";
import { getRepoStats } from "@/lib/releaseChannels";
import { getBobineReleases } from "@/lib/github-releases";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import LandingDownload, { type LandingChannelData } from "@/components/LandingDownload";
import "@/styles/split/landing.css";

const BASE_URL = CLEARNET_URL;
const CHANNELS = ["stable", "beta", "canary"] as const;

/** Plateforme proposée quand l'appareil du visiteur n'est pas reconnu. */
const FALLBACK_PLATFORM: Partial<Record<LandingId, PlatformId>> = {
  ordinateur: "windows",
  linux: "linux",
  "android-tv": "android-tv",
  "google-book": "android",
  tor: "linux",
};
/** Plateformes détaillées dans « Configuration requise » : celle de la page d'abord. */
const DOWNLOAD_KEY = { windows: "windows", macos: "macos", linux: "linux", android: "android", "android-tv": "androidTv" } as const;
const REQUIREMENT_ORDER: PlatformId[] = ["windows", "macos", "linux", "android", "android-tv"];
type Channel = (typeof CHANNELS)[number];

function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function channelLabel(channel: Channel, isEn: boolean): string {
  if (channel === "stable") return "Stable";
  if (channel === "beta") return isEn ? "Beta" : "Bêta";
  return "Canary";
}

/** Version lisible d'un canal : numéro pour la Stable, tag et commit pour les canaux mobiles. */
function versionOf(info: ReleaseChannelInfo): string {
  return info.commit ? `${info.version} (${info.commit})` : info.version;
}

function SectionIcon({ name }: { name?: LandingSectionIcon }) {
  switch (name) {
    case "cpu":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
        </svg>
      );
    case "display":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "shield":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "terminal":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case "download":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case "network":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "spark":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "layers":
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
  }
}

export default async function LandingPage({ locale, id }: { locale: Locale; id: LandingId }) {
  const isEn = locale === "en";
  const page = LANDING_PAGES[id];
  const c = getLanding(id, locale);
  const [stats, releases] = await Promise.all([getRepoStats(), getBobineReleases()]);
  const infos: Record<Channel, ReleaseChannelInfo> = { stable: stats.stable, beta: stats.beta, canary: stats.canary };
  const channel = page.channel;
  const common = LANDING_COMMON[locale];
  const channelsData = Object.fromEntries(
    CHANNELS.map((ch) => [ch, { label: channelLabel(ch, isEn), version: versionOf(infos[ch]), downloads: infos[ch].downloads }]),
  ) as Record<Channel, LandingChannelData>;
  const fallbackPlatform = FALLBACK_PLATFORM[id] ?? "windows";
  // Les pages de canal expliquent déjà les mises à jour : seul le contrôle d'intégrité s'y ajoute.
  const commonBlocks = id.startsWith("canal") ? [common.verify] : [common.verify, common.update];
  const requirementIds = [fallbackPlatform, ...REQUIREMENT_ORDER.filter((p) => p !== fallbackPlatform)];

  // Date de dernière mise à jour affichée et publiée en JSON-LD : celle de la release concernée.
  const reference = channel ? infos[channel] : stats.stable;
  const updated = reference.publishedAt;
  const url = `${BASE_URL}${lp(locale, page.path)}`;

  const breadcrumbs = [
    { name: isEn ? "Home" : "Accueil", url: `/${locale}` },
    ...(id.startsWith("canal-")
      ? [
          { name: isEn ? "Update channels" : "Canaux de mise à jour", url: lp(locale, "/canaux") },
          { name: c.breadcrumb, url: lp(locale, page.path) },
        ]
      : [{ name: c.breadcrumb, url: lp(locale, page.path) }]),
  ];

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: c.h1,
    description: c.description,
    url,
    inLanguage: locale,
    dateModified: updated,
    author: { "@type": "Person", name: AUTHOR_NAME, url: `${BASE_URL}/${locale}${isEn ? "/about" : "/a-propos"}` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: BASE_URL, logo: `${BASE_URL}/icon.png` },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: BASE_URL },
  };
  const schemaChannel: Channel = channel ?? "stable";
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Bobine ${channel ? channelLabel(channel, isEn) : c.breadcrumb}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: OPERATING_SYSTEMS.join(", "),
    softwareRequirements: requirementIds.map((p) => REQUIREMENTS[p][isEn ? "en" : "fr"]).join(" "),
    softwareVersion: infos[schemaChannel].version,
    dateModified: updated,
    downloadUrl: infos[schemaChannel].downloads[DOWNLOAD_KEY[fallbackPlatform]] ?? infos[schemaChannel].downloads.windows,
    license: "https://www.gnu.org/licenses/agpl-3.0.html",
    url,
    offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
  };

  return (
    <div className="container landing">
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <FaqJsonLd items={c.faq.map((f) => ({ ...f, category: "updates" as const }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <nav aria-label={isEn ? "Breadcrumb" : "Fil d'Ariane"} className="landing-breadcrumb">
        {breadcrumbs.map((b, i) => (
          <span key={b.url}>
            {i > 0 && " / "}
            {i < breadcrumbs.length - 1 ? <Link href={b.url}>{b.name}</Link> : <span aria-current="page">{b.name}</span>}
          </span>
        ))}
      </nav>

      <header className="landing-header">
        <h1 className="landing-title">
          {c.h1}
        </h1>
        <p className="landing-lead">{c.lead}</p>
        {updated && (
          <p className="landing-updated">
            {isEn ? "Updated" : "Mis à jour"} : <time dateTime={updated.slice(0, 10)}>{formatDate(updated, locale)}</time>
          </p>
        )}
      </header>

      {c.heroImage && (
        <div className="landing-hero-visual landing-section">
          <Image
            src={c.heroImage.src}
            alt={c.heroImage.alt}
            width={c.heroImage.width}
            height={c.heroImage.height}
            className="landing-hero-visual__img"
            priority
          />
        </div>
      )}

      {c.chips && c.chips.length > 0 && (
        <section className="landing-section" aria-label={isEn ? "Compatible processors and architectures" : "Processeurs et architectures compatibles"}>
          <div className="landing-chips">
            {c.chips.map((chip) => (
              <div key={chip.label} className="landing-chip">
                {chip.icon && (
                  <span className="landing-chip__icon-wrap" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={chip.icon} alt="" width={20} height={20} className="landing-chip__icon" />
                  </span>
                )}
                <div className="landing-chip__body">
                  <strong className="landing-chip__label">{chip.label}</strong>
                  <span className="landing-chip__note">{chip.note}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <LandingDownload locale={locale} channels={channelsData} lockedChannel={channel} fallback={fallbackPlatform} />

      {c.showcaseCards && c.showcaseCards.length > 0 && (
        <section className="landing-section" aria-label={isEn ? "Hardware and platform selection" : "Sélection matériel et plateformes"}>
          <div className="landing-showcase-grid">
            {c.showcaseCards.map((card) => (
              <Link key={card.title} href={lp(locale, card.href)} className="landing-showcase-card">
                <div className="landing-showcase-card__media">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={420}
                    height={260}
                    className="landing-showcase-card__img"
                  />
                </div>
                <div className="landing-showcase-card__body">
                  <h2 className="landing-showcase-card__title">{card.title}</h2>
                  <p className="landing-showcase-card__desc">{card.subtitle}</p>
                  <span className="landing-showcase-card__cta">
                    <span>{card.cta}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {id === "canaux" || id === "nouveautes" ? (
        <section className="landing-card landing-section">
          <h2 className="landing-h2">{isEn ? "Current versions" : "Versions en cours"}</h2>
          <div className="landing-table-wrap">
            <table className="landing-table">
              <thead>
                <tr>
                  <th scope="col">{isEn ? "Channel" : "Canal"}</th>
                  <th scope="col">Version</th>
                  <th scope="col">{isEn ? "Published" : "Publiée le"}</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((ch) => (
                  <tr key={ch}>
                    <td>
                      <Link href={lp(locale, `/canaux/${ch}`)} className="landing-link">
                        {`Bobine ${channelLabel(ch, isEn)}`}
                      </Link>
                    </td>
                    <td>{versionOf(infos[ch])}</td>
                    <td>{formatDate(infos[ch].publishedAt, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {id === "nouveautes" && (
        <section className="landing-card landing-section">
          <h2 className="landing-h2">{isEn ? "Latest releases" : "Dernières versions publiées"}</h2>
          <ul className="landing-releases">
            {releases
              .filter((r) => !r.isPrerelease)
              .slice(0, 8)
              .map((r) => (
                <li key={r.slug}>
                  <Link href={`/${locale}/blog/${r.slug}`} className="landing-link">
                    {r.slug}
                  </Link>
                  {r.publishedAt ? ` - ${formatDate(r.publishedAt, locale)}` : ""}
                  <small>{r.title}</small>
                </li>
              ))}
          </ul>
        </section>
      )}

      <div className="landing-stack">
        {c.sections.map((s) => (
          <article key={s.heading} className="landing-card">
            <div className="landing-card__head">
              <span className="landing-card__icon">
                <SectionIcon name={s.icon} />
              </span>
              <h2 className="landing-h2">{s.heading}</h2>
            </div>
            {s.paragraphs?.map((p) => (
              <p key={p} className="landing-prose">{p}</p>
            ))}
            {s.bullets && (
              <ul className="landing-list">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {s.code && (
              <pre className="landing-code">
                <code>{s.code}</code>
              </pre>
            )}
          </article>
        ))}
      </div>

      {c.hardwareCta && (
        <section className="landing-card landing-hardware-cta landing-section">
          <div className="landing-hardware-cta__text">
            <h2 className="landing-h2">{c.hardwareCta.title}</h2>
            <p className="landing-prose">{c.hardwareCta.desc}</p>
          </div>
          <div className="landing-hardware-cta__actions">
            <Link href={lp(locale, c.hardwareCta.primaryHref)} className="btn-primary landing-hardware-cta__btn">
              <span>{c.hardwareCta.primaryLabel}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href={lp(locale, c.hardwareCta.secondaryHref)} className="landing-hardware-cta__btn-secondary">
              <span>{c.hardwareCta.secondaryLabel}</span>
            </Link>
          </div>
        </section>
      )}

      <section className="landing-card landing-section" aria-labelledby="landing-req-title">
        <div className="landing-card__head">
          <span className="landing-card__icon">
            <SectionIcon name="cpu" />
          </span>
          <h2 id="landing-req-title" className="landing-h2">{common.requirementsTitle}</h2>
        </div>
        <div className="landing-table-wrap">
          <table className="landing-table">
            <thead>
              <tr>
                <th scope="col">{isEn ? "Platform" : "Plateforme"}</th>
                <th scope="col">{isEn ? "Requirement" : "Configuration"}</th>
              </tr>
            </thead>
            <tbody>
              {requirementIds.map((p) => (
                <tr key={p}>
                  <td>{REQUIREMENTS[p].name}</td>
                  <td>{REQUIREMENTS[p][isEn ? "en" : "fr"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="landing-note">{common.requirementsNote(ANDROID.minVersion)}</p>
      </section>

      <div className="landing-stack">
        {commonBlocks.map((b, idx) => (
          <article key={b.heading} className="landing-card">
            <div className="landing-card__head">
              <span className="landing-card__icon">
                <SectionIcon name={idx === 0 ? "shield" : "download"} />
              </span>
              <h2 className="landing-h2">{b.heading}</h2>
            </div>
            {b.paragraphs.map((para) => (
              <p key={para} className="landing-prose">{para}</p>
            ))}
          </article>
        ))}
      </div>

      <section className="landing-section">
        <h2 className="landing-h2">{isEn ? "Frequently asked questions" : "Questions fréquentes"}</h2>
        <div className="landing-faq">
          {c.faq.map((item) => (
            <details key={item.q} className="landing-card">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav aria-label={isEn ? "Related pages" : "Pages liées"} className="landing-section">
        <h2 className="landing-h2">{isEn ? "Related pages" : "Pages liées"}</h2>
        <ul className="landing-related">
          {c.related.map((l) => (
            <li key={l.path}>
              <Link href={lp(locale, l.path)} className="landing-related__pill">{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
