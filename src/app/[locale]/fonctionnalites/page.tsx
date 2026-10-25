import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import { FEATURE_OVERVIEW } from "@/content/docs/chapters";
import MarketingPage from "@/components/page/MarketingPage";
import MediaFrame from "@/components/page/MediaFrame";
import Icon from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, pathname: "/fonctionnalites", title: locale === "fr" ? "Fonctionnalités : piloter votre salle avec Bobine" : "Features: run your studio with Bobine playout", description: locale === "fr" ? "Explorez les fonctions de Bobine : cours programmés, régie coach, radio, stockage, thèmes et sauvegardes. Captures et prérequis pour préparer votre essai." : "Explore Bobine features: scheduled classes, coach console, radio, storage, themes and backups. See screenshots and requirements before trying it.", keywords: ["Bobine", "fonctionnalités", "fitness playout"], image: "/images/screens/library-og.webp" });
}
export default async function FeaturesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const en = locale === "en";
  return <MarketingPage locale={locale} id="features" title={en ? "Your media, your timetable, your studio" : "Vos médias, votre planning, votre salle"} intro={en ? "Bobine brings your video classes, music and display controls into a local playout system. Start with the workflow you need, then check your device’s requirements." : "Bobine réunit vos cours vidéo, votre musique et le pilotage des écrans dans une régie locale. Partez de votre usage, puis vérifiez les prérequis de votre appareil."} image="library">
    <nav className="marketing-notice marketing-actions" aria-label={en ? "Feature shortcuts" : "Accès aux fonctionnalités"}>{FEATURE_OVERVIEW.map((feature) => <a key={feature.id} href={`#${feature.id}`} className="btn-secondary">{feature.title[locale]}</a>)}</nav>
    <div className="marketing-grid">{FEATURE_OVERVIEW.map((feature) => <section id={feature.id} key={feature.id} className="marketing-card"><h2><Icon name={feature.icon} />{feature.title[locale]}</h2><p>{feature.description[locale]}</p><dl><dt>{en ? "What to know" : "À savoir"}</dt><dd>{feature.detail[locale]}</dd></dl><Link href={`${lp(locale, feature.href)}${feature.anchor ? `#${feature.anchor}` : ""}`} aria-label={`${en ? "Read the guide" : "Consulter le guide"} : ${feature.title[locale]}`}>{en ? "Read the guide" : "Consulter le guide"}</Link></section>)}</div>
    <section className="marketing-section"><h2>{en ? "Prepare a week of classes" : "Préparer une semaine de cours"}</h2><MediaFrame id="schedule" locale={locale} caption={en ? "Bobine 5.0.5, isolated demonstration with synthetic media. The interface shown is in French." : "Bobine 5.0.5, démonstration isolée avec des médias synthétiques."} /></section>
    <section className="marketing-section"><h2>{en ? "Before your first session" : "Avant votre première séance"}</h2><div className="marketing-faq"><details><summary>{en ? "Does Bobine supply workout videos?" : "Bobine fournit-il les vidéos de cours ?"}</summary><p>{en ? "No. You supply your media and the permissions needed to play them. Bobine organizes playback." : "Non. Vous fournissez vos médias et les autorisations nécessaires à leur diffusion. Bobine en organise la lecture."}</p></details><details><summary>{en ? "Does local playback need internet?" : "La lecture locale nécessite-t-elle internet ?"}</summary><p>{en ? "Imported files play from your machine. Other screens and remote controls need your local network; downloads and updates need internet." : "Les fichiers importés sont lus depuis votre machine. Les autres écrans et télécommandes nécessitent le réseau local ; les téléchargements et mises à jour utilisent internet."}</p></details></div></section>
  </MarketingPage>;
}
