import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import MarketingPage from "@/components/page/MarketingPage";
import Icon from "@/components/ui/Icon";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) return {};
  return buildMetadata({ locale, pathname: "/a-propos", title: locale === "fr" ? "À propos de Bobine : une régie locale et libre" : "About Bobine: local, open-source studio playout", description: locale === "fr" ? "Découvrez le projet Bobine, son auteur et sa mascotte Baamix. Une régie locale sous licence libre pour organiser vos médias et vos cours en salle." : "Meet Bobine, its author and its mascot Baamix. Local, open-source playout software to organize your own media, class timetables and studio screens.", keywords: ["Bobine", "Baamix", "AGPL-3.0"], image: "/images/marketing/baamix-og.webp" });
}
export default async function AboutPage({ params }: Props) {
  const { locale } = await params; if (!isLocale(locale)) notFound(); const en = locale === "en";
  return <MarketingPage locale={locale} id="about" title={en ? "A local tool for the life of your studio" : "Un outil local pour la vie de votre salle"} intro={en ? "Bobine is a project by Clément Barillot (FantasmaGlad). It brings the organization and playback of a club’s own media onto its own equipment." : "Bobine est un projet de Clément Barillot (FantasmaGlad). Il rassemble l’organisation et la diffusion des médias d’une salle sur son propre équipement."} image="baamix">
    <div className="marketing-grid">
      <section className="marketing-card"><h2><Icon name="video" />{en ? "Why Bobine?" : "Pourquoi Bobine ?"}</h2><p>{en ? "The name refers to a film reel. The software connects a media library, class timetable and playback controls so that a club can prepare its sessions in one place." : "Le nom évoque la bobine de film. Le logiciel relie une médiathèque, un planning de cours et des commandes de diffusion pour préparer les séances au même endroit."}</p><Link href={lp(locale, "/fonctionnalites")}>{en ? "Explore what it does" : "Découvrir ses fonctions"}</Link></section>
      <section className="marketing-card"><h2><Icon name="cpu" />{en ? "Keep control locally" : "Garder la main localement"}</h2><p>{en ? "Your imported media and configuration live on your equipment. You choose the machine, maintain your backups and supply the content that your club is allowed to show." : "Vos médias importés et votre configuration restent sur votre équipement. Vous choisissez la machine, entretenez vos sauvegardes et fournissez les contenus que votre salle est autorisée à diffuser."}</p></section>
      <section className="marketing-card"><h2><Icon name="layers" />{en ? "Meet Baamix" : "Rencontrer Baamix"}</h2><p>{en ? "Baamix, the white hamster, is the project’s mascot. It accompanies the interface and the documentation without replacing the information needed to install or operate the software." : "Baamix, le hamster blanc, est la mascotte du projet. Il accompagne l’interface et la documentation sans remplacer les informations nécessaires pour installer ou utiliser le logiciel."}</p></section>
      <section className="marketing-card"><h2><Icon name="link" />{en ? "Read, test, contribute" : "Lire, tester, contribuer"}</h2><p>{en ? "Bobine software is distributed under AGPL-3.0. Its source code, release notes and issue tracker are available on GitHub. Device reports, translations and code contributions help improve it." : "Le logiciel Bobine est distribué sous AGPL-3.0. Son code, ses notes de version et son suivi des problèmes sont disponibles sur GitHub. Les retours matériels, traductions et contributions au code aident à l’améliorer."}</p><a href="https://github.com/FantasmaGlad/Bobine" rel="noreferrer">GitHub</a></section>
    </div>
  </MarketingPage>;
}
