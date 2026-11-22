import data from "./siteMap.json";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";

export type RouteId = (typeof data.routes)[number]["id"];
export type FooterGroup = "reference" | "project" | "legal";

export interface Localized {
  fr: string;
  en: string;
}

export interface SiteRoute {
  id: RouteId;
  path: string;
  kind: "hub" | "leaf";
  parent?: RouteId;
  label: Localized;
  description: Localized;
  icon?: string;
  nav?: boolean;
  footer?: FooterGroup;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  hidden?: boolean;
  dynamicChildren?: boolean;
  redirectTo?: RouteId;
}

export const ROUTES = data.routes as SiteRoute[];

const byId = new Map<RouteId, SiteRoute>(ROUTES.map((r) => [r.id, r]));

export function getRoute(id: RouteId): SiteRoute {
  const route = byId.get(id);
  if (!route) throw new Error(`Route inconnue : ${id}`);
  return route;
}

export function routeHref(locale: Locale, id: RouteId): string {
  const route = getRoute(id);
  if (route.redirectTo) return routeHref(locale, route.redirectTo);
  const { path } = route;
  return path === "" ? `/${locale}` : lp(locale, path);
}

export const navRoutes = (): SiteRoute[] => ROUTES.filter((r) => r.nav && !r.hidden);

export const FOOTER_GROUPS: Array<{ id: FooterGroup; label: Localized }> = [
  { id: "reference", label: { fr: "Référence", en: "Reference" } },
  { id: "project", label: { fr: "Projet", en: "Project" } },
  { id: "legal", label: { fr: "Légal", en: "Legal" } },
];

export const footerRoutes = (group: FooterGroup): SiteRoute[] => ROUTES.filter((r) => r.footer === group && !r.hidden);
