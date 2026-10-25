import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BrandIcon from "@/components/ui/BrandIcon";
import { ASSET_KEYS, getAsset } from "@/lib/assets";
import media from "@/content/media.json";
import MarketingPage from "@/components/page/MarketingPage";
import MediaFrame, { type MediaId } from "@/components/page/MediaFrame";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) return {};
  return buildMetadata({ locale, pathname: "/credits", title: locale === "fr" ? "Crédits des images et captures du projet Bobine" : "Image and screenshot credits for the Bobine project", description: locale === "fr" ? "Consultez les sources des illustrations et captures Bobine, leurs versions et leurs crédits. Les images optimisées sont hébergées localement sur le site." : "Find sources, versions and credits for Bobine illustrations and screenshots. Optimized images are hosted locally and also work on the static Tor mirror.", keywords: ["Bobine", "crédits", "images"], image: "/images/marketing/baamix-og.webp" });
}
export default async function CreditsPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const en = locale === "en";
  return <MarketingPage locale={locale} id="credits" title={en ? "Where the images come from" : "D’où viennent les images"} intro={en ? "Current application screenshots use an isolated demo and synthetic media. Bobine visual identity remains the property of the project; no stock-photo license is claimed." : "Les captures actuelles utilisent une instance de démonstration isolée et des médias synthétiques. L’identité visuelle Bobine reste la propriété du projet ; aucune licence de photo de stock n’est revendiquée."} image="baamix">
    <section className="marketing-section"><h2>{en ? "Identification logos" : "Logos d’identification"}</h2><div className="marketing-actions">{ASSET_KEYS.map((key) => <span className="marketing-logo" key={key}><BrandIcon name={key} size={28} />{getAsset(key).name}</span>)}</div><p><a href="https://github.com/FantasmaGlad/BobineWeb/blob/main/NOTICE.md">{en ? "Sources and trademark attribution" : "Sources et attribution des marques"}</a></p></section>
    <div className="marketing-grid">{Object.entries(media).map(([id, item]) => <article key={id} className="marketing-card"><h2>{item.alt[locale]}</h2><MediaFrame id={id as MediaId} locale={locale} /><p>{item.credit}{item.version ? ` · ${item.version}` : ""}</p><a href={item.source} rel="noreferrer">{en ? "Original source" : "Source d’origine"}</a></article>)}</div>
  </MarketingPage>;
}
