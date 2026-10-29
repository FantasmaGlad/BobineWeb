import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentProps } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { isLocale, type Locale } from "@/lib/i18n";
import { getBobineRelease } from "@/lib/github-releases";
import { buildMetadata } from "@/lib/seo";
import { IS_ONION } from "@/lib/onion";
import GitHubIcon from "@/components/icons/GitHubIcon";
import GitHubAttachmentMedia from "@/components/GitHubAttachmentMedia";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import "@/styles/split/pages-blog.css";

const GITHUB_ATTACHMENT_PATTERN =
  /^https:\/\/github\.com\/user-attachments\/assets\//;

/**
 * Miroir Tor : aucune image ni vidéo distante n'est chargée automatiquement
 * (GitHub, shields.io...). Le média devient un lien que le lecteur ouvre,
 * ou non, de sa propre initiative.
 */
function remoteMediaLink(src: string | undefined, label?: string) {
  if (!src) return null;
  let host = src;
  try {
    host = new URL(src).hostname;
  } catch {
    // src relatif ou invalide : on l'affiche tel quel.
  }
  return (
    <a href={src} target="_blank" rel="noopener noreferrer">
      {label || host}
    </a>
  );
}

const markdownComponents: Components = {
  h1({ children }) { return <h2>{children}</h2>; },
  a({ href, children, node: _node, ...props }) {
    void _node;
    if (IS_ONION && href && GITHUB_ATTACHMENT_PATTERN.test(href)) {
      return remoteMediaLink(href, typeof children === "string" ? children : undefined);
    }
    if (href && GITHUB_ATTACHMENT_PATTERN.test(href)) {
      return <GitHubAttachmentMedia href={href}>{children}</GitHubAttachmentMedia>;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  ...(IS_ONION
    ? {
        video({ src, node: _node }: ComponentProps<"video"> & { node?: unknown }) {
          void _node;
          return remoteMediaLink(typeof src === "string" ? src : undefined);
        },
      }
    : {}),
  img({ src, alt, node: _node, ...props }) {
    void _node;
    if (IS_ONION) return remoteMediaLink(typeof src === "string" ? src : undefined, alt || undefined);
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={alt || ""} className="blog-img-1"
        {...props}
      />
    );
  },
};

function cleanReleaseBody(body: string, title: string): string {
  let cleaned = body;
  // Si le corps markdown commence par un H1 identique ou similaire au titre déjà affiché dans le header, on le retire
  cleaned = cleaned.replace(/^\s*#\s+[^\n]+/m, (match) => {
    const headingText = match.replace(/^#\s+/, "").trim();
    if (
      headingText.toLowerCase() === title.toLowerCase() ||
      headingText.includes(title) ||
      title.includes(headingText)
    ) {
      return "";
    }
    return match;
  });
  return cleaned.trim();
}

export async function generateStaticParams() {
  const slugs = ["v5.0.7", "V5.0.7", "v5.0.5", "V5.0.5", "beta", "BETA", "canary", "CANARY"];
  return slugs.map((slug) => ({ slug }));
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

  const release = (await getBobineRelease(decodeURIComponent(slug))) ?? {
    slug,
    title: `Bobine ${slug}`,
    publishedAt: "",
    url: `https://github.com/FantasmaGlad/Bobine/releases/tag/${slug}`,
    body: locale === "fr"
      ? `Cette version est archivée. Vous pouvez consulter les notes de publication et télécharger les paquets historiques directement sur GitHub : [Voir la release ${slug} sur GitHub](https://github.com/FantasmaGlad/Bobine/releases/tag/${slug}).`
      : `This version is archived. You can read the release notes and download historical packages directly on GitHub: [View release ${slug} on GitHub](https://github.com/FantasmaGlad/Bobine/releases/tag/${slug}).`,
    isPrerelease: false,
  };

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

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Blog", url: `/${locale}/blog` },
    { name: release.title, url: `/${locale}/blog/${slug}` },
  ];

  return (
    <div className="container blog-div-1">
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="blog-div-2">
        <Link
          href={`/${locale}/blog`} className="blog-link-1"
        >
          &larr; {locale === "fr" ? "Retour aux versions" : "Back to releases"}
        </Link>
      </div>

      <article className="blog-article-1">
        <header className="blog-header-1"
        >
          <div className="blog-div-3"
          >
            <div className="blog-div-4">
              <span className="badge blog-span-1">
                {release.slug}
              </span>
              {release.publishedAt && (
                <time className="blog-time-1"
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

          <h1 className="blog-h1-1"
          >
            {release.title}
          </h1>
        </header>

        <div className="release-body">
          {locale === "en" ? <p className="marketing-notice" lang="en">These release notes are shown in their original language, usually French.</p> : null}
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
          >
            {cleanReleaseBody(release.body, release.title)}
          </Markdown>
        </div>

        <footer className="blog-footer-1"
        >
          <a
            href={release.url}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary blog-a-1"
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
