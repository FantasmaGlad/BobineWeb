import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import CodeBlock from "@/components/CodeBlock";
import BrandIcon from "@/components/ui/BrandIcon";
import { buildMetadata, lp } from "@/lib/seo";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { ONION_APT_HOST, ONION_SITE_HOST, TOR_PROJECT_URL } from "@/lib/onion";
import "@/styles/split/pages-docs.css";

const FINGERPRINT = "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A";

const APT = `sudo apt install apt-transport-tor
curl -fsS --socks5-hostname 127.0.0.1:9050 http://${ONION_APT_HOST}/bobine.gpg \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg
echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://${ONION_APT_HOST}/ stable main" \\
  | sudo tee /etc/apt/sources.list.d/bobine-onion.list
sudo apt update && sudo apt install bobine`;

const TEXT = {
  fr: {
    title: "Anonymisation par Tor",
    description: "Installer et mettre à jour Bobine par Tor : services onion v3 du site et du dépôt APT.",
    h1: "Anonymisation",
    why: "Le site et le dépôt APT sont aussi publiés en services onion v3. Une salle peut ainsi installer Bobine et lire la documentation sans révéler son adresse IP. C'est aussi un banc d'essai : une chaîne de déploiement multi-OS signée, anonyme et robuste, pour des applications qui doivent rester disponibles en temps de crise.",
    addrTitle: "Adresses",
    site: "Site :",
    apt: "Dépôt APT :",
    scriptTitle: "Installation en une commande",
    script: "Le script installe Tor, récupère la clé par Tor et s'arrête si son empreinte diffère. Lisez-le avant de l'exécuter ; --dry-run simule, --channel=beta ou canary change de canal.",
    manualTitle: "Installation manuelle",
    manual: "Mêmes paquets et même clé que packages.bobine.fit. Empreinte de la clé principale :",
    mirrorTitle: "Miroir",
    mirror: "Export statique du site, sans route serveur, sans ressource tierce ni journal de visite, hébergé sur une machine du mainteneur. Disponibilité au mieux. Le site public envoie l'en-tête Onion-Location : Tor Browser propose alors la version .onion.",
  },
  en: {
    title: "Anonymization over Tor",
    description: "Install and update Bobine over Tor: v3 onion services for the site and the APT repository.",
    h1: "Anonymization",
    why: "The site and the APT repository are also published as v3 onion services. A gym can install Bobine and read the documentation without revealing its IP address. It is also a test bench: a signed, anonymous and robust multi-OS deployment chain, for applications that must stay available in a crisis.",
    addrTitle: "Addresses",
    site: "Site:",
    apt: "APT repository:",
    scriptTitle: "One-command install",
    script: "The script installs Tor, fetches the key over Tor and stops if its fingerprint differs. Read it before running it; --dry-run simulates, --channel=beta or canary switches channel.",
    manualTitle: "Manual install",
    manual: "Same packages and same key as packages.bobine.fit. Primary key fingerprint:",
    mirrorTitle: "Mirror",
    mirror: "Static export of the site, no server route, no third-party resource and no visit log, hosted on a maintainer machine. Best-effort availability. The public site sends the Onion-Location header, so Tor Browser offers the .onion version.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = TEXT[locale];
  return buildMetadata({ locale: locale as Locale, pathname: "/documentation/anonymisation", title: t.title, description: t.description });
}

export default async function AnonymisationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = TEXT[locale];
  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: t.h1, url: lp(locale, `/documentation/anonymisation`) },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <h1 className="dx-h1-1 dx-h1-with-icon"><BrandIcon name="os.tor" size="1.1em" />{t.h1}</h1>
      <p>{t.why}</p>

      <h2 id="adresses">{t.addrTitle}</h2>
      <ul>
        <li>{t.site} <code>http://{ONION_SITE_HOST}/</code></li>
        <li>{t.apt} <code>tor+http://{ONION_APT_HOST}/</code></li>
      </ul>

      <h2 id="script">{t.scriptTitle}</h2>
      <p>{t.script}</p>
      <CodeBlock>
        <code>{`curl -fsSL https://bobine.fit/install-tor.sh -o install-tor.sh\nless install-tor.sh\nbash install-tor.sh`}</code>
      </CodeBlock>

      <h2 id="manuel">{t.manualTitle}</h2>
      <p>
        {t.manual} <code>{FINGERPRINT}</code>
      </p>
      <CodeBlock>
        <code>{APT}</code>
      </CodeBlock>

      <h2 id="miroir">{t.mirrorTitle}</h2>
      <p>
        {t.mirror} <a href={TOR_PROJECT_URL} target="_blank" rel="noopener noreferrer">torproject.org</a>
      </p>
    </>
  );
}
