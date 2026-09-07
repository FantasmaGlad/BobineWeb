"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Locale } from "@/lib/i18n";

interface TauriDemoProps {
  locale: Locale;
}

const INSTALL_STEPS = [
  { num: 1, title: "Paquets système (apt)", detail: "Chromium, MPV, SQLite3, pilotes VA-API iHD", pct: 7 },
  { num: 2, title: "Accès GPU & Xwrapper", detail: "Groupes render/video & QuickSync activés", pct: 14 },
  { num: 3, title: "Environnement Python", detail: "Python 3.13 venv, FastAPI, Uvicorn", pct: 21 },
  { num: 4, title: "Build du frontend Next.js", detail: "Export statique SSG (frontend/out)", pct: 28 },
  { num: 5, title: "Configuration de production", detail: "/etc/bobine/config.toml (mono-processus)", pct: 35 },
  { num: 6, title: "Script de contrôle CLI 'bobine'", detail: "/usr/local/bin/bobine installé", pct: 42 },
  { num: 7, title: "Désinstalleur détaché", detail: "Script autonome de reset usine prêt", pct: 49 },
  { num: 8, title: "Service systemd — backend", detail: "bobine-backend.service démarré (port 8000)", pct: 56 },
  { num: 9, title: "Kiosk Chromium", detail: "Session X11 verrouillée, anti-veille actif", pct: 64 },
  { num: 10, title: "Audio & ALSA", detail: "Auto-port, anti-sifflement sono", pct: 71 },
  { num: 11, title: "Autorisation sudo restreinte", detail: "Commandes de maintenance autorisées", pct: 78 },
  { num: 12, title: "Synchronisation NTP", detail: "systemd-timesyncd synchronisé", pct: 85 },
  { num: 13, title: "URL locale (mDNS) & port 80", detail: "http://bobine.local actif sur LAN", pct: 92 },
  { num: 14, title: "Chien de garde (watchdog)", detail: "bobine-watchdog.timer actif", pct: 96 },
  { num: 15, title: "Activation des services & santé", detail: "Contrôle HTTP 200 OK validé", pct: 100 },
];

