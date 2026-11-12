import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ApiEntry from "@/components/reference/ApiEntry";
import ReferenceHeader from "@/components/reference/ReferenceHeader";
import ReferenceTabs from "@/components/reference/ReferenceTabs";
import { isLocale, type Locale } from "@/lib/i18n";
import { anchor, API } from "@/lib/reference";
import { buildMetadata, lp } from "@/lib/seo";
import "@/styles/split/pages-reference.css";

const copy = {
  fr: {
    badge: "Référence",
    title: "API HTTP",
    intro: "Toutes les routes de l'API locale de Bobine (port 1903 par défaut), sur le réseau local seulement. Chaque route a sa commande bobine. Toute erreur répond { \"detail\": { \"code\", \"message\" } }.",
    errors: "Codes d'erreur", index: "Domaines", labels: { path: "Chemin", query: "Requête", body: "Corps" },
    metaTitle: "API HTTP — Bobine", metaDescription: "Référence complète de l'API locale de Bobine : routes, paramètres, corps et codes d'erreur.",
  },
  en: {
    badge: "Reference",
    title: "HTTP API",
    intro: "Every route of Bobine's local API (port 1903 by default), on the local network only. Each route has its bobine command. Every error answers { \"detail\": { \"code\", \"message\" } }.",
    errors: "Error codes", index: "Domains", labels: { path: "Path", query: "Query", body: "Body" },
    metaTitle: "HTTP API — Bobine", metaDescription: "Complete reference of Bobine's local API: routes, parameters, bodies and error codes.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = copy[locale as Locale];
  return buildMetadata({ locale: locale as Locale, pathname: "/api", title: t.metaTitle, description: t.metaDescription });
}

export default async function ApiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  return (
    <div className="container ref-page">
      <BreadcrumbsJsonLd items={[{ name: "Bobine", url: `/${locale}` }, { name: t.title, url: lp(locale, "/api") }]} />
      <ReferenceHeader badge={t.badge} title={t.title} intro={t.intro} />
      <ReferenceTabs locale={locale as Locale} current="api" />
      <h2 className="ref-h2">{t.errors}</h2>
      <dl className="ref-args">
        {Object.entries(API.errors.codes).map(([status, code]) => (
          <div key={status} className="ref-arg"><dt><code>{status}</code></dt><dd><code>{code}</code></dd></div>
        ))}
      </dl>
      <h2 className="ref-h2">{t.index}</h2>
      <nav className="ref-index">
        {API.groups.map((group) => <a key={group.name} href={`#${anchor("api", group.name)}`}>{group.name}</a>)}
      </nav>
      {API.groups.map((group) => (
        <div key={group.name} id={anchor("api", group.name)} className="ref-group">
          <h2 className="ref-h2"><code>/api/{group.name}</code></h2>
          {group.routes.map((route) => <ApiEntry key={route.method + route.path} route={route} labels={t.labels} />)}
        </div>
      ))}
    </div>
  );
}
