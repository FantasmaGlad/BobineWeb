"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";
import { ONION_APT_HOST, ONION_SITE_HOST, TOR_PROJECT_URL } from "@/lib/onion";
import { getLanding } from "@/content/landing";
import Breadcrumbs from "@/components/page/Breadcrumbs";
import FaqJsonLd from "@/components/FaqJsonLd";
import BrandIcon from "@/components/ui/BrandIcon";
import Icon from "@/components/ui/Icon";
import "@/styles/split/tor-showcase.css";

const TOR_CURL_COMMAND = "curl -fsSL https://bobine.fit/install-tor.sh | bash";
const FINGERPRINT = "B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A";

const TOR_MANUAL_COMMANDS = `sudo apt install apt-transport-tor
curl -fsS --socks5-hostname 127.0.0.1:9050 \\
  http://${ONION_APT_HOST}/bobine.gpg \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg
echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] \\
  tor+http://${ONION_APT_HOST}/ stable main" \\
  | sudo tee /etc/apt/sources.list.d/bobine-onion.list
sudo apt update && sudo apt install bobine`;

export default function TorShowcasePage({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const c = getLanding("tor", locale);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (key: string, text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const onionSiteUrl = `http://${ONION_SITE_HOST}/`;
  const onionAptUrl = `tor+http://${ONION_APT_HOST}/`;

  const faqItems = c.faq.map((item) => ({
    category: "security" as const,
    q: item.q,
    a: item.a,
  }));

  return (
    <div className="tor-page">
      <Breadcrumbs locale={locale} id="tor" />
      <FaqJsonLd items={faqItems} />

      {/* Arrière-plan subtil et aérien à droite */}
      <Image
        src="/images/baamix-tor.webp"
        alt={isEn ? "Bobine Tor mirror and .onion repository" : "Miroir Tor et dépôt .onion de Bobine"}
        width={1200}
        height={675}
        priority
        className="tor-page__ambient-visual"
        aria-hidden="true"
      />

      {/* En-tête Hero épuré */}
      <header className="tor-hero">
        <div className="tor-hero__badge">
          <BrandIcon name="browser.tor" className="tor-hero__badge-icon" />
          <span>{c.badge}</span>
        </div>
        <h1>{c.h1}</h1>
        <p className="tor-hero__lead">{c.lead}</p>
        <div className="tor-hero__actions">
          <a
            href={onionSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <BrandIcon name="browser.tor" />
            <span>{isEn ? "Open in Tor Browser" : "Ouvrir dans Tor Browser"}</span>
          </a>
          <button
            type="button"
            onClick={() => copyToClipboard("hero-onion", onionSiteUrl)}
            className="btn-secondary"
          >
            <Icon name={copiedKey === "hero-onion" ? "check" : "copy"} size={16} />
            <span>{copiedKey === "hero-onion" ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy .onion address" : "Copier l'adresse .onion")}</span>
          </button>
        </div>
      </header>

      {/* 1. Adresses Onion officielles */}
      <section className="tor-section" aria-labelledby="tor-addresses-title">
        <header className="tor-section-header">
          <div className="tor-section-header__tag">{isEn ? "Official Services" : "Services Officiels"}</div>
          <h2 id="tor-addresses-title" className="tor-section-header__title">
            {isEn ? "Official .onion addresses" : "Les adresses .onion officielles"}
          </h2>
          <p className="tor-section-header__desc">
            {isEn
              ? "Reachable exclusively through Tor Browser or an active Tor SOCKS proxy. Connections are end-to-end encrypted with zero hops."
              : "Accessibles exclusivement via Tor Browser ou un relais Tor local. Les échanges sont chiffrés de bout en bout sans intermédiaire."}
          </p>
        </header>

        <div className="tor-addresses">
          <div className="tor-address-row">
            <div className="tor-address-row__info">
              <span className="tor-address-row__label">{isEn ? "Site Mirror" : "Site Miroir"}</span>
              <span className="tor-address-row__value">{onionSiteUrl}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("site-url", onionSiteUrl)}
              className="tor-copy-btn"
              aria-label={isEn ? "Copy site onion URL" : "Copier l'adresse onion du site"}
            >
              <Icon name={copiedKey === "site-url" ? "check" : "copy"} size={14} />
              <span>{copiedKey === "site-url" ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy" : "Copier")}</span>
            </button>
          </div>

          <div className="tor-address-row">
            <div className="tor-address-row__info">
              <span className="tor-address-row__label">{isEn ? "Linux Package Repository (APT, DNF, Pacman)" : "Miroir des paquets Linux (APT, DNF, Pacman)"}</span>
              <span className="tor-address-row__value">{onionAptUrl}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard("apt-url", onionAptUrl)}
              className="tor-copy-btn"
              aria-label={isEn ? "Copy Linux packages onion URL" : "Copier l'adresse onion du miroir des paquets Linux"}
            >
              <Icon name={copiedKey === "apt-url" ? "check" : "copy"} size={14} />
              <span>{copiedKey === "apt-url" ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy" : "Copier")}</span>
            </button>
          </div>
        </div>

        <ul className="tor-notes-list">
          <li>
            <Icon name="shield" size={15} />
            <span>
              {isEn
                ? "The hardware guide and the Baamix assistant are excluded from the mirror because they rely on external affiliate links."
                : "La boutique matériel et l'assistant Baamix sont exclus du miroir car ils reposent sur des liens tiers d'affiliation."}
            </span>
          </li>
          <li>
            <Icon name="check" size={15} />
            <span>
              {isEn
                ? "Self-hosted by the maintainer with zero telemetry, zero traffic logs, and certified identical packages."
                : "Hébergé par le mainteneur sans journal de visite, sans pistage, avec des paquets strictement identiques."}
            </span>
          </li>
        </ul>
      </section>

      {/* 2. Installation en 1 commande */}
      <section className="tor-section" aria-labelledby="tor-install-title">
        <header className="tor-section-header">
          <div className="tor-section-header__tag">{isEn ? "Fast Installation" : "Installation Rapide"}</div>
          <h2 id="tor-install-title" className="tor-section-header__title">
            {isEn ? "Install Bobine over Tor in 1 line" : "Installer Bobine par Tor en une commande"}
          </h2>
          <p className="tor-section-header__desc">
            {isEn
              ? "The install-tor.sh script handles all configuration steps and verifies the OpenPGP key signature automatically."
              : "Le script install-tor.sh prend en charge l'ensemble des étapes et s'interrompt si l'empreinte de la clé diffère."}
          </p>
        </header>

        <div className="tor-command-block">
          <div className="tor-command-block__bar">
            <span className="tor-command-block__title">
              <Icon name="terminal" size={15} />
              <span>bash · curl</span>
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard("curl-cmd", TOR_CURL_COMMAND)}
              className="tor-copy-btn"
              aria-label={isEn ? "Copy install command" : "Copier la commande d'installation"}
            >
              <Icon name={copiedKey === "curl-cmd" ? "check" : "copy"} size={14} />
              <span>{copiedKey === "curl-cmd" ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy" : "Copier")}</span>
            </button>
          </div>
          <pre className="tor-command-block__code">
            <code>{TOR_CURL_COMMAND}</code>
          </pre>
        </div>

        <ul className="tor-notes-list">
          <li>
            <Icon name="terminal" size={15} />
            <span>
              {isEn
                ? "Switch channels with --channel=stable, --channel=beta, or --channel=canary. Use --dry-run to inspect actions without installing."
                : "Choisissez votre canal avec --channel=stable, --channel=beta ou --channel=canary. Utilisez --dry-run pour inspecter sans installer."}
            </span>
          </li>
        </ul>
      </section>

      {/* 3. Configuration manuelle APT */}
      <section className="tor-section" aria-labelledby="tor-manual-title">
        <header className="tor-section-header">
          <div className="tor-section-header__tag">{isEn ? "Manual Setup" : "Configuration Manuelle"}</div>
          <h2 id="tor-manual-title" className="tor-section-header__title">
            {isEn ? "Or step by step for APT (Debian, Ubuntu, Mint)" : "Ou pas à pas pour APT (Debian, Ubuntu, Mint)"}
          </h2>
          <p className="tor-section-header__desc">
            {isEn
              ? "Configure apt-transport-tor, import the verified key into /etc/apt/keyrings, and register the .onion repository source."
              : "Configurez apt-transport-tor, importez la clé officielle dans /etc/apt/keyrings et déclarez la source .onion."}
          </p>
        </header>

        <div className="tor-command-block">
          <div className="tor-command-block__bar">
            <span className="tor-command-block__title">
              <Icon name="terminal" size={15} />
              <span>/etc/apt/sources.list.d/bobine-onion.list</span>
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard("manual-cmd", TOR_MANUAL_COMMANDS)}
              className="tor-copy-btn"
              aria-label={isEn ? "Copy manual commands" : "Copier les commandes manuelles"}
            >
              <Icon name={copiedKey === "manual-cmd" ? "check" : "copy"} size={14} />
              <span>{copiedKey === "manual-cmd" ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy" : "Copier")}</span>
            </button>
          </div>
          <pre className="tor-command-block__code">
            <code>{TOR_MANUAL_COMMANDS}</code>
          </pre>
        </div>
      </section>

      {/* 4. Vérification de la clé PGP */}
      <section className="tor-section" aria-labelledby="tor-key-title">
        <header className="tor-section-header">
          <div className="tor-section-header__tag">{isEn ? "Cryptographic Trust" : "Confiance Cryptographique"}</div>
          <h2 id="tor-key-title" className="tor-section-header__title">
            {isEn ? "Verify the OpenPGP signing key" : "Vérifier la clé de signature OpenPGP"}
          </h2>
          <p className="tor-section-header__desc">
            {isEn
              ? "Every package published on the .onion repository is cryptographically signed with the same primary key as packages.bobine.fit."
              : "Chaque paquet publié sur le miroir .onion est signé avec la même clé officielle que sur packages.bobine.fit."}
          </p>
        </header>

        <div className="tor-fingerprint-box">
          <code className="tor-fingerprint-box__code">{FINGERPRINT}</code>
          <button
            type="button"
            onClick={() => copyToClipboard("fingerprint", FINGERPRINT)}
            className="tor-copy-btn"
            aria-label={isEn ? "Copy OpenPGP fingerprint" : "Copier l'empreinte OpenPGP"}
          >
            <Icon name={copiedKey === "fingerprint" ? "check" : "copy"} size={14} />
            <span>{copiedKey === "fingerprint" ? (isEn ? "Copied!" : "Copié !") : (isEn ? "Copy fingerprint" : "Copier l'empreinte")}</span>
          </button>
        </div>

        <ul className="tor-notes-list">
          <li>
            <Icon name="shield" size={15} />
            <span>
              {isEn
                ? "APT, DNF, and Pacman immediately reject any package whose signature doesn't match this published key."
                : "APT, DNF et Pacman refusent catégoriquement tout paquet dont la signature ne correspond pas à cette clé."}
            </span>
          </li>
          <li>
            <Icon name="globe" size={15} />
            <span>
              {isEn ? (
                <>
                  Bobine is an independent open-source project and is not affiliated with The Tor Project. To support Tor:{" "}
                  <a href={TOR_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                    torproject.org
                  </a>
                  .
                </>
              ) : (
                <>
                  Bobine est un projet libre indépendant et n&apos;est pas affilié au Tor Project. Pour soutenir le réseau Tor :{" "}
                  <a href={TOR_PROJECT_URL} target="_blank" rel="noopener noreferrer">
                    torproject.org
                  </a>
                  .
                </>
              )}
            </span>
          </li>
        </ul>
      </section>

      {/* 5. FAQ Aérienne */}
      <section className="tor-section" aria-labelledby="tor-faq-title">
        <header className="tor-section-header">
          <div className="tor-section-header__tag">FAQ</div>
          <h2 id="tor-faq-title" className="tor-section-header__title">
            {isEn ? "Frequently asked questions" : "Questions fréquentes sur Tor"}
          </h2>
        </header>

        <div className="tor-faq-list">
          {c.faq.map((item) => (
            <details key={item.q} className="tor-faq-item">
              <summary>
                <span>{item.q}</span>
                <Icon name="chevron-right" size={16} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 6. Pages liées */}
      <nav className="tor-section" aria-label={isEn ? "Related pages" : "Pages liées"}>
        <header className="tor-section-header">
          <div className="tor-section-header__tag">{isEn ? "Ecosystem" : "Écosystème"}</div>
          <h2 className="tor-section-header__title">{isEn ? "Related resources" : "Ressources associées"}</h2>
        </header>

        <div className="tor-related-pills">
          {c.related.map((link) => (
            <Link key={link.path} href={link.path.startsWith("http") ? link.path : lp(locale, link.path)} className="tor-related-pill">
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
