"use client";

import { useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import WindowsIcon from "@/components/icons/WindowsIcon";
import AppleIcon from "@/components/icons/AppleIcon";
import LinuxIcon from "@/components/icons/LinuxIcon";
import TauriIcon from "@/components/icons/TauriIcon";
import TerminalIcon from "@/components/icons/TerminalIcon";
import AndroidIcon from "@/components/icons/AndroidIcon";
import QuickStartStepper from "@/components/QuickStartStepper";
import { docChapters } from "@/content/docs/chapters";
import { useDetectedPlatform, reorderForPlatform } from "@/lib/detectPlatform";

import type { ReleaseChannelInfo } from "@/lib/releaseTypes";

type InstallTab = "windows" | "macos" | "linux" | "android" | "ios" | "tauri" | "cli";

const FALLBACK_STABLE: ReleaseChannelInfo = {
  version: "V3.0.5",
  title: "Bobine V3.0.5 — Console Régie Coach, Ambiances Visuelles & Moteur Gapless",
  publishedAt: "2026-09-12T18:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.5/Bobine-Setup-3.0.5.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.5/bobine_3.0.5_amd64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.5/Bobine-3.0.5.dmg",
    android: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.5/Bobine-3.0.5.apk",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.5/bobine-assistant",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.5/install.sh",
  },
};

const FALLBACK_BETA: ReleaseChannelInfo = {
  version: "beta",
  title: "Bobine — Bêta (build automatique)",
  publishedAt: "2026-09-09T20:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_amd64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.dmg",
    android: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.apk",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-assistant",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/install.sh",
  },
};

