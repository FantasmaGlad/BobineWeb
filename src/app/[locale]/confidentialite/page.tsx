import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

const copy = {
  fr: {
    badge: "Vie Privée & Éthique",
    title: "Politique de Confidentialité",
    subtitle: "Notre engagement strict pour le respect de votre vie privée : zéro cookie tiers, zéro tracking publicitaire et souveraineté totale.",
    sections: [
      {
        heading: "1. Philosophie Privacy-by-Design & Zéro Cookie Publicitaire",
        body: "Le site bobine.fit applique une politique stricte de minimisation des données. Nous ne déposons aucun cookie tiers, aucun pixel Facebook/Meta, aucun cookie publicitaire et nous n'effectuons aucun profilage commercial.",
        contact: "Aucun bandeau de cookies intrusif n'est requis sur ce site car aucune donnée personnelle n'est exploitée à des fins de ciblage ou revendue à des tiers.",
        subtext: "Le choix de votre thème visuel est sauvegardé localement sur votre navigateur (localStorage) sans jamais être transmis à un serveur distant.",
      },
      {
        heading: "2. Mesure d'Audience Anonyme & Conforme RGPD",
        body: "Pour évaluer la fréquentation des guides et de la documentation, nous utilisons Vercel Web Analytics. Cet outil est configuré dans le respect strict des recommandations de la CNIL et du RGPD.",
        contact: "Garanties techniques : Aucune adresse IP complète n'est stockée, aucun identifiant persistant n'est tracé d'un site à l'autre.",
        subtext: "Les métriques mesurées sont purement globales et statistiques (nombre de pages vues, pays d'origine, type de navigateur).",
      },
      {
        heading: "3. Données de Contact & Échanges Communautaires",
        body: "Le seul moyen de contact direct est un lien e-mail volontaire (clement.barillot3901@gmail.com) ou la participation sur le dépôt GitHub officiel.",
        contact: "Aucun formulaire de prospection, aucune inscription obligatoire et aucune base d'adresses e-mail n'est collectée.",
        subtext: "Les correspondances par e-mail sont traitées de manière confidentielle et ne sont jamais intégrées à des listes de diffusion marketing.",
      },
      {
        heading: "4. Hébergement & Sécurité des Échanges (HTTPS / TLS)",
        body: "Toutes les connexions au site bobine.fit sont chiffrées de bout en bout via le protocole HTTPS / TLS de pointe fourni par Vercel Inc.",
        contact: "Conformément au RGPD, vous disposez d'un droit d'accès et d'effacement de vos éventuels messages en écrivant à clement.barillot3901@gmail.com.",
        subtext: "Le projet Bobine milite pour un web sobre, respectueux des libertés numériques et sans surveillance de masse.",
      },
    ],
  },
  en: {
    badge: "Privacy & Digital Ethics",
    title: "Privacy Policy",
    subtitle: "Our strict commitment to respecting your privacy: zero third-party trackers, zero advertising cookies, and complete digital sovereignty.",
    sections: [
      {
        heading: "1. Privacy-by-Design & Zero Ad Cookies",
        body: "bobine.fit implements a strict data minimization policy. We set no third-party cookies, no tracking pixels (Meta/Facebook), no marketing trackers, and we perform zero commercial profiling.",
        contact: "No invasive cookie banner is needed on this site because no personal data is collected for targeting or shared with brokers.",
        subtext: "Your selected UI theme is saved locally in your browser storage (localStorage) without ever being transmitted to a remote server.",
      },
      {
        heading: "2. Anonymous & GDPR-Compliant Analytics",
        body: "To gauge readership across technical guides and documentation, we utilize privacy-friendly Vercel Web Analytics, designed to fully comply with GDPR and ePrivacy guidelines.",
        contact: "Technical safeguards: No raw IP addresses are logged, and no persistent device fingerprints track you across the web.",
        subtext: "Aggregated metrics collected include page view counts, broad geographic region, and device/browser category.",
      },
      {
        heading: "3. Contact Information & Community Interactions",
        body: "The only direct contact channel is a voluntary email link (clement.barillot3901@gmail.com) or opening issues and discussions on our GitHub repository.",
        contact: "No lead forms, no forced sign-ups, and no marketing mailing lists exist on this platform.",
        subtext: "Email communications are treated strictly as direct private correspondence and never sold or shared.",
      },
      {
        heading: "4. Infrastructure Security & GDPR Rights",
        body: "All web traffic to bobine.fit is encrypted in transit using industry-standard HTTPS / TLS provided by Vercel Inc.",
        contact: "Under the GDPR, you retain full rights of access and deletion regarding any emailed correspondence by writing to clement.barillot3901@gmail.com.",
        subtext: "Bobine promotes an open, tracker-free web prioritizing software autonomy and user freedom.",
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
      ? "Privacy policy for the Bobine website: privacy-first analytics, no advertising trackers, and no personal data collection."
      : "Politique de confidentialité du site Bobine : mesure d'audience respectueuse, zéro cookie publicitaire et aucune collecte de données personnelles.",
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
    <div className="container" style={{ paddingBlock: "clamp(2rem, 4vh, 3.5rem)", maxWidth: "56rem" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 4vw, 3rem)" }}>
        <span className="feature-category-label">{t.badge}</span>
        <h1
          style={{
            fontSize: "clamp(2rem, 4.2vw, 2.85rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBlock: "0.4rem 0.75rem",
            color: "var(--text-heading)",
          }}
        >
          {t.title}
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {t.sections.map((sec) => (
          <div
            key={sec.heading}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "0.85rem",
              padding: "1.5rem 1.75rem",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--text-heading)",
                marginBottom: "0.6rem",
                letterSpacing: "-0.02em",
              }}
            >
              {sec.heading}
            </h2>
            <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0, marginBottom: "0.5rem" }}>
              {sec.body}
            </p>
            {sec.contact && (
              <p style={{ color: "var(--accent-primary)", fontSize: "0.875rem", fontWeight: 600, margin: 0, marginBottom: "0.35rem" }}>
                {sec.contact}
              </p>
            )}
            {sec.subtext && (
              <p style={{ color: "var(--text-dim)", fontSize: "0.825rem", lineHeight: 1.5, margin: 0 }}>
                {sec.subtext}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
