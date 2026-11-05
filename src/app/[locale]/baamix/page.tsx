import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { IS_ONION } from "@/lib/onion";
import { buildMetadata, lp } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import BobineChatbot from "@/components/BobineChatbot";
import { CLEARNET_URL } from "@/lib/onion";

const copy = {
  fr: {
    title: "Baamix, l'assistant IA de Bobine — Chat plein écran",
    description:
      "Discutez en plein écran avec Baamix, l'assistant IA gratuit de Bobine : installation, fonctionnalités, choix d'architecture matérielle (mini PC, ARM, Mac mini), configuration et conseils pour équiper votre salle de sport. Sans compte.",
    keywords: [
      "Baamix",
      "Assistant IA Bobine",
      "Chatbot Bobine",
      "Chatbot salle de sport",
      "Conseiller matériel régie vidéo fitness",
      "Mini PC salle de sport",
      "Assistant IA fitness gratuit",
      "Bobine Clément Barillot",
    ],
    aboutHeading: "À propos de Baamix",
    intro:
      "Baamix est la mascotte et l'assistant IA de Bobine, le logiciel libre de régie vidéo pour salles de sport. Il répond en français et en anglais, sans compte et gratuitement, en s'appuyant sur la documentation officielle et les spécifications techniques de Bobine.",
    canTitle: "Ce que Baamix peut faire",
    can: [
      "Répondre sur Bobine : installation (Debian, Ubuntu, Windows, macOS, Android TV), planning des cours, télécommande coach, sauvegarde en un clic, mises à jour.",
      "Aider à choisir votre architecture matérielle : mini PC x86_64 reconditionné, PC Snapdragon ARM64, Mac mini Apple Silicon ou cartes monocartes (Raspberry Pi 5, Orange Pi 5).",
      "Expliquer les prérequis de diffusion vidéo, de décodage matériel et d'affichage multi-écrans pour votre studio.",
      "Guider dans la configuration réseau locale, l'accès hors ligne 24/7 et la sécurisation de votre régie.",
    ],
    examplesTitle: "Exemples de questions",
    examples: [
      "Quel matériel choisir pour équiper une salle de cycling avec un écran 4K autonome ?",
      "Comment installer Bobine sur un mini PC Debian et configurer le démarrage automatique 24/7 ?",
      "Quelle est la différence entre un PC Snapdragon ARM et un mini PC x86_64 pour Bobine ?",
      "Comment sauvegarder ma configuration et programmer des cours vidéo hebdomadaires ?",
    ],
    faqTitle: "Questions fréquentes sur Baamix",
    faq: [
      {
        q: "Qu'est-ce que Baamix ?",
        a: "Baamix est l'assistant IA et la mascotte de Bobine, un logiciel libre (AGPL-3.0) de régie vidéo pour salles de sport. Il aide à installer, utiliser et déployer Bobine.",
      },
      {
        q: "Baamix est-il gratuit, faut-il un compte ?",
        a: "Baamix est gratuit et fonctionne sans compte ni inscription.",
      },
      {
        q: "Baamix peut-il me conseiller sur le matériel ?",
        a: "Oui, il analyse vos besoins d'affichage (résolution, nombre d'écrans, environnement sonore) et vous oriente vers les architectures adaptées (mini PC, ARM64, Mac mini, Android TV).",
      },
      {
        q: "Mes conversations sont-elles conservées ?",
        a: "Bobine ne conserve pas les conversations. Les messages sont transmis à un service d'IA tiers pour générer la réponse ; voir la politique de confidentialité. N'écrivez aucune donnée personnelle dans le chat.",
      },
      {
        q: "Baamix peut-il se tromper ?",
        a: "Oui, c'est une IA : ses réponses sont indicatives et doivent être vérifiées avec la documentation officielle.",
      },
    ],
    whoTitle: "Qui est derrière Baamix ?",
    who: "Baamix et Bobine sont conçus et développés par Clément Barillot (FantasmaGlad), développeur indépendant. Contact :",
    privacy: "Politique de confidentialité",
    legal: "Mentions légales",
    breadcrumb: "Baamix",
  },
  en: {
    title: "Baamix, the Bobine AI Assistant — Full-screen Chat",
    description:
      "Chat full screen with Baamix, the free Bobine AI assistant: installation, features, hardware architecture advice (mini PC, ARM, Mac mini), setup and tips to equip your gym. No account needed.",
    keywords: [
      "Baamix",
      "Bobine AI assistant",
      "Bobine chatbot",
      "Gym chatbot",
      "Gym video playout hardware advisor",
      "Mini PC gym",
      "Free fitness AI assistant",
      "Bobine Clément Barillot",
    ],
    aboutHeading: "About Baamix",
    intro:
      "Baamix is the mascot and AI assistant of Bobine, the open-source video playout software for gyms. It answers in French and English, free and without an account, using the official documentation and technical specifications of Bobine.",
    canTitle: "What Baamix can do",
    can: [
      "Answer questions about Bobine: installation (Debian, Ubuntu, Windows, macOS, Android TV), class scheduling, coach remote, one-click backup, updates.",
      "Help you choose hardware architecture: refurbished x86_64 mini PC, Snapdragon ARM64 PC, Apple Silicon Mac mini, or single-board computers (Raspberry Pi 5, Orange Pi 5).",
      "Explain video playback requirements, hardware video decoding, and multi-display setups for your fitness studio.",
      "Guide you through local network configuration, 24/7 offline operation, and kiosk security.",
    ],
    examplesTitle: "Example questions",
    examples: [
      "What hardware should I choose to equip a cycling studio with a standalone 4K display?",
      "How do I install Bobine on a Debian mini PC and set up automatic 24/7 boot?",
      "What is the difference between a Snapdragon ARM PC and an x86_64 mini PC for Bobine?",
      "How do I back up my configuration and schedule weekly video fitness classes?",
    ],
    faqTitle: "Baamix FAQ",
    faq: [
      {
        q: "What is Baamix?",
        a: "Baamix is the AI assistant and mascot of Bobine, an open-source (AGPL-3.0) video playout software for gyms. It helps you install, use and deploy Bobine.",
      },
      {
        q: "Is Baamix free, do I need an account?",
        a: "Baamix is free and works without an account or sign-up.",
      },
      {
        q: "Can Baamix advise on hardware?",
        a: "Yes, it evaluates your display requirements (resolution, screen count, acoustics) and guides you toward suitable hardware architectures (mini PC, ARM64, Mac mini, Android TV).",
      },
      {
        q: "Are my conversations kept?",
        a: "Bobine does not keep conversations. Messages are sent to a third-party AI service to produce the answer; see the privacy policy. Do not type personal data in the chat.",
      },
      {
        q: "Can Baamix be wrong?",
        a: "Yes, it is an AI: its answers are indicative and should be checked against the official documentation.",
      },
    ],
    whoTitle: "Who is behind Baamix?",
    who: "Baamix and Bobine are designed and developed by Clément Barillot (FantasmaGlad), an independent developer. Contact:",
    privacy: "Privacy policy",
    legal: "Legal notice",
    breadcrumb: "Baamix",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = copy[locale as Locale];
  return buildMetadata({
    locale: locale as Locale,
    pathname: "/baamix",
    title: t.title,
    description: t.description,
    keywords: [...t.keywords],
  });
}

export default async function BaamixPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const currentLocale = locale as Locale;
  if (IS_ONION) {
    // Miroir Tor : le chat s'ouvre sur le message de Baamix qui explique pourquoi il ne peut pas répondre.
    return (
      <div className="baamix-page">
        <BobineChatbot locale={currentLocale} variant="page" />
      </div>
    );
  }
  const t = copy[currentLocale];
  const url = `https://bobine.fit/${currentLocale}/baamix`;

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Baamix",
    alternateName: ["Baamix AI", "Assistant IA Bobine", "Bobine chatbot"],
    url,
    description: t.description,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "AI assistant",
    operatingSystem: "Web",
    inLanguage: ["fr-FR", "en-US"],
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0.00", priceCurrency: "EUR" },
    featureList: [...t.can],
    isPartOf: { "@type": "SoftwareApplication", name: "Bobine Fit", url: CLEARNET_URL },
    creator: {
      "@type": "Person",
      name: "Clément Barillot",
      alternateName: "FantasmaGlad",
      email: "clement.barillot@bobine.fit",
      url: "https://github.com/FantasmaGlad",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbs = [
    { name: "Bobine", url: `/${currentLocale}` },
    { name: t.breadcrumb, url: `/${currentLocale}/baamix` },
  ];

  return (
    <div className="baamix-page">
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <BobineChatbot locale={currentLocale} variant="page" />

      <div className="container">
      <section className="baamix-page__about" aria-labelledby="baamix-about">
        <h2 id="baamix-about">{t.aboutHeading}</h2>
        <p>{t.intro}</p>

        <h3>{t.canTitle}</h3>
        <ul>
          {t.can.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3>{t.examplesTitle}</h3>
        <ul>
          {t.examples.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3>{t.faqTitle}</h3>
        <dl>
          {t.faq.map((item) => (
            <div key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>

        <h3>{t.whoTitle}</h3>
        <p>
          {t.who} <a href="mailto:clement.barillot@bobine.fit">clement.barillot@bobine.fit</a>
        </p>
        <p>
          <Link href={lp(currentLocale, `/confidentialite`)}>{t.privacy}</Link>
          {" · "}
          <Link href={lp(currentLocale, `/mentions-legales`)}>{t.legal}</Link>
        </p>
      </section>
      </div>
    </div>
  );
}