export default function DocsInstallHub({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const detected = useDetectedPlatform();
  const [selectedTab, setSelectedTab] = useState<InstallTab | null>(null);
  const activeTab: InstallTab = selectedTab ?? (detected as InstallTab | null) ?? "windows";
  const roadmapChapter = docChapters[locale].find((c) => c.id === "feuille-de-route");
  const roadmapSubsections = roadmapChapter?.subsections ?? [];
  const androidRoadmap = roadmapSubsections.find((s) => s.subtitle.includes("Android"));
  const iosRoadmap = roadmapSubsections.find((s) => s.subtitle.includes("iOS"));
  const [stable, setStable] = useState<ReleaseChannelInfo>(FALLBACK_STABLE);
  const [beta, setBeta] = useState<ReleaseChannelInfo>(FALLBACK_BETA);
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Miroir Tor : pas de route serveur, valeurs de repli deja en place.
    if (process.env.NEXT_PUBLIC_BOBINE_ONION === "1") return;
    fetch("/api/github-stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.stable) setStable(data.stable);
        if (data.beta) setBeta(data.beta);
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
      format: ".deb (Debian, Ubuntu)",
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
      format: "Tauri 2 (mDNS & SSH)",
      badge: isEn ? "Network" : "Réseau",
      icon: <TauriIcon size={20} />,
    },
    {
      id: "cli",
      group: "appliance",
      name: isEn ? "Dedicated Appliance" : "Appliance Kiosque",
      format: "Debian 13 · CLI",
      badge: isEn ? "24/7 Gym" : "Salle 24/7",
      icon: <TerminalIcon size={18} />,
    },
  ];

  const desktopTabs = reorderForPlatform(
    tabs.filter((tab) => tab.group === "desktop" || tab.group === "roadmap"),
    detected
  );
  const advancedTabs = tabs.filter((tab) => tab.group === "appliance");

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
      {/* Sélecteur de méthode d'installation avec logos vectoriels, regroupé par nature */}
      <div className="docs-install-selector-wrap">
        <div className="docs-install-nav-header">
          <span className="docs-install-nav-label">
            {isEn ? "1-click desktop & mobile apps:" : "Applications de bureau & mobile en 1 clic :"}
          </span>
        </div>

        <div
          role="tablist"
          aria-label={isEn ? "Installation methods" : "Méthodes d'installation"}
          className="docs-install-tabs"
        >
          {desktopTabs.map(renderTabButton)}
        </div>

        <div className="docs-install-nav-header docs-install-nav-header--secondary">
          <span className="docs-install-nav-label docs-install-nav-label--secondary">
            {isEn ? "Advanced & dedicated deployments:" : "Déploiements avancés & dédiés :"}
          </span>
        </div>

        <div
          role="tablist"
          aria-label={isEn ? "Advanced installation methods" : "Méthodes d'installation avancées"}
          className="docs-install-tabs docs-install-tabs--advanced"
        >
          {advancedTabs.map(renderTabButton)}
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
              <div>
                <h2 className="docs-method-hero__title">
                  {isEn ? "Bobine for Windows 11, 10 & Windows IoT" : "Bobine pour Windows 11, 10 et Windows IoT"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Native 1-click installer. Zero command line, runs silently in the background with a system tray companion and automatic firewall configuration."
                    : "Installation native en 1 clic pour le grand public. Zéro ligne de commande, démarrage silencieux sans console noire avec icône en barre des tâches."}
                </p>
              </div>
            </div>

            <div className="docs-method-hero__action-col">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", width: "100%" }}>
                <a
                  href={stable.downloads.windows}
                  download
                  className="btn-primary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? `Download Stable (${stable.version})` : `Télécharger la Stable (${stable.version})`}</span>
                </a>

                <a
                  href={beta.downloads.windows}
                  download
                  className="btn-secondary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? "Download Beta (Rolling beta)" : "Télécharger la Bêta (Rolling beta)"}</span>
                </a>
              </div>

              <div className="docs-method-meta-row">
                <span className="docs-method-version-text">{stable.version}</span>
                <span className="docs-method-meta-dot">·</span>
                <span>x86-64</span>
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
            </div>
          </div>

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
                    ? "Click the download button above to get Bobine-Setup-3.0.0.exe directly from the official repository."
                    : "Cliquez sur le bouton de téléchargement ci-dessus pour récupérer l'installeur officiel Bobine-Setup-3.0.0.exe."}
                </p>
              </div>
            </div>

            <div className="docs-step-card">
              <div className="docs-step-card__num">2</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Launch the setup wizard" : "Lancez l'assistant d'installation"}</h4>
                <p>
                  {isEn
                    ? "Double-click Bobine-Setup-3.0.0.exe. The standard Windows setup wizard will create a desktop shortcut and prepare the self-contained environment."
                    : "Double-cliquez sur le fichier Bobine-Setup-3.0.0.exe. L'assistant prépare l'environnement autonome et crée un raccourci officiel sur votre Bureau."}
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
              <div>
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

            <div className="docs-method-hero__action-col">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", width: "100%" }}>
                <a
                  href={stable.downloads.macos}
                  download
                  className="btn-primary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? `Download Stable (${stable.version})` : `Télécharger la Stable (${stable.version})`}</span>
                </a>

                <a
                  href={beta.downloads.macos}
                  download
                  className="btn-secondary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? "Download Beta (Rolling beta)" : "Télécharger la Bêta (Rolling beta)"}</span>
                </a>
              </div>

              <div className="docs-method-meta-row">
                <span className="docs-method-version-text">{stable.version}</span>
                <span className="docs-method-meta-dot">·</span>
                <span>Apple Silicon (arm64)</span>
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
            </div>
          </div>

          <div className="docs-callout docs-callout--info" style={{ marginTop: "1.25rem" }}>
            <div className="docs-callout__content">
              <div className="docs-callout__title">
                {isEn ? "Apple Silicon Architecture & Intel Mac Roadmap" : "Architecture Apple Silicon & Précision Mac Intel"}
              </div>
              <div>
                {isEn
                  ? "Bobine 3.0.0 is compiled natively for Apple Silicon Macs (MacBook Air, MacBook Pro, Mac mini, Mac Studio with M1, M2, M3, or M4). Native support for legacy Intel Macs (x86_64) is undergoing validation and will be released in an upcoming update."
                  : "Bobine 3.0.0 est optimisé nativement pour les Mac Apple Silicon (MacBook, Mac mini, iMac équipés de puces M1, M2, M3 ou M4). La compatibilité native avec les anciens processeurs Mac Intel (x86_64) arrivera lors d'une prochaine mise à jour."}
              </div>
            </div>
          </div>

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
                    ? "Download Bobine-3.0.0.dmg using the button above."
                    : "Téléchargez le fichier Bobine-3.0.0.dmg via le bouton de téléchargement."}
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

      {/* 3. LINUX DESKTOP (.deb) */}
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
                <LinuxIcon size={32} />
              </div>
              <div>
                <h2 className="docs-method-hero__title">
                  {isEn ? "Bobine for Linux Desktop (.deb package)" : "Bobine pour Linux Bureau (Paquet .deb)"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Native Debian, Ubuntu, and Linux Mint package. Certified AppStream metadata for Ubuntu App Center, standard XDG directory structure, and desktop integration."
                    : "Paquet natif pour Debian, Ubuntu et Linux Mint. Métadonnées AppStream certifiées pour les logithèques, intégration XDG et lanceur de bureau."}
                </p>
              </div>
            </div>

            <div className="docs-method-hero__action-col">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", width: "100%" }}>
                <a
                  href={stable.downloads.linux}
                  download
                  className="btn-primary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? `Download Stable (${stable.version})` : `Télécharger la Stable (${stable.version})`}</span>
                </a>

                <a
                  href={beta.downloads.linux}
                  download
                  className="btn-secondary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? "Download Beta (Rolling beta)" : "Télécharger la Bêta (Rolling beta)"}</span>
                </a>
              </div>

              <div className="docs-method-meta-row">
                <span className="docs-method-version-text">{stable.version}</span>
                <span className="docs-method-meta-dot">·</span>
                <span>x86-64 (amd64)</span>
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
            </div>
          </div>

          <div className="docs-steps-flow">
            <h3 className="docs-steps-flow__heading">
              {isEn ? "Installation options:" : "Options d'installation :"}
            </h3>

            <div className="docs-step-card">
              <div className="docs-step-card__num">1</div>
              <div className="docs-step-card__content">
                <h4>{isEn ? "Option A: Official APT Repository (Recommended)" : "Option A : Dépôt APT officiel (Recommandé)"}</h4>
                <p>
                  {isEn
                    ? "Add the official GPG-signed repository (apt.bobine.fit) to receive automatic updates with your standard apt upgrade:"
                    : "Ajoutez le dépôt officiel signé GPG (apt.bobine.fit) pour bénéficier des mises à jour automatiques lors de vos apt upgrade habituels :"}
                </p>
                <div className="docs-copyable-cmd" style={{ whiteSpace: "pre-wrap", alignItems: "flex-start" }}>
                  <code style={{ fontSize: "0.8rem", lineHeight: "1.5" }}>
                    {`curl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho "deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://apt.bobine.fit/ stable main" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine`}
                  </code>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        "curl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg\necho \"deb [signed-by=/etc/apt/keyrings/bobine.gpg] https://apt.bobine.fit/ stable main\" | sudo tee /etc/apt/sources.list.d/bobine.list\nsudo apt update && sudo apt install bobine"
                      )
                    }
                    className="docs-copy-btn"
                    aria-label={isEn ? "Copy command" : "Copier la commande"}
                  >
                    {copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}
                  </button>
                </div>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {isEn
                    ? "For pre-release builds, replace 'stable' with 'beta'. Repository web portal: "
                    : "Pour tester les versions préliminaires, remplacez « stable » par « beta ». Portail du dépôt : "}
                  <a
                    href="https://apt.bobine.fit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--text-heading)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    apt.bobine.fit
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
                  <code>sudo apt install ./bobine_*_amd64.deb</code>
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
                <h4>{isEn ? "Desktop Integration & XDG Storage" : "Intégration au bureau & Stockage XDG"}</h4>
                <p>
                  {isEn
                    ? "Bobine is integrated into your application menu with high-resolution icons. All SQLite databases, logs, and workout media are safely stored in ~/.local/share/bobine/."
                    : "Bobine est présent dans vos menus d'applications avec son icône haute résolution. Vos bases SQLite et vos médias sont conservés dans ~/.local/share/bobine/ conformément aux standards Linux XDG."}
                </p>
              </div>
            </div>
          </div>
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
                <AndroidIcon size={32} />
              </div>
              <div>
                <h2 className="docs-method-hero__title">
                  {isEn ? "Bobine for Android Tablets & Touch Kiosks" : "Bobine pour Tablettes Android & Bornes Tactiles"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Official native APK package. Embedded FastAPI server (Chaquopy), independent dual display (/grid on tablet, /cinema on HDMI), and MediaCodec hardware acceleration."
                    : "Paquet APK natif officiel. Serveur FastAPI embarqué (Chaquopy), double affichage indépendant (/grid sur tablette, /cinema sur HDMI), et accélération matérielle MediaCodec."}
                </p>
              </div>
            </div>

            <div className="docs-method-hero__action-col">
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", width: "100%" }}>
                <a
                  href={stable.downloads.android}
                  download
                  className="btn-primary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? `Download Stable (${stable.version})` : `Télécharger la Stable (${stable.version})`}</span>
                </a>

                <a
                  href={beta.downloads.android}
                  download
                  className="btn-secondary docs-method-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>{isEn ? "Download Beta (Rolling beta)" : "Télécharger la Bêta (Rolling beta)"}</span>
                </a>
              </div>

              <div className="docs-method-meta-row">
                <span className="docs-method-version-text">{stable.version}</span>
                <span className="docs-method-meta-dot">·</span>
                <span>ARM64 (arm64-v8a)</span>
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
            </div>
          </div>

          <div className="docs-callout docs-callout--info">
            <div className="docs-callout__content">
              {androidRoadmap?.paragraphs.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "0.6rem 0 0 0" }}>
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

          <div className="docs-callout docs-callout--info">
            <div className="docs-callout__content">
              {iosRoadmap?.paragraphs.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "0.6rem 0 0 0" }}>
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
              <div>
                <h2 className="docs-method-hero__title">
                  {isEn ? "Bobine Assistant (Network Orchestrator)" : "Bobine Assistant (Orchestrateur Réseau)"}
                </h2>
                <p className="docs-method-hero__desc">
                  {isEn
                    ? "Lightweight Rust & Tauri 2 desktop tool to discover, audit, and deploy Bobine headless appliances across your local network without typing terminal commands."
                    : "Application graphique légère en Rust & Tauri 2 pour découvrir, auditer et déployer vos appliances Bobine sur le réseau local sans saisir de ligne de commande."}
                </p>
              </div>
            </div>

            <div className="docs-method-hero__action-col">
              <a
                href={stable.downloads.assistant}
                download
                className="btn-primary docs-method-download-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{isEn ? "Download bobine-assistant" : "Télécharger bobine-assistant"}</span>
              </a>
              <div className="docs-method-meta-row">
                <span className="docs-method-version-text">{stable.version}</span>
                <span className="docs-method-meta-dot">·</span>
                <span>Tauri 2 (Rust)</span>
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
            </div>
          </div>

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
              <div>
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

            <div className="docs-method-hero__action-col">
              <div className="docs-quick-install-box" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <span className="docs-quick-install-box__label">
                    {isEn ? "Stable Install Command (Recommended):" : "Commande d'installation Stable (Recommandé) :"}
                  </span>
                  <div className="docs-copyable-cmd">
                    <code>curl -fsSL https://bobine.fit/install.sh | sudo bash</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("curl -fsSL https://bobine.fit/install.sh | sudo bash")}
                      className="docs-copy-btn"
                      aria-label={isEn ? "Copy stable install command" : "Copier la commande stable"}
                    >
                      {copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="docs-quick-install-box__label">
                    {isEn ? "Beta Channel Install (Rolling beta):" : "Canal Bêta (Rolling beta — Accès anticipé) :"}
                  </span>
                  <div className="docs-copyable-cmd">
                    <code>curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta</code>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta")}
                      className="docs-copy-btn"
                      aria-label={isEn ? "Copy beta install command" : "Copier la commande bêta"}
                    >
                      {copiedCmd ? (isEn ? "Copied" : "Copié") : (isEn ? "Copy" : "Copier")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-heading)" }}>
              {isEn ? "Interactive Step-by-Step Appliance Guide & Terminal Simulator" : "Guide Étape par Étape & Simulateur de Terminal Interactif"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
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
