import { FEATURE_OVERVIEW } from "@/content/docs/chapters";
import { FAQ_CATEGORY_LABELS, FAQ_ITEMS, TROUBLESHOOTING_ROWS } from "@/content/docs/faq-data";
import { USAGE_SECTIONS } from "@/content/docs/usage-sections";
import type { Locale } from "@/lib/i18n";
import { API, CLI, anchor } from "@/lib/reference";
import { ROUTES, routeHref } from "@/lib/siteMap";

export interface SearchEntry {
  title: string;
  category: string;
  excerpt: string;
  href: string;
  tags: string[];
}

const CATEGORIES: Record<Locale, Record<"pages" | "features" | "usage" | "troubleshooting" | "commands" | "api", string>> = {
  fr: { pages: "Pages", features: "Fonctionnalités", usage: "Guide d'utilisation", troubleshooting: "Dépannage", commands: "Commandes", api: "API" },
  en: { pages: "Pages", features: "Features", usage: "User guide", troubleshooting: "Troubleshooting", commands: "Commands", api: "API" },
};

const EXCERPT_LENGTH = 180;

function excerpt(text: string): string {
  return text.length <= EXCERPT_LENGTH ? text : `${text.slice(0, EXCERPT_LENGTH).replace(/\s+\S*$/, "")}…`;
}

function words(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9àâäçéèêëîïôöùûüÿœ.-]+/).filter((word) => word.length > 2);
}

function pages(locale: Locale): SearchEntry[] {
  return ROUTES.filter((route) => !route.hidden && !route.redirectTo).map((route) => ({
    title: route.label[locale], category: CATEGORIES[locale].pages, excerpt: route.description?.[locale] ?? "",
    href: routeHref(locale, route.id), tags: [route.id, ...route.path.split("/").filter(Boolean)],
  }));
}

function features(locale: Locale): SearchEntry[] {
  const base = routeHref(locale, "features");
  return FEATURE_OVERVIEW.map((feature) => ({
    title: feature.title[locale], category: CATEGORIES[locale].features, excerpt: feature.description[locale],
    href: `${base}#${feature.id}`, tags: [feature.id, ...words(feature.detail[locale])],
  }));
}

function usage(locale: Locale): SearchEntry[] {
  const base = routeHref(locale, "docs-usage");
  return USAGE_SECTIONS.map((section) => ({
    title: section.title[locale], category: CATEGORIES[locale].usage, excerpt: "", href: `${base}#${section.id}`, tags: section.id.split("-"),
  }));
}

function faq(locale: Locale): SearchEntry[] {
  const base = routeHref(locale, "docs-faq");
  const faqEntries = FAQ_ITEMS[locale].map((item) => ({
    title: item.q, category: FAQ_CATEGORY_LABELS[locale][item.category], excerpt: excerpt(item.a), href: base, tags: [item.category],
  }));
  const rows = TROUBLESHOOTING_ROWS[locale].map((row) => ({
    title: row.issue, category: CATEGORIES[locale].troubleshooting, excerpt: excerpt(`${row.cause} ${row.solution}`),
    href: `${base}#troubleshooting-matrix`, tags: words(row.cause),
  }));
  return [...faqEntries, ...rows];
}

function commands(locale: Locale): SearchEntry[] {
  const base = routeHref(locale, "commands");
  return CLI.commands.flatMap((command) => {
    const actions = command.actions.length === 0 ? [{ words: [command.name], help: command.help }] : command.actions.map((action) => ({ words: [command.name, action.name], help: action.help }));
    return actions.map((action) => ({
      title: `bobine ${action.words.join(" ")}`, category: CATEGORIES[locale].commands, excerpt: action.help,
      href: `${base}#${anchor("cmd", ...action.words)}`, tags: action.words,
    }));
  });
}

function api(locale: Locale): SearchEntry[] {
  const base = routeHref(locale, "api");
  return API.groups.flatMap((group) => group.routes.map((route) => ({
    title: `${route.method} ${route.path}`, category: `${CATEGORIES[locale].api} · ${group.name}`, excerpt: route.summary,
    href: `${base}#${anchor(route.method, route.path)}`, tags: route.path.split(/[/{}]/).filter(Boolean),
  })));
}

function build(locale: Locale): SearchEntry[] {
  return [...pages(locale), ...features(locale), ...usage(locale), ...faq(locale), ...commands(locale), ...api(locale)];
}

export const SEARCH_INDEX: Record<Locale, SearchEntry[]> = { fr: build("fr"), en: build("en") };
