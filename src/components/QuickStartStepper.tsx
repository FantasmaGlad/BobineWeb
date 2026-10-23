"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";
import Shot from "@/components/Shot";
import CodeBlock from "@/components/CodeBlock";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import { lp } from "@/lib/seo";
import "@/styles/split/pages-docs.css";

interface QuickStartStepperProps {
  locale: Locale;
}

export default function QuickStartStepper({ locale }: QuickStartStepperProps) {
  const isEn = locale === "en";
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("bobine_quickstart_progress");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // stockage local indisponible : la progression n'est pas conservée
    }
    return [];
  });
  const [isContinuousMode, setIsContinuousMode] = useState(false);

  const toggleStepCompleted = (index: number) => {
    setCompletedSteps((prev) => {
      const updated = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      try {
        localStorage.setItem("bobine_quickstart_progress", JSON.stringify(updated));
      } catch {
        // stockage local indisponible : la progression n'est pas conservée
      }
      return updated;
    });
  };

  const markAndNext = (index: number) => {
    if (!completedSteps.includes(index)) {
      toggleStepCompleted(index);
    }
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const steps = [
    {
      id: "requirements",
      number: 0,
      badge: isEn ? "Prerequisites" : "Prérequis",
      title: isEn ? "What you need & Hardware selection" : "Matériel requis & Choix du mini PC",
      shortTitle: isEn ? "Hardware" : "Matériel",
      content: (
        <div>
          <p>
            {isEn
              ? "Bobine runs on standard, low-cost x86-64 mini PCs. You do not need expensive proprietary servers — refurbished enterprise hardware provides full 1080p60/4K playout with dedicated GPU decoding."
              : "Bobine fonctionne sur des mini PC standards x86-64 très économiques. Aucun serveur propriétaire coûteux n'est requis : du matériel reconditionné d'entreprise (40 à 70 €) assure une diffusion 1080p60/4K parfaite avec décodage matériel."}
          </p>

          <div className="docs-table-wrapper">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>{isEn ? "Component" : "Composant"}</th>
                  <th>{isEn ? "Requirement" : "Spécification minimale"}</th>
                  <th>{isEn ? "Recommendation" : "Recommandation optimale"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{isEn ? "Mini PC / CPU" : "Mini PC / Processeur"}</strong></td>
                  <td>x86-64 CPU (Intel iGPU / AMD APU)</td>
                  <td>Dell Wyse 5070 (Celeron J4105 ~40–50 €) ou Beelink N100</td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "RAM Memory" : "Mémoire vive (RAM)"}</strong></td>
                  <td>4 GB RAM</td>
                  <td>8 GB DDR4</td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "Storage" : "Stockage SSD"}</strong></td>
                  <td>32 GB minimum</td>
                  <td>128 GB–256 GB NVMe / SATA SSD</td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "Display / TV" : "Écran TV / Vidéoprojecteur"}</strong></td>
                  <td>HDMI 1080p ou 4K</td>
                  <td>{isEn ? "4K 60fps TV or projector" : "Télévision ou vidéoprojecteur 4K 60 im/s"}</td>
                </tr>
                <tr>
                  <td><strong>{isEn ? "Flash Drive" : "Clé USB"}</strong></td>
                  <td>8 GB USB Drive</td>
                  <td>USB 3.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="docs-callout docs-callout--info">
            <div className="docs-callout__content">
              <div className="docs-callout__title">
                {isEn ? "Tested & Recommended Models" : "Modèles testés et recommandés"}
              </div>
              <div>
                <ul>
                  <li>
                    <strong>Intel</strong> : Dell Wyse 5070 (Celeron J4105), HP ProDesk 400/600 G4/G5 DM, Lenovo ThinkCentre M710q/M720q Tiny, Beelink N100.
                  </li>
                  <li>
                    <strong>AMD</strong> : HP EliteDesk 705 G4/G5 Mini (Ryzen 3/5 Pro), Lenovo M715q/M725q Tiny, HP T630/T730 Thin Client.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "download-debian",
      number: 1,
      badge: isEn ? "Step 1" : "Étape 1",
      title: isEn ? "Download Debian 13 Netinst ISO" : "Télécharger Debian 13 Netinst ISO",
      shortTitle: isEn ? "Debian ISO" : "Debian ISO",
      content: (
        <div>
          <p>
            {isEn
              ? "Bobine targets Debian 13 'Trixie' (or Debian 12 'Bookworm') in a minimal headless installation without any heavy desktop environment."
              : "Bobine cible Debian 13 « Trixie » (ou Debian 12 « Bookworm ») en installation minimale épurée, sans environnement de bureau lourd."}
          </p>
          <p>
            {isEn
              ? "Download the official netinst ISO image (~700 MB) from Debian: "
              : "Téléchargez l'image ISO netinst officielle (~700 Mo) depuis le site Debian : "}
            <a href="https://www.debian.org/download" target="_blank" rel="noreferrer">
              debian.org/download
            </a>{" "}
            {isEn ? "— select the amd64 netinst image." : "— choisissez l'image netinst amd64."}
          </p>
        </div>
      ),
    },
    {
      id: "flash-usb",
      number: 2,
      badge: isEn ? "Step 2" : "Étape 2",
      title: isEn ? "Write ISO to USB Flash Drive" : "Écrire l'image sur la clé USB",
      shortTitle: isEn ? "Flash USB" : "Flasher USB",
      content: (
        <div>
          <p>
            <strong>Windows / macOS</strong> :{" "}
            {isEn
              ? "Use balenaEtcher (or Rufus on Windows) — select the downloaded Debian ISO, select your USB flash drive, and click Flash."
              : "Utilisez balenaEtcher (ou Rufus sous Windows) — sélectionnez l'ISO Debian téléchargé, choisissez votre clé USB et lancez l'écriture."}
          </p>
          <Shot caption={isEn ? "balenaEtcher interface with Debian ISO and USB drive selected, ready to flash" : "Interface de balenaEtcher avec l'image Debian et la clé USB sélectionnées, prêt à flasher"} />

          <p><strong>{isEn ? "Linux Terminal" : "En ligne de commande sous Linux"}</strong> :</p>
          <CodeBlock title="bash — dd command">
            <code>sudo dd if=debian-13-*-amd64-netinst.iso of=/dev/sdX bs=4M status=progress oflag=sync</code>
          </CodeBlock>
          <p>
            <em>
              {isEn
                ? "Replace /dev/sdX with your actual USB flash drive device identifier (found via lsblk)."
                : "Remplacez /dev/sdX par l'identifiant de votre clé USB (trouvé via lsblk)."}
            </em>
          </p>
        </div>
      ),
    },
    {
      id: "boot-bios",
      number: 3,
      badge: isEn ? "Step 3" : "Étape 3",
      title: isEn ? "Boot Mini PC & Critical BIOS Settings" : "Démarrer sur la clé & Réglages BIOS",
      shortTitle: isEn ? "BIOS Boot" : "Boot BIOS",
      content: (
        <div>
          <p>
            {isEn
              ? "Insert the USB flash drive into the mini PC, turn it on, and immediately press the Boot Menu key (F12 on Dell Wyse, or F7, F10, Esc on other machines). Select the USB drive in the list."
              : "Insérez la clé USB dans le mini PC, allumez-le et appuyez immédiatement sur la touche du menu de démarrage (F12 sur Dell Wyse, ou F7, F10, Échap selon la marque). Choisissez la clé USB dans la liste."}
          </p>

          <div className="docs-callout docs-callout--tip">
            <div className="docs-callout__content">
              <div className="docs-callout__title">
                {isEn ? "Crucial BIOS Setting: AC Power Recovery" : "Réglage BIOS crucial : Reprise sur coupure de courant"}
              </div>
              <div>
                {isEn
                  ? "In the BIOS under Power Management / AC Recovery, select 'Power On'. This ensures your gym's display automatically powers back on and resumes playout after any power outage without manual intervention."
                  : "Dans le BIOS (section Power Management / AC Recovery), choisissez 'Power On'. Votre régie se rallumera et reprendra la diffusion automatiquement après toute coupure générale de courant."}
              </div>
            </div>
          </div>
          <Shot caption={isEn ? "Boot menu showing the USB flash drive selected as primary boot device" : "Écran du menu de démarrage (boot menu) avec la clé USB sélectionnée"} />
        </div>
      ),
    },
    {
      id: "install-debian",
      number: 4,
      badge: isEn ? "Step 4" : "Étape 4",
      title: isEn ? "Install minimal Debian (No GUI desktop)" : "Installer Debian minimale (Sans bureau graphique)",
      shortTitle: isEn ? "Debian Install" : "Install Debian",
      content: (
        <div>
          <p>{isEn ? "Follow the standard installer wizard:" : "Suivez les étapes classiques de l'installateur :"}</p>
          <ol>
            <li><strong>{isEn ? "Language & Keyboard" : "Langue et clavier"}</strong> — {isEn ? "select your preferences." : "choisissez selon vos préférences."}</li>
            <li><strong>{isEn ? "Hostname" : "Nom de machine"}</strong> — {isEn ? "set e.g. 'bobine'. The system will be accessible at http://bobine.local." : "indiquez 'bobine'. Le système sera joignable sur http://bobine.local."}</li>
            <li><strong>{isEn ? "User account" : "Compte utilisateur"}</strong> — {isEn ? "create a regular user account (not root) with a strong password." : "créez un compte utilisateur normal (pas root) avec votre mot de passe."}</li>
            <li><strong>{isEn ? "Disk Partitioning" : "Partitionnement"}</strong> — {isEn ? "choose 'Guided - use entire disk'." : "sélectionnez 'Guidé - utiliser tout le disque'."}</li>
            <li>
              <strong>{isEn ? "Software Selection (Critical step)" : "Sélection des logiciels (Étape critique)"}</strong> —{" "}
              <strong>{isEn ? "Uncheck all desktop environments (GNOME, XFCE, etc.)" : "Décochez impérativement tous les bureaux (GNOME, XFCE...)"}</strong>,{" "}
              {isEn
                ? "and check only SSH Server and Standard system utilities. Bobine operates its own optimized fullscreen kiosk layer."
                : "et cochez uniquement Serveur SSH et Utilitaires usuels du système. Bobine intègre son propre environnement kiosque plein écran ultra-optimisé."}
            </li>
          </ol>
          <Shot caption={isEn ? "Software selection screen with only SSH Server and Standard utilities checked" : "Écran de sélection des logiciels avec uniquement Serveur SSH et Utilitaires usuels cochés"} />
          <p>
            {isEn
              ? "6. Finish installation and reboot while removing the USB drive."
              : "6. Terminez l'installation et redémarrez en retirant la clé USB."}
          </p>
        </div>
      ),
    },
    {
      id: "connect-ssh",
      number: 5,
      badge: isEn ? "Step 5" : "Étape 5",
      title: isEn ? "Connect via SSH from your computer" : "Se connecter en SSH depuis votre PC",
      shortTitle: isEn ? "SSH Connect" : "Connexion SSH",
      content: (
        <div>
          <p>
            {isEn
              ? "From your laptop or administration computer connected to the same local Wi-Fi / network:"
              : "Depuis votre ordinateur portable ou PC connecté au même réseau Wi-Fi / Ethernet :"}
          </p>
          <CodeBlock title="bash — ssh connection">
            <code>ssh your-username@bobine.local</code>
          </CodeBlock>
          <p>
            {isEn
              ? "If mDNS is blocked on your router, find the mini PC IP address from your router admin panel and connect via ssh your-username@<ip>."
              : "Si votre box / routeur bloque le mDNS, repérez l'adresse IP du mini PC et connectez-vous avec ssh votre-utilisateur@<ip>."}
          </p>
          <Shot caption={isEn ? "Terminal window showing a successful SSH connection to the mini PC" : "Terminal montrant une connexion SSH réussie au mini PC fraîchement installé"} />
        </div>
      ),
    },
    {
      id: "install-bobine",
      number: 6,
      badge: isEn ? "Step 6" : "Étape 6",
      title: isEn ? "Run Bobine Automated Installer" : "Lancer l'installation automatisée de Bobine",
      shortTitle: isEn ? "Install Bobine" : "Install Bobine",
      content: (
        <div>
          <p>
            {isEn
              ? "Still in your SSH session, run the automated installer. You can test arguments and options in the interactive playground below:"
              : "Toujours dans votre session SSH, lancez la commande d'installation. Vous pouvez tester les arguments et options directement dans le simulateur ci-dessous :"}
          </p>

          <InteractiveTerminal
            locale={locale}
            preset="installer"
            title="bash — bobine installer playground"
          />

          <p><strong>{isEn ? "Alternative — Manual repository clone:" : "Alternative — Clonage manuel du dépôt :"}</strong></p>
          <CodeBlock title="bash — manual git clone">
            <code>git clone https://github.com/FantasmaGlad/Bobine.git
cd Bobine
sudo ./install.sh</code>
          </CodeBlock>

          <p>
            {isEn
              ? "install.sh is idempotent and fully automated: it configures the Python virtual environment (FastAPI + SQLite, no external Redis), builds the Next.js UI, registers the 4 systemd units (backend, kiosk, audio-guard, watchdog), and starts everything."
              : "install.sh est autonome et idempotent : il configure l'environnement Python (FastAPI + SQLite, sans dépendance Redis), compile l'interface Next.js, enregistre les 4 services systemd (backend, kiosk, audio-guard, watchdog) et démarre la régie."}
          </p>
          <Shot caption={isEn ? "Completed install.sh execution showing success summary and local IP address" : "Fin de l'exécution de install.sh : message de succès et adresse IP affichée dans le terminal"} />
        </div>
      ),
    },
    {
      id: "validation",
      number: 7,
      badge: isEn ? "Step 7" : "Étape 7",
      title: isEn ? "Post-Install Diagnostic & Health Check" : "Validation & Diagnostic du système",
      shortTitle: isEn ? "Diagnostic" : "Diagnostic",
      content: (
        <div>
          <p>
            {isEn
              ? "Verify that hardware acceleration and background systemd services are operating smoothly:"
              : "Vérifiez que l'accélération matérielle GPU et les services d'arrière-plan fonctionnent :"}
          </p>
          <CodeBlock title="bash — post-install verification">
            <code>{`# 1. Verify Intel / AMD Hardware Video Acceleration (VA-API)
vainfo

# 2. Check Bobine background systemd services
sudo systemctl status bobine-backend bobine-kiosk bobine-watchdog

# 3. Test sound output through HDMI / 3.5mm Jack
speaker-test -t wav -c 2 -l 1`}</code>
          </CodeBlock>
        </div>
      ),
    },
    {
      id: "open-app",
      number: 8,
      badge: isEn ? "Step 8" : "Étape 8",
      title: isEn ? "Open Web Admin Interface" : "Ouvrir l'Interface d'administration",
      shortTitle: isEn ? "Web Admin" : "Interface Web",
      content: (
        <div>
          <p>
            {isEn
              ? "From any smartphone, tablet, or laptop connected to the gym Wi-Fi, open your browser:"
              : "Depuis n'importe quel smartphone, tablette ou ordinateur connecté au Wi-Fi de la salle :"}
          </p>
          <CodeBlock title="browser url">
            <code>http://bobine.local</code>
          </CodeBlock>
          <Shot caption={isEn ? "First login on the Bobine web administration dashboard" : "Première ouverture du tableau de bord d'administration web Bobine"} />
        </div>
      ),
    },
    {
      id: "import-media",
      number: 9,
      badge: isEn ? "Step 9" : "Étape 9",
      title: isEn ? "Upload Workouts & Configure Timetable" : "Importer vos premiers cours & Planning",
      shortTitle: isEn ? "Workouts" : "Cours & Planning",
      content: (
        <div>
          <p>
            {isEn
              ? "From the Admin dashboard, upload your workout videos (drag-and-drop batch upload), organize them by categories (Spinning, HIIT, Yoga, BodyPump), and schedule your weekly timetable slots."
              : "Depuis le panneau d'administration, téléversez vos vidéos de cours (glisser-déposer par lot), créez vos catégories (Spinning, HIIT, Yoga, Renforcement) et programmez votre grille hebdomadaire."}
          </p>
          <Shot caption={isEn ? "Administration panel: Drag-and-drop batch video upload in library" : "Panneau d'administration : Glisser-déposer de vidéos par lot dans la médiathèque"} />

          <div className="docs-callout docs-callout--tip dx-div-18">
            <div className="docs-callout__content">
              <div className="docs-callout__title">
                {isEn ? "Ready for Daily Playout!" : "Votre régie est opérationnelle !"}
              </div>
              <div>
                {isEn
                  ? "Explore the User Manual to configure the member touchscreen kiosk, 24/7 background audio, and coach mobile remotes."
                  : "Consultez le guide d'utilisation pour exploiter la borne tactile membre, la radio sono 24/7 et les télécommandes coach."}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeStep = steps[activeStepIndex] || steps[0];
  const progressPercent = Math.round(
    (completedSteps.length / steps.length) * 100
  );

  return (
    <div className="quickstart-stepper-container">
      {/* Barre de choix du mode */}
      <div className="stepper-mode-bar">
        <div className="stepper-mode-info">
          <span className="stepper-progress-counter">
            {isEn
              ? `Step ${activeStepIndex + 1} of ${steps.length} · ${progressPercent}% completed (${completedSteps.length}/${steps.length} validated)`
              : `Étape ${activeStepIndex + 1} sur ${steps.length} · ${progressPercent}% complété (${completedSteps.length}/${steps.length} validées)`}
          </span>
        </div>

        <div className="stepper-mode-toggle">
          <button
            type="button"
            onClick={() => setIsContinuousMode(false)}
            className={`stepper-mode-btn ${!isContinuousMode ? "is-active" : ""}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>{isEn ? "Step-by-step Wizard" : "Mode Pas-à-Pas (Guidé)"}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsContinuousMode(true)}
            className={`stepper-mode-btn ${isContinuousMode ? "is-active" : ""}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>{isEn ? "Continuous Full View" : "Tout afficher (Mode continu)"}</span>
          </button>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="stepper-progress-track">
        <div
          className="stepper-progress-fill"
          style={{ width: `${Math.max(6, progressPercent)}%` }}
        />
      </div>

      {/* Pastilles de navigation entre étapes */}
      <div className="stepper-nav-pills-wrap">
        {steps.map((s, idx) => {
          const isActive = idx === activeStepIndex && !isContinuousMode;
          const isDone = completedSteps.includes(idx);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActiveStepIndex(idx);
                if (isContinuousMode) {
                  const el = document.getElementById(`step-${s.id}`);
                  el?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`stepper-nav-pill ${isActive ? "is-active" : ""} ${isDone ? "is-done" : ""}`}
            >
              <span className="pill-number-badge">
                {isDone ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  s.number === 0 ? "0" : s.number
                )}
              </span>
              <span className="pill-title">{s.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Corps : une étape à la fois, ou liste continue */}
      {!isContinuousMode ? (
        <div className="stepper-focused-card">
          {/* En-tête de la carte */}
          <div className="stepper-card-header">
            <div className="stepper-card-title-group">
              <span className="stepper-card-badge">{activeStep.badge}</span>
              <h2 className="stepper-card-heading">{activeStep.title}</h2>
            </div>

            <button
              type="button"
              onClick={() => toggleStepCompleted(activeStepIndex)}
              className={`stepper-card-check-btn ${completedSteps.includes(activeStepIndex) ? "is-checked" : ""}`}
              title={isEn ? "Toggle step completion" : "Valider ou dévalider cette étape"}
            >
              <span className="stepper-check-box">
                {completedSteps.includes(activeStepIndex) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span>
                {completedSteps.includes(activeStepIndex)
                  ? (isEn ? "Completed" : "Étape validée")
                  : (isEn ? "Mark completed" : "Valider l'étape")}
              </span>
            </button>
          </div>

          {/* Contenu de la carte */}
          <div className="stepper-card-body">
            {activeStep.content}
          </div>

          {/* Pied de carte : navigation */}
          <div className="stepper-card-footer">
            <button
              type="button"
              onClick={() => {
                if (activeStepIndex > 0) {
                  setActiveStepIndex(activeStepIndex - 1);
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }
              }}
              disabled={activeStepIndex === 0}
              className="btn-secondary stepper-nav-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>{isEn ? "Previous Step" : "Étape précédente"}</span>
            </button>

            <div className="stepper-footer-right">
              {activeStepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => markAndNext(activeStepIndex)}
                  className="btn-primary stepper-nav-btn"
                >
                  <span>{isEn ? "Validate & Next Step" : "Valider & Étape suivante"}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              ) : (
                <Link
                  href={lp(locale, `/documentation/utilisation`)}
                  className="btn-primary stepper-nav-btn"
                >
                  <span>{isEn ? "Explore User Manual" : "Passer au Guide d'Utilisation"}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Mode continu : toutes les étapes */
        <div className="stepper-continuous-list">
          {steps.map((s, idx) => (
            <div key={s.id} id={`step-${s.id}`} className="stepper-continuous-item">
              <div className="stepper-card-header">
                <div className="stepper-card-title-group">
                  <span className="stepper-card-badge">{s.badge}</span>
                  <h2 className="stepper-card-heading">{s.title}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStepCompleted(idx)}
                  className={`stepper-card-check-btn ${completedSteps.includes(idx) ? "is-checked" : ""}`}
                >
                  <span className="stepper-check-box">
                    {completedSteps.includes(idx) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span>
                    {completedSteps.includes(idx)
                      ? (isEn ? "Completed" : "Étape validée")
                      : (isEn ? "Mark completed" : "Valider l'étape")}
                  </span>
                </button>
              </div>

              <div className="stepper-card-body">
                {s.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
