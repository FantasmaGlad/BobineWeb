import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import "@/styles/split/pages-legal.css";

const copy = {
  fr: {
    badge: "Transparence & Cadre Légal",
    title: "Mentions Légales",
    subtitle: "Informations légales relatives à l'éditeur, à l'hébergement et aux droits d'utilisation du projet open-source Bobine.",
    updated: "Dernière mise à jour : 5 novembre 2026",
    sections: [
      {
        heading: "1. Éditeur du Site & Direction de la Publication",
        body: "Le site bobine.fit est développé et maintenu à titre indépendant par Clément Barillot (FantasmaGlad), développeur et auteur du projet libre Bobine. Directeur de la publication : Clément Barillot.",
        contact: "Contact direct : clement.barillot@bobine.fit",
        subtext: "Dépôt officiel du code source et suivi des versions : github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "2. Hébergement & Infrastructure",
        body: "Le site web bobine.fit est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com). Le trafic du site transite par le réseau de Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (cloudflare.com), qui assure la résolution DNS, l'accélération et la protection contre les attaques. Un miroir en service onion (Tor) est hébergé par l'éditeur lui-même, sur sa propre machine.",
        contact: "Les dépôts de paquets Linux packages.bobine.fit (APT, DNF et Pacman) sont servis par GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis), tout comme le code source du projet.",
        subtext: "Le traitement des données par ces prestataires est décrit dans la Politique de Confidentialité.",
      },
      {
        heading: "3. Propriété Intellectuelle & Licence Logicielle",
        body: "L'ensemble du code source du logiciel Bobine est mis à disposition sous licence libre GNU Affero General Public License v3.0 (AGPL-3.0).",
        contact: "Liberté d'usage : vous êtes libre d'utiliser, d'étudier, de modifier, de compiler et de redistribuer Bobine sans redevance, dans le respect de cette licence.",
        subtext: "Les marques, noms de produits et logos cités (ex : HP, Intel, AMD, Apple, Dell, Qualcomm, Fedora, Arch Linux, Debian, Ubuntu) appartiennent à leurs propriétaires respectifs et sont utilisés uniquement pour identifier des produits, à des fins d'interopérabilité technique et de description. La préférence de thème utilise le cookie bobine-theme, partagé entre bobine.fit et ses sous-domaines pendant un an ; voir la politique de confidentialité. Les comparatifs identifient les solutions tierces par leur nom en texte, sans reproduire leur logo ni suggérer de partenariat.",
      },
      {
        heading: "4. Rôle du Site : Information et Documentation Technique, Aucune Vente",
        body: "Le site bobine.fit est une plateforme d'information, de téléchargement et de documentation technique. Il ne vend aucun produit, ne propose aucun abonnement payant et ne perçoit aucun paiement de ses visiteurs. Bobine est un logiciel libre et gratuit.",
        contact: "Le logiciel Bobine est fourni « en l'état », sans garantie expresse ou implicite, conformément à la licence AGPL-3.0.",
        subtext: "Les gérants de salle de sport et exploitants restent responsables de la conformité de leurs équipements de diffusion audiovisuelle.",
      },
      {
        heading: "5. Recommandations Techniques & Assistant Baamix",
        body: "Les configurations matérielles recommandées dans la documentation sont données à titre purement indicatif pour guider les utilisateurs vers des machines adaptées (mini PC x86_64, PC ARM Snapdragon, Mac mini Apple Silicon, Raspberry Pi, Orange Pi, etc.).",
        contact: "Les recommandations reflètent des retours d'expérience et ne constituent ni une garantie de compatibilité ni un conseil personnalisé engageant son auteur.",
        subtext: "Baamix utilise un modèle d'IA pour générer ses réponses et peut interroger Google Cloud Vertex AI Search pour retrouver la documentation pertinente. Il peut se tromper : ses réponses n'ont aucune valeur contractuelle et doivent être vérifiées avec la documentation officielle.",
      },
    ],
  },
  en: {
    badge: "Transparency & Legal Framework",
    title: "Legal Notice",
    subtitle: "Legal information regarding the publisher, hosting, and the terms of use of the open-source Bobine project.",
    updated: "Last updated: 5 November 2026",
    sections: [
      {
        heading: "1. Site Publisher & Publication Director",
        body: "The website bobine.fit is independently created and maintained by Clément Barillot (FantasmaGlad), lead author and developer of the open-source Bobine project. Publication director: Clément Barillot.",
        contact: "Direct contact: clement.barillot@bobine.fit",
        subtext: "Official repository and version tracking: github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "2. Hosting & Infrastructure",
        body: "The website bobine.fit is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (vercel.com). Site traffic goes through the network of Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA (cloudflare.com), which provides DNS resolution, acceleration and protection against attacks. A mirror served as an onion service (Tor) is hosted by the publisher on their own machine.",
        contact: "The packages.bobine.fit Linux package repositories (APT, DNF and Pacman) are served by GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA), as is the project's source code.",
        subtext: "How these providers process data is described in the Privacy Policy.",
      },
      {
        heading: "3. Intellectual Property & Software License",
        body: "The entire source code of Bobine is distributed under the GNU Affero General Public License v3.0 (AGPL-3.0).",
        contact: "Freedom of use: you are free to run, study, adapt, compile, and redistribute Bobine without license fees, in accordance with that license.",
        subtext: "Third-party trademarks, product names and logos mentioned (e.g., HP, Intel, AMD, Apple, Dell, Qualcomm, Fedora, Arch Linux, Debian, Ubuntu) remain the property of their respective owners and are used solely to identify products, for technical interoperability and descriptive comparison. The theme preference uses the bobine-theme cookie, shared between bobine.fit and its subdomains for one year; see the privacy policy. Comparisons identify third-party solutions by their names in plain text, without reproducing their logos or suggesting a partnership.",
      },
      {
        heading: "4. Role of the Site: Information and Technical Documentation, No Sales",
        body: "The website bobine.fit is an informational, download and technical documentation platform. It does not sell any product, offers no paid subscription and receives no payment from its visitors. Bobine is free and open-source software.",
        contact: "The Bobine software is provided 'as is', without warranty of any kind, in accordance with the AGPL-3.0 license.",
        subtext: "Gym owners and operators remain responsible for the compliance of their audiovisual equipment.",
      },
      {
        heading: "5. Technical Recommendations & the Baamix Assistant",
        body: "Hardware configurations recommended in the documentation are provided for informational purposes only to guide users toward suitable machines (x86_64 mini PCs, Snapdragon ARM PCs, Apple Silicon Mac mini, Raspberry Pi, Orange Pi, etc.).",
        contact: "Hardware suggestions reflect community experience and are neither a compatibility guarantee nor personalized advice binding its author.",
        subtext: "Baamix uses an AI model to generate its answers and may query Google Cloud Vertex AI Search to retrieve relevant documentation. It can be wrong: its answers have no contractual value and should be checked against the official documentation.",
      },
    ],
  },
} as const;

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
    pathname: "/mentions-legales",
    title: isEn ? "Legal Notice — Bobine" : "Mentions Légales — Bobine",
    description: isEn
      ? "Legal information, hosting, and terms of use for the Bobine open-source project."
      : "Informations légales, hébergement et conditions d'utilisation du projet libre Bobine.",
  });
}

export default async function LegalNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale as Locale];
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: isEn ? "Legal Notice" : "Mentions Légales", url: lp(locale, `/mentions-legales`) },
  ];

  return (
    <div className="container legal-div-1">
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div className="legal-div-2">
        <span className="legal-span-1"
        >
          {t.badge}
        </span>
        <h1 className="legal-h1-1">
          {t.title}
        </h1>
        <p className="legal-p-1">
          {t.subtitle}
        </p>
        <span className="legal-span-2">
          {t.updated}
        </span>
      </div>

      <div className="legal-div-3">
        {t.sections.map((section, idx) => (
          <article
            key={idx}
            className="legal-card legal-card--accent legal-article-1"
          >
            <h2 className="legal-h2-1">
              {section.heading}
            </h2>
            <p className="legal-p-2">
              {section.body}
            </p>
            {section.contact && (
              <p className="legal-p-3">
                {section.contact}
              </p>
            )}
            {section.subtext && (
              <p className="legal-p-4">
                {section.subtext}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