export default function TauriDemo({ locale }: TauriDemoProps) {
  const isEn = locale === "en";

  // Étape du Wizard (1 à 5)
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Étape 1 : Découverte
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(true);
  const [selectedIp, setSelectedIp] = useState<string>("10.0.0.30");

  // Étape 2 : Connexion SSH
  const [sshConnecting, setSshConnecting] = useState<boolean>(false);

  // Étape 4 : Options
  const [kioskEnabled, setKioskEnabled] = useState<boolean>(true);
  const [mockEnabled, setMockEnabled] = useState<boolean>(true);
  const [betaChannel, setBetaChannel] = useState<boolean>(false);

  // Étape 5 : Déploiement
  const [deployStepIndex, setDeployStepIndex] = useState<number>(0);
  const [deployPct, setDeployPct] = useState<number>(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([
    "[SYS] Session SSH établie avec 10.0.0.30:22",
    "[SYS] Lancement du déploiement automatisé : ./install.sh --channel=stable --progress=json",
  ]);
  const [isDeployCompleted, setIsDeployCompleted] = useState<boolean>(false);

  // Simulation automatique optionnelle
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const logsContainerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearActiveTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scrollLogsToBottom = useCallback(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, []);

  // Démarre le déploiement étape 5
  const startDeployment = useCallback(() => {
    setWizardStep(5);
    setDeployStepIndex(0);
    setDeployPct(5);
    const channelFlag = betaChannel ? "--channel=beta" : "--channel=stable";
    setDeployLogs([
      "[SYS] Session SSH authentifiée (utilisateur 'fanta')",
      "[SYS] Amorçage des privilèges sudo : OK",
      `[SYS] Lancement : ./install.sh ${channelFlag} --progress=json`,
    ]);
    setIsDeployCompleted(false);
  }, [betaChannel]);

  // Avance les étapes de déploiement
  useEffect(() => {
    if (wizardStep !== 5 || isDeployCompleted) return;

    if (deployStepIndex < INSTALL_STEPS.length) {
      const step = INSTALL_STEPS[deployStepIndex];
      timerRef.current = setTimeout(() => {
        setDeployPct(step.pct);
        setDeployLogs((prev) => [
          ...prev,
          `[OK] Étape ${step.num}/15 : ${step.title} — ${step.detail}`,
        ]);
        scrollLogsToBottom();

        if (deployStepIndex + 1 < INSTALL_STEPS.length) {
          setDeployStepIndex((prev) => prev + 1);
        } else {
          setIsDeployCompleted(true);
          setDeployLogs((prev) => [
            ...prev,
            "[TERMINÉ] Installation terminée avec succès (15/15 étapes).",
            "[HEALTH] API backend HTTP 200 OK — Kiosque et mDNS actifs.",
          ]);
          setTimeout(scrollLogsToBottom, 60);
        }
      }, 450);

      return () => clearActiveTimer();
    }
  }, [wizardStep, deployStepIndex, isDeployCompleted, scrollLogsToBottom]);

  // Réinitialiser la démonstration
  const resetDemo = useCallback(() => {
    clearActiveTimer();
    setWizardStep(1);
    setIsScanning(false);
    setHasScanned(true);
    setSelectedIp("10.0.0.30");
    setSshConnecting(false);
    setDeployStepIndex(0);
    setDeployPct(0);
    setDeployLogs([]);
    setIsDeployCompleted(false);
  }, []);

  // Passer directement au bilan final réussi
  const skipToSuccess = useCallback(() => {
    clearActiveTimer();
    setWizardStep(5);
    setDeployStepIndex(INSTALL_STEPS.length - 1);
    setDeployPct(100);
    setDeployLogs([
      "[SYS] Session SSH authentifiée (utilisateur 'fanta')",
      "[SYS] Lancement : ./install.sh --progress=json",
      ...INSTALL_STEPS.map((s) => `[OK] Étape ${s.num}/15 : ${s.title} — ${s.detail}`),
      "[TERMINÉ] Installation terminée avec succès (15/15 étapes).",
      "[HEALTH] API backend HTTP 200 OK — Kiosque et mDNS actifs.",
    ]);
    setIsDeployCompleted(true);
    setTimeout(scrollLogsToBottom, 60);
  }, [scrollLogsToBottom]);

  // Action scan réseau
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
    }, 700);
  };

  // Action vérification SSH
  const handleConnectSsh = () => {
    setSshConnecting(true);
    setTimeout(() => {
      setSshConnecting(false);
      setWizardStep(3);
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      className="tauri-demo-container"
      role="region"
      aria-label={isEn ? "Bobine Assistant Tauri interactive demo" : "Démonstration interactive Bobine Assistant Tauri"}
    >
      <div className="tauri-demo-window">
        {/* En-tête de fenêtre façon application native desktop */}
        <div className="tauri-demo-header">
          <div className="tauri-demo-dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>

          <div className="tauri-demo-title-group">
            <div className="tauri-demo-brand">
              <span className="tauri-demo-brand-name">BOBINE</span>
              <span className="tauri-demo-brand-tag">
                {isEn ? "INSTALLATION WIZARD" : "ASSISTANT D'INSTALLATION"}
              </span>
            </div>
            <div className="tauri-demo-status-pill">
              <span className={`status-dot ${selectedIp ? "connected" : "disconnected"}`} />
              <span className="status-text">
                {wizardStep === 5 && isDeployCompleted
                  ? (isEn ? "Online : 10.0.0.30" : "En ligne : 10.0.0.30")
                  : selectedIp
                  ? `${isEn ? "Target" : "Cible"} : ${selectedIp}`
                  : (isEn ? "Ready" : "Prêt")}
              </span>
            </div>
          </div>

          <div className="tauri-demo-controls">
            <button
              type="button"
              className="terminal-ctrl-btn"
              onClick={resetDemo}
              title={isEn ? "Reset simulation" : "Réinitialiser"}
              aria-label={isEn ? "Reset simulation" : "Réinitialiser"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
              </svg>
              <span>{isEn ? "Reset" : "Rejouer"}</span>
            </button>

            {(!isDeployCompleted || wizardStep < 5) && (
              <button
                type="button"
                className="terminal-ctrl-btn"
                onClick={skipToSuccess}
                title={isEn ? "Direct success view" : "Vue directe"}
                aria-label={isEn ? "Direct success view" : "Vue directe"}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
                <span>{isEn ? "Fast View" : "Vue directe"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Stepper à 5 étapes officiel */}
        <div className="tauri-wizard-stepper">
          {[
            { step: 1, label: isEn ? "Discovery" : "Découverte" },
            { step: 2, label: isEn ? "Connection" : "Connexion" },
            { step: 3, label: isEn ? "System" : "Système" },
            { step: 4, label: isEn ? "Options" : "Options" },
            { step: 5, label: isEn ? "Deployment" : "Déploiement" },
          ].map((item, i, arr) => {
            const isActive = wizardStep === item.step;
            const isDone = wizardStep > item.step;
            return (
              <div key={item.step} className="tauri-stepper-item-wrap">
                <button
                  type="button"
                  className={`tauri-stepper-circle ${isActive ? "is-active" : isDone ? "is-done" : ""}`}
                  onClick={() => setWizardStep(item.step)}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    item.step
                  )}
                </button>
                <span className={`tauri-stepper-label ${isActive ? "is-active" : ""}`}>
                  {item.label}
                </span>
                {i < arr.length - 1 && (
                  <div className={`tauri-stepper-line ${wizardStep > item.step ? "is-done" : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Corps applicatif : Conteneur à hauteur verrouillée pour éliminer tout tressautement */}
        <div className="tauri-demo-body-viewport">
          {/* ÉTAPE 1 : DÉCOUVERTE RÉSEAU */}
          {wizardStep === 1 && (
            <div className="tauri-pane">
              <div className="tauri-pane-header">
                <h3>{isEn ? "Locate the mini PC on local network" : "Localiser le mini PC sur le réseau"}</h3>
                <p>{isEn ? "Scan all local network interfaces (Wi-Fi, Ethernet) to detect the Debian target or enter its address manually." : "Scannez votre réseau local pour détecter automatiquement la cible Debian ou saisissez son adresse manuellement."}</p>
              </div>

              <div className="tauri-discovery-controls">
                <button
                  type="button"
                  className="tauri-btn tauri-btn--primary"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning && (
                    <span className="terminal-spinner" style={{ marginRight: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" className="terminal-spinner-icon" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </span>
                  )}
                  <span>{isScanning ? (isEn ? "Scanning..." : "Scan en cours...") : (isEn ? "Scan local network" : "Lancer le scan réseau")}</span>
                </button>

                <div className="tauri-manual-ip">
                  <input
                    type="text"
                    value={selectedIp}
                    onChange={(e) => setSelectedIp(e.target.value)}
                    placeholder="Ex: 10.0.0.30"
                    className="tauri-input"
                  />
                  <button
                    type="button"
                    className="tauri-btn tauri-btn--secondary"
                    onClick={() => setWizardStep(2)}
                  >
                    {isEn ? "Target this IP" : "Cibler cette IP"}
                  </button>
                </div>
              </div>

              <div className="tauri-devices-section">
                <span className="tauri-section-label">{isEn ? "Discovered devices" : "Appareils détectés"}</span>
                <div className="tauri-devices-list">
                  <div className="tauri-device-row is-selected">
                    <div className="tauri-device-info">
                      <span className="tauri-device-name">Dell Wyse 5070 — pavilion-malefique.local</span>
                      <span className="tauri-device-ip">10.0.0.30 · Port 8000 · SSH : 22</span>
                      <div className="tauri-device-pills">
                        <span className="tauri-pill tauri-pill--success">Bobine Actif</span>
                        <span className="tauri-pill tauri-pill--info">SSH Ouvert</span>
                        <span className="tauri-pill">Debian 13</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tauri-btn tauri-btn--primary tauri-btn--sm"
                      onClick={() => {
                        setSelectedIp("10.0.0.30");
                        setWizardStep(2);
                      }}
                    >
                      {isEn ? "Select" : "Sélectionner"}
                    </button>
                  </div>

                  <div className="tauri-device-row">
                    <div className="tauri-device-info">
                      <span className="tauri-device-name">Hôte Linux — dev-pc.local</span>
                      <span className="tauri-device-ip">10.0.0.28 · SSH : 22</span>
                      <div className="tauri-device-pills">
                        <span className="tauri-pill tauri-pill--info">SSH Ouvert</span>
                        <span className="tauri-pill">Ubuntu 24.04</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="tauri-btn tauri-btn--secondary tauri-btn--sm"
                      onClick={() => {
                        setSelectedIp("10.0.0.28");
                        setWizardStep(2);
                      }}
                    >
                      {isEn ? "Select" : "Sélectionner"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : CONNEXION SSH */}
          {wizardStep === 2 && (
            <div className="tauri-pane">
              <div className="tauri-pane-header">
                <h3>{isEn ? "SSH target authentication" : "Connexion SSH à la cible"}</h3>
                <p>{isEn ? "Enter the credentials configured during minimal Debian 13 installation." : "Entrez les identifiants configurés lors de l'installation minimale de Debian 13."}</p>
              </div>

              <div className="tauri-form-grid">
                <div className="tauri-form-group">
                  <label className="tauri-label">{isEn ? "IP Address / Hostname" : "Adresse IP / Nom d'hôte"}</label>
                  <input type="text" value={selectedIp} readOnly className="tauri-input" />
                </div>
                <div className="tauri-form-group">
                  <label className="tauri-label">{isEn ? "SSH Port" : "Port SSH"}</label>
                  <input type="number" defaultValue={22} className="tauri-input" />
                </div>
                <div className="tauri-form-group">
                  <label className="tauri-label">{isEn ? "Target user" : "Utilisateur standard"}</label>
                  <input type="text" defaultValue="fanta" className="tauri-input" />
                </div>
                <div className="tauri-form-group">
                  <label className="tauri-label">{isEn ? "User password" : "Mot de passe utilisateur"}</label>
                  <input type="password" defaultValue="••••••••" className="tauri-input" />
                </div>
              </div>

              <div className="tauri-pane-actions">
                <button
                  type="button"
                  className="tauri-btn tauri-btn--secondary"
                  onClick={() => setWizardStep(1)}
                >
                  {isEn ? "Back" : "Retour"}
                </button>
                <button
                  type="button"
                  className="tauri-btn tauri-btn--primary"
                  onClick={handleConnectSsh}
                  disabled={sshConnecting}
                >
                  {sshConnecting && (
                    <span className="terminal-spinner" style={{ marginRight: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" className="terminal-spinner-icon" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </span>
                  )}
                  <span>{sshConnecting ? (isEn ? "Testing SSH..." : "Test de connexion...") : (isEn ? "Verify & Inspect" : "Vérifier & Analyser")}</span>
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : ANALYSE SYSTÈME & PRIVILÈGES */}
          {wizardStep === 3 && (
            <div className="tauri-pane">
              <div className="tauri-pane-header">
                <h3>{isEn ? "Target hardware & privilege audit" : "Analyse du système cible"}</h3>
                <p>{isEn ? "The assistant inspected hardware capabilities, GPU acceleration, and privilege policies." : "L'assistant a sondé le matériel et la politique de privilèges de votre mini PC."}</p>
              </div>

              <div className="tauri-specs-grid">
                <div className="tauri-spec-card">
                  <span className="tauri-spec-title">{isEn ? "Operating System" : "Système d'exploitation"}</span>
                  <span className="tauri-spec-val">Debian 13 (Trixie)</span>
                  <span className="tauri-pill tauri-pill--success">{isEn ? "Compatible" : "Compatible"}</span>
                </div>
                <div className="tauri-spec-card">
                  <span className="tauri-spec-title">{isEn ? "Processor" : "Processeur"}</span>
                  <span className="tauri-spec-val">Intel Celeron J4105 (4 cœurs @ 1.50GHz)</span>
                  <span className="tauri-pill tauri-pill--info">64-bit (x86_64)</span>
                </div>
                <div className="tauri-spec-card">
                  <span className="tauri-spec-title">{isEn ? "Memory & Storage" : "Mémoire & Disque"}</span>
                  <span className="tauri-spec-val">8 Go RAM / 60 Go Libre</span>
                  <span className="tauri-pill tauri-pill--success">{isEn ? "Adequate" : "Adéquat"}</span>
                </div>
                <div className="tauri-spec-card">
                  <span className="tauri-spec-title">{isEn ? "Hardware Video Playout" : "Accélération Vidéo"}</span>
                  <span className="tauri-spec-val">Intel UHD Graphics 600 (QuickSync)</span>
                  <span className="tauri-pill tauri-pill--success">{isEn ? "Supported" : "Supporté"}</span>
                </div>
              </div>

              <div className="tauri-pane-actions">
                <button
                  type="button"
                  className="tauri-btn tauri-btn--secondary"
                  onClick={() => setWizardStep(2)}
                >
                  {isEn ? "Back" : "Retour"}
                </button>
                <button
                  type="button"
                  className="tauri-btn tauri-btn--primary"
                  onClick={() => setWizardStep(4)}
                >
                  {isEn ? "Continue to options" : "Continuer vers les options"}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : PARAMÈTRES D'INSTALLATION */}
          {wizardStep === 4 && (
            <div className="tauri-pane">
              <div className="tauri-pane-header">
                <h3>{isEn ? "Installation parameters" : "Paramètres d'installation"}</h3>
                <p>{isEn ? "Select the target execution mode for the gym kiosk display." : "Sélectionnez la configuration souhaitée pour la borne."}</p>
              </div>

              <div className="tauri-options-list">
                <label className="tauri-toggle-card">
                  <div className="tauri-toggle-text">
                    <span className="tauri-toggle-title">{isEn ? "Fullscreen Chromium Kiosk" : "Mode Kiosque Plein Écran"}</span>
                    <span className="tauri-toggle-desc">{isEn ? "Automatically launch Chromium locked on the connected HDMI cinema display." : "Démarre automatiquement Chromium en plein écran verrouillé sur l'écran HDMI connecté."}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={kioskEnabled}
                    onChange={(e) => setKioskEnabled(e.target.checked)}
                    className="tauri-checkbox"
                  />
                </label>

                <label className="tauri-toggle-card">
                  <div className="tauri-toggle-text">
                    <span className="tauri-toggle-title">{isEn ? "Simulation / Replay Mode" : "Simulation d'installation (Mode Démo)"}</span>
                    <span className="tauri-toggle-desc">{isEn ? "Inspect the complete live deployment pipeline safely without modifying system files." : "Rejoue le flux réel capturé pour valider la progression sans altérer la machine distante."}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mockEnabled}
                    onChange={(e) => setMockEnabled(e.target.checked)}
                    className="tauri-checkbox"
                  />
                </label>

                <label className="tauri-toggle-card">
                  <div className="tauri-toggle-text">
                    <span className="tauri-toggle-title">{isEn ? "Bobine Beta Program" : "Programme Bobine Beta"}</span>
                    <span className="tauri-toggle-desc">
                      {isEn
                        ? "Early access to upcoming features. Automatically replaced by equivalent or newer stable. Disabled = Stable channel (recommended)."
                        : "Accès anticipé aux fonctionnalités en cours de développement. Une version stable équivalente ou plus récente la remplace toujours. Désactivé = canal Stable (recommandé)."}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={betaChannel}
                    onChange={(e) => setBetaChannel(e.target.checked)}
                    className="tauri-checkbox"
                  />
                </label>
              </div>

              <div className="tauri-pane-actions">
                <button
                  type="button"
                  className="tauri-btn tauri-btn--secondary"
                  onClick={() => setWizardStep(3)}
                >
                  {isEn ? "Back" : "Retour"}
                </button>
                <button
                  type="button"
                  className="tauri-btn tauri-btn--primary"
                  onClick={startDeployment}
                >
                  {isEn ? "Start installation" : "Lancer l'installation"}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 5 : DÉPLOIEMENT EN TEMPS RÉEL */}
          {wizardStep === 5 && (
            <div className="tauri-pane">
              <div className="tauri-pane-header">
                <h3>
                  {isDeployCompleted
                    ? (isEn ? "Deployment successfully completed" : "Installation terminée avec succès")
                    : (isEn ? "Deployment in progress..." : "Déploiement en cours...")}
                </h3>
                <p>
                  {isDeployCompleted
                    ? (isEn ? "All 15 system steps were executed and validated." : "Les 15 étapes du script ont été exécutées et validées.")
                    : (isEn ? `Step ${deployStepIndex + 1} of 15 : ${INSTALL_STEPS[deployStepIndex]?.title || "Initializing"}` : `Étape ${deployStepIndex + 1} sur 15 : ${INSTALL_STEPS[deployStepIndex]?.title || "Initialisation"}`)}
                </p>
              </div>

              {/* Barre de progression avec pourcentage */}
              <div className="tauri-progress-section">
                <div className="tauri-progress-track">
                  <div className="tauri-progress-fill" style={{ width: `${deployPct}%` }} />
                </div>
                <span className="tauri-progress-pct">{deployPct}%</span>
              </div>

              {/* Journal d'exécution temps réel (console de logs) */}
              <div className="tauri-terminal-box">
                <div className="tauri-terminal-header">
                  <span>{isEn ? "Execution log (install.sh --progress=json)" : "Journal d'exécution (install.sh --progress=json)"}</span>
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => setDeployLogs([])}
                  >
                    {isEn ? "Clear" : "Effacer"}
                  </button>
                </div>
                <div ref={logsContainerRef} className="tauri-terminal-body">
                  {deployLogs.map((log, idx) => (
                    <div key={idx} className="tauri-log-row">
                      <span className="tauri-log-prefix">&gt;</span>
                      <span className={log.startsWith("[OK]") ? "tauri-log-ok" : log.startsWith("[TERMINÉ]") ? "tauri-log-done" : ""}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bilan de succès officiel */}
              {isDeployCompleted && (
                <div className="tauri-success-banner">
                  <div className="tauri-success-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="tauri-success-details">
                    <h4>{isEn ? "Bobine was installed successfully!" : "Bobine a été installé avec succès !"}</h4>
                    <p>{isEn ? "Your mini PC is operational and ready for video playout & gym streaming." : "Votre mini PC est prêt pour la diffusion de cours et la télécommande."}</p>
                    <div className="tauri-success-actions">
                      <a
                        href="http://bobine.local"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tauri-btn tauri-btn--primary tauri-btn--sm"
                      >
                        {isEn ? "Open Web Administration" : "Ouvrir l'administration (Web)"}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
