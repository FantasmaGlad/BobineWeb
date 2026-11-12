import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { getRoute, type RouteId } from "@/lib/siteMap";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import HubGrid from "@/components/page/HubGrid";
import "@/styles/components/page.css";

interface HubPageProps {
  locale: Locale;
  id: RouteId;
  children?: ReactNode;
  lead?: string;
  gridTitle?: string;
}

export default function HubPage({ locale, id, children, lead, gridTitle }: HubPageProps) {
  const route = getRoute(id);
  return (
    <div className="pg-page">
      <Breadcrumbs locale={locale} id={id} />
      <header className="pg-hero">
        <h1 className="pg-hero__title">{route.label[locale]}</h1>
        <p className="pg-hero__lead">{lead ?? route.description[locale]}</p>
      </header>
      {children}
      <section aria-labelledby={`${id}-children`} className="pg-section">
        <h2 id={`${id}-children`} className="pg-section__title">
          {gridTitle ?? (locale === "en" ? "Pages in this section" : "Pages de cette section")}
        </h2>
        <HubGrid locale={locale} id={id} />
      </section>
    </div>
  );
}
