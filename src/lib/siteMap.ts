/**
 * Plan du site : registre unique des routes (`siteMap.json`), lu par l'en-tête, le tiroir mobile, le pied de page, le
 * sitemap XML, les fils d'Ariane et les pages « hub ». Le fichier JSON est aussi lu par `scripts/ci/check-site-graph.mjs`,
 * qui refuse une feuille sans parent hub ou sans lien entrant depuis ce hub.
 *
 * Règles : une route a exactement un parent (un hub) ; un hub liste ses enfants ; les slugs anglais restent dans
 * `slugs.ts` (lus aussi par `next.config.ts`).
 */
import data from "./siteMap.json";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";

export type RouteId = (typeof data.routes)[number]["id"];
export type FooterGroup = "product" | "download" | "docs" | "compare" | "hardware" | "resources" | "project" | "legal";

export interface Localized {
  fr: string;
  en: string;
}

export interface SiteRoute {
  id: RouteId;
  /** Chemin français sans préfixe de langue ; vide pour l'accueil. */
  path: string;
  kind: "hub" | "leaf";
  parent?: RouteId;
  label: Localized;
  description: Localized;
  /** `icon:<IconName>` (interface) ou `brand:<AssetKey>` (logo). */
  icon?: string;
  /** Présente dans la navigation principale. */
  nav?: boolean;
  footer?: FooterGroup;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Page directe qui ne figure ni dans la navigation ni dans les listes d'un hub (reste dans le sitemap XML). */
  hidden?: boolean;
  /** Le hub liste aussi des pages créées à la volée (articles du blog). */
  dynamicChildren?: boolean;
  /** Ancienne adresse redirigée vers une route canonique. */
  redirectTo?: RouteId;
}

export const ROUTES = data.routes as SiteRoute[];

const byId = new Map<RouteId, SiteRoute>(ROUTES.map((r) => [r.id, r]));

export function getRoute(id: RouteId): SiteRoute {
  const route = byId.get(id);
  if (!route) throw new Error(`Route inconnue : ${id}`);
  return route;
}

/** Adresse d'une route, avec le préfixe de langue et le slug de la langue. */
export function routeHref(locale: Locale, id: RouteId): string {
  const route = getRoute(id);
  if (route.redirectTo) return routeHref(locale, route.redirectTo);
  const { path } = route;
  return path === "" ? `/${locale}` : lp(locale, path);
}

export function routeLabel(locale: Locale, id: RouteId): string {
  return getRoute(id).label[locale];
}

/** Enfants visibles d'un hub, dans l'ordre du registre. */
export function childrenOf(id: RouteId): SiteRoute[] {
  return ROUTES.filter((r) => r.parent === id && !r.hidden);
}

/** Chemin d'accès de l'accueil jusqu'à la route (l'accueil et la route y figurent). */
export function trailOf(id: RouteId): SiteRoute[] {
  const trail: SiteRoute[] = [];
  for (let cur: SiteRoute | undefined = getRoute(id); cur; cur = cur.parent ? getRoute(cur.parent) : undefined) trail.unshift(cur);
  return trail;
}

export const navRoutes = (): SiteRoute[] => ROUTES.filter((r) => r.nav && !r.hidden);

export const FOOTER_GROUPS: Array<{ id: FooterGroup; label: Localized }> = [
  { id: "product", label: { fr: "Produit", en: "Product" } },
  { id: "download", label: { fr: "Télécharger", en: "Download" } },
  { id: "docs", label: { fr: "Documentation", en: "Documentation" } },
  { id: "compare", label: { fr: "Comparatifs", en: "Comparisons" } },
  { id: "hardware", label: { fr: "Matériel", en: "Hardware" } },
  { id: "resources", label: { fr: "Ressources", en: "Resources" } },
  { id: "project", label: { fr: "Projet", en: "Project" } },
  { id: "legal", label: { fr: "Légal", en: "Legal" } },
];

export const footerRoutes = (group: FooterGroup): SiteRoute[] => ROUTES.filter((r) => r.footer === group && !r.hidden);
