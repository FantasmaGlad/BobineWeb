import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { RouteId } from "@/lib/siteMap";
import { lp } from "@/lib/seo";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import MediaFrame, { type MediaId } from "@/components/page/MediaFrame";
import Icon from "@/components/ui/Icon";
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
      <section className="marketing-cta">
        <h2>{locale === "fr" ? "Préparer votre installation" : "Prepare your installation"}</h2>
        <p>{locale === "fr" ? "Choisissez votre système, consultez les prérequis et essayez Bobine avec vos médias." : "Choose your system, check its requirements and try Bobine with your own media."}</p>
        <Link href={lp(locale, "/telechargement")} className="btn-primary"><Icon name="download" />{locale === "fr" ? "Choisir mon téléchargement" : "Choose my download"}</Link>
      </section>
      <p className="marketing-credits"><Link href={lp(locale, "/credits")}>{locale === "fr" ? "Crédits des images et captures" : "Image and screenshot credits"}</Link></p>
    </div>
  );
}
