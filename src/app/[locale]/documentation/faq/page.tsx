import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEn = locale === "en";
  return buildMetadata({
    locale: locale as Locale,
    pathname: "/documentation/faq",
    title: isEn ? "FAQ & Troubleshooting — Bobine" : "FAQ & Dépannage — Bobine",
    description: isEn
      ? "Frequently asked questions and troubleshooting guide for Bobine: hardware requirements, network configuration, offline playout, and HDMI-CEC automation."
      : "Foire aux questions et guide de dépannage de Bobine : matériel requis, configuration réseau local, diffusion 100% hors-ligne et pilotage TV HDMI-CEC.",
    keywords: [
      "FAQ Bobine",
      "Dépannage régie vidéo",
      "Bobine gratuit sans abonnement",
      "Installation Debian Bobine",
      "Erreur mDNS bobine.local",
    ],
  });
}

const faqData = {
  fr: [
    {
      q: "Bobine est-il vraiment gratuit ?",
      a: "Oui. Logiciel libre sous licence AGPL-3.0, aucun abonnement, aucune redevance par écran, aucun compte requis. Le seul investissement est votre matériel standard (mini PC, écran, câbles).",
    },
    {
      q: "En quoi Bobine remplace-t-il Les Mills Cinema ?",
      a: "Même usage en salle (cours planifiés, borne tactile membre à la demande), mais sans dépendance à un éditeur : le code est ouvert, vous maîtrisez votre matériel et tout fonctionne 100% hors-ligne sur SSD local.",
    },
    {
      q: "Ai-je besoin d'une connexion internet pour faire tourner Bobine ?",
      a: "Non, pas au quotidien. Internet n'est requis qu'une seule fois lors de l'installation initiale. Ensuite, la salle diffuse ses cours sans aucune connexion.",
    },
    {
      q: "Quel matériel informatique faut-il acheter ?",
      a: "Un mini PC x86-64 standard (référence : Dell Wyse 5070 reconditionné à ~40-50 € avec processeur Intel Celeron J4105), 4 à 8 Go de RAM, et un écran HDMI.",
    },
    {
      q: "Que se passe-t-il en cas de coupure de courant ou de plantage ?",
      a: "Un chien de garde systemd surveille en continu la santé des services et relance automatiquement les composants en cas d'anomalie. Les services redémarrent instantanément et de façon autonome dès le retour du courant.",
    },
  ],
  en: [
    {
      q: "Is Bobine truly 100% free with no recurring fees?",
      a: "Yes. Free and open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero royalties per screen, and no user accounts. Your only investment is standard refurbished hardware.",
    },
    {
      q: "How does Bobine replace proprietary systems like Les Mills Cinema?",
      a: "Same workout room experience — automated weekly timetables, on-demand member touchscreen kiosk — but without publisher lock-in: the code is open, you own your devices, and playback is 100% offline from local SSD.",
    },
    {
      q: "Do I need an active internet connection to run Bobine?",
      a: "No, not for daily operations. Internet is only required once during the initial setup. Afterwards, your gym plays workout videos entirely offline.",
    },
    {
      q: "What hardware do I need to equip my gym?",
      a: "A standard refurbished x86-64 mini PC (Reference unit: Dell Wyse 5070 with Intel Celeron J4105, ~40-50 EUR), 4-8GB RAM, and an HDMI TV display.",
    },
    {
      q: "What happens if there is a power cut or system crash?",
      a: "A local systemd supervisor continuously monitors process health and restarts failing components automatically. All services boot autonomously upon power restoration after a blackout.",
    },
  ],
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";
  const items = faqData[locale as Locale];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">{isEn ? "Support & Knowledge" : "Support & Connaissances"}</span>
          <h1 style={{ margin: 0 }}>{isEn ? "FAQ & Troubleshooting" : "FAQ / Dépannage"}</h1>
        </div>
        <ShareButton
          locale={locale as Locale}
          pathname="/documentation/faq"
          title={isEn ? "Bobine FAQ & Troubleshooting" : "FAQ & Dépannage Bobine"}
          description={isEn ? "Answers to common questions about Bobine open-source gym playout." : "Réponses aux questions courantes sur la régie vidéo open-source Bobine."}
        />
      </div>

      <h2 id="general">{isEn ? "General Questions" : "Général"}</h2>

      <p><strong>{isEn ? "Is Bobine truly 100% free?" : "Bobine est-il vraiment gratuit ?"}</strong><br />
      {isEn
        ? "Yes. Free, open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero per-screen license royalties, and no user accounts required. The only investment is your standard hardware (mini PC, display, cables)."
        : "Oui. Logiciel libre sous licence AGPL-3.0, aucun abonnement, aucune redevance par écran, aucun compte requis. Le seul investissement est votre matériel standard (mini PC, écran, câbles)."}</p>

      <p><strong>{isEn ? "How does Bobine replace Les Mills Cinema?" : "En quoi Bobine remplace-t-il Les Mills Cinema ?"}</strong><br />
      {isEn
        ? "Same workout room usage — automated scheduled classes, on-demand member touchscreen kiosk — but without publisher lock-in: the code is open, you own your hardware, and everything plays 100% offline from local SSD."
        : "Même usage en salle — cours planifiés, borne tactile membre à la demande — mais sans dépendance à un éditeur : le code est ouvert, vous maîtrisez votre matériel et tout fonctionne 100% hors-ligne sur SSD local."}</p>

      <p><strong>{isEn ? "Do I need an active internet connection to run Bobine?" : "Ai-je besoin d'une connexion internet pour faire tourner Bobine ?"}</strong><br />
      {isEn
        ? "No, not for daily gym operations. Internet is only required once during the initial Debian and Bobine package download. Afterward, the studio runs workouts completely offline."
        : "Non, pas au quotidien. Internet n'est requis qu'une seule fois lors de l'installation initiale. Ensuite, la salle diffuse ses cours sans aucune connexion."}</p>

      <p><strong>{isEn ? "What hardware do I need?" : "Quel matériel informatique faut-il acheter ?"}</strong><br />
      {isEn
        ? "A standard x86-64 mini PC (Reference unit: Dell Wyse 5070 with Intel J4105), 4GB RAM minimum, and an HDMI display. See full details in the "
        : "Un mini PC x86-64 standard (référence : Dell Wyse 5070 reconditionné à ~40-50 € avec processeur Intel Celeron J4105), 4 à 8 Go de RAM, et un écran HDMI. Voir le détail dans le "}
      <Link href={`/${locale}/documentation/demarrage-rapide`}>{isEn ? "Quick Start Guide" : "guide de démarrage rapide"}</Link>.</p>

      <h2 id="installation">{isEn ? "Installation & Network" : "Installation & Réseau"}</h2>

      <p><strong>{isEn ? "I cannot connect to http://bobine.local, what should I do?" : "Je n'arrive pas à joindre http://bobine.local, que faire ?"}</strong><br />
      {isEn
        ? "If your router or corporate Wi-Fi blocks mDNS (Bonjour/Zeroconf), use the machine's local IP address directly (e.g. http://192.168.1.50). The IP is displayed at the end of install.sh, or found by running hostname -I on the mini PC."
        : "Si votre réseau ou box bloque le mDNS (Bonjour/Zeroconf), utilisez l'adresse IP de la machine directement (ex. http://192.168.1.50). Elle s'affiche à la fin de install.sh, ou se trouve avec hostname -I exécuté sur le mini PC."}</p>

      <p><strong>{isEn ? "Can I update Bobine without losing workout videos or schedules?" : "Puis-je réinstaller ou mettre à jour Bobine sans perdre mes vidéos ni mon planning ?"}</strong><br />
      {isEn
        ? "Yes, install.sh is idempotent: run a git pull then re-run sudo ./install.sh. Your video library, settings, and schedules stored in the database are safely preserved."
        : "Oui, install.sh est idempotent : relancez-le après un git pull pour reconstruire et redémarrer proprement, vos données (vidéos, planning) sont scrupuleusement conservées."}</p>

      <h2 id="daily-operation">{isEn ? "Daily Operations & Hardware" : "Exploitation quotidienne & Matériel"}</h2>

      <p><strong>{isEn ? "What happens if a component or power crashes?" : "Un composant plante ou le courant coupe, que se passe-t-il ?"}</strong><br />
      {isEn
        ? "A local systemd watchdog supervises process health continuously and restarts failing services automatically. All services are configured to boot automatically upon power restoration after a blackout."
        : "Un chien de garde systemd surveille en continu la santé des composants et les relance automatiquement. Tous les services redémarrent aussi instantanément après une coupure de courant."}</p>

      <p><strong>{isEn ? "Can I drive two different screens with different content?" : "Puis-je piloter deux écrans différents avec un contenu distinct ?"}</strong><br />
      {isEn
        ? "Yes: the wired HDMI TV screen and the network browser display are completely independent, configured separately in Settings → Screen Routing."
        : "Oui : l'écran câblé (HDMI) et l'écran réseau sont indépendants, configurables séparément dans Paramètres → Sortie d'écran."}</p>

      <h2 id="support-help">{isEn ? "Getting Help" : "Aide & Support"}</h2>
      <p><strong>{isEn ? "My question is not answered here?" : "Votre question n'est pas dans cette liste ?"}</strong><br />
      {isEn
        ? "Ask Baamix via the chat bubble on the right, or open an "
        : "Posez votre question à Baamix via la bulle de discussion à droite, ou ouvrez une "}
      <a href="https://github.com/FantasmaGlad/Bobine/issues" target="_blank" rel="noreferrer">{isEn ? "Issue on GitHub" : "Issue sur GitHub"}</a>.</p>
    </>
  );
}
