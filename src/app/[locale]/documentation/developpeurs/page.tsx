import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import CodeBlock from "@/components/CodeBlock";
import { buildMetadata, lp } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import "@/styles/split/pages-docs.css";

const REPO = "https://github.com/FantasmaGlad/Bobine";

const TEXT = {
  fr: {
    title: "Documentation développeurs",
    description: "Pile technique, API locale et contribution au code de Bobine, logiciel libre sous AGPL-3.0.",
    crumb: "Développeurs",
    h1: "Développeurs",
    lead: "Bobine est un seul processus local : FastAPI et SQLite côté serveur, Next.js côté interface. Le code, l'architecture et les règles de contribution sont sur GitHub.",
    stackTitle: "Pile",
    stack: [
      "Serveur : Python 3.11+, FastAPI, SQLite (SQLAlchemy).",
      "Interface : Next.js, React, TypeScript.",
      "Lecture : mpv avec décodage matériel quand il est disponible.",
      "Assistant d'installation et composants natifs : Rust.",
    ],
    apiTitle: "API locale",
    api: "Bobine écoute sur le port 1903 (variable BOBINE_PORT). S'il est déjà pris, Bobine se replie sur un port libre. La documentation interactive de l'API est servie par l'application elle-même :",
    contribTitle: "Contribuer",
    contrib: "Lisez CONTRIBUTING.md et docs/ARCHITECTURE.md avant d'ouvrir une pull request. Les failles se signalent en privé (SECURITY.md).",
  },
  en: {
    title: "Developer documentation",
    description: "Tech stack, local API and contributing to Bobine, free software under AGPL-3.0.",
    crumb: "Developers",
    h1: "Developers",
    lead: "Bobine is a single local process: FastAPI and SQLite on the server side, Next.js for the interface. Code, architecture and contribution rules live on GitHub.",
    stackTitle: "Stack",
    stack: [
      "Server: Python 3.11+, FastAPI, SQLite (SQLAlchemy).",
      "Interface: Next.js, React, TypeScript.",
      "Playback: mpv, with hardware decoding when available.",
      "Setup assistant and native components: Rust.",
    ],
    apiTitle: "Local API",
    api: "Bobine listens on port 1903 (BOBINE_PORT variable). If it is taken, Bobine falls back to a free port. The interactive API documentation is served by the application itself:",
    contribTitle: "Contributing",
    contrib: "Read CONTRIBUTING.md and docs/ARCHITECTURE.en.md before opening a pull request. Vulnerabilities are reported privately (SECURITY.md).",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = TEXT[locale];
  return buildMetadata({ locale: locale as Locale, pathname: "/documentation/developpeurs", title: t.title, description: t.description });
}

export default async function DeveloppeursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = TEXT[locale];
  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: t.crumb, url: lp(locale, `/documentation/developpeurs`) },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="dx-div-1">
        <h1 className="dx-h1-1">{t.h1}</h1>
        <div className="dx-div-2">
          <ShareButton locale={locale as Locale} pathname="/documentation/developpeurs" title={t.title} description={t.description} />
        </div>
      </div>

      <p>
        {t.lead} <a href={REPO} target="_blank" rel="noopener noreferrer">github.com/FantasmaGlad/Bobine</a>
      </p>

      <h2 id="stack">{t.stackTitle}</h2>
      <ul>{t.stack.map((line) => <li key={line}>{line}</li>)}</ul>

      <h2 id="api">{t.apiTitle}</h2>
      <p>{t.api}</p>
      <CodeBlock>
        <code>http://127.0.0.1:1903/docs</code>
      </CodeBlock>

      <h2 id="contribuer">{t.contribTitle}</h2>
      <p>
        {t.contrib} <a href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">CONTRIBUTING.md</a>
      </p>

    </>
  );
}
