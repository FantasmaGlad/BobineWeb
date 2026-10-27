import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { getBobineStableReleases, getBobineBetaRelease, getBobineCanaryRelease } from "@/lib/github-releases";
import { releaseSummary } from "@/lib/releaseSummary";
import MarketingPage from "@/components/page/MarketingPage";
import MediaFrame from "@/components/page/MediaFrame";
import Icon from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) return {};
  return buildMetadata({ locale, pathname: "/blog", title: locale === "fr" ? "Journal de Bobine : versions et nouveautés livrées" : "Bobine journal: releases and delivered updates", description: locale === "fr" ? "Retrouvez les 3 versions actives de Bobine (Stable, Bêta, Canary), les détails de chaque mise à jour et les archives complètes des versions sur GitHub." : "Discover the 3 active Bobine releases (Stable, Beta, Canary), details of every software update and the complete version archives available on GitHub.", keywords: ["Bobine", "versions", "release notes", "stable", "beta", "canary"], image: "/images/screens/library-og.webp" });
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const en = locale === "en";
  const [stableList, betaRelease, canaryRelease] = await Promise.all([
    getBobineStableReleases(),
    getBobineBetaRelease(),
    getBobineCanaryRelease(),
  ]);

  const latestStable = stableList[0];
  const activeReleases = [
    ...(latestStable ? [{ ...latestStable, channelLabel: "Stable" }] : []),
    ...(betaRelease ? [{ ...betaRelease, channelLabel: en ? "Beta" : "Bêta" }] : []),
    ...(canaryRelease ? [{ ...canaryRelease, channelLabel: "Canary" }] : []),
  ];

  return (
    <MarketingPage
      locale={locale}
      id="blog"
      title={en ? "Bobine Releases & Updates" : "Versions & Canaux de Bobine"}
      intro={en ? "Follow the 3 active release channels: Stable for routine gym operation, Beta to preview curated upcoming features, and Canary for continuous builds." : "Suivez les 3 canaux actifs de diffusion : Stable pour l’exploitation en salle, Bêta pour anticiper les évolutions validées, et Canary pour les compilations continues."}
      image="library"
    >
      {en ? <p className="marketing-notice" lang="en">Release titles and notes are provided in their original language. The surrounding navigation is in English.</p> : null}
      
      <div className="marketing-grid">
        {activeReleases.map((release) => (
          <article key={release.slug} className="marketing-card">
            <div className="marketing-release-meta">
              <span>{release.slug}</span>
              <span>{release.channelLabel}</span>
              {release.publishedAt ? (
                <time dateTime={release.publishedAt}>
                  {new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", { dateStyle: "long", timeZone: "Europe/Paris" }).format(new Date(release.publishedAt))}
                </time>
              ) : null}
            </div>
            <h2 className="marketing-release-title" lang="fr">{release.title.split(" — ")[0]}</h2>
            <MediaFrame
              id={release.slug.toLowerCase() === "v5.0.5" ? "library" : "laptop"}
              locale={locale}
              caption={release.slug.toLowerCase() === "v5.0.5" ? (en ? "Bobine 5.0.5 demonstration screenshot." : "Capture de démonstration de Bobine 5.0.5.") : (en ? "Project illustration." : "Illustration du projet.")}
            />
            <ul lang="fr">
              {releaseSummary(release.body).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link href={`/${locale}/blog/${encodeURIComponent(release.slug)}`} className="btn-secondary">
              {en ? "Read the release notes" : "Lire les notes de version"}
            </Link>
          </article>
        ))}
      </div>

      <section className="marketing-card" style={{ marginTop: "2rem", textAlign: "center", padding: "2rem 1.5rem" }} aria-labelledby="blog-archive-heading">
        <h2 id="blog-archive-heading" style={{ margin: "0 0 0.5rem" }}>
          {en ? "Previous versions & Archives" : "Versions antérieures & Archives"}
        </h2>
        <p style={{ margin: "0 0 1.25rem", color: "var(--text-muted)", fontSize: "var(--fs-0-95rem)" }}>
          {en
            ? "All earlier versions of Bobine remain documented, preserved, and downloadable with their full source code and package assets on GitHub Releases."
            : "L'ensemble des versions antérieures de Bobine reste documenté, archivé et téléchargeable avec le code source et les paquets d'époque sur GitHub Releases."}
        </p>
        <a
          href="https://github.com/FantasmaGlad/Bobine/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span>{en ? "Access the complete GitHub release archives" : "Accéder aux archives complètes sur GitHub"}</span>
          <Icon name="external" size={16} />
        </a>
      </section>
    </MarketingPage>
  );
}
