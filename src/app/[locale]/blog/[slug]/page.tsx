import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { isLocale, type Locale } from "@/lib/i18n";
import { getBobineRelease, getBobineReleases } from "@/lib/github-releases";
import { buildMetadata } from "@/lib/seo";
import GitHubIcon from "@/components/icons/GitHubIcon";
import GitHubAttachmentMedia from "@/components/GitHubAttachmentMedia";
import ShareButton from "@/components/ShareButton";

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
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const release = await getBobineRelease(decodeURIComponent(slug));
  const isEn = locale === "en";
  const title = release?.title ?? slug;
  const description = release?.body
    ? release.body.slice(0, 155).replace(/[#*`_]/g, "").trim() + "..."
    : (isEn ? "Release notes and updates for Bobine." : "Notes de version et nouveautés de Bobine.");

  return buildMetadata({
    locale: locale as Locale,
    pathname: `/blog/${slug}`,
    title: `${title} — Blog Bobine`,
    description,
    type: "article",
    publishedTime: release?.publishedAt || undefined,
  });
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: release.title,
    description: release.body.slice(0, 160).replace(/[#*`_]/g, "").trim(),
    datePublished: release.publishedAt,
    dateModified: release.publishedAt,
    mainEntityOfPage: `https://bobine.fit/${locale}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: "FantasmaGlad",
      url: "https://github.com/FantasmaGlad",
    },
    publisher: {
      "@type": "Organization",
      name: "Bobine",
      logo: {
        "@type": "ImageObject",
        url: "https://bobine.fit/icon.png",
      },
    },
  };

  return (
    <div className="container" style={{ paddingBlock: "clamp(2.5rem, 6vw, 5rem)", maxWidth: "60rem" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div style={{ marginBottom: "2rem" }}>
        <Link
          href={`/${locale}/blog`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 0.15s ease",
          }}
        >
          ← {locale === "fr" ? "Retour aux articles" : "Back to articles"}
        </Link>
      </div>

      <article style={{ width: "100%" }}>
        <header
          style={{
            paddingBottom: "2rem",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span className="badge" style={{ fontSize: "0.8rem", padding: "0.25rem 0.65rem" }}>
                {release.slug}
              </span>
              {release.publishedAt && (
                <time
                  style={{ color: "var(--text-dim)", fontSize: "0.9rem", fontWeight: 500 }}
                  dateTime={release.publishedAt}
                >
                  {new Date(release.publishedAt).toLocaleDateString(
                    locale === "fr" ? "fr-FR" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
              )}
            </div>
            <ShareButton
              locale={locale as Locale}
              pathname={`/blog/${slug}`}
              title={release.title}
              description={`Notes de version et nouveautés de Bobine : ${release.title}`}
              hashtags={["Bobine", "Release", "OpenSource", "Fitness"]}
            />
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.18,
              color: "var(--text-heading)",
              margin: 0,
            }}
          >
            {release.title}
          </h1>
        </header>

        <div className="release-body" style={{ fontSize: "1.05rem", lineHeight: 1.75 }}>
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {release.body}
          </Markdown>
        </div>

        <footer
          style={{
            marginTop: "3.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.25rem",
          }}
        >
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
          <ShareButton
            locale={locale as Locale}
            pathname={`/blog/${slug}`}
            title={release.title}
            description={`Notes de version et nouveautés de Bobine : ${release.title}`}
            hashtags={["Bobine", "Release", "OpenSource", "Fitness"]}
          />
        </footer>
      </article>
    </div>
  );
}
