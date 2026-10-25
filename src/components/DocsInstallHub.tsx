"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import ScrollingCode from "@/components/ScrollingCode";
import WindowsIcon from "@/components/icons/WindowsIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import TauriIcon from "@/components/icons/TauriIcon";
import TerminalIcon from "@/components/icons/TerminalIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import AndroidTvIcon from "@/components/icons/AndroidTvIcon";
import QuickStartStepper from "@/components/QuickStartStepper";
import { docChapters } from "@/content/docs/chapters";
import { useDetectedPlatform, reorderForPlatform } from "@/lib/detectPlatform";

import type { ReleaseChannelInfo } from "@/lib/releaseTypes";
import { FALLBACK_STABLE, FALLBACK_BETA, FALLBACK_CANARY } from "@/lib/releaseFallbacks";
import { useReleaseData } from "@/components/ReleaseProvider";
import { ONION_APT_HOST, ONION_SITE_HOST } from "@/lib/onion";
import TorLogo from "@/components/icons/TorLogo";
import { ANDROID } from "@/lib/productFacts";
import DistroLogo from "@/components/icons/DistroLogo";
import {
  FAMILY_NOTES,
  LINUX_FAMILIES,
  LINUX_FAMILY_IDS,
  NOT_VALIDATED_NOTE,
  SIGNING_KEY_FINGERPRINT,
  archCommands,
  archInstallScript,
  downloadKey,
  fedoraCommands,
  fedoraInstallScript,
  keyCheckCommand,
  packageFileName,
  packageLink,
  packageUrl,
  repoStatusNote,
  updateCommand,
  type LinuxFamilyId,
  type PackageChannel,
} from "@/lib/linuxPackages";
import "@/styles/split/pages-docs.css";

type InstallTab = "windows" | "macos" | "linux" | "android" | "ios" | "tauri" | "cli";
type AndroidVariant = "mobile" | "tv";

const TOR_APT_COMMANDS = `sudo apt install apt-transport-tor
curl -fsS --socks5-hostname 127.0.0.1:9050 http://${ONION_APT_HOST}/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg
echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://${ONION_APT_HOST}/ stable main" | sudo tee /etc/apt/sources.list.d/bobine-onion.list
sudo apt update && sudo apt install bobine`;

