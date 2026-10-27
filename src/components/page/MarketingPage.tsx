import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { RouteId } from "@/lib/siteMap";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import MediaFrame, { type MediaId } from "@/components/page/MediaFrame";
import "@/styles/components/marketing.css";

export default function MarketingPage({ locale, id, title, intro, image, children }: { locale: Locale; id: RouteId; title: string; intro: string; image: MediaId; children: ReactNode }) {
  return (
    <div className="container marketing-page">
      <Breadcrumbs locale={locale} id={id} />
      <header className="marketing-hero">
        <div><h1>{title}</h1><p>{intro}</p><Link className="btn-secondary" href={`/${locale}/documentation`}>{locale === "fr" ? "Lire la documentation" : "Read the documentation"}</Link></div>
        <MediaFrame id={image} locale={locale} preload caption={image === "library" ? (locale === "fr" ? "Bobine 5.0.5, instance de démonstration." : "Bobine 5.0.5 demonstration screenshot, French interface.") : undefined} />
      </header>
      {children}
    </div>
  );
}
