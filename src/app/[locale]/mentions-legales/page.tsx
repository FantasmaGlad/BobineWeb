import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

const copy = {
  fr: {
    badge: "Transparence & Cadre Légal",
    title: "Mentions Légales",
    subtitle: "Informations légales relatives à l'éditeur, à l'hébergement, au rôle du site dans les achats de matériel et aux droits d'utilisation du projet open-source Bobine.",
    updated: "Dernière mise à jour : 19 septembre 2026",
    sections: [
      {
        heading: "1. Éditeur du Site & Direction de la Publication",
        body: "Le site bobine.fit est développé et maintenu à titre indépendant par Clément Barillot (FantasmaGlad), développeur et auteur du projet libre Bobine. Directeur de la publication : Clément Barillot.",
        contact: "Contact direct : clement.barillot@bobine.fit",
        subtext: "Dépôt officiel du code source et suivi des versions : github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "2. Hébergement & Infrastructure",
        body: "Le site web bobine.fit est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com). Le trafic du site transite par le réseau de Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis (cloudflare.com), qui assure la résolution DNS, l'accélération et la protection contre les attaques.",
        contact: "Le dépôt de paquets Linux apt.bobine.fit est servi par GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis), tout comme le code source du projet.",
        subtext: "Le traitement des données par ces prestataires est décrit dans la Politique de Confidentialité.",
      },
      {
        heading: "3. Propriété Intellectuelle & Licence Logicielle",
        body: "L'ensemble du code source du logiciel Bobine est mis à disposition sous licence libre GNU Affero General Public License v3.0 (AGPL-3.0).",
        contact: "Liberté d'usage : vous êtes libre d'utiliser, d'étudier, de modifier, de compiler et de redistribuer Bobine sans redevance, dans le respect de cette licence.",
        subtext: "Les marques, noms de produits et logos cités (ex : HP, Intel, AMD, Apple, Amazon, AliExpress, Les Mills) appartiennent à leurs propriétaires respectifs et sont utilisés uniquement pour identifier des produits, à des fins d'interopérabilité technique et de comparaison descriptive. Les images de produits proviennent des fiches des vendeurs.",
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
        subtext: "Baamix est un assistant fondé sur l'intelligence artificielle. Il peut se tromper : ses réponses n'ont aucune valeur contractuelle et doivent être vérifiées avec la documentation et la fiche du vendeur.",
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
    updated: "Last updated: 19 September 2026",
    sections: [
      {
        heading: "1. Site Publisher & Publication Director",
        body: "The website bobine.fit is independently created and maintained by Clément Barillot (FantasmaGlad), lead author and developer of the open-source Bobine project. Publication director: Clément Barillot.",
        contact: "Direct contact: clement.barillot@bobine.fit",
        subtext: "Official repository and version tracking: github.com/FantasmaGlad/Bobine",
      },
      {
        heading: "2. Hosting & Infrastructure",
        body: "The website bobine.fit is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (vercel.com). Site traffic goes through the network of Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, USA (cloudflare.com), which provides DNS resolution, acceleration and protection against attacks.",
        contact: "The apt.bobine.fit Linux package repository is served by GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA), as is the project's source code.",
        subtext: "How these providers process data is described in the Privacy Policy.",
      },
      {
        heading: "3. Intellectual Property & Software License",
        body: "The entire source code of Bobine is distributed under the GNU Affero General Public License v3.0 (AGPL-3.0).",
        contact: "Freedom of use: you are free to run, study, adapt, compile, and redistribute Bobine without license fees, in accordance with that license.",
        subtext: "Third-party trademarks, product names and logos mentioned (e.g., HP, Intel, AMD, Apple, Amazon, AliExpress, Les Mills) remain the property of their respective owners and are used solely to identify products, for technical interoperability and descriptive comparison. Product images come from the sellers' product pages.",
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
        subtext: "Baamix is an assistant based on artificial intelligence. It can be wrong: its answers have no contractual value and should be checked against the documentation and the seller's product page.",
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
    { name: isEn ? "Legal Notice" : "Mentions Légales", url: `/${locale}/mentions-legales` },
  ];

  return (
    <div className="container" style={{ paddingBlock: "clamp(2rem, 5vh, 4rem)" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div style={{ marginBottom: "clamp(2.5rem, 6vw, 3.5rem)" }}>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
          }}
        >
          {t.badge}
        </span>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 3.8vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBlock: "0.5rem 0.85rem",
            color: "var(--text-heading)",
          }}
        >
          {t.title}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6, margin: 0, maxWidth: "42rem" }}>
          {t.subtitle}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.75rem 0 0" }}>{t.updated}</p>
      </div>

      <div>
        {t.sections.map((sec) => (
          <section
            key={sec.heading}
            style={{
              paddingBlock: "clamp(1.5rem, 3vw, 2rem)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-heading)",
                marginBottom: "0.75rem",
                letterSpacing: "-0.01em",
              }}
            >
              {sec.heading}
            </h2>
            <p style={{ color: "var(--text-main)", fontSize: "0.925rem", lineHeight: 1.7, margin: 0, maxWidth: "62rem" }}>
              {sec.body}
            </p>
            {sec.contact && (
              <p style={{ color: "var(--text-main)", fontSize: "0.925rem", fontWeight: 600, lineHeight: 1.7, margin: 0, marginTop: "0.75rem", maxWidth: "62rem" }}>
                {sec.contact}
              </p>
            )}
            {sec.subtext && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.65, margin: 0, marginTop: "0.75rem", maxWidth: "62rem" }}>
                {sec.subtext}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