export default function DocsInstallHub({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const detected = useDetectedPlatform();
  const [selectedTab, setSelectedTab] = useState<InstallTab | null>(null);
  // Un visiteur sur Android TV n'a pas d'onglet propre : il tombe sur l'onglet Android, variante TV.
  const detectedTab: InstallTab | null = detected === "android-tv" ? "android" : (detected as InstallTab | null);
  const activeTab: InstallTab = selectedTab ?? detectedTab ?? "windows";
  const roadmapChapter = docChapters[locale].find((c) => c.id === "feuille-de-route");
  const roadmapSubsections = roadmapChapter?.subsections ?? [];
  const androidRoadmap = roadmapSubsections.find((s) => s.subtitle.includes("Android"));
  const iosRoadmap = roadmapSubsections.find((s) => s.subtitle.includes("iOS"));
  const initialRelease = useReleaseData();
  const [stable, setStable] = useState<ReleaseChannelInfo>(initialRelease?.stable ?? FALLBACK_STABLE);
  const [beta, setBeta] = useState<ReleaseChannelInfo>(initialRelease?.beta ?? FALLBACK_BETA);
  const [canary, setCanary] = useState<ReleaseChannelInfo>(initialRelease?.canary ?? FALLBACK_CANARY);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [selectedArch, setSelectedArch] = useState<"x86_64" | "arm64">("x86_64");
  const [selectedFamily, setSelectedFamily] = useState<LinuxFamilyId>("debian");
  const [selectedAndroidVariant, setSelectedAndroidVariant] = useState<AndroidVariant | null>(null);
  const androidVariant: AndroidVariant = selectedAndroidVariant ?? (detected === "android-tv" ? "tv" : "mobile");

  // Détection légère de l'architecture ARM64 côté client (Snapdragon, Linux aarch64, Windows ARM)
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent || "";
    if (/\b(aarch64|arm64|armv8|woa|snapdragon)\b/i.test(ua)) {
      setSelectedArch("arm64");
      return;
    }
    const navWithUAData = navigator as Navigator & {
      userAgentData?: {
        getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
      };
    };
    navWithUAData.userAgentData
      ?.getHighEntropyValues?.(["architecture"])
      .then((vals) => {
        if (vals?.architecture && /arm/i.test(vals.architecture)) {
          setSelectedArch("arm64");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Miroir Tor : pas de route serveur, valeurs de repli déjà en place.
    if (process.env.NEXT_PUBLIC_BOBINE_ONION === "1") return;
    fetch("/api/github-stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.stable) setStable(data.stable);
        if (data.beta) setBeta(data.beta);
        if (data.canary) setCanary(data.canary);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2200);
    }
  };

  const isArm = selectedArch === "arm64";
  const cleanVersion = stable.version.replace(/^V/i, "");

  const renderArchSwitch = () => (
    <div className="docs-arch-switch-wrap">
      <span className="docs-arch-switch-label">{isEn ? "Architecture :" : "Architecture :"}</span>
      <div className="docs-arch-switch-pill" role="radiogroup" aria-label={isEn ? "CPU Architecture" : "Architecture processeur"}>
        <button
          type="button"
          role="radio"
          aria-checked={selectedArch === "x86_64"}
          className={`docs-arch-switch-btn ${selectedArch === "x86_64" ? "is-active" : ""}`}
          onClick={() => setSelectedArch("x86_64")}
        >
          <span>x86_64</span>
          <span className="docs-arch-switch-sub">{isEn ? "(Intel / AMD)" : "(Intel / AMD)"}</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={selectedArch === "arm64"}
          className={`docs-arch-switch-btn ${selectedArch === "arm64" ? "is-active" : ""}`}
          onClick={() => setSelectedArch("arm64")}
        >
          <span>ARM64</span>
          <span className="docs-arch-switch-sub">{isEn ? "(Snapdragon, Pi 5)" : "(Snapdragon, Pi 5)"}</span>
        </button>
      </div>
    </div>
  );

  const renderFamilySwitch = () => (
    <div className="docs-arch-switch-wrap">
      <span className="docs-arch-switch-label">{isEn ? "Distribution :" : "Distribution :"}</span>
      <div className="docs-arch-switch-pill" role="radiogroup" aria-label={isEn ? "Linux distribution family" : "Famille de distribution Linux"}>
        {LINUX_FAMILY_IDS.map((id) => {
          const family = LINUX_FAMILIES[id];
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selectedFamily === id}
              className={`docs-arch-switch-btn ${selectedFamily === id ? "is-active" : ""}`}
              onClick={() => setSelectedFamily(id)}
            >
              <DistroLogo id={family.logo} />
              <span>{family.label[isEn ? "en" : "fr"]}</span>
              {!family.live && <span className="docs-soon-tag">{isEn ? "Soon" : "Bientôt"}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCopyBlock = (text: string) => (
    <div className="docs-copyable-cmd dx-div-16">
      <code className="dx-code-1">{text}</code>
      <button
        type="button"
        onClick={() => copyToClipboard(text)}
        className="docs-copy-btn"
        aria-label={isEn ? "Copy command" : "Copier la commande"}
      >
        {copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}
      </button>
    </div>
  );

  /** Mention « dès la mise en ligne des dépôts » : absente dès que l'interrupteur des dépôts est vrai. */
  const renderRepoNote = (family: LinuxFamilyId) => {
    const note = repoStatusNote(family, isEn ? "en" : "fr");
    return note ? <p className="docs-soon-note" role="note">{note}</p> : null;
  };

  const renderStep = (num: number, title: React.ReactNode, body: React.ReactNode) => (
    <div className="docs-step-card">
      <div className="docs-step-card__num">{num}</div>
      <div className="docs-step-card__content">
        <h4>{title}</h4>
        {body}
      </div>
    </div>
  );

  const renderDistroTable = () => (
    <div className="docs-distro-table-wrap">
      <table className="docs-distro-table">
        <caption>{isEn ? "Supported Linux distributions" : "Distributions Linux prises en charge"}</caption>
        <thead>
          <tr>
            <th scope="col">{isEn ? "Family" : "Famille"}</th>
            <th scope="col">{isEn ? "Distributions" : "Distributions"}</th>
            <th scope="col">{isEn ? "Package" : "Paquet"}</th>
            <th scope="col">{isEn ? "Update" : "Mise à jour"}</th>
            <th scope="col">{isEn ? "Status" : "Statut"}</th>
          </tr>
        </thead>
        <tbody>
          {LINUX_FAMILY_IDS.map((id) => {
            const family = LINUX_FAMILIES[id];
            return (
              <tr key={id} className={selectedFamily === id ? "is-active" : undefined}>
                <th scope="row">
                  <button type="button" className="docs-distro-table__pick" aria-pressed={selectedFamily === id} onClick={() => setSelectedFamily(id)}>
                    <DistroLogo id={family.logo} />
                    <span>{family.label[isEn ? "en" : "fr"]}</span>
                  </button>
                </th>
                <td>{family.distros[isEn ? "en" : "fr"]}</td>
                <td><code>{family.extension}</code> · {family.manager}</td>
                <td><code>{updateCommand(id)}</code></td>
                <td>{family.live ? (isEn ? "Available" : "Disponible") : (isEn ? "Soon" : "Bientôt")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderAndroidVariantSwitch = () => (
    <div className="docs-arch-switch-wrap">
      <span className="docs-arch-switch-label">{isEn ? "Device :" : "Appareil :"}</span>
      <div className="docs-arch-switch-pill" role="radiogroup" aria-label={isEn ? "Android device type" : "Type d'appareil Android"}>
        <button
          type="button"
          role="radio"
          aria-checked={androidVariant === "mobile"}
          className={`docs-arch-switch-btn ${androidVariant === "mobile" ? "is-active" : ""}`}
          onClick={() => setSelectedAndroidVariant("mobile")}
        >
          <span>Android</span>
          <span className="docs-arch-switch-sub">{isEn ? "(Tablets, Google Books)" : "(Tablettes, Google Books)"}</span>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={androidVariant === "tv"}
          className={`docs-arch-switch-btn ${androidVariant === "tv" ? "is-active" : ""}`}
          onClick={() => setSelectedAndroidVariant("tv")}
        >
          <span>Android TV</span>
          <span className="docs-arch-switch-sub">{isEn ? "(Google TV, Xiaomi)" : "(Google TV, Xiaomi)"}</span>
        </button>
      </div>
    </div>
  );

  const renderDivider = () => (
    <div className="docs-install-divider">
      <div className="docs-install-divider__line" />
      <div className="docs-install-divider__pill">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <span>{isEn ? "Step-by-step setup guide" : "Guide d'installation pas à pas"}</span>
      </div>
      <div className="docs-install-divider__line" />
    </div>
  );

  interface ChannelCardConfig {
    /** Absent : le fichier n'est pas (encore) publié, le bouton devient un « Bientôt » inactif. */
    stableUrl?: string;
    stableLabel: string;
    betaUrl?: string;
    betaLabel: string;
    canaryUrl?: string;
    canaryLabel: string;
    archText: string;
  }

  const renderChannelCards = (cfg: ChannelCardConfig) => (
    <>
      <div className="docs-channels-grid">
        {/* Canal Stable */}
        <div className="download-modal__channel-card download-modal__channel-card--stable">
          <div className="download-modal__card-header docs-channel-card__header">
            <div className="download-modal__card-tag-row docs-channel-card__tag-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="download-modal__channel-icon" src="/images/channels/bobine-stable.webp" alt="" />
              <span className="download-modal__badge download-modal__badge--stable">
                {isEn ? "Stable Release" : "Version Stable"}
              </span>
              <span className="download-modal__badge download-modal__badge--rec">
                {isEn ? "Recommended" : "Recommandé"}
              </span>
            </div>
            <span className="download-modal__version docs-channel-card__version">{stable.version}</span>
          </div>

          <p className="download-modal__card-desc">
            {isEn
              ? "Official production release. 100% verified, stable and recommended for fitness studio playout."
              : "Version officielle certifiée. 100% testée, stable et recommandée pour l'exploitation en salle de sport."}
          </p>

          <div className="dx-div-12">
            {cfg.stableUrl ? (
              <a
                href={cfg.stableUrl}
                download
                className="docs-channel-btn docs-channel-btn--stable"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{cfg.stableLabel}</span>
              </a>
            ) : (
              <button type="button" className="docs-channel-btn docs-channel-btn--soon" disabled>
                {isEn ? "Soon" : "Bientôt"}
              </button>
            )}
          </div>
        </div>

        {/* Canal Bêta */}
        <div className="download-modal__channel-card download-modal__channel-card--beta">
          <div className="download-modal__card-header docs-channel-card__header">
            <div className="download-modal__card-tag-row docs-channel-card__tag-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="download-modal__channel-icon" src="/images/channels/bobine-beta.webp" alt="" />
              <span className="download-modal__badge download-modal__badge--beta">
                {isEn ? "Beta (curated)" : "Bêta (curée)"}
              </span>
            </div>
            <span className="download-modal__version docs-channel-card__version">{beta.commit ? `#${beta.commit}` : (isEn ? "Rolling" : "Continue")}</span>
          </div>

          <p className="download-modal__card-desc">
            {isEn
              ? "Beta: batches of features/fixes I select and publish manually when ready."
              : "Bêta : lots de fonctionnalités/correctifs que je sélectionne et publie manuellement quand ils sont prêts."}
          </p>

          <div className="dx-div-13">
            {cfg.betaUrl ? (
              <a
                href={cfg.betaUrl}
                download
                className="docs-channel-btn docs-channel-btn--beta"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{cfg.betaLabel}</span>
              </a>
            ) : (
              <button type="button" className="docs-channel-btn docs-channel-btn--soon" disabled>
                {isEn ? "Soon" : "Bientôt"}
              </button>
            )}
          </div>
        </div>

        {/* Canal Canary */}
        <div className="download-modal__channel-card download-modal__channel-card--canary">
          <div className="download-modal__card-header docs-channel-card__header">
            <div className="download-modal__card-tag-row docs-channel-card__tag-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="download-modal__channel-icon" src="/images/channels/bobine-canary.webp" alt="" />
              <span className="download-modal__badge download-modal__badge--canary">
                {isEn ? "Canary (rolling)" : "Canary (rolling)"}
              </span>
            </div>
            <span className="download-modal__version docs-channel-card__version">{canary.commit ? `#${canary.commit}` : (isEn ? "Rolling" : "Continue")}</span>
          </div>

          <p className="download-modal__card-desc">
            {isEn
              ? "Canary: rebuilt automatically on every commit to main. Earliest access, zero curation, untested."
              : "Canary : reconstruite automatiquement à chaque commit sur main. Accès le plus anticipé, zéro curation, non testé."}
          </p>

          <div className="dx-div-13">
            {cfg.canaryUrl ? (
              <a
                href={cfg.canaryUrl}
                download
                className="docs-channel-btn docs-channel-btn--canary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{cfg.canaryLabel}</span>
              </a>
            ) : (
              <button type="button" className="docs-channel-btn docs-channel-btn--soon" disabled>
                {isEn ? "Soon" : "Bientôt"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="docs-method-meta-row">
        <span className="docs-method-version-text">{stable.version}</span>
        <span className="docs-method-meta-dot">·</span>
        <span>{cfg.archText}</span>
        <span className="docs-method-meta-dot">·</span>
        <a
          href="https://github.com/FantasmaGlad/Bobine/releases"
          target="_blank"
          rel="noreferrer"
          className="docs-method-source-link"
        >
          GitHub Releases
        </a>
      </div>
    </>
  );

  const renderCliChannelCards = () => (
    <>
      <div className="docs-channels-grid">
        {/* Canal Stable CLI */}
        <div className="download-modal__channel-card download-modal__channel-card--stable">
          <div className="download-modal__card-header docs-channel-card__header">
            <div className="download-modal__card-tag-row docs-channel-card__tag-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="download-modal__channel-icon" src="/images/channels/bobine-stable.webp" alt="" />
              <span className="download-modal__badge download-modal__badge--stable">
                {isEn ? "Stable Release" : "Version Stable"}
              </span>
              <span className="download-modal__badge download-modal__badge--rec">
                {isEn ? "Recommended" : "Recommandé"}
              </span>
            </div>
            <span className="download-modal__version docs-channel-card__version">{stable.version}</span>
          </div>

          <p className="download-modal__card-desc">
            {isEn
              ? "Official production release. 100% verified, stable and recommended for dedicated 24/7 gym kiosks."
              : "Version officielle certifiée. 100% testée, stable et recommandée pour l'exploitation en salle de sport."}
          </p>

          <div className="download-modal__cli-block dx-div-13">
            <ScrollingCode>curl -fsSL https://bobine.fit/install.sh | sudo bash</ScrollingCode>
            <button
              type="button"
              className="download-modal__cli-copy-btn download-modal__cli-copy-btn--stable"
              onClick={() => copyToClipboard("curl -fsSL https://bobine.fit/install.sh | sudo bash")}
              aria-label={isEn ? "Copy command" : "Copier la commande"}
            >
              {copiedCmd ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              )}
              <span>{copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}</span>
            </button>
          </div>
        </div>

        {/* Canal Bêta CLI */}
        <div className="download-modal__channel-card download-modal__channel-card--beta">
          <div className="download-modal__card-header docs-channel-card__header">
            <div className="download-modal__card-tag-row docs-channel-card__tag-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="download-modal__channel-icon" src="/images/channels/bobine-beta.webp" alt="" />
              <span className="download-modal__badge download-modal__badge--beta">
                {isEn ? "Beta (curated)" : "Bêta (curée)"}
              </span>
            </div>
            <span className="download-modal__version docs-channel-card__version">{beta.commit ? `#${beta.commit}` : (isEn ? "Rolling" : "Continue")}</span>
          </div>

          <p className="download-modal__card-desc">
            {isEn
              ? "Beta: batches of features/fixes I select and publish manually when ready."
              : "Bêta : lots de fonctionnalités/correctifs que je sélectionne et publie manuellement quand ils sont prêts."}
          </p>

          <div className="download-modal__cli-block dx-div-13">
            <ScrollingCode>curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta</ScrollingCode>
            <button
              type="button"
              className="download-modal__cli-copy-btn download-modal__cli-copy-btn--beta"
              onClick={() => copyToClipboard("curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta")}
              aria-label={isEn ? "Copy command" : "Copier la commande"}
            >
              {copiedCmd ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              )}
              <span>{copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}</span>
            </button>
          </div>
        </div>

        {/* Canal Canary CLI */}
        <div className="download-modal__channel-card download-modal__channel-card--canary">
          <div className="download-modal__card-header docs-channel-card__header">
            <div className="download-modal__card-tag-row docs-channel-card__tag-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="download-modal__channel-icon" src="/images/channels/bobine-canary.webp" alt="" />
              <span className="download-modal__badge download-modal__badge--canary">
                {isEn ? "Canary (rolling)" : "Canary (rolling)"}
              </span>
            </div>
            <span className="download-modal__version docs-channel-card__version">{canary.commit ? `#${canary.commit}` : (isEn ? "Rolling" : "Continue")}</span>
          </div>

          <p className="download-modal__card-desc">
            {isEn
              ? "Canary: rebuilt automatically on every commit to main. Earliest access, zero curation, untested."
              : "Canary : reconstruite automatiquement à chaque commit sur main. Accès le plus anticipé, zéro curation, non testé."}
          </p>

          <div className="download-modal__cli-block dx-div-13">
            <ScrollingCode>curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=canary</ScrollingCode>
            <button
              type="button"
              className="download-modal__cli-copy-btn download-modal__cli-copy-btn--canary"
              onClick={() => copyToClipboard("curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=canary")}
              aria-label={isEn ? "Copy command" : "Copier la commande"}
            >
              {copiedCmd ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              )}
              <span>{copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="docs-method-meta-row">
        <span className="docs-method-version-text">{stable.version}</span>
        <span className="docs-method-meta-dot">·</span>
        <span>Debian 13 (x86_64 & ARM64 auto-detect)</span>
        <span className="docs-method-meta-dot">·</span>
        <a
          href="https://github.com/FantasmaGlad/Bobine/releases"
          target="_blank"
          rel="noreferrer"
          className="docs-method-source-link"
        >
          GitHub Releases
        </a>
      </div>
    </>
  );

  // Onglet Linux : famille choisie (Debian / Ubuntu, Fedora, Arch Linux), lien du paquet de chaque canal.
  const linuxArch = isArm ? "arm64" : "x86_64";
  const linuxFormat = `${LINUX_FAMILIES[selectedFamily].extension} ${isArm ? "ARM64" : "x86_64"}`;
  const linuxLink = (info: ReleaseChannelInfo, channel: PackageChannel, tag: string) =>
    selectedFamily === "debian"
      ? info.downloads[downloadKey("debian", linuxArch)] || packageUrl("debian", channel, linuxArch, tag)
      : packageLink(info.downloads, selectedFamily, linuxArch);
  const linuxHero = {
    debian: {
      title: isEn ? "Bobine for Linux Desktop (.deb package — x86_64 & ARM64)" : "Bobine pour Linux Bureau (Paquet .deb — x86_64 & ARM64)",
      desc: isEn
        ? "Native Debian, Ubuntu, and Linux Mint package for x86_64 and ARM64 (Snapdragon, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi). Certified AppStream metadata for Ubuntu App Center, standard XDG directory structure, and desktop integration."
        : "Paquet natif pour Debian, Ubuntu et Linux Mint en x86_64 et ARM64 (Snapdragon, NVIDIA DGX Spark, Raspberry Pi 5, Orange Pi). Métadonnées AppStream certifiées pour les logithèques, intégration XDG et lanceur de bureau.",
    },
    fedora: {
      title: isEn ? "Bobine for Fedora and derivatives (.rpm package — x86_64 & ARM64)" : "Bobine pour Fedora et dérivés (Paquet .rpm — x86_64 & ARM64)",
      desc: isEn
        ? "Native package and dnf repository for Fedora, Nobara and, through EPEL, RHEL, AlmaLinux and Rocky Linux, on x86_64 and aarch64."
        : "Paquet natif et dépôt dnf pour Fedora, Nobara et, via EPEL, RHEL, AlmaLinux et Rocky Linux, en x86_64 et aarch64.",
    },
    arch: {
      title: isEn ? "Bobine for Arch Linux and derivatives (pacman package — x86_64 & ARM64)" : "Bobine pour Arch Linux et dérivés (Paquet pacman — x86_64 & ARM64)",
      desc: isEn
        ? "Native package and pacman repository for Arch Linux, EndeavourOS, CachyOS and Manjaro on x86_64, and Arch Linux ARM on aarch64."
        : "Paquet natif et dépôt pacman pour Arch Linux, EndeavourOS, CachyOS et Manjaro en x86_64, et Arch Linux ARM en aarch64.",
    },
  }[selectedFamily];

  const renderDerivatives = (family: "fedora" | "arch") => {
    const l = isEn ? "en" : "fr";
    return (
      <>
        <ul className="docs-plain-list">
          {FAMILY_NOTES[family].derivatives.map((d) => (
            <li key={d.fr}>{d[l]}</li>
          ))}
        </ul>
        <ul className="docs-plain-list">
          {/* La limite ffmpeg de Fedora a déjà son étape : seules les autres limites sont rappelées ici. */}
          {FAMILY_NOTES[family].limits.slice(family === "fedora" ? 1 : 0).map((d) => (
            <li key={d.fr}>{d[l]}</li>
          ))}
        </ul>
        <p className="dx-p-6">{NOT_VALIDATED_NOTE[l]}</p>
      </>
    );
  };

  const renderFedoraSteps = () => {
    const c = fedoraCommands();
    return (
      <div className="docs-steps-flow">
        <h3 className="docs-steps-flow__heading">{isEn ? "Installation options:" : "Options d'installation :"}</h3>
        {renderStep(
          1,
          isEn ? "Option A: Official dnf repository (Recommended — x86_64 & aarch64)" : "Option A : Dépôt dnf officiel (Recommandé — x86_64 & aarch64)",
          <>
            <p>
              {isEn
                ? "Add the signed repository (packages.bobine.fit/fedora) to receive Bobine with your regular dnf upgrade. The first install shows the signing key fingerprint: compare it with the one below before accepting."
                : "Ajoutez le dépôt signé (packages.bobine.fit/fedora) pour recevoir Bobine avec votre dnf upgrade habituel. La première installation affiche l'empreinte de la clé de signature : comparez-la à celle ci-dessous avant d'accepter."}
            </p>
            {renderRepoNote("fedora")}
            {renderCopyBlock(fedoraInstallScript())}
            <p className="dx-p-6">
              {isEn ? "On dnf 4 (RHEL, AlmaLinux, Rocky Linux) the first command is: " : "Sur dnf 4 (RHEL, AlmaLinux, Rocky Linux), la première commande est : "}
              <code>{c.addRepoLegacy}</code>
              {isEn
                ? ". For pre-release builds, replace stable with beta (curated) or canary (rolling) in the repo file name."
                : ". Pour les versions préliminaires, remplacez stable par beta (curée) ou canary (rolling) dans le nom du fichier .repo."}
            </p>
          </>
        )}
        {renderStep(
          2,
          isEn ? "Option B: Direct .rpm package (Offline / 1-Click)" : "Option B : Paquet direct .rpm (Hors ligne / 1 clic)",
          <>
            <p>
              {isEn
                ? "Download the .rpm above and install it from the software center (GNOME Software, KDE Discover) or with:"
                : "Téléchargez le .rpm ci-dessus et installez-le depuis la logithèque (GNOME Logiciels, KDE Discover) ou avec :"}
            </p>
            {renderCopyBlock(`sudo dnf install ./${packageFileName("fedora", "stable", linuxArch, "*")}`)}
          </>
        )}
        {renderStep(
          3,
          isEn ? "Full ffmpeg through RPM Fusion" : "ffmpeg complet via RPM Fusion",
          <>
            <p>
              {isEn
                ? "Fedora ships ffmpeg-free, without several codecs. To play every class format, add RPM Fusion and swap it for the full ffmpeg:"
                : "Fedora fournit ffmpeg-free, privé de plusieurs codecs. Pour lire tous les formats de cours, ajoutez RPM Fusion et remplacez-le par le ffmpeg complet :"}
            </p>
            {renderCopyBlock(c.ffmpeg)}
          </>
        )}
        {renderStep(
          4,
          isEn ? "Check the key and update" : "Vérifier la clé et mettre à jour",
          <>
            <p>
              {isEn ? "Signing key fingerprint: " : "Empreinte de la clé de signature : "}
              <code>{SIGNING_KEY_FINGERPRINT}</code>
              {isEn ? ". To read it before installing:" : ". Pour la lire avant d'installer :"}
            </p>
            {renderCopyBlock(keyCheckCommand("fedora"))}
            <p className="dx-p-6">
              {isEn ? "Updates come with the rest of the system: " : "Les mises à jour arrivent avec le reste du système : "}
              <code>{c.upgrade}</code>
            </p>
          </>
        )}
        {renderStep(5, isEn ? "Derivatives and limits" : "Dérivés et limites", renderDerivatives("fedora"))}
      </div>
    );
  };

  const renderArchSteps = () => {
    const c = archCommands();
    return (
      <div className="docs-steps-flow">
        <h3 className="docs-steps-flow__heading">{isEn ? "Installation options:" : "Options d'installation :"}</h3>
        {renderStep(
          1,
          isEn ? "Option A: Official pacman repository (Recommended — x86_64 & aarch64)" : "Option A : Dépôt pacman officiel (Recommandé — x86_64 & aarch64)",
          <>
            <p>
              {isEn
                ? "Import and trust the signing key, add the [bobine] section to /etc/pacman.conf, then install. With SigLevel = Required DatabaseOptional, pacman rejects any package whose signature does not match."
                : "Importez et approuvez la clé de signature, ajoutez la section [bobine] à /etc/pacman.conf, puis installez. Avec SigLevel = Required DatabaseOptional, pacman refuse tout paquet dont la signature ne correspond pas."}
            </p>
            {renderRepoNote("arch")}
            {renderCopyBlock(archInstallScript())}
            <p className="dx-p-6">
              {isEn
                ? "For pre-release builds, replace stable with beta (curated) or canary (rolling) in the Server line. Install and update use -Syu: on Arch a package is never updated alone."
                : "Pour les versions préliminaires, remplacez stable par beta (curée) ou canary (rolling) dans la ligne Server. L'installation et la mise à jour passent par -Syu : sur Arch, un paquet ne se met jamais à jour seul."}
            </p>
          </>
        )}
        {renderStep(
          2,
          isEn ? "Option B: Direct package (Offline)" : "Option B : Paquet direct (Hors ligne)",
          <>
            <p>{isEn ? "Download the .pkg.tar.zst above and install it with:" : "Téléchargez le .pkg.tar.zst ci-dessus et installez-le avec :"}</p>
            {renderCopyBlock(`sudo pacman -U ./${packageFileName("arch", "stable", linuxArch, "*")}`)}
          </>
        )}
        {renderStep(
          3,
          isEn ? "Check the key and update" : "Vérifier la clé et mettre à jour",
          <>
            <p>
              {isEn ? "Signing key fingerprint: " : "Empreinte de la clé de signature : "}
              <code>{SIGNING_KEY_FINGERPRINT}</code>
              {isEn ? ". To read it before trusting the key:" : ". Pour la lire avant d'approuver la clé :"}
            </p>
            {renderCopyBlock(keyCheckCommand("arch"))}
            <p className="dx-p-6">
              {isEn ? "Updates come with the rest of the system: " : "Les mises à jour arrivent avec le reste du système : "}
              <code>{c.upgrade}</code>
            </p>
          </>
        )}
        {renderStep(4, isEn ? "Derivatives and limits" : "Dérivés et limites", renderDerivatives("arch"))}
      </div>
    );
  };

  const tabs: Array<{
    id: InstallTab;
    group: "desktop" | "appliance" | "roadmap";
    name: string;
    format: string;
    badge: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "windows",
      group: "desktop",
      name: "Windows",
      format: ".exe (11, 10, IoT)",
      badge: isEn ? "1-click" : "1 clic",
      icon: <WindowsIcon size={20} />,
    },
    {
      id: "macos",
      group: "desktop",
      name: "macOS",
      format: ".dmg (Apple Silicon)",
      badge: isEn ? "1-click" : "1 clic",
      icon: <AppleIcon size={20} />,
    },
    {
      id: "linux",
      group: "desktop",
      name: isEn ? "Linux Desktop" : "Linux Bureau",
      format: ".deb · .rpm · Arch",
      badge: isEn ? "1-click" : "1 clic",
      icon: <LinuxIcon size={20} />,
    },
    {
      id: "android",
      group: "desktop",
      name: "Android",
      format: isEn ? "Package .apk" : "Paquet .apk",
      badge: isEn ? "1-click" : "1 clic",
      icon: <AndroidIcon size={20} />,
    },
    {
      id: "ios",
      group: "roadmap",
      name: "iOS / iPadOS",
      format: isEn ? "Explored idea" : "Piste explorée",
      badge: isEn ? "Roadmap" : "À venir",
      icon: <AppleIcon size={20} />,
    },
    {
      id: "tauri",
      group: "appliance",
      name: "Bobine Assistant",
      format: isEn ? "Tauri 2 · Network" : "Tauri 2 · Réseau",
      badge: isEn ? "Network" : "Réseau",
      icon: <TauriIcon size={20} />,
    },
    {
      id: "cli",
      group: "appliance",
      name: isEn ? "Dedicated Kiosk" : "Kiosque",
      format: "Debian 13 · CLI",
      badge: isEn ? "24/7 Gym" : "Salle 24/7",
      icon: <TerminalIcon size={18} />,
    },
  ];

  const orderedTabs = reorderForPlatform(
    [
      ...tabs.filter((tab) => tab.group === "desktop"),
      ...tabs.filter((tab) => tab.group === "appliance"),
      ...tabs.filter((tab) => tab.group === "roadmap"),
    ],
    detected
  );

  const renderTabButton = (tab: (typeof tabs)[number]) => {
    const isSelected = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        role="tab"
        type="button"
        id={`tab-${tab.id}`}
        aria-selected={isSelected}
        aria-controls={`panel-${tab.id}`}
        onClick={() => setSelectedTab(tab.id)}
        className={`docs-install-tab-btn ${isSelected ? "is-active" : ""}`}
      >
        <span className="docs-install-tab-icon">{tab.icon}</span>
        <span className="docs-install-tab-text">
          <span className="docs-install-tab-name">{tab.name}</span>
          <span className="docs-install-tab-format">{tab.format}</span>
        </span>
      </button>
    );
  };

  return (
    <div className="docs-install-hub">
      {/* Sélecteur de méthode d'installation avec logos vectoriels */}
      <div className="docs-install-selector-wrap">
        <div className="docs-install-nav-header">
          <span className="docs-install-nav-label">
            {isEn ? "Installation methods :" : "Méthodes d'installations :"}
          </span>
        </div>

        <div
          role="tablist"
          aria-label={isEn ? "Installation methods" : "Méthodes d'installation"}
          className="docs-install-tabs"
        >
          {orderedTabs.map(renderTabButton)}
        </div>
      </div>

      {/* Contenu Dédié par Méthode */}

      {/* 1. WINDOWS */}
      {activeTab === "windows" && (
        <div
          id="panel-windows"
          role="tabpanel"
          aria-labelledby="tab-windows"
          className="docs-install-panel animate-fade-in"
        >
          {/* Carte de téléchargement direct */}
          <div className="docs-method-hero">
            <div className="docs-method-hero__left">
              <div className="docs-method-hero__icon">
                <WindowsIcon size={32} />
              </div>
              <div className="dx-div-14">
                <h2 className="docs-method-hero__title">
                  {isEn ? "Bobine for Windows 11, 10, Windows ARM & Windows IoT" : "Bobine pour Windows 11, 10, Windows ARM et Windows IoT"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Native 1-click installer for x86_64 and ARM64 (Qualcomm Snapdragon X Elite / X Plus). Zero command line, runs silently in the background with a system tray companion and automatic firewall configuration."
                    : "Installation native en 1 clic pour x86_64 et ARM64 (Qualcomm Snapdragon X Elite / X Plus). Zéro ligne de commande, démarrage silencieux sans console noire avec icône en barre des tâches."}
                </p>
                {renderArchSwitch()}
              </div>
            </div>

            {renderChannelCards({
              stableUrl: isArm
                ? (stable.downloads.windowsArm64 || `https://github.com/FantasmaGlad/Bobine/releases/download/${stable.version}/Bobine-Setup-${cleanVersion}-arm64.exe`)
                : stable.downloads.windows,
              stableLabel: isArm
                ? (isEn ? `Download Stable (${stable.version}) · .exe ARM64` : `Télécharger la Stable (${stable.version}) · .exe ARM64`)
                : (isEn ? `Download Stable (${stable.version}) · .exe x86_64` : `Télécharger la Stable (${stable.version}) · .exe x86_64`),
              betaUrl: isArm
                ? (beta.downloads.windowsArm64 || "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta-arm64.exe")
                : beta.downloads.windows,
              betaLabel: isArm
                ? (isEn ? "Download Beta · .exe ARM64" : "Télécharger la Bêta · .exe ARM64")
                : (isEn ? "Download Beta · .exe x86_64" : "Télécharger la Bêta · .exe x86_64"),
              canaryUrl: isArm
                ? (canary.downloads.windowsArm64 || "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-Setup-canary-arm64.exe")
                : canary.downloads.windows,
              canaryLabel: isArm
                ? (isEn ? "Download Canary · .exe ARM64" : "Télécharger la Canary · .exe ARM64")
                : (isEn ? "Download Canary · .exe x86_64" : "Télécharger la Canary · .exe x86_64"),
              archText: isArm ? "ARM64 (Qualcomm Snapdragon X Elite / X Plus)" : "x86_64 (Intel / AMD)",
            })}
          </div>

          {renderDivider()}

          {/* Étapes simples grand public */}
          <div className="docs-steps-flow">
            <h3 className="docs-steps-flow__heading">
              {isEn ? "Step-by-step setup (under 2 minutes):" : "Guide pas à pas en 5 étapes (moins de 2 minutes) :"}
            </h3>

            <div className="docs-step-card">
              <div className="docs-step-card__num">1</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Download the installer" : "Téléchargez le programme d'installation"}</h4>
                <p>
                  {isEn
                    ? "Click the download button above to get Bobine-Setup-x.y.z.exe (for Intel / AMD) or Bobine-Setup-x.y.z-arm64.exe (for Snapdragon X Elite / X Plus)."
                    : "Cliquez sur le bouton ci-dessus pour récupérer Bobine-Setup-x.y.z.exe (pour Intel / AMD) ou Bobine-Setup-x.y.z-arm64.exe (pour PC ARM Snapdragon X Elite / X Plus)."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">2</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Launch the setup wizard" : "Lancez l'assistant d'installation"}</h4>
                <p>
                  {isEn
                    ? "Double-click Bobine-Setup-x.y.z.exe. The standard Windows setup wizard will create a desktop shortcut and prepare the self-contained environment."
                    : "Double-cliquez sur le fichier Bobine-Setup-x.y.z.exe. L'assistant prépare l'environnement autonome et crée un raccourci officiel sur votre Bureau."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">3</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Silent background run & System Tray" : "Exécution silencieuse & Zone de notification"}</h4>
                <p>
                  {isEn
                    ? "Bobine starts silently in the background without any intrusive black console windows. A discrete Bobine icon appears in your Windows system tray (near the clock) allowing you to manage or close the service anytime."
                    : "Bobine démarre en arrière-plan sans aucune fenêtre de console noire intrusive. Une icône discrète apparaît dans votre zone de notification (près de l'horloge) pour piloter ou quitter le service à tout moment."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">4</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Browser interface & Mobile Wi-Fi remote" : "Accès dans le navigateur & Télécommande Wi-Fi"}</h4>
                <p>
                  {isEn
                    ? "Your default web browser automatically opens to http://localhost:8000. An inbound firewall rule is automatically added to Windows Defender so any smartphone on your local Wi-Fi can open the remote via your PC's IP address."
                    : "Votre navigateur par défaut s'ouvre automatiquement à l'adresse http://localhost:8000. Une règle de pare-feu Windows Defender est automatiquement configurée afin que vos smartphones en Wi-Fi puissent piloter la régie immédiatement."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">5</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Import workouts & Anti-sleep safeguard" : "Ajoutez vos cours & Protection anti-veille"}</h4>
                <p>
                  {isEn
                    ? "Drag and drop your video workout files (MP4, MKV, WebM) directly into the library. The built-in Screen Wake Lock API ensures your screen stays awake during workouts without altering your Windows power plans."
                    : "Glissez-déposez vos vidéos d'entraînement (MP4, MKV, WebM) dans l'onglet Vidéothèque. Grâce à l'API Screen Wake Lock intégrée, votre écran reste allumé pendant la séance sans forcer la veille générale de Windows."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MACOS */}
      {activeTab === "macos" && (
        <div
          id="panel-macos"
          role="tabpanel"
          aria-labelledby="tab-macos"
          className="docs-install-panel animate-fade-in"
        >
          <div className="docs-method-hero">
            <div className="docs-method-hero__left">
              <div className="docs-method-hero__icon">
                <AppleIcon size={32} />
              </div>
              <div className="dx-div-14">
                <h2 className="docs-method-hero__title">
                  {isEn ? "Bobine for Mac (Apple Silicon M1–M4)" : "Bobine pour Mac (Apple Silicon M1–M4)"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Native macOS disk image (.dmg). Drag-and-drop installation into Applications, Retina icon, menu bar companion, and optional login item."
                    : "Image disque native .dmg pour Mac Apple Silicon. Installation par glisser-déposer dans Applications, icône Retina et présence en barre des menus."}
                </p>
              </div>
            </div>

            {renderChannelCards({
              stableUrl: stable.downloads.macos,
              stableLabel: isEn ? `Download Stable (${stable.version}) · .dmg` : `Télécharger la Stable (${stable.version}) · .dmg`,
              betaUrl: beta.downloads.macos,
              betaLabel: isEn ? "Download Beta · .dmg" : "Télécharger la Bêta · .dmg",
              canaryUrl: canary.downloads.macos,
              canaryLabel: isEn ? "Download Canary · .dmg" : "Télécharger la Canary · .dmg",
              archText: isEn ? "Apple Silicon (M1–M4 · arm64)" : "Apple Silicon (M1–M4 · arm64)",
            })}
          </div>

          <div className="docs-callout docs-callout--info dx-div-15">
            <div className="docs-callout__content">
              <div className="docs-callout__title">
                {isEn ? "Apple Silicon Architecture & Intel Mac Roadmap" : "Architecture Apple Silicon & Précision Mac Intel"}
              </div>
              <div>
                {isEn
                  ? "Bobine is compiled natively for Apple Silicon Macs (MacBook Air, MacBook Pro, Mac mini, Mac Studio with M1, M2, M3, or M4). Native support for legacy Intel Macs (x86_64) is undergoing validation and will be released in an upcoming update."
                  : "Bobine est optimisé nativement pour les Mac Apple Silicon (MacBook, Mac mini, iMac équipés de puces M1, M2, M3 ou M4). La compatibilité native avec les anciens processeurs Mac Intel (x86_64) arrivera lors d'une prochaine mise à jour."}
              </div>
            </div>
          </div>

          {renderDivider()}

          <div className="docs-steps-flow">
            <h3 className="docs-steps-flow__heading">
              {isEn ? "Installation steps:" : "Guide d'installation pas à pas :"}
            </h3>

            <div className="docs-step-card">
              <div className="docs-step-card__num">1</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Download the disk image" : "Téléchargez l'image disque"}</h4>
                <p>
                  {isEn
                    ? "Download Bobine-x.y.z.dmg using the button above."
                    : "Téléchargez le fichier Bobine-x.y.z.dmg via le bouton de téléchargement."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">2</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Drag to Applications" : "Glissez l'application dans Applications"}</h4>
                <p>
                  {isEn
                    ? "Open the downloaded .dmg file and drag the Bobine icon directly into your Applications folder."
                    : "Double-cliquez sur l'image disque .dmg et faites glisser l'icône Bobine dans le dossier Applications."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">3</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Open Bobine & Menu Bar companion" : "Premier lancement & Barre des menus"}</h4>
                <p>
                  {isEn
                    ? "Launch Bobine from Spotlight or Launchpad. A companion icon will be placed in your top macOS menu bar."
                    : "Ouvrez Bobine depuis Spotlight ou le Launchpad. Une icône compagnon s'installe dans la barre supérieure des menus pour piloter l'état du système."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">4</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Access administration & Mobile control" : "Administration & Télécommande mobile"}</h4>
                <p>
                  {isEn
                    ? "Safari opens to http://localhost:8000. Any coach or staff member on the gym Wi-Fi can scan the QR code to take control."
                    : "Votre navigateur s'ouvre sur http://localhost:8000. Vos coachs connectés au Wi-Fi peuvent scanner le QR code pour piloter la régie depuis leur smartphone."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LINUX BUREAU : Debian / Ubuntu (.deb), Fedora (.rpm), Arch Linux (.pkg.tar.zst) */}
      {activeTab === "linux" && (
        <div
          id="panel-linux"
          role="tabpanel"
          aria-labelledby="tab-linux"
          className="docs-install-panel animate-fade-in"
        >
          <div className="docs-method-hero">
            <div className="docs-method-hero__left">
              <div className="docs-method-hero__icon">
                <DistroLogo id={LINUX_FAMILIES[selectedFamily].logo} className="distro-logo--hero" />
              </div>
              <div className="dx-div-14">
                <h2 className="docs-method-hero__title">{linuxHero.title}</h2>
                <p className="docs-method-hero__desc">{linuxHero.desc}</p>
                {renderFamilySwitch()}
                {renderArchSwitch()}
              </div>
            </div>

            {renderChannelCards({
              stableUrl: linuxLink(stable, "stable", stable.version),
              stableLabel: isEn ? `Download Stable (${stable.version}) · ${linuxFormat}` : `Télécharger la Stable (${stable.version}) · ${linuxFormat}`,
              betaUrl: linuxLink(beta, "beta", "beta"),
              betaLabel: isEn ? `Download Beta · ${linuxFormat}` : `Télécharger la Bêta · ${linuxFormat}`,
              canaryUrl: linuxLink(canary, "canary", "canary"),
              canaryLabel: isEn ? `Download Canary · ${linuxFormat}` : `Télécharger la Canary · ${linuxFormat}`,
              archText: isArm ? "ARM64 (Snapdragon, Raspberry Pi 5, Orange Pi)" : `x86_64 (${LINUX_FAMILIES[selectedFamily].distros[isEn ? "en" : "fr"]})`,
            })}
          </div>

          {renderDistroTable()}

          {renderDivider()}

          {selectedFamily === "debian" && (
            <div className="docs-steps-flow">
              <h3 className="docs-steps-flow__heading">
                {isEn ? "Installation options:" : "Options d'installation :"}
              </h3>

              <div className="docs-step-card">
                <div className="docs-step-card__num">1</div>
                <div className="docs-step-card__content">
                  <h4>{isEn ? "Option A: Official APT Repository (Recommended — x86_64 & ARM64)" : "Option A : Dépôt APT officiel (Recommandé — x86_64 & ARM64)"}</h4>
                  <p>
                    {isEn
                      ? "Add the official GPG-signed repository (packages.bobine.fit/debian) to receive automatic updates with your standard apt upgrade (serves amd64 and arm64 architectures):"
                      : "Ajoutez le dépôt officiel signé GPG (packages.bobine.fit/debian) pour bénéficier des mises à jour automatiques lors de vos apt upgrade habituels (distribue automatiquement amd64 et arm64) :"}
                  </p>
                  <div className="docs-copyable-cmd dx-div-16">
                    <code className="dx-code-1">
                      {`sudo install -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://packages.bobine.fit/bobine.gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/bobine.gpg\necho "deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://packages.bobine.fit/debian stable main" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine`}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          "sudo install -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://packages.bobine.fit/bobine.gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://packages.bobine.fit/debian stable main\" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine"
                        )
                      }
                      className="docs-copy-btn"
                      aria-label={isEn ? "Copy command" : "Copier la commande"}
                    >
                      {copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}
                    </button>
                  </div>
                  <p className="dx-p-6">
                    {isEn
                      ? "For pre-release builds, replace 'stable' with 'beta' (curated) or 'canary' (rolling). Repository web portal: "
                      : "Pour tester les versions préliminaires, remplacez « stable » par « beta » (curée) ou « canary » (rolling). Portail du dépôt : "}
                    <a
                      href="https://packages.bobine.fit"
                      target="_blank"
                      rel="noopener noreferrer" className="dx-a-1"
                    >
                      packages.bobine.fit
                    </a>
                  </p>
                </div>
              </div>

              <div className="docs-step-card">
                <div className="docs-step-card__num">2</div>
                <div className="docs-step-card__content">
                  <h4>{isEn ? "Option B: Direct .deb Package (Offline / 1-Click)" : "Option B : Paquet direct .deb (Hors ligne / 1 clic)"}</h4>
                  <p>
                    {isEn
                      ? "Download the standalone .deb package above and double-click to install via Ubuntu App Center or GNOME Software, or run:"
                      : "Téléchargez le paquet autonome .deb ci-dessus et double-cliquez pour l'installer via l'App Center Ubuntu / Logithèque GNOME, ou exécutez :"}
                  </p>
                  <div className="docs-copyable-cmd">
                    <code>{isEn ? "sudo apt install ./bobine_*_amd64.deb # or ./bobine_*_arm64.deb on ARM64" : "sudo apt install ./bobine_*_amd64.deb # ou ./bobine_*_arm64.deb sur ARM64"}</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("sudo apt install ./bobine_*_amd64.deb")}
                      className="docs-copy-btn"
                      aria-label={isEn ? "Copy command" : "Copier la commande"}
                    >
                      {copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="docs-step-card">
                <div className="docs-step-card__num">3</div>
                <div className="docs-step-card__content">
                  <div className="dx-div-17">
                    <TorLogo size={20} />
                    <h4 className="dx-h1-1">
                      {isEn ? "Option C: Protected APT repository over Tor (.onion)" : "Option C : Dépôt APT protégé via Tor (.onion)"}
                    </h4>
                  </div>
                  <p>
                    {isEn
                      ? "Same packages, same GPG signature, without revealing your IP address (and even if packages.bobine.fit is blocked). Install apt-transport-tor first, then add the onion source:"
                      : "Mêmes paquets, même signature GPG, sans révéler votre adresse IP (et même si packages.bobine.fit est bloqué). Installez d'abord apt-transport-tor, puis ajoutez la source onion :"}
                  </p>
                  <div className="docs-copyable-cmd dx-div-16">
                    <code className="dx-code-1">{TOR_APT_COMMANDS}</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(TOR_APT_COMMANDS)}
                      className="docs-copy-btn"
                      aria-label={isEn ? "Copy command" : "Copier la commande"}
                    >
                      {copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}
                    </button>
                  </div>
                  <p className="dx-p-7">
                    {isEn ? "APT repository (open in Tor Browser): " : "Dépôt APT (à ouvrir dans Tor Browser) : "}
                    <a href={`http://${ONION_APT_HOST}/`} rel="noopener noreferrer" className="docs-onion-link">
                      http://{ONION_APT_HOST}/
                    </a>
                    <br />
                    {isEn ? "Website (open in Tor Browser): " : "Site miroir (à ouvrir dans Tor Browser) : "}
                    <a href={`http://${ONION_SITE_HOST}/`} rel="noopener noreferrer" className="docs-onion-link">
                      http://{ONION_SITE_HOST}/
                    </a>
                  </p>
                  <p className="dx-p-6">
                    {isEn
                      ? "One-command alternative (read it first, add --dry-run to simulate): "
                      : "Alternative en une commande (à lire avant, ajoutez --dry-run pour simuler) : "}
                    <a href="/install-tor.sh" className="docs-onion-link">
                      bobine.fit/install-tor.sh
                    </a>
                    {isEn
                      ? ". It fetches the key through Tor, checks it against the published fingerprint (B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A) and stops if it differs."
                      : ". Il récupère la clé par Tor, la compare à l'empreinte publiée (B77D 96D7 2F84 F36A CAA3 F872 9CBF 497D 829E E15A) et s'arrête si elle diffère."}
                  </p>
                </div>
              </div>

              <div className="docs-step-card">
                <div className="docs-step-card__num">4</div>
                <div className="docs-step-card__content">
                  <h4>{isEn ? "Desktop Integration & XDG Storage" : "Intégration au bureau & Stockage XDG"}</h4>
                  <p>
                    {isEn
                      ? "Bobine is integrated into your application menu with high-resolution icons. All SQLite databases, logs, and workout media are safely stored in ~/.local/share/bobine/."
                      : "Bobine est présent dans vos menus d'applications avec son icône haute résolution. Vos bases SQLite et vos médias sont conservés dans ~/.local/share/bobine/ conformément aux standards Linux XDG."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedFamily === "fedora" && renderFedoraSteps()}

          {selectedFamily === "arch" && renderArchSteps()}
        </div>
      )}

      {/* ANDROID (Application native officielle) */}
      {activeTab === "android" && (
        <div
          id="panel-android"
          role="tabpanel"
          aria-labelledby="tab-android"
          className="docs-install-panel animate-fade-in"
        >
          <div className="docs-method-hero">
            <div className="docs-method-hero__left">
              <div className="docs-method-hero__icon">
                {androidVariant === "tv" ? <AndroidTvIcon size={32} /> : <AndroidIcon size={32} />}
              </div>
              <div className="dx-div-14">
                <h2 className="docs-method-hero__title">
                  {androidVariant === "tv"
                    ? (isEn ? "Bobine for Android TV, Google TV & Streaming Boxes" : "Bobine pour Android TV, Google TV & Box TV")
                    : (isEn ? "Bobine for Android Tablets, Google Books & Touch Kiosks" : "Bobine pour Tablettes Android, Google Books & Bornes Tactiles")}
                </h2>
                <p className="docs-method-hero__desc">
                  {androidVariant === "tv"
                    ? (isEn
                        ? `Dedicated APK for TV boxes, sticks and Smart TVs running Android ${ANDROID.minVersion} or later, such as the Google TV Streamer or the Xiaomi TV Box S 3rd generation). Installs on 32-bit and 64-bit ARM systems, Leanback launcher, full remote-control navigation, embedded FastAPI server (Chaquopy) and MediaCodec hardware acceleration.`
                        : `APK dédié aux box TV, clés HDMI et Smart TV sous Android ${ANDROID.minVersion} ou supérieur, comme le Google TV Streamer ou le Xiaomi TV Box S 3e génération). S'installe sur les systèmes ARM 32 et 64 bits, lanceur Leanback, navigation complète à la télécommande, serveur FastAPI embarqué (Chaquopy) et accélération matérielle MediaCodec.`)
                    : (isEn
                        ? "Official native APK package. Direct execution on Android tablets and Google Books (Aluminium OS, with upcoming Google Play Store release). Embedded FastAPI server (Chaquopy), independent dual display (/grid on tablet, /cinema on HDMI), and MediaCodec hardware acceleration."
                        : "Paquet APK natif officiel. Exécution directe sur tablettes Android et Google Books (Aluminium OS, avec arrivée prochaine sur le Google Play Store). Serveur FastAPI embarqué (Chaquopy), double affichage indépendant (/grid sur tablette, /cinema sur HDMI), et accélération matérielle MediaCodec.")}
                </p>
                {renderAndroidVariantSwitch()}
              </div>
            </div>

            {renderChannelCards(
              androidVariant === "tv"
                ? {
                    stableUrl: stable.downloads.androidTv || FALLBACK_STABLE.downloads.androidTv!,
                    stableLabel: isEn ? `Download Stable (${stable.version}) · Android TV .apk` : `Télécharger la Stable (${stable.version}) · Android TV .apk`,
                    betaUrl: beta.downloads.androidTv || FALLBACK_BETA.downloads.androidTv!,
                    betaLabel: isEn ? "Download Beta · Android TV .apk" : "Télécharger la Bêta · Android TV .apk",
                    canaryUrl: canary.downloads.androidTv || FALLBACK_CANARY.downloads.androidTv!,
                    canaryLabel: isEn ? "Download Canary · Android TV .apk" : "Télécharger la Canary · Android TV .apk",
                    archText: isEn ? "Android TV & Google TV (ARM 32/64-bit)" : "Android TV & Google TV (ARM 32/64 bits)",
                  }
                : {
                    stableUrl: stable.downloads.android,
                    stableLabel: isEn ? `Download Stable (${stable.version}) · Android .apk` : `Télécharger la Stable (${stable.version}) · Android .apk`,
                    betaUrl: beta.downloads.android,
                    betaLabel: isEn ? "Download Beta · Android .apk" : "Télécharger la Bêta · Android .apk",
                    canaryUrl: canary.downloads.android,
                    canaryLabel: isEn ? "Download Canary · Android .apk" : "Télécharger la Canary · Android .apk",
                    archText: isEn ? "Android Tablets & Google Books (ARM64)" : "Tablettes Android & Google Books (ARM64)",
                  }
            )}
          </div>

          {renderDivider()}

          <div className="docs-steps-flow">
            <h3 className="docs-steps-flow__heading">
              {isEn ? "Installation steps:" : "Guide d'installation pas à pas :"}
            </h3>

            <div className="docs-step-card">
              <div className="docs-step-card__num">1</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Download the APK package" : "Téléchargez le paquet APK"}</h4>
                <p>
                  {androidVariant === "tv"
                    ? (isEn
                        ? "Download the Android TV APK from your computer using the buttons above (or from the browser of your TV box)."
                        : "Téléchargez l'APK Android TV depuis votre ordinateur via les boutons ci-dessus (ou depuis le navigateur de votre box TV).")
                    : (isEn
                        ? "Download the APK directly to your tablet or computer using the buttons above."
                        : "Téléchargez le fichier APK directement sur votre tablette ou depuis votre ordinateur via les boutons ci-dessus.")}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">2</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Install on your device" : "Installez sur votre appareil"}</h4>
                <p>
                  {androidVariant === "tv"
                    ? (isEn
                        ? "Transfer the file with a USB drive (and a file manager app) or wirelessly with 'Send Files to TV' or 'Downloader', then allow the installation of unknown apps in the TV settings."
                        : "Transférez le fichier par clé USB (avec un gestionnaire de fichiers) ou sans fil avec « Send Files to TV » ou « Downloader », puis autorisez l'installation d'applications inconnues dans les paramètres de la TV.")
                    : (isEn
                        ? "Open the APK file from your file manager to install it (allow unknown sources if your system asks)."
                        : "Ouvrez le fichier APK depuis votre gestionnaire de fichiers pour lancer l'installation (autorisez les sources inconnues si votre système le demande).")}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">3</div>
              <div className="docs-step-card__content">
                <h4>
                  {androidVariant === "tv"
                    ? (isEn ? "Launch Bobine from the TV home screen" : "Lancez Bobine depuis l'écran d'accueil de la TV")
                    : (isEn ? "Connect dual-screen display" : "Raccordez l'affichage double écran")}
                </h4>
                <p>
                  {androidVariant === "tv"
                    ? (isEn
                        ? "The app appears in the apps row of Android TV / Google TV and opens the big-screen interface (/kiosk), fully usable with the remote control D-pad. Plug a FAT32/exFAT USB drive or SSD to store your classes outside the box's internal memory."
                        : "L'application apparaît dans la ligne des applications d'Android TV / Google TV et ouvre l'interface grand écran (/kiosk), entièrement pilotable au D-Pad de la télécommande. Branchez une clé USB ou un SSD FAT32/exFAT pour stocker vos cours hors de la mémoire interne de la box.")
                    : (isEn
                        ? "Connect a USB-C to HDMI cable or hub from your tablet to the gym TV or projector. The big screen displays the fullscreen workout cinema (/cinema) while the tablet displays the interactive coach desk (/grid)."
                        : "Branchez un câble ou adaptateur USB-C vers HDMI reliant la tablette au téléviseur ou projecteur de la salle. Le grand écran diffuse le cours en plein écran (/cinema) pendant que la tablette sert de pupitre tactile interactif (/grid).")}
                </p>
              </div>
            </div>
          </div>

          <div className="docs-callout docs-callout--info dx-div-18">
            <div className="docs-callout__content">
              {androidRoadmap?.paragraphs.map((p, i) => (
                <p key={i} className="dx-para-stack">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* iOS / iPadOS (feuille de route, piste exploree) */}
      {activeTab === "ios" && (
        <div
          id="panel-ios"
          role="tabpanel"
          aria-labelledby="tab-ios"
          className="docs-install-panel animate-fade-in"
        >
          <div className="docs-method-hero">
            <div className="docs-method-hero__left">
              <div className="docs-method-hero__icon">
                <AppleIcon size={32} />
              </div>
              <div>
                <h2 className="docs-method-hero__title">
                  {isEn ? "iOS / iPadOS: explored, not committed" : "iOS / iPadOS : piste explorée, non engagée"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Not under active study yet. Here is why iPad support is a harder question than Android."
                    : "Pas encore à l'étude active. Voici pourquoi le support iPad est une question plus complexe qu'Android."}
                </p>
              </div>
            </div>
            <div className="docs-method-hero__action-col">
              <span className="docs-roadmap-status-pill docs-roadmap-status-pill--muted">
                {isEn ? "Explored idea — no timeline" : "Piste explorée — sans calendrier"}
              </span>
            </div>
          </div>

          {renderDivider()}

          <div className="docs-callout docs-callout--info dx-div-15">
            <div className="docs-callout__content">
              {iosRoadmap?.paragraphs.map((p, i) => (
                <p key={i} className="dx-para-stack">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAURI ASSISTANT */}
      {activeTab === "tauri" && (
        <div
          id="panel-tauri"
          role="tabpanel"
          aria-labelledby="tab-tauri"
          className="docs-install-panel animate-fade-in"
        >
          <div className="docs-method-hero">
            <div className="docs-method-hero__left">
              <div className="docs-method-hero__icon">
                <TauriIcon size={32} />
              </div>
              <div className="dx-div-14">
                <h2 className="docs-method-hero__title">
                  {isEn ? "Bobine Assistant (Network Orchestrator)" : "Bobine Assistant (Orchestrateur Réseau)"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Lightweight Rust & Tauri 2 desktop tool to discover, audit, and deploy Bobine headless appliances across your local network without typing terminal commands."
                    : "Application graphique légère en Rust & Tauri 2 pour découvrir, auditer et déployer vos appliances Bobine sur le réseau local sans saisir de ligne de commande."}
                </p>
                {renderArchSwitch()}
              </div>
            </div>

            {renderChannelCards({
              stableUrl: isArm ? (stable.downloads.assistantArm64 || stable.downloads.assistant) : stable.downloads.assistant,
              stableLabel: isArm
                ? (isEn ? `Download Assistant (${stable.version}) · ARM64` : `Télécharger l'Assistant (${stable.version}) · ARM64`)
                : (isEn ? `Download Assistant (${stable.version}) · x86_64` : `Télécharger l'Assistant (${stable.version}) · x86_64`),
              betaUrl: isArm ? (beta.downloads.assistantArm64 || beta.downloads.assistant) : beta.downloads.assistant,
              betaLabel: isArm
                ? (isEn ? "Download Beta · ARM64" : "Télécharger la Bêta · ARM64")
                : (isEn ? "Download Beta · x86_64" : "Télécharger la Bêta · x86_64"),
              canaryUrl: isArm ? (canary.downloads.assistantArm64 || canary.downloads.assistant) : canary.downloads.assistant,
              canaryLabel: isArm
                ? (isEn ? "Download Canary · ARM64" : "Télécharger la Canary · ARM64")
                : (isEn ? "Download Canary · x86_64" : "Télécharger la Canary · x86_64"),
              archText: isArm ? "ARM64 (Qualcomm Snapdragon, Raspberry Pi 5)" : "x86_64 (Intel / AMD)",
            })}
          </div>

          {renderDivider()}

          <div className="docs-steps-flow">
            <h3 className="docs-steps-flow__heading">
              {isEn ? "Key Capabilities of Bobine Assistant:" : "Fonctionnalités clés de l'Assistant :"}
            </h3>

            <div className="docs-step-card">
              <div className="docs-step-card__num">1</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "mDNS & Subnet Auto-Discovery" : "Découverte réseau mDNS & Balayage de sous-réseau"}</h4>
                <p>
                  {isEn
                    ? "Automatically scans your gym LAN to detect Bobine machines (bobine.local) or sweeps the /24 local subnet to locate available mini PCs."
                    : "Scanne automatiquement le réseau local pour repérer les machines Bobine (bobine.local) ou balaye le sous-réseau /24 pour localiser les mini PC connectés."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">2</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Remote SSH Hardware Audit" : "Audit matériel SSH à distance"}</h4>
                <p>
                  {isEn
                    ? "Audits CPU specifications (Celeron J4105, Intel N100, AMD Ryzen), available RAM, NVMe/eMMC storage, and checks for VA-API hardware video acceleration."
                    : "Interroge à distance le processeur (Celeron J4105, Intel N100, AMD Ryzen), la mémoire vive, le stockage SSD et vérifie la disponibilité de l'accélération VA-API."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">3</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "One-Click Guided Remote Deployment" : "Déploiement distant guidé en un clic"}</h4>
                <p>
                  {isEn
                    ? "Pushes configuration, orchestrates updates, and triggers service reloads with live progress tracking, eliminating the need to physically connect a keyboard to the mini PC."
                    : "Déploie les mises à jour, installe les dépendances et surveille le redémarrage des services avec une barre de progression en temps réel, sans brancher de clavier au mini PC."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DEDICATED APPLIANCE (CLI / BASH) */}
      {activeTab === "cli" && (
        <div
          id="panel-cli"
          role="tabpanel"
          aria-labelledby="tab-cli"
          className="docs-install-panel animate-fade-in"
        >
          <div className="docs-method-hero">
            <div className="docs-method-hero__left">
              <div className="docs-method-hero__icon">
                <TerminalIcon size={32} />
              </div>
              <div className="dx-div-14">
                <h2 className="docs-method-hero__title">
                  {isEn ? "Dedicated Gym Appliance (Debian 13 · CLI)" : "Appliance Dédiée & Kiosque 24/7 (Debian 13 · CLI)"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Recommended for permanent gym installations. Turns low-cost refurbished hardware (Dell Wyse 5070, Beelink N100 ~40-70 €) into an autonomous, maintenance-free playout appliance with a self-healing watchdog."
                    : "La solution recommandée pour les studios et salles de sport : transforme un mini PC reconditionné (40 à 70 €) sous Debian 13 minimale en régie autonome 365 jours/an avec chien de garde auto-réparateur."}
                </p>
              </div>
            </div>

            {renderCliChannelCards()}
          </div>

          {renderDivider()}

          <div className="dx-div-11">
            <h3 className="dx-h3-2">
              {isEn ? "Interactive Step-by-Step Appliance Guide & Terminal Simulator" : "Guide Étape par Étape & Simulateur de Terminal Interactif"}
            </h3>
            <p className="dx-p-8">
              {isEn
                ? "Follow the 10 steps below from hardware preparation to automated class playout in your studio. Test installer options live in the terminal emulator at Step 6."
                : "Suivez les 10 étapes ci-dessous, de la préparation du matériel jusqu'à la diffusion automatisée des cours. Testez les options d'installation en direct dans le terminal à l'étape 6."}
            </p>

            {/* Stepper interactif complet avec terminal virtuel */}
            <QuickStartStepper locale={locale} />
          </div>
        </div>
      )}

    </div>
  );
}
