import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getBobineStableReleases, getBobineBetaRelease } from "@/lib/github-releases";
import { releaseSummary } from "@/lib/releaseSummary";
import MarketingPage from "@/components/page/MarketingPage";
import MediaFrame from "@/components/page/MediaFrame";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) return {};
  return buildMetadata({ locale, pathname: "/blog", title: locale === "fr" ? "Journal de Bobine : versions et nouveautés livrées" : "Bobine journal: releases and delivered updates", description: locale === "fr" ? "Retrouvez les versions de Bobine, leurs notes de publication et les nouveautés livrées. Les résumés proviennent directement des notes de version GitHub." : "Browse Bobine releases, publication notes and delivered updates. Summaries come directly from GitHub release notes, shown in their original language.", keywords: ["Bobine", "versions", "release notes"], image: "/images/screens/library-og.webp" });
}
export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const en = locale === "en";
  const [stable, beta] = await Promise.all([getBobineStableReleases(), getBobineBetaRelease()]);
  const releases = [...stable.slice(0, 1), ...(beta ? [beta] : []), ...stable.slice(1)];
  return <MarketingPage locale={locale} id="blog" title={en ? "What is new in Bobine" : "Ce qui change dans Bobine"} intro={en ? "Published versions and their release notes, synchronized from GitHub. Choose Stable for routine use, or read what the Beta channel is testing." : "Les versions publiées et leurs notes, synchronisées depuis GitHub. Choisissez Stable pour l’usage courant, ou consultez ce que teste le canal Bêta."} image="library">
    {en ? <p className="marketing-notice" lang="en">Release titles and notes are provided in their original language, usually French. The surrounding navigation is in English.</p> : null}
    <div className="marketing-grid">{releases.map((release) => <article key={release.slug} className="marketing-card">
      <div className="marketing-release-meta"><span>{release.slug}</span><span>{release.isPrerelease ? (en ? "Beta" : "Bêta") : "Stable"}</span>{release.publishedAt ? <time dateTime={release.publishedAt}>{new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date(release.publishedAt))}</time> : null}</div>
      <h2 className="marketing-release-title" lang="fr">{release.title.split(" — ")[0]}</h2>
      <MediaFrame id={release.slug.toLowerCase() === "v5.0.5" ? "library" : "laptop"} locale={locale} caption={release.slug.toLowerCase() === "v5.0.5" ? (en ? "Bobine 5.0.5 demonstration screenshot (French interface)." : "Capture de démonstration de Bobine 5.0.5.") : (en ? "Project illustration; not a screenshot of this release." : "Illustration du projet, pas une capture de cette version.")} />
      <ul lang="fr">{releaseSummary(release.body).map((point) => <li key={point}>{point}</li>)}</ul>
      <Link href={`/${locale}/blog/${encodeURIComponent(release.slug)}`} className="btn-secondary">{en ? "Read the release notes" : "Lire les notes de version"}</Link>
    </article>)}</div>
    {!releases.length ? <p>{en ? "No published release is available right now." : "Aucune version publiée n’est disponible pour le moment."}</p> : null}
  </MarketingPage>;
}
