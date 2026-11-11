import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import "@/styles/split/pages-legal.css";

const CONTACT = "clement.barillot@bobine.fit";

const copy = {
  fr: {
    badge: "Le projet et son auteur",
    title: "À propos",
    subtitle: "Bobine est conçu, développé et publié par une seule personne. Cette page dit qui, et pourquoi le projet est construit ainsi.",
    metaTitle: "À propos — Bobine",
    metaDescription: "Clément Barillot, créateur de Bobine : contact, et raisons des choix techniques du projet (plateformes, canaux de mise à jour, miroir Tor).",
    sections: [
      {
        heading: "Auteur",
        body: "Clément Barillot, créateur de Bobine. Il développe et maintient seul l'application, ce site, les dépôts de paquets et le miroir Tor.",
        contact: `Contact : ${CONTACT}`,
        subtext: "Code source : github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "Pourquoi autant d'ingénierie pour une régie vidéo ?",
        body: "Le besoin est simple : diffuser des cours collectifs dans une salle de sport. La manière d'y répondre est volontairement poussée. Bobine sert aussi à démontrer la tenue d'un flux de travail complet, sur plusieurs systèmes et plusieurs plateformes, du code source jusqu'au paquet installé chez l'utilisateur.",
      },
      {
        heading: "Pourquoi autant de systèmes et d'architectures ?",
        body: "Pour que la question « est-ce compatible ? » ne se pose pas. Un ancien ordinateur, une tablette, un boîtier TV, un mini PC d'occasion : si l'appareil dort dans un garage, Bobine doit pouvoir s'y installer, quelle que soit sa puissance. Réutiliser un appareil existant évite d'en acheter un.",
        subtext: "C'est l'objectif, pas une garantie : les prérequis de chaque paquet sont indiqués avec son téléchargement.",
      },
      {
        heading: "Pourquoi trois canaux de mise à jour ?",
        body: "Pour apprendre à tenir un processus de diffusion propre : Stable en bout de chaîne, Bêta par lots choisis, Canary reconstruite à chaque modification du code.",
      },
      {
        heading: "Pourquoi un miroir Tor pour des cours de cuisses-abdos-fessiers ?",
        body: "C'est disproportionné pour une application de régie, et c'est assumé. Publier une application et ses dépôts par des miroirs en service onion, avec une installation qui ne révèle pas l'adresse de l'utilisateur, est un savoir-faire à maîtriser avant de publier un jour des applications plus sensibles. Bobine sert de terrain d'apprentissage.",
      },
    ],
  },
  en: {
    badge: "The project and its author",
    title: "About",
    subtitle: "Bobine is designed, developed and published by one person. This page says who, and why the project is built this way.",
    metaTitle: "About — Bobine",
    metaDescription: "Clément Barillot, creator of Bobine: contact, and the reasons behind the project's technical choices (platforms, update channels, Tor mirror).",
    sections: [
      {
        heading: "Author",
        body: "Clément Barillot, creator of Bobine. He develops and maintains the application, this website, the package repositories and the Tor mirror on his own.",
        contact: `Contact: ${CONTACT}`,
        subtext: "Source code: github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "Why so much engineering for a video player?",
        body: "The need is simple: play group classes in a fitness room. The way it is met is deliberately thorough. Bobine also serves to demonstrate a complete workflow, across several systems and platforms, from source code to the package installed on the user's device.",
      },
      {
        heading: "Why so many systems and architectures?",
        body: "So that the question \"is it compatible?\" does not come up. An old computer, a tablet, a TV box, a second-hand mini PC: if the device sits in a garage, Bobine should install on it, whatever its power. Reusing an existing device avoids buying one.",
        subtext: "This is the goal, not a guarantee: the requirements of each package are listed with its download.",
      },
      {
        heading: "Why three update channels?",
        body: "To learn to run a clean release process: Stable at the end of the line, Beta in chosen batches, Canary rebuilt on every change to the code.",
      },
      {
        heading: "Why a Tor mirror for glutes-and-abs classes?",
        body: "It is out of proportion for a playout application, and deliberately so. Publishing an application and its repositories through onion-service mirrors, with an installation that does not reveal the user's address, is a skill to master before publishing more sensitive applications one day. Bobine is the training ground.",
      },
    ],
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = copy[locale as Locale];
  return buildMetadata({ locale: locale as Locale, pathname: "/a-propos", title: t.metaTitle, description: t.metaDescription });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: t.title, url: lp(locale, "/a-propos") },
  ];

  return (
    <div className="container legal-div-1">
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div className="legal-div-2">
        <span className="legal-span-1">{t.badge}</span>
        <h1 className="legal-h1-1">{t.title}</h1>
        <p className="legal-p-1">{t.subtitle}</p>
      </div>

      <div className="legal-div-3">
        {t.sections.map((section) => (
          <article key={section.heading} className="legal-card legal-card--accent legal-article-1">
            <h2 className="legal-h2-1">{section.heading}</h2>
            <p className="legal-p-2">{section.body}</p>
            {"contact" in section && <p className="legal-p-3">{section.contact}</p>}
            {"subtext" in section && <p className="legal-p-4">{section.subtext}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
