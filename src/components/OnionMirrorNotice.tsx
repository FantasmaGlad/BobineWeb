import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { CLEARNET_URL } from "@/lib/onion";

export type OnionTopic = "materiel" | "baamix";

const copy = {
  fr: {
    eyebrow: "Miroir Tor de Bobine",
    materiel: {
      title: "La boutique reste sur le web classique",
      lead: "Vous consultez la version .onion de Bobine. Cette page ne présente volontairement aucun produit.",
      points: [
        "La sélection de matériel repose sur des liens d'affiliation vers Amazon et AliExpress. Un lien suivi ne correspond pas à ce qu'on attend d'un accès par Tor.",
        "Bobine est un logiciel libre : le matériel n'est jamais imposé, et tout ce qu'il faut pour installer et utiliser le logiciel est ici, sans achat.",
        "Le miroir ne contacte aucun service extérieur et ne garde aucun journal de visite.",
      ],
      cta: "Ouvrir la boutique sur bobine.fit",
      ctaNote: "Ce lien quitte le réseau Tor. Rien n'est ouvert automatiquement.",
    },
    baamix: {
      title: "Baamix est disponible sur bobine.fit",
      lead: "L'assistant Baamix n'est pas proposé sur le miroir Tor.",
      points: [
        "Baamix s'appuie sur des services d'IA tiers : vos messages quitteraient le réseau Tor pour être traités ailleurs, ce qui contredirait l'intérêt d'être ici.",
        "Toute l'information utile reste lisible sans lui : documentation, FAQ et guide de démarrage rapide sont complets sur ce miroir.",
        "Le miroir ne contacte aucun service extérieur et ne garde aucun journal de visite.",
      ],
      cta: "Ouvrir Baamix sur bobine.fit",
      ctaNote: "Ce lien quitte le réseau Tor. Rien n'est ouvert automatiquement.",
    },
    docs: "Lire la documentation",
    manifest: "Lire le manifeste",
    footer:
      "Tor protège votre adresse IP et le contenu du transport, pas vos habitudes de navigation. Bobine n'est pas affilié au Tor Project.",
  },
  en: {
    eyebrow: "Bobine Tor mirror",
    materiel: {
      title: "The store stays on the regular web",
      lead: "You are viewing the .onion version of Bobine. This page deliberately lists no product.",
      points: [
        "The hardware selection relies on affiliate links to Amazon and AliExpress. A tracked link is not what one expects from a Tor visit.",
        "Bobine is free software: hardware is never imposed, and everything needed to install and use the software is here, with no purchase.",
        "The mirror contacts no outside service and keeps no visit log.",
      ],
      cta: "Open the store on bobine.fit",
      ctaNote: "This link leaves the Tor network. Nothing opens automatically.",
    },
    baamix: {
      title: "Baamix is available on bobine.fit",
      lead: "The Baamix assistant is not offered on the Tor mirror.",
      points: [
        "Baamix relies on third-party AI services: your messages would leave the Tor network to be processed elsewhere, defeating the point of being here.",
        "All the useful information stays readable without it: documentation, FAQ and quick-start guide are complete on this mirror.",
        "The mirror contacts no outside service and keeps no visit log.",
      ],
      cta: "Open Baamix on bobine.fit",
      ctaNote: "This link leaves the Tor network. Nothing opens automatically.",
    },
    docs: "Read the documentation",
    manifest: "Read the manifesto",
    footer:
      "Tor protects your IP address and the content of the transport, not your browsing habits. Bobine is not affiliated with the Tor Project.",
  },
} as const;

/** Logo du projet Tor (fichier fourni par le mainteneur). */
function OnionMark() {
  return (
    <span className="onion-notice__mark">
      <Image src="/images/tor-onion.webp" alt="Tor" width={96} height={96} unoptimized />
    </span>
  );
}

export default function OnionMirrorNotice({
  locale,
  topic,
  clearnetPath,
}: {
  locale: Locale;
  topic: OnionTopic;
  clearnetPath: string;
}) {
  const t = copy[locale];
  const c = t[topic];

  return (
    <section className="onion-notice">
      <div className="container onion-notice__inner">
        <OnionMark />
        <p className="onion-notice__eyebrow">{t.eyebrow}</p>
        <h1 className="onion-notice__title">{c.title}</h1>
        <p className="onion-notice__lead">{c.lead}</p>

        <ul className="onion-notice__points">
          {c.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="onion-notice__actions">
          <Link href={`/${locale}/documentation`} className="btn-primary">
            {t.docs}
          </Link>
          <Link href={`/${locale}/documentation/manifeste`} className="btn-secondary">
            {t.manifest}
          </Link>
        </div>

        <p className="onion-notice__clearnet">
          <a href={`${CLEARNET_URL}/${locale}${clearnetPath}`} rel="noopener noreferrer">
            {c.cta}
          </a>
          <span>{c.ctaNote}</span>
        </p>

        <p className="onion-notice__footer">{t.footer}</p>
      </div>
    </section>
  );
}
