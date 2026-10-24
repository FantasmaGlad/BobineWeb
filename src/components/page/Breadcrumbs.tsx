import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { CLEARNET_URL } from "@/lib/onion";
import { routeHref, trailOf, type RouteId } from "@/lib/siteMap";
import "@/styles/components/page.css";

interface BreadcrumbsProps {
  locale: Locale;
  /** Route de la page courante dans le plan du site. */
  id: RouteId;
  /** Maillon final propre à une page créée à la volée (article de blog) : il suit la route `id`. */
  current?: { name: string; href: string };
}

/**
 * Fil d'Ariane visible et son JSON-LD `BreadcrumbList`, dérivés du plan du site : une page n'a qu'un seul fil, avec les
 * mêmes adresses que ses liens (jamais un chemin français sous `/en`).
 */
export default function Breadcrumbs({ locale, id, current }: BreadcrumbsProps) {
  const items = trailOf(id).map((r) => ({ name: r.label[locale], href: routeHref(locale, r.id) }));
  if (current) items.push({ name: current.name, href: current.href });
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${CLEARNET_URL}${item.href}` })),
  };
  const label = locale === "en" ? "Breadcrumb" : "Fil d'Ariane";
  return (
    <>
      <nav aria-label={label} className="pg-breadcrumbs">
        <ol>
          {items.map((item, index) => (
            <li key={item.href}>
              {index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.href}>{item.name}</Link>}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
