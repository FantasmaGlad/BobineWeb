import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

const SECURITY_EMAIL = "security@bobine.fit";
const ADVISORY_URL = "https://github.com/FantasmaGlad/Bobine/security/advisories/new";
const APT_FINGERPRINT = "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A";
const REPORT_KEY_FINGERPRINT = "23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2";
const REPORT_KEY_URL = "https://bobine.fit/.well-known/security.asc";

const linkStyle = { color: "var(--text-heading)", textDecoration: "underline", textUnderlineOffset: "0.2em" } as const;

const mail = (
  <a href={`mailto:${SECURITY_EMAIL}?subject=Vulnerability%20report`} style={linkStyle}>
    {SECURITY_EMAIL}
  </a>
);
const advisory = (
  <a href={ADVISORY_URL} target="_blank" rel="noopener noreferrer" style={linkStyle}>
    {ADVISORY_URL}
  </a>
);
const reportKey = (
  <a href={REPORT_KEY_URL} style={linkStyle}>
    {REPORT_KEY_URL}
  </a>
);
const code = (text: string) => (
  <code style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.85em", background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "0.3rem", padding: "0.1em 0.4em", overflowWrap: "anywhere" }}>
    {text}
  </code>
);
const securityTxt = (
  <a href="/.well-known/security.txt" style={linkStyle}>
    /.well-known/security.txt
  </a>
);

interface Section {
  id: string;
  heading: string;
  paragraphs: ReactNode[];
  items?: ReactNode[];
}

