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
    subtitle: "Informations légales relatives à l'éditeur, à l'hébergement, au rôle du site dans les achats de matériel et aux droits d'utilisation du projet open-source Bobine.",
    updated: "Dernière mise à jour : 27 octobre 2026",
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
        subtext: "Les marques, noms de produits et logos cités (ex : HP, Intel, AMD, Apple, Amazon, AliExpress, Les Mills, Fedora, Arch Linux, Debian, Ubuntu) appartiennent à leurs propriétaires respectifs et sont utilisés uniquement pour identifier des produits, à des fins d'interopérabilité technique et de comparaison descriptive. La préférence de thème utilise le cookie bobine-theme, partagé entre bobine.fit et ses sous-domaines pendant un an ; voir la politique de confidentialité. Les comparatifs identifient les solutions tierces par leur nom en texte, sans reproduire leur logo ni suggérer de partenariat. Les images de produits proviennent des fiches des vendeurs.",
      },
      {
        heading: "4. Rôle du Site : Information et Suggestions, Aucune Vente",
        body: "Le site bobine.fit est une plateforme d'information, de téléchargement et de documentation technique. Il ne vend aucun produit, ne propose aucun abonnement payant et ne perçoit aucun paiement de ses visiteurs. La page « Matériel » se contente de suggérer des produits et renvoie vers Amazon.fr et AliExpress.",
        contact: "Les achats sont réalisés exclusivement sur Amazon et AliExpress, auprès de ces plateformes ou de leurs vendeurs tiers. Ce sont eux qui sont responsables de la vente, du paiement, de la facturation, de la livraison, de la garantie, du droit de rétractation et du service après-vente, selon leurs conditions et la loi qui leur est applicable.",
        subtext: "Bobine n'intervient à aucun stade de la commande et n'a accès à aucune donnée de paiement ni à l'identité des acheteurs. Le logiciel Bobine est fourni « en l'état », sans garantie expresse ou implicite, conformément à la licence AGPL-3.0. Les gérants de salle de sport et exploitants restent responsables de la conformité de leurs équipements de diffusion audiovisuelle.",
      },
      {
        heading: "5. Informations sur les Produits & Assistant Baamix",
        body: "Les prix, disponibilités et caractéristiques affichés sont donnés à titre indicatif. Les prix Amazon sont des prix constatés à la date indiquée. Les prix AliExpress sont récupérés automatiquement et affichés « à partir de » : ils correspondent à la variante la moins chère de l'annonce et peuvent varier selon la configuration, le pays de livraison ou les promotions. Seule la fiche du vendeur fait foi.",
        contact: "Les suggestions de matériel reflètent la sélection éditoriale du site et ne constituent ni une garantie de compatibilité ni un conseil personnalisé engageant son auteur : vérifiez la compatibilité avec votre installation avant tout achat.",
        subtext: "Baamix utilise Hugging Face pour générer ses réponses et peut interroger Google Cloud Vertex AI Search pour retrouver la documentation pertinente. Il peut se tromper : ses réponses n'ont aucune valeur contractuelle et doivent être vérifiées avec la documentation et la fiche du vendeur.",
      },
      {
        heading: "6. Liens d'Affiliation & Soutien au Projet Libre",
        body: "Le site bobine.fit participe au Programme Partenaires d’Amazon Europe S.à r.l., un programme d’affiliation conçu pour permettre à des sites de percevoir une rémunération grâce à la création de liens vers Amazon.fr. En tant que Partenaire Amazon, le site bobine.fit réalise un bénéfice sur les achats remplissant les conditions requises.",
        contact: "Le site participe également au programme d'affiliation AliExpress Portals : lorsque vous achetez sur AliExpress après avoir cliqué sur un lien de ce site, une commission peut lui être versée.",
        subtext: "Ces liens sont signalés comme sponsorisés et n'augmentent en rien le prix payé par l'acheteur. Les commissions perçues financent l'hébergement de l'infrastructure web et le développement continu du logiciel libre Bobine.",
      },
    ],
  },
  en: {
    badge: "Transparency & Legal Framework",
    title: "Legal Notice",
    subtitle: "Legal information regarding the publisher, hosting, the site's role in hardware purchases, and the terms of use of the open-source Bobine project.",
    updated: "Last updated: 27 October 2026",
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
        subtext: "Third-party trademarks, product names and logos mentioned (e.g., HP, Intel, AMD, Apple, Amazon, AliExpress, Les Mills, Fedora, Arch Linux, Debian, Ubuntu) remain the property of their respective owners and are used solely to identify products, for technical interoperability and descriptive comparison. The theme preference uses the bobine-theme cookie, shared between bobine.fit and its subdomains for one year; see the privacy policy. Comparisons identify third-party solutions by their names in plain text, without reproducing their logos or suggesting a partnership. Product images come from the sellers' product pages.",
      },
      {
        heading: "4. Role of the Site: Information and Suggestions, No Sales",
        body: "The website bobine.fit is an informational, download and technical documentation platform. It does not sell any product, offers no paid subscription and receives no payment from its visitors. The \"Hardware\" pages only suggest products and link to Amazon.fr and AliExpress.",
        contact: "Purchases are made exclusively on Amazon and AliExpress, from those platforms or their third-party sellers. They are responsible for the sale, payment, invoicing, delivery, warranty, withdrawal right and after-sales service, under their own terms and the law applicable to them.",
        subtext: "Bobine takes no part in any order and has no access to payment data or to buyers' identity. The Bobine software is provided 'as is', without warranty of any kind, in accordance with the AGPL-3.0 license. Gym owners and operators remain responsible for the compliance of their audiovisual equipment.",
      },
      {
        heading: "5. Product Information & the Baamix Assistant",
        body: "Prices, availability and specifications are indicative. Amazon prices are prices observed on the stated date. AliExpress prices are retrieved automatically and shown as \"from\": they match the cheapest variant of the listing and may vary with configuration, delivery country or promotions. Only the seller's product page is authoritative.",
        contact: "Hardware suggestions reflect the site's editorial selection and are neither a compatibility guarantee nor personalised advice binding its author: check compatibility with your installation before any purchase.",
        subtext: "Baamix uses Hugging Face to generate its answers and may query Google Cloud Vertex AI Search to retrieve relevant documentation. It can be wrong: its answers have no contractual value and should be checked against the documentation and the seller's product page.",
      },
      {
        heading: "6. Affiliate Links & Open-Source Sponsorship",
        body: "The website bobine.fit participates in the Amazon Services LLC Associates Program and Amazon EU Associates Programme, an affiliate advertising program designed to provide a means for sites to earn fees by linking to Amazon. As an Amazon Associate, bobine.fit earns from qualifying purchases.",
        contact: "The site also takes part in the AliExpress Portals affiliate program: when you buy on AliExpress after clicking a link on this site, a commission may be paid to it.",
        subtext: "These links are flagged as sponsored and do not increase the price paid by the buyer. Commissions fund web hosting and the continued development of the open-source Bobine software.",
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
      ? "Legal information, hosting, affiliate disclosure and the role of the site in hardware purchases (Amazon, AliExpress) for the Bobine open-source project."
      : "Informations légales, hébergement, transparence sur l'affiliation et rôle du site dans les achats de matériel (Amazon, AliExpress) du projet libre Bobine.",
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
        <h1 className="legal-h1-1"
        >
          {t.title}
        </h1>
        <p className="legal-p-1">
          {t.subtitle}
        </p>
        <p className="legal-p-2">{t.updated}</p>
      </div>

      <div>
        {t.sections.map((sec) => (
          <section
            key={sec.heading} className="legal-section-1"
          >
            <h2 className="legal-h2-1"
            >
              {sec.heading}
            </h2>
            <p className="legal-p-3">
              {sec.body}
            </p>
            {sec.contact && (
              <p className="legal-p-4">
                {sec.contact}
              </p>
            )}
            {sec.subtext && (
              <p className="legal-p-5">
                {sec.subtext}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
