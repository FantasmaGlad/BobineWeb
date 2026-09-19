import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

const copy = {
  fr: {
    badge: "Vie Privée & Éthique",
    title: "Politique de Confidentialité",
    subtitle: "Ce que le site collecte, ce qui reste sur votre appareil et ce qui transite par des prestataires : zéro cookie publicitaire, zéro pistage commercial.",
    updated: "Dernière mise à jour : 19 septembre 2026",
    sections: [
      {
        heading: "1. Responsable du Traitement",
        body: "Le responsable du traitement des données du site bobine.fit est Clément Barillot (FantasmaGlad), éditeur du site.",
        contact: "Contact pour toute question ou demande relative à vos données : clement.barillot@bobine.fit",
        subtext: "Le site ne propose aucun compte utilisateur, aucun formulaire d'inscription et aucun paiement.",
      },
      {
        heading: "2. Cookies & Données Stockées sur Votre Appareil",
        body: "Le site ne dépose aucun cookie publicitaire, aucun pixel de suivi (Meta ou autre) et n'effectue aucun profilage commercial. Il utilise uniquement le stockage local de votre navigateur (localStorage) pour des fonctions que vous utilisez : votre thème visuel, votre progression dans le guide de démarrage et le contenu de votre panier « Mon Pack » du guide matériel.",
        contact: "Ces données restent sur votre appareil. Le contenu du panier n'est transmis à notre serveur que si vous utilisez l'assistant Baamix (voir section 4). Vous pouvez les effacer à tout moment depuis les réglages de votre navigateur ou avec le bouton « Vider » du panier.",
        subtext: "Aucun bandeau de consentement n'est affiché car le site ne dépose pas de traceur à des fins publicitaires ou de mesure individuelle.",
      },
      {
        heading: "3. Mesure d'Audience Anonyme",
        body: "Pour évaluer la fréquentation des guides et de la documentation, le site utilise Vercel Web Analytics, un outil de statistiques agrégées conçu pour fonctionner sans cookie ni identifiant persistant.",
        contact: "Les métriques collectées sont statistiques : nombre de pages vues, pays ou région d'origine, type de navigateur et d'appareil, page de provenance. Elles ne servent qu'à améliorer le contenu du site.",
        subtext: "Base légale : intérêt légitime de l'éditeur à connaître la fréquentation de son site (article 6.1.f du RGPD).",
      },
      {
        heading: "4. Assistant Baamix (Intelligence Artificielle)",
        body: "Lorsque vous utilisez l'assistant Baamix, le texte de vos messages, le contenu de votre panier « Mon Pack » (noms et prix des produits) et l'indication de l'onglet de la boutique que vous consultez sont envoyés à notre serveur, puis transmis à OpenRouter (OpenRouter, Inc., États-Unis), un service qui les relaie à un modèle de langage tiers pour produire la réponse.",
        contact: "Bobine ne conserve pas vos conversations : elles ne sont enregistrées ni dans une base de données ni dans votre navigateur, et disparaissent quand vous fermez ou rechargez la page. Le site ne journalise pas le contenu des échanges. Les prestataires d'IA appliquent toutefois leurs propres règles de conservation et de traitement, et peuvent traiter les données hors de l'Union européenne.",
        subtext: "N'écrivez aucune donnée personnelle ou sensible dans le chat. Base légale : votre demande d'assistance (intérêt légitime à répondre à cette demande, article 6.1.f du RGPD).",
      },
      {
        heading: "5. Liens vers Amazon & AliExpress",
        body: "Le guide matériel contient des liens d'affiliation vers Amazon.fr et AliExpress. En cliquant, vous quittez bobine.fit : Amazon et AliExpress peuvent alors déposer leurs propres cookies et mesurer le clic pour attribuer une éventuelle commission, selon leurs propres politiques de confidentialité, que nous vous invitons à consulter.",
        contact: "Vos achats, vos données de paiement et de livraison sont traités uniquement par ces plateformes et leurs vendeurs : bobine.fit n'y a pas accès. Le site reçoit seulement des rapports statistiques de ses programmes d'affiliation (clics, articles commandés, commissions), sans l'identité des acheteurs.",
        subtext: "Le site ne vend rien lui-même et ne collecte aucune donnée de commande.",
      },
      {
        heading: "6. Hébergement, Prestataires & Transferts Hors UE",
        body: "Toutes les connexions à bobine.fit sont chiffrées via HTTPS / TLS. Le site est hébergé par Vercel Inc. et son trafic transite par Cloudflare, Inc. (DNS, accélération, protection contre les attaques), qui traitent des données techniques de connexion telles que l'adresse IP et les journaux de requêtes. Le dépôt de paquets apt.bobine.fit et le code source sont hébergés par GitHub, Inc., dont l'API est aussi interrogée par notre serveur pour lister les versions publiées.",
        contact: "Ces prestataires sont établis aux États-Unis : vos données techniques peuvent donc être traitées hors de l'Union européenne, dans le cadre de leurs propres engagements et politiques de confidentialité.",
        subtext: "Le site ne revend ni ne cède aucune donnée à des tiers à des fins commerciales.",
      },
      {
        heading: "7. Contact par E-mail & Conservation",
        body: "Le seul canal de contact direct est l'adresse e-mail clement.barillot@bobine.fit (ou les échanges publics sur le dépôt GitHub du projet). Aucune base d'adresses ni liste de diffusion marketing n'existe.",
        contact: "Les messages reçus sont utilisés uniquement pour répondre à votre demande et conservés le temps nécessaire à son traitement.",
        subtext: "Base légale : votre demande de contact (intérêt légitime à y répondre, article 6.1.f du RGPD).",
      },
      {
        heading: "8. Vos Droits",
        body: "Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition concernant vos données personnelles.",
        contact: "Pour exercer ces droits, écrivez à clement.barillot@bobine.fit. Une réponse vous est apportée dans un délai d'un mois.",
        subtext: "Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr), l'autorité française de protection des données.",
      },
    ],
  },
  en: {
    badge: "Privacy & Digital Ethics",
    title: "Privacy Policy",
    subtitle: "What the site collects, what stays on your device and what goes through providers: zero advertising cookies, zero commercial tracking.",
    updated: "Last updated: 19 September 2026",
    sections: [
      {
        heading: "1. Data Controller",
        body: "The controller of personal data on bobine.fit is Clément Barillot (FantasmaGlad), the site's publisher.",
        contact: "Contact for any question or request about your data: clement.barillot@bobine.fit",
        subtext: "The site has no user accounts, no sign-up forms and no payments.",
      },
      {
        heading: "2. Cookies & Data Stored on Your Device",
        body: "The site sets no advertising cookies, no tracking pixels (Meta or other) and performs no commercial profiling. It only uses your browser's local storage (localStorage) for features you use: your visual theme, your progress in the quick-start guide and the contents of your \"My Pack\" cart in the hardware guide.",
        contact: "This data stays on your device. The cart contents are only sent to our server if you use the Baamix assistant (see section 4). You can erase it at any time from your browser settings or with the cart's \"Empty\" button.",
        subtext: "No consent banner is shown because the site sets no tracker for advertising or individual measurement purposes.",
      },
      {
        heading: "3. Anonymous Audience Measurement",
        body: "To gauge readership of guides and documentation, the site uses Vercel Web Analytics, an aggregated statistics tool designed to work without cookies or persistent identifiers.",
        contact: "Collected metrics are statistical: page view counts, country or region, browser and device type, referring page. They are only used to improve the site's content.",
        subtext: "Legal basis: the publisher's legitimate interest in knowing how the site is used (Article 6(1)(f) GDPR).",
      },
      {
        heading: "4. Baamix Assistant (Artificial Intelligence)",
        body: "When you use the Baamix assistant, the text of your messages, the contents of your \"My Pack\" cart (product names and prices) and the store tab you are viewing are sent to our server, then forwarded to OpenRouter (OpenRouter, Inc., USA), a service that relays them to a third-party language model to produce the answer.",
        contact: "Bobine does not keep your conversations: they are stored neither in a database nor in your browser, and disappear when you close or reload the page. The site does not log the content of exchanges. AI providers apply their own retention and processing rules, however, and may process data outside the European Union.",
        subtext: "Do not type personal or sensitive data in the chat. Legal basis: your request for assistance (legitimate interest in answering it, Article 6(1)(f) GDPR).",
      },
      {
        heading: "5. Links to Amazon & AliExpress",
        body: "The hardware guide contains affiliate links to Amazon.fr and AliExpress. By clicking, you leave bobine.fit: Amazon and AliExpress may then set their own cookies and measure the click to attribute a possible commission, under their own privacy policies, which we invite you to read.",
        contact: "Your purchases, payment and delivery data are processed only by those platforms and their sellers: bobine.fit has no access to them. The site only receives statistical reports from its affiliate programs (clicks, items ordered, commissions), without buyers' identity.",
        subtext: "The site sells nothing itself and collects no order data.",
      },
      {
        heading: "6. Hosting, Providers & Transfers Outside the EU",
        body: "All connections to bobine.fit are encrypted via HTTPS / TLS. The site is hosted by Vercel Inc. and its traffic goes through Cloudflare, Inc. (DNS, acceleration, protection against attacks), which process technical connection data such as IP addresses and request logs. The apt.bobine.fit package repository and the source code are hosted by GitHub, Inc., whose API our server also queries to list published releases.",
        contact: "These providers are based in the United States: your technical data may therefore be processed outside the European Union, under their own commitments and privacy policies.",
        subtext: "The site neither sells nor transfers any data to third parties for commercial purposes.",
      },
      {
        heading: "7. Contact by Email & Retention",
        body: "The only direct contact channel is the email address clement.barillot@bobine.fit (or public exchanges on the project's GitHub repository). No address database or marketing mailing list exists.",
        contact: "Messages received are used only to answer your request and kept for as long as needed to handle it.",
        subtext: "Legal basis: your contact request (legitimate interest in answering it, Article 6(1)(f) GDPR).",
      },
      {
        heading: "8. Your Rights",
        body: "Under the General Data Protection Regulation (GDPR) and the French Data Protection Act, you have the right of access, rectification, erasure, restriction of processing, portability and objection regarding your personal data.",
        contact: "To exercise these rights, write to clement.barillot@bobine.fit. You will receive an answer within one month.",
        subtext: "If you believe your rights are not respected, you may lodge a complaint with the CNIL (cnil.fr), the French data protection authority.",
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
    pathname: "/confidentialite",
    title: isEn ? "Privacy Policy — Bobine" : "Politique de Confidentialité — Bobine",
    description: isEn
      ? "Privacy policy for the Bobine website: local storage, anonymous analytics, the Baamix AI assistant, affiliate links to Amazon and AliExpress, providers and your GDPR rights."
      : "Politique de confidentialité du site Bobine : stockage local, mesure d'audience anonyme, assistant IA Baamix, liens d'affiliation Amazon et AliExpress, prestataires et droits RGPD.",
  });
}

export default async function PrivacyPage({
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
    { name: isEn ? "Privacy Policy" : "Confidentialité", url: `/${locale}/confidentialite` },
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
