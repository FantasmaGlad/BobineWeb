import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { lp, SITE_NAME, AUTHOR_NAME } from "@/lib/seo";
import { CLEARNET_URL } from "@/lib/onion";
import { OPERATING_SYSTEMS, REQUIREMENTS, ANDROID, type PlatformId } from "@/lib/productFacts";
import { LANDING_PAGES, LANDING_COMMON, getLanding, type LandingId } from "@/content/landing";
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

      <LandingDownload locale={locale} channels={channelsData} lockedChannel={channel} fallback={fallbackPlatform} />

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
            <h2 className="landing-h2">{s.heading}</h2>
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

      <section className="landing-card landing-section" aria-labelledby="landing-req-title">
        <h2 id="landing-req-title" className="landing-h2">{common.requirementsTitle}</h2>
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
        {commonBlocks.map((b) => (
          <article key={b.heading} className="landing-card">
            <h2 className="landing-h2">{b.heading}</h2>
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
              <Link href={lp(locale, l.path)} className="landing-link">{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