const copy: Record<Locale, { badge: string; title: string; subtitle: string; updated: string; sections: Section[] }> = {
  fr: {
    badge: "Sécurité",
    title: "Signaler une vulnérabilité",
    subtitle:
      "Bobine est un projet libre maintenu à titre indépendant. Si vous pensez avoir trouvé une faille dans le site, le miroir Tor, le dépôt APT ou le logiciel, voici comment nous la signaler et ce que vous pouvez attendre en retour.",
    updated: "Dernière mise à jour : 7 octobre 2026",
    sections: [
      {
        id: "signalement",
        heading: "1. Comment signaler",
        paragraphs: [
          <>Écrivez à {mail}, ou ouvrez un signalement privé de vulnérabilité sur GitHub : {advisory}. Le signalement privé GitHub est préférable pour tout détail exploitable : il n&apos;est visible que des mainteneurs.</>,
          <>Nous demandons de chiffrer tout rapport contenant des détails exploitables. Notre clé publique OpenPGP de réception (Ed25519 et Curve25519, expire en octobre 2028) a pour empreinte <strong>{REPORT_KEY_FINGERPRINT}</strong>. Téléchargez-la sur {reportKey} ou laissez votre client la découvrir : {code("gpg --locate-keys security@bobine.fit")}. Vérifiez l&apos;empreinte avant d&apos;envoyer.</>,
          <>Créez votre propre paire de clés et joignez votre clé publique à votre message (ou indiquez où la récupérer) : nous répondrons chiffré avec elle. Exemple : {code('gpg --quick-generate-key "Votre Nom <vous@exemple.org>" ed25519 default 2y')} puis {code("gpg --armor --export vous@exemple.org")}. Ne partagez jamais votre clé privée.</>,
          <>Si vous ne pouvez pas utiliser PGP, utilisez le signalement privé GitHub plutôt qu&apos;un e-mail en clair. Le fichier {securityTxt} décrit ces canaux de manière lisible par les machines (RFC 9116).</>,
          "Merci d'indiquer : l'adresse ou le composant concerné, les étapes pour reproduire, l'impact que vous observez et, si possible, une preuve de concept minimale.",
        ],
      },
      {
        id: "perimetre",
        heading: "2. Périmètre",
        paragraphs: ["Sont concernés :"],
        items: [
          "le site bobine.fit et ses routes serveur (assistant Baamix, catalogue) ;",
          "le miroir Tor du site et du dépôt APT ;",
          "le dépôt de paquets apt.bobine.fit et sa chaîne de signature ;",
          "le logiciel Bobine (dépôt github.com/FantasmaGlad/Bobine) et ses installateurs (install.sh, install-tor.sh, paquets Windows, macOS, Linux et Android).",
        ],
      },
      {
        id: "hors-perimetre",
        heading: "3. Hors périmètre",
        paragraphs: ["Ne nous signalez pas :"],
        items: [
          "les failles des services tiers (Vercel, Cloudflare, GitHub, Amazon, AliExpress, Hugging Face, OpenRouter, Resend) : adressez-vous directement à leurs éditeurs ;",
          "l'ingénierie sociale, le hameçonnage, l'accès physique ;",
          "les attaques par déni de service, les tests de charge et les scans automatisés massifs ;",
          "les constats sans impact démontrable (absence d'un en-tête non exploitable, version affichée, fichiers publics volontaires comme llms.txt ou robots.txt) ;",
          "les erreurs de contenu ou de traduction (utilisez l'adresse de contact habituelle).",
        ],
      },
      {
        id: "engagements",
        heading: "4. Ce que nous faisons",
        paragraphs: [
          "Nous visons d'accuser réception d'un signalement sous 7 jours, puis de vous tenir informé de l'avancement. Le projet étant maintenu par une seule personne, ces délais sont un objectif et non un engagement contractuel.",
          "Nous demandons un délai raisonnable pour corriger avant toute publication : 90 jours par défaut, prolongeable d'un commun accord ou raccourci si la faille est déjà exploitée. Nous publions les correctifs dans les notes de version et créditons les personnes qui le souhaitent.",
        ],
      },
      {
        id: "bonne-foi",
        heading: "5. Recherche de bonne foi",
        paragraphs: [
          "Une recherche menée de bonne foi dans le périmètre ci-dessus ne fera l'objet d'aucune action de notre part. En contrepartie : n'accédez pas aux données d'autres personnes au-delà du strict nécessaire pour démontrer la faille, ne modifiez et ne détruisez aucune donnée, ne perturbez pas le service, n'installez aucune persistance, et ne divulguez rien avant la correction.",
          "Il n'existe pas de programme de récompense financière (bug bounty).",
        ],
      },
      {
        id: "verification",
        heading: "6. Vérifier l'authenticité des téléchargements",
        paragraphs: [
          `Le dépôt APT est signé. Empreinte de la clé principale : ${APT_FINGERPRINT}. Le script install-tor.sh épingle cette empreinte et s'arrête si elle diffère. Cette clé de signature est distincte de la clé de réception des rapports (section 1). Les mises à jour automatiques vérifient le condensé SHA-256 des fichiers publiés sur GitHub Releases.`,
        ],
      },
      {
        id: "remerciements",
        heading: "7. Remerciements",
        paragraphs: ["Aucun signalement n'a été publié à ce jour. Les personnes ayant signalé une faille corrigée seront listées ici, avec leur accord."],
      },
    ],
  },
  en: {
    badge: "Security",
    title: "Report a vulnerability",
    subtitle:
      "Bobine is an open-source project maintained independently. If you believe you found a flaw in the website, the Tor mirror, the APT repository or the software, here is how to report it and what to expect.",
    updated: "Last updated: 7 October 2026",
    sections: [
      {
        id: "signalement",
        heading: "1. How to report",
        paragraphs: [
          <>Write to {mail}, or open a private vulnerability report on GitHub: {advisory}. The private GitHub report is preferable for anything exploitable: only the maintainers can see it.</>,
          <>We ask that any report containing exploitable details be encrypted. Our OpenPGP public key for receiving reports (Ed25519 and Curve25519, expires October 2028) has the fingerprint <strong>{REPORT_KEY_FINGERPRINT}</strong>. Download it at {reportKey} or let your client discover it: {code("gpg --locate-keys security@bobine.fit")}. Check the fingerprint before sending.</>,
          <>Create your own key pair and attach your public key to your message (or tell us where to fetch it): we will reply encrypted to it. Example: {code('gpg --quick-generate-key "Your Name <you@example.org>" ed25519 default 2y')} then {code("gpg --armor --export you@example.org")}. Never share your private key.</>,
          <>If you cannot use PGP, use the private GitHub report rather than plain email. The {securityTxt} file describes these channels in a machine-readable form (RFC 9116).</>,
          "Please include: the affected address or component, steps to reproduce, the impact you observe and, if possible, a minimal proof of concept.",
        ],
      },
      {
        id: "perimetre",
        heading: "2. Scope",
        paragraphs: ["In scope:"],
        items: [
          "the bobine.fit website and its server routes (Baamix assistant, catalog);",
          "the Tor mirror of the site and of the APT repository;",
          "the apt.bobine.fit package repository and its signing chain;",
          "the Bobine software (github.com/FantasmaGlad/Bobine) and its installers (install.sh, install-tor.sh, Windows, macOS, Linux and Android packages).",
        ],
      },
      {
        id: "hors-perimetre",
        heading: "3. Out of scope",
        paragraphs: ["Please do not report:"],
        items: [
          "flaws in third-party services (Vercel, Cloudflare, GitHub, Amazon, AliExpress, Hugging Face, OpenRouter, Resend): contact their vendors directly;",
          "social engineering, phishing, physical access;",
          "denial-of-service attacks, load tests and mass automated scans;",
          "findings without demonstrable impact (a missing non-exploitable header, displayed version, deliberately public files such as llms.txt or robots.txt);",
          "content or translation errors (use the usual contact address).",
        ],
      },
      {
        id: "engagements",
        heading: "4. What we do",
        paragraphs: [
          "We aim to acknowledge a report within 7 days and keep you informed of progress. As the project has a single maintainer, these timings are a goal, not a contractual commitment.",
          "We ask for a reasonable time to fix before any disclosure: 90 days by default, extendable by mutual agreement or shortened if the flaw is already being exploited. Fixes are published in the release notes and we credit reporters who wish it.",
        ],
      },
      {
        id: "bonne-foi",
        heading: "5. Good-faith research",
        paragraphs: [
          "Research carried out in good faith within the scope above will not lead to any action from us. In return: do not access other people's data beyond what is strictly needed to demonstrate the flaw, do not modify or destroy data, do not disrupt the service, do not install persistence, and do not disclose anything before it is fixed.",
          "There is no financial reward program (bug bounty).",
        ],
      },
      {
        id: "verification",
        heading: "6. Verifying the authenticity of downloads",
        paragraphs: [
          `The APT repository is signed. Primary key fingerprint: ${APT_FINGERPRINT}. The install-tor.sh script pins this fingerprint and stops if it differs. This signing key is separate from the key used to receive reports (section 1). Automatic updates verify the SHA-256 digest of the files published on GitHub Releases.`,
        ],
      },
      {
        id: "remerciements",
        heading: "7. Acknowledgments",
        paragraphs: ["No report has been published so far. People who report a fixed flaw will be listed here, with their consent."],
      },
    ],
  },
};

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
    pathname: "/securite",
    title: isEn ? "Security Policy & Vulnerability Reporting" : "Politique de Sécurité & Signalement de Vulnérabilités",
    description: isEn
      ? "How to report a vulnerability in the Bobine website, Tor mirror, APT repository or software: contact, scope, disclosure timeline and good-faith research."
      : "Comment signaler une vulnérabilité du site Bobine, du miroir Tor, du dépôt APT ou du logiciel : contact, périmètre, délais de divulgation et recherche de bonne foi.",
  });
}

export default async function SecurityPage({
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
    { name: isEn ? "Security" : "Sécurité", url: `/${locale}/securite` },
  ];

  return (
    <div className="container" style={{ paddingBlock: "clamp(2rem, 5vh, 4rem)" }}>
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div style={{ marginBottom: "clamp(2.5rem, 6vw, 3.5rem)" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
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
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.6, margin: 0, maxWidth: "42rem" }}>{t.subtitle}</p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "0.75rem 0 0" }}>{t.updated}</p>
      </div>

      <div>
        {t.sections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            style={{ paddingBlock: "clamp(1.5rem, 3vw, 2rem)", borderTop: "1px solid var(--border-subtle)", scrollMarginTop: "6rem" }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-heading)", marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p, i) => (
              <p key={i} style={{ color: "var(--text-main)", fontSize: "0.925rem", lineHeight: 1.7, margin: i === 0 ? 0 : "0.75rem 0 0", maxWidth: "62rem" }}>
                {p}
              </p>
            ))}
            {sec.items && (
              <ul style={{ color: "var(--text-main)", fontSize: "0.925rem", lineHeight: 1.7, margin: "0.5rem 0 0", paddingLeft: "1.25rem", maxWidth: "62rem" }}>
                {sec.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
