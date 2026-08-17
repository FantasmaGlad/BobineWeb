import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { isLocale } from "@/lib/i18n";
import { getBobineRelease, getBobineReleases } from "@/lib/github-releases";
import GitHubIcon from "@/components/icons/GitHubIcon";
import GitHubAttachmentMedia from "@/components/GitHubAttachmentMedia";

// Notes de release rédigées via l'éditeur GitHub : une vidéo/image glissée-
// déposée y devient un simple lien brut vers cette URL (pas de balise <video>
// dans le Markdown source) — on l'intercepte pour l'incorporer en lecteur.
const GITHUB_ATTACHMENT_PATTERN =
  /^https:\/\/github\.com\/user-attachments\/assets\//;

const markdownComponents: Components = {
  a({ href, children, ...props }) {
    if (href && GITHUB_ATTACHMENT_PATTERN.test(href)) {
      return <GitHubAttachmentMedia href={href}>{children}</GitHubAttachmentMedia>;
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
};

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
    <div className="container" style={{ paddingBlock: "clamp(2rem, 5vw, 4rem)", maxWidth: "48rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href={`/${locale}/blog`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          ← {locale === "fr" ? "Retour aux articles" : "Back to articles"}
        </Link>
      </div>

      <article className="docs-content__inner" style={{ maxWidth: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span className="badge">{release.slug}</span>
          {release.publishedAt && (
            <time
              style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
              dateTime={release.publishedAt}
            >
              {new Date(release.publishedAt).toLocaleDateString(
                locale === "fr" ? "fr-FR" : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </time>
          )}
        </div>

        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", marginBottom: "1.5rem" }}>
          {release.title}
        </h1>

        <div className="release-body">
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {release.body}
          </Markdown>
        </div>

        <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
          <a
            href={release.url}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ display: "inline-flex" }}
          >
            <GitHubIcon size={16} />
            {locale === "fr" ? "Voir la release officielle sur GitHub" : "View official release on GitHub"}
          </a>
        </div>
      </article>
    </div>
  );
}
