import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getBobineRelease, getBobineReleases } from "@/lib/github-releases";

export async function generateStaticParams() {
  const releases = await getBobineReleases();
  return releases.map((release) => ({ slug: release.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = await getBobineRelease(decodeURIComponent(slug));
  return { title: release?.title ?? slug };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const release = await getBobineRelease(decodeURIComponent(slug));
  if (!release) notFound();

  return (
    <div className="container" style={{ paddingBlock: "3rem", maxWidth: "40rem" }}>
      <h1>{release.title}</h1>
      {release.publishedAt && (
        <p style={{ color: "var(--text-muted)" }}>
          {new Date(release.publishedAt).toLocaleDateString(
            locale === "fr" ? "fr-FR" : "en-US"
          )}
        </p>
      )}
      {/* Rendu texte brut pour l'instant — le corps vient de l'API Releases GitHub (Markdown). */}
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{release.body}</pre>
      <a href={release.url} target="_blank" rel="noreferrer">
        {locale === "fr" ? "Voir la release sur GitHub →" : "View the release on GitHub →"}
      </a>
    </div>
  );
}
