import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildMetadata, lp } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import "@/styles/split/pages-legal.css";

const SECURITY_EMAIL = "security@bobine.fit";
const ADVISORY_URL = "https://github.com/FantasmaGlad/Bobine/security/advisories/new";
const APT_FINGERPRINT = "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A";
const REPORT_KEY_FINGERPRINT = "23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2";
const REPORT_KEY_URL = "https://bobine.fit/.well-known/security.asc";

const mail = (
  <a href={`mailto:${SECURITY_EMAIL}?subject=Vulnerability%20report`} className="legal-link">
    {SECURITY_EMAIL}
  </a>
);
const advisory = (
  <a href={ADVISORY_URL} target="_blank" rel="noopener noreferrer" className="legal-link">
    {ADVISORY_URL}
  </a>
);
const reportKey = (
  <a href={REPORT_KEY_URL} className="legal-link">
    {REPORT_KEY_URL}
  </a>
);
const code = (text: string) => (
  <code className="legal-code-1">
    {text}
  </code>
);
const repoPolicy = (
  <a href="https://github.com/FantasmaGlad/Bobine/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" className="legal-link">
    github.com/FantasmaGlad/Bobine/SECURITY.md
  </a>
);
const securityTxt = (
  <a href="/.well-known/security.txt" className="legal-link">
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
    updated: "Dernière mise à jour : 24 octobre 2026",
    sections: [
      {
        id: "signalement",
        heading: "1. Comment signaler",
        paragraphs: [
          <>Écrivez à {mail}, ou ouvrez un signalement privé de vulnérabilité sur GitHub : {advisory}. Le signalement privé GitHub est préférable pour tout détail exploitable : il n&apos;est visible que des mainteneurs.</>,
          <>Nous demandons de chiffrer tout rapport contenant des détails exploitables. Notre clé publique OpenPGP de réception (Ed25519 et Curve25519, expire en octobre 2028) a pour empreinte <strong>{REPORT_KEY_FINGERPRINT}</strong>. Téléchargez-la sur {reportKey} ou laissez votre client la découvrir : {code("gpg --locate-keys security@bobine.fit")}. Vérifiez l&apos;empreinte avant d&apos;envoyer.</>,
          <>Le fichier {securityTxt} est signé avec cette clé : {code("curl -s https://bobine.fit/.well-known/security.txt | gpg --verify")}. L&apos;empreinte est aussi publiée de façon indépendante dans le dépôt officiel du logiciel ({repoPolicy} et dossier docs/security), sur le site dédié security.bobine.fit (hébergé séparément) et dans le DNS (enregistrements TXT openpgp4fpr et OPENPGPKEY) : vérifiez qu&apos;elle correspond sur au moins deux canaux avant d&apos;envoyer un rapport.</>,
          <>Créez votre propre paire de clés et joignez votre clé publique à votre message (ou indiquez où la récupérer) : nous répondrons chiffré avec elle. Exemple : {code('gpg --quick-generate-key "Votre Nom <vous@exemple.org>" future-default default 2y')} puis {code("gpg --armor --export vous@exemple.org")}. Ne partagez jamais votre clé privée.</>,
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
          "les dépôts de paquets packages.bobine.fit (APT, DNF et Pacman) et leur chaîne de signature ;",
          "le logiciel Bobine (dépôt github.com/FantasmaGlad/Bobine) et ses installateurs (install.sh, install-tor.sh, paquets Windows, macOS, Linux et Android).",
        ],
      },
      {
        id: "hors-perimetre",
        heading: "3. Hors périmètre",
        paragraphs: ["Ne nous signalez pas :"],
        items: [
          "les failles des services tiers (Vercel, Cloudflare, GitHub, Amazon, AliExpress, Hugging Face, Google Cloud, Resend) : adressez-vous directement à leurs éditeurs ;",
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
          `Les dépôts APT, Fedora (dnf) et Arch Linux (pacman) sont signés avec la même clé. Empreinte de la clé principale : ${APT_FINGERPRINT}. Le script install-tor.sh épingle cette empreinte et s'arrête si elle diffère. Cette clé de signature est distincte de la clé de réception des rapports (section 1). Les mises à jour automatiques vérifient le condensé SHA-256 des fichiers publiés sur GitHub Releases.`,
        ],
      },
      {
        id: "remerciements",
        heading: "7. Remerciements",
        paragraphs: ["Aucun signalement n'a été publié à ce jour. Les personnes ayant signalé une faille corrigée seront listées ici, avec leur accord."],
      },
      {
        id: "historique",
        heading: "8. Historique des clés et du document",
        paragraphs: [
          "7 octobre 2026 : publication de la politique avec une première clé de réception (empreinte 8208 FFD3 F7AB 4DD3 6B0A CDD8 4726 A378 F683 265A).",
          "7 octobre 2026 : cette première clé est révoquée et retirée le jour même, quelques heures après sa publication, car sa phrase secrète était inutilisable. Aucun rapport n'avait été reçu et la clé privée n'a jamais été exposée. La clé publique révoquée, munie de sa signature de révocation, est publiée dans le dépôt officiel du logiciel.",
          `7 octobre 2026 : création et publication de la clé actuelle (${REPORT_KEY_FINGERPRINT}) ; signature de security.txt avec cette clé.`,
          "8 octobre 2026 : publication du site de divulgation dédié security.bobine.fit et de l'empreinte dans le DNS de bobine.fit ; une vérification quotidienne contrôle que tous les canaux servent la même empreinte.",
          "Tout changement de clé, d'empreinte ou d'engagement est consigné ici.",
        ],
      },
    ],
  },
  en: {
    badge: "Security",
    title: "Report a vulnerability",
    subtitle:
      "Bobine is an open-source project maintained independently. If you believe you found a flaw in the website, the Tor mirror, the APT repository or the software, here is how to report it and what to expect.",
    updated: "Last updated: 24 October 2026",
    sections: [
      {
        id: "signalement",
        heading: "1. How to report",
        paragraphs: [
          <>Write to {mail}, or open a private vulnerability report on GitHub: {advisory}. The private GitHub report is preferable for anything exploitable: only the maintainers can see it.</>,
          <>We ask that any report containing exploitable details be encrypted. Our OpenPGP public key for receiving reports (Ed25519 and Curve25519, expires October 2028) has the fingerprint <strong>{REPORT_KEY_FINGERPRINT}</strong>. Download it at {reportKey} or let your client discover it: {code("gpg --locate-keys security@bobine.fit")}. Check the fingerprint before sending.</>,
          <>The {securityTxt} file is signed with this key: {code("curl -s https://bobine.fit/.well-known/security.txt | gpg --verify")}. The fingerprint is also published independently in the official software repository ({repoPolicy} and docs/security folder), on the dedicated security.bobine.fit site (hosted separately) and in the DNS (openpgp4fpr TXT and OPENPGPKEY records): check that it matches on at least two channels before sending a report.</>,
          <>Create your own key pair and attach your public key to your message (or tell us where to fetch it): we will reply encrypted to it. Example: {code('gpg --quick-generate-key "Your Name <you@example.org>" future-default default 2y')} then {code("gpg --armor --export you@example.org")}. Never share your private key.</>,
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
          "the packages.bobine.fit package repositories (APT, DNF and Pacman) and their signing chain;",
          "the Bobine software (github.com/FantasmaGlad/Bobine) and its installers (install.sh, install-tor.sh, Windows, macOS, Linux and Android packages).",
        ],
      },
      {
        id: "hors-perimetre",
        heading: "3. Out of scope",
        paragraphs: ["Please do not report:"],
        items: [
          "flaws in third-party services (Vercel, Cloudflare, GitHub, Amazon, AliExpress, Hugging Face, Google Cloud, Resend): contact their vendors directly;",
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
          `The APT, Fedora (dnf) and Arch Linux (pacman) repositories are signed with the same key. Primary key fingerprint: ${APT_FINGERPRINT}. The install-tor.sh script pins this fingerprint and stops if it differs. This signing key is separate from the key used to receive reports (section 1). Automatic updates verify the SHA-256 digest of the files published on GitHub Releases.`,
        ],
      },
      {
        id: "remerciements",
        heading: "7. Acknowledgments",
        paragraphs: ["No report has been published so far. People who report a fixed flaw will be listed here, with their consent."],
      },
      {
        id: "historique",
        heading: "8. Key and document history",
        paragraphs: [
          "7 October 2026: policy published with a first report key (fingerprint 8208 FFD3 F7AB 4DD3 6B0A CDD8 4726 A378 F683 265A).",
          "7 October 2026: this first key is revoked and removed the same day, a few hours after publication, because its passphrase could not be used. No report had been received and the private key was never exposed. The revoked public key, carrying its revocation signature, is published in the official software repository.",
          `7 October 2026: current key created and published (${REPORT_KEY_FINGERPRINT}); security.txt signed with this key.`,
          "8 October 2026: dedicated disclosure site security.bobine.fit published and fingerprint added to the DNS of bobine.fit; a daily check verifies that every channel serves the same fingerprint.",
          "Any change of key, fingerprint or commitment is recorded here.",
        ],
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
    { name: isEn ? "Security" : "Sécurité", url: lp(locale, `/securite`) },
  ];

  return (
    <div className="container legal-div-1">
      <BreadcrumbsJsonLd items={breadcrumbs} />

      <div className="legal-div-2">
        <span className="legal-span-1">
          {t.badge}
        </span>
        <h1 className="legal-h1-1"
        >
          {t.title}
        </h1>
        <p className="legal-p-1">{t.subtitle}</p>
        <p className="legal-p-2">{t.updated}</p>
      </div>

      <div>
        {t.sections.map((sec) => (
          <section
            key={sec.id}
            id={sec.id} className="legal-section-2"
          >
            <h2 className="legal-h2-1">
              {sec.heading}
            </h2>
            {sec.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "legal-para legal-para--first" : "legal-para"}>
                {p}
              </p>
            ))}
            {sec.items && (
              <ul className="legal-ul-1">
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
