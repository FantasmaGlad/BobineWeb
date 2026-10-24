import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { childrenOf, routeHref, type RouteId } from "@/lib/siteMap";
import RouteIcon from "@/components/page/RouteIcon";
import Icon from "@/components/ui/Icon";
import "@/styles/components/page.css";

/** Cartes des pages enfants d'un hub : le lien entrant de chaque feuille vers son parent est vérifié en CI. */
export default function HubGrid({ locale, id }: { locale: Locale; id: RouteId }) {
  const children = childrenOf(id);
  return (
    <ul className="pg-grid">
      {children.map((route) => (
        <li key={route.id}>
          <Link href={routeHref(locale, route.id)} className="pg-card">
            <span className="pg-card__icon" aria-hidden="true">
              <RouteIcon icon={route.icon} />
            </span>
            <span className="pg-card__body">
              <span className="pg-card__title">{route.label[locale]}</span>
              <span className="pg-card__text">{route.description[locale]}</span>
            </span>
            <Icon name="arrow-right" size={18} className="pg-card__arrow" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
