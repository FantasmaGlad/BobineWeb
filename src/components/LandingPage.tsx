import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";
import { LANDING_PAGES, getLanding, type LandingId } from "@/content/landing";
import { getRepoStats } from "@/lib/releaseChannels";
import { getBobineReleases } from "@/lib/github-releases";
import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";

const BASE_URL = "https://bobine.fit";
const CHANNELS = ["stable", "beta", "canary"] as const;
type Channel = (typeof CHANNELS)[number];

const CARD: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "0.85rem",
  padding: "1.5rem",
};
const H2: React.CSSProperties = { fontSize: "1.45rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "1rem" };
const TH: React.CSSProperties = { textAlign: "left", padding: "0.6rem 0.75rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" };
const TD: React.CSSProperties = { padding: "0.65rem 0.75rem", fontSize: "0.95rem", color: "var(--text-body)", borderBottom: "1px solid var(--border-subtle)" };

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

function fileName(url: string): string {
  return decodeURIComponent(url.split("/").pop() ?? url);
}

/** Version lisible d'un canal : numéro pour la Stable, tag et commit pour les canaux mobiles. */
function versionOf(info: ReleaseChannelInfo): string {
  return info.commit ? `${info.version} (${info.commit})` : info.version;
}

function DownloadRows({ rows, isEn }: { rows: Array<{ label: string; url?: string }>; isEn: boolean }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th scope="col" style={TH}>{isEn ? "Platform" : "Plateforme"}</th>
            <th scope="col" style={TH}>{isEn ? "File" : "Fichier"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.filter((r) => r.url).map((r) => (
            <tr key={r.label}>
              <td style={TD}>{r.label}</td>
              <td style={TD}>
                <a href={r.url} rel="noopener noreferrer" style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                  {fileName(r.url!)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function channelRows(info: ReleaseChannelInfo, isEn: boolean) {
  const d = info.downloads;
  return [
    { label: "Windows x86-64", url: d.windows },
    { label: "Windows ARM64", url: d.windowsArm64 },
    { label: isEn ? "Linux .deb amd64" : "Linux .deb amd64", url: d.linux },
    { label: isEn ? "Linux .deb arm64" : "Linux .deb arm64", url: d.linuxArm64 },
    { label: "macOS Apple Silicon", url: d.macos },
    { label: isEn ? "Android (tablets, Google Book)" : "Android (tablettes, Google Book)", url: d.android },
    { label: "Android TV", url: d.androidTv },
    { label: "Bobine Assistant", url: d.assistant },
    { label: "Bobine Assistant ARM64", url: d.assistantArm64 },
    { label: isEn ? "Installer script" : "Script d'installation", url: d.installScript },
  ];
}

export default async function LandingPage({ locale, id }: { locale: Locale; id: LandingId }) {
  const isEn = locale === "en";
  const page = LANDING_PAGES[id];
  const c = getLanding(id, locale);
  const [stats, releases] = await Promise.all([getRepoStats(), getBobineReleases()]);
  const infos: Record<Channel, ReleaseChannelInfo> = { stable: stats.stable, beta: stats.beta, canary: stats.canary };
  const channel = page.channel;

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
    author: { "@type": "Person", name: "Clément Barillot", url: `${BASE_URL}/${locale}${isEn ? "/about" : "/a-propos"}` },
    publisher: { "@type": "Organization", name: "Bobine Fit", url: BASE_URL, logo: `${BASE_URL}/icon.png` },
    isPartOf: { "@type": "WebSite", name: "Bobine Fit", url: BASE_URL },
  };
  const appSchema = channel
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: `Bobine ${channelLabel(channel, isEn)}`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Windows, macOS, Linux, Android, Android TV",
        softwareVersion: infos[channel].version,
        dateModified: updated,
        downloadUrl: infos[channel].downloads.windows,
        license: "https://www.gnu.org/licenses/agpl-3.0.html",
        url,
        offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
      }
    : null;

  return (
    <div className="container" style={{ paddingBottom: "2rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <FaqJsonLd items={c.faq.map((f) => ({ ...f, category: "updates" as const }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      {appSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />}

      <nav aria-label={isEn ? "Breadcrumb" : "Fil d'Ariane"} style={{ fontSize: "0.85rem", color: "var(--text-muted)", paddingTop: "0.5rem" }}>
        {breadcrumbs.map((b, i) => (
          <span key={b.url}>
            {i > 0 && " / "}
            {i < breadcrumbs.length - 1 ? <Link href={b.url} style={{ color: "var(--text-muted)" }}>{b.name}</Link> : <span aria-current="page">{b.name}</span>}
          </span>
        ))}
      </nav>

      <header style={{ paddingTop: "1rem", paddingBottom: "2rem", maxWidth: "860px" }}>
        <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)", fontWeight: 800, marginBottom: "1rem", color: "var(--text-heading)", lineHeight: 1.2 }}>
          {c.h1}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{c.lead}</p>
        {updated && (
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {isEn ? "Updated" : "Mis à jour"} : <time dateTime={updated.slice(0, 10)}>{formatDate(updated, locale)}</time>
          </p>
        )}
      </header>

      {id === "canaux" || id === "nouveautes" ? (
        <section style={{ ...CARD, marginBottom: "2.5rem", maxWidth: "860px" }}>
          <h2 style={H2}>{isEn ? "Current versions" : "Versions en cours"}</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th scope="col" style={TH}>{isEn ? "Channel" : "Canal"}</th>
                  <th scope="col" style={TH}>Version</th>
                  <th scope="col" style={TH}>{isEn ? "Published" : "Publiée le"}</th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map((ch) => (
                  <tr key={ch}>
                    <td style={TD}>
                      <Link href={lp(locale, `/canaux/${ch}`)} style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                        {`Bobine ${channelLabel(ch, isEn)}`}
                      </Link>
                    </td>
                    <td style={TD}>{versionOf(infos[ch])}</td>
                    <td style={TD}>{formatDate(infos[ch].publishedAt, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {channel && (
        <section style={{ ...CARD, marginBottom: "2.5rem", maxWidth: "860px" }}>
          <h2 style={H2}>
            {isEn ? `Download Bobine ${channelLabel(channel, isEn)}` : `Télécharger Bobine ${channelLabel(channel, isEn)}`}
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: 0 }}>
            {isEn ? "Version" : "Version"} : <strong>{versionOf(infos[channel])}</strong>
          </p>
          <DownloadRows isEn={isEn} rows={channelRows(infos[channel], isEn)} />
        </section>
      )}

      {(id === "android-tv" || id === "google-book") && (
        <section style={{ ...CARD, marginBottom: "2.5rem", maxWidth: "860px" }}>
          <h2 style={H2}>{isEn ? "Download" : "Téléchargement"}</h2>
          <DownloadRows
            isEn={isEn}
            rows={CHANNELS.map((ch) => ({
              label: `${id === "android-tv" ? "Android TV" : "Android"} - ${channelLabel(ch, isEn)} (${versionOf(infos[ch])})`,
              url: id === "android-tv" ? infos[ch].downloads.androidTv : infos[ch].downloads.android,
            }))}
          />
        </section>
      )}

      {id === "nouveautes" && (
        <section style={{ ...CARD, marginBottom: "2.5rem", maxWidth: "860px" }}>
          <h2 style={H2}>{isEn ? "Latest releases" : "Dernières versions publiées"}</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {releases
              .filter((r) => !r.isPrerelease)
              .slice(0, 8)
              .map((r) => (
                <li key={r.slug}>
                  <Link href={`/${locale}/blog/${r.slug}`} style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                    {r.slug}
                  </Link>
                  {r.publishedAt ? ` - ${formatDate(r.publishedAt, locale)}` : ""}
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{r.title}</div>
                </li>
              ))}
          </ul>
        </section>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem", maxWidth: "860px" }}>
        {c.sections.map((s) => (
          <article key={s.heading} style={CARD}>
            <h2 style={H2}>{s.heading}</h2>
            {s.paragraphs?.map((p) => (
              <p key={p} style={{ color: "var(--text-body)", lineHeight: 1.65 }}>{p}</p>
            ))}
            {s.bullets && (
              <ul style={{ color: "var(--text-body)", lineHeight: 1.65, paddingLeft: "1.25rem", margin: 0 }}>
                {s.bullets.map((b) => (
                  <li key={b} style={{ marginBottom: "0.4rem", wordBreak: "break-word" }}>{b}</li>
                ))}
              </ul>
            )}
            {s.code && (
              <pre style={{ background: "var(--bg-code, rgba(0,0,0,0.06))", borderRadius: "0.5rem", padding: "0.9rem 1rem", overflowX: "auto", fontSize: "0.85rem", margin: "0.75rem 0 0" }}>
                <code>{s.code}</code>
              </pre>
            )}
          </article>
        ))}
      </div>

      <section style={{ marginBottom: "3rem", maxWidth: "860px" }}>
        <h2 style={H2}>{isEn ? "Frequently asked questions" : "Questions fréquentes"}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {c.faq.map((item) => (
            <details key={item.q} style={{ ...CARD, padding: "1rem 1.25rem" }}>
              <summary style={{ fontWeight: 600, fontSize: "1.05rem", color: "var(--text-heading)", cursor: "pointer" }}>{item.q}</summary>
              <p style={{ margin: "0.75rem 0 0", color: "var(--text-body)", lineHeight: 1.6 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav aria-label={isEn ? "Related pages" : "Pages liées"} style={{ marginBottom: "3rem", maxWidth: "860px" }}>
        <h2 style={H2}>{isEn ? "Related pages" : "Pages liées"}</h2>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem", listStyle: "none", padding: 0, margin: 0 }}>
          {c.related.map((l) => (
            <li key={l.path}>
              <Link href={lp(locale, l.path)} style={{ color: "var(--accent-primary)", fontWeight: 600 }}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
