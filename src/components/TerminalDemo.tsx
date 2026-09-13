"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Locale } from "@/lib/i18n";

interface StepItem {
  id: string;
  num: number;
  labelFr: string;
  labelEn: string;
  detailFr: (channel: "stable" | "beta") => string;
  detailEn: (channel: "stable" | "beta") => string;
  durationMs: number;
}

const STEPS: StepItem[] = [
  {
    id: "update-channel",
    num: 1,
    labelFr: "Canal de mise à jour (Stable / Bêta)",
    labelEn: "Update channel (Stable / Bêta)",
    detailFr: (c) => (c === "beta" ? "Canal 'beta' configuré (/etc/bobine/update-channel)" : "Canal 'stable' configuré (/etc/bobine/update-channel)"),
    detailEn: (c) => (c === "beta" ? "'beta' channel configured (/etc/bobine/update-channel)" : "'stable' channel configured (/etc/bobine/update-channel)"),
    durationMs: 800,
  },
  {
    id: "packages",
    num: 2,
    labelFr: "Paquets système (apt)",
    labelEn: "System packages (apt)",
    detailFr: () => "Chromium, MPV, Uvicorn, SQLite3, nftables & pilotes VA-API iHD",
    detailEn: () => "Chromium, MPV, Uvicorn, SQLite3, nftables & VA-API iHD drivers",
    durationMs: 950,
  },
  {
    id: "gpu-access",
    num: 3,
    labelFr: "Accès GPU (groupes render/video) & Xwrapper",
    labelEn: "GPU access (render/video groups) & Xwrapper",
    detailFr: () => "Accélération matérielle QuickSync Intel configurée",
    detailEn: () => "Intel QuickSync hardware acceleration configured",
    durationMs: 800,
  },
  {
    id: "python-env",
    num: 4,
    labelFr: "Environnement Python & dépendances backend",
    labelEn: "Python virtualenv & backend dependencies",
    detailFr: () => "Python 3.13 venv isolé, FastAPI, SQLAlchemy, Uvicorn",
    detailEn: () => "Isolated Python 3.13 venv, FastAPI, SQLAlchemy, Uvicorn",
    durationMs: 900,
  },
  {
    id: "frontend-build",
    num: 5,
    labelFr: "Build du frontend Next.js",
    labelEn: "Next.js frontend build",
    detailFr: () => "Export statique SSG (frontend/out) optimisé pour l'appliance",
    detailEn: () => "Static SSG export (frontend/out) appliance-optimized",
    durationMs: 1000,
  },
  {
    id: "config",
    num: 6,
    labelFr: "Configuration de production",
    labelEn: "Production configuration",
    detailFr: () => "/etc/bobine/config.toml généré (mono-processus sans Redis)",
    detailEn: () => "/etc/bobine/config.toml generated (single-process without Redis)",
    durationMs: 750,
  },
  {
    id: "cli-tool",
    num: 7,
    labelFr: "Script de contrôle CLI 'bobine'",
    labelEn: "CLI control script 'bobine'",
    detailFr: () => "/usr/local/bin/bobine installé (start/stop/status/logs)",
    detailEn: () => "/usr/local/bin/bobine installed (start/stop/status/logs)",
    durationMs: 700,
  },
  {
    id: "uninstaller",
    num: 8,
    labelFr: "Désinstalleur détaché",
    labelEn: "Detached uninstaller",
    detailFr: () => "Script autonome de réinitialisation d'usine prêt",
    detailEn: () => "Autonomous factory reset script ready",
    durationMs: 700,
  },
  {
    id: "backend-service",
    num: 9,
    labelFr: "Service systemd — backend FastAPI",
    labelEn: "Systemd service — FastAPI backend",
    detailFr: () => "bobine-backend.service actif (port 8000)",
    detailEn: () => "bobine-backend.service active (port 8000)",
    durationMs: 850,
  },
  {
    id: "kiosk",
    num: 10,
    labelFr: "Kiosk Chromium (écran cinéma câblé)",
    labelEn: "Chromium Kiosk (cabled cinema display)",
    detailFr: () => "Session X11 verrouillée, anti-veille Screen Wake Lock actif",
    detailEn: () => "Locked X11 session, Screen Wake Lock active",
    durationMs: 950,
  },
  {
    id: "audio",
    num: 11,
    labelFr: "Audio (auto-port, anti-sifflement)",
    labelEn: "Audio engine (auto-port, anti-hum)",
    detailFr: () => "Garde-fou sonore hors session & profil ALSA calibré",
    detailEn: () => "Sound guard between sessions & calibrated ALSA profile",
    durationMs: 800,
  },
  {
    id: "sudoers",
    num: 12,
    labelFr: "Autorisation sudo restreinte",
    labelEn: "Restricted sudo authorization",
    detailFr: () => "Règles ciblées pour maintenance et remise à zéro sécurisée",
    detailEn: () => "Targeted rules for maintenance & secure factory reset",
    durationMs: 700,
  },
  {
    id: "ntp",
    num: 13,
    labelFr: "Synchronisation NTP",
    labelEn: "NTP clock synchronization",
    detailFr: () => "systemd-timesyncd configuré pour calendrier précis",
    detailEn: () => "systemd-timesyncd configured for timetable accuracy",
    durationMs: 700,
  },
  {
    id: "mdns-redirect",
    num: 14,
    labelFr: "URL locale (mDNS) & redirection du port 80",
    labelEn: "Local URL (mDNS) & port 80 redirection",
    detailFr: () => "http://bobine.local accessible sur tout le réseau local",
    detailEn: () => "http://bobine.local accessible throughout local LAN",
    durationMs: 800,
  },
  {
    id: "watchdog",
    num: 15,
    labelFr: "Chien de garde de santé (watchdog)",
    labelEn: "Health watchdog timer",
    detailFr: () => "bobine-watchdog.timer actif (reprise automatique)",
    detailEn: () => "bobine-watchdog.timer active (automatic recovery)",
    durationMs: 700,
  },
  {
    id: "tuning",
    num: 16,
    labelFr: "Optimisations système (gouverneur CPU, journal)",
    labelEn: "System tuning (CPU governor, journald limits)",
    detailFr: () => "Gouverneur CPU 'performance' & journald plafonné à 200 Mo",
    detailEn: () => "CPU governor set to 'performance' & journald capped at 200MB",
    durationMs: 700,
  },
  {
    id: "activation",
    num: 17,
    labelFr: "Activation des services & vérification de santé",
    labelEn: "Services activation & healthcheck",
    detailFr: () => "HTTP 200 OK (http://127.0.0.1:8000/api/health — 8ms)",
    detailEn: () => "HTTP 200 OK (http://127.0.0.1:8000/api/health — 8ms)",
    durationMs: 850,
  },
  {
    id: "capabilities",
    num: 18,
    labelFr: "Vérification des capacités audio & vidéo",
    labelEn: "Audio & video hardware capabilities check",
    detailFr: () => "Carte audio détectée & décodage matériel H.264 VA-API actif",
    detailEn: () => "Audio sink detected & H.264 VA-API hardware decoding active",
    durationMs: 750,
  },
];

const COMMAND_STABLE = "curl -fsSL https://bobine.fit/install.sh | sudo bash";
const COMMAND_BETA = "curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta";

export default function TerminalDemo({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);
  const [channel, setChannel] = useState<"stable" | "beta">("stable");
  const commandText = channel === "stable" ? COMMAND_STABLE : COMMAND_BETA;

  // États d'exécution
  const [hasTriggered, setHasTriggered] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [channelPromptAnswered, setChannelPromptAnswered] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [currentRunningStep, setCurrentRunningStep] = useState<number>(-1);
  const [isCompleted, setIsCompleted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const terminalBodyRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const promptTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (promptTimerRef.current) {
      clearTimeout(promptTimerRef.current);
      promptTimerRef.current = null;
    }
  };

  // Défilement automatique vers le bas du terminal au fur et à mesure
  const scrollToBottom = useCallback(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, []);

  // Démarre l'exécution des 18 étapes
  const startStepsSequence = useCallback(() => {
    setChannelPromptAnswered(true);
    setCurrentRunningStep(0);
    setTimeout(scrollToBottom, 40);
  }, [scrollToBottom]);

  // Sélection d'un canal lors du prompt interactif
  const handleSelectChannelPrompt = useCallback(
    (selected: "stable" | "beta") => {
      setChannel(selected);
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
        promptTimerRef.current = null;
      }
      setChannelPromptAnswered(true);
      setTimeout(() => {
        setCurrentRunningStep(0);
        setTimeout(scrollToBottom, 40);
      }, 500);
    },
    [scrollToBottom]
  );

  // Déclenchement de l'exécution (touche Entrée ou clic initial)
  const triggerExecution = useCallback(() => {
    if (hasTriggered) return;
    clearAllTimers();
    setHasTriggered(true);
    setShowBanner(true);

    // Si la commande incluait déjà --channel=beta, on valide directement le canal
    // Sinon, on affiche le prompt interactif de sélection pendant un court instant avant de lancer
    promptTimerRef.current = setTimeout(() => {
      startStepsSequence();
    }, 2200);
  }, [hasTriggered, startStepsSequence]);

  const restartTerminal = useCallback(() => {
    clearAllTimers();
    setHasTriggered(false);
    setShowBanner(false);
    setChannelPromptAnswered(false);
    setCompletedSteps(0);
    setCurrentRunningStep(-1);
    setIsCompleted(false);
  }, []);

  const skipToEnd = useCallback(() => {
    clearAllTimers();
    setHasTriggered(true);
    setShowBanner(true);
    setChannelPromptAnswered(true);
    setCompletedSteps(STEPS.length);
    setCurrentRunningStep(-1);
    setIsCompleted(true);
    setTimeout(scrollToBottom, 50);
  }, [scrollToBottom]);

  // Écoute des touches au clavier (Entrée pour lancer, 1 ou 2 pour choisir le canal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const isInViewport = rect && rect.top < window.innerHeight && rect.bottom > 0;
      if (!isInViewport) return;

      if (!hasTriggered && e.key === "Enter") {
        e.preventDefault();
        triggerExecution();
        return;
      }

      if (hasTriggered && !channelPromptAnswered) {
        if (e.key === "1") {
          e.preventDefault();
          handleSelectChannelPrompt("stable");
        } else if (e.key === "2") {
          e.preventDefault();
          handleSelectChannelPrompt("beta");
        } else if (e.key === "Enter") {
          e.preventDefault();
          startStepsSequence();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasTriggered, channelPromptAnswered, triggerExecution, handleSelectChannelPrompt, startStepsSequence]);

  // Déroulement des 18 étapes (vitesse posée et lisible)
  useEffect(() => {
    if (!hasTriggered || !showBanner || !channelPromptAnswered || isCompleted) return;

    if (currentRunningStep >= 0 && currentRunningStep < STEPS.length) {
      const step = STEPS[currentRunningStep];
      timerRef.current = setTimeout(() => {
        setCompletedSteps((prev) => prev + 1);
        scrollToBottom();

        if (currentRunningStep + 1 < STEPS.length) {
          setCurrentRunningStep((prev) => prev + 1);
        } else {
          setCurrentRunningStep(-1);
          setIsCompleted(true);
          setTimeout(scrollToBottom, 60);
        }
      }, step.durationMs);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [currentRunningStep, showBanner, channelPromptAnswered, hasTriggered, isCompleted, scrollToBottom]);

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      ref={containerRef}
      className="terminal-wrapper terminal-demo-root"
      tabIndex={0}
      role="region"
      aria-label={isEn ? "Bash installation interactive simulation" : "Simulation interactive de l'installation Bash"}
      onClick={() => {
        if (!hasTriggered) triggerExecution();
      }}
    >
      {/* Barre d'en-tête du terminal */}
      <div className="terminal-header">
        <div className="terminal-dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        <div className="terminal-demo-title-group">
          <span className="terminal-title">
            bash — install.sh ({channel === "stable" ? "Stable" : "Bêta"})
          </span>
          {hasTriggered && (
            <span className={`terminal-demo-status-pill ${!isCompleted ? "is-active" : ""}`}>
              <span
                className={`terminal-demo-status-dot ${
                  isCompleted ? "is-complete" : "is-running"
                }`}
              />
              <span>
                {isCompleted
                  ? (isEn ? "Installed (18/18)" : "Installé (18/18)")
                  : !channelPromptAnswered
                  ? (isEn ? "Channel setup" : "Choix du canal")
                  : (isEn ? `Step ${completedSteps + 1}/18` : `Étape ${completedSteps + 1}/18`)}
              </span>
            </span>
          )}
        </div>

        {/* Sélecteur de canal Stable / Bêta */}
        <div className="terminal-channel-tabs" role="tablist" aria-label={isEn ? "Release channel" : "Canal de version"}>
          <button
            type="button"
            role="tab"
            aria-selected={channel === "stable"}
            className={`terminal-channel-tab ${channel === "stable" ? "is-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setChannel("stable");
            }}
          >
            Stable
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={channel === "beta"}
            className={`terminal-channel-tab ${channel === "beta" ? "is-active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setChannel("beta");
            }}
          >
            Bêta
          </button>
        </div>

        <div className="terminal-demo-actions">
          {/* Bouton Rejouer */}
          {hasTriggered && (
            <button
              type="button"
              className="terminal-ctrl-btn"
              onClick={(e) => {
                e.stopPropagation();
                restartTerminal();
              }}
              title={isEn ? "Reset terminal" : "Réinitialiser"}
              aria-label={isEn ? "Reset terminal" : "Réinitialiser"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
              </svg>
              <span>{isEn ? "Reset" : "Rejouer"}</span>
            </button>
          )}

          {/* Bouton Passer à la fin */}
          {hasTriggered && !isCompleted && (
            <button
              type="button"
              className="terminal-ctrl-btn"
              onClick={(e) => {
                e.stopPropagation();
                skipToEnd();
              }}
              title={isEn ? "Skip animation" : "Passer l'animation"}
              aria-label={isEn ? "Skip animation" : "Passer l'animation"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
              <span>{isEn ? "Fast View" : "Vue directe"}</span>
            </button>
          )}

          {/* Bouton Copier la commande */}
          <button
            type="button"
            className="terminal-copy-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            aria-label={isEn ? "Copy install command" : "Copier la commande"}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{isEn ? "Copied" : "Copié"}</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{isEn ? "Copy" : "Copier"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Corps du terminal avec hauteur fixe et défilement interne */}
      <div ref={terminalBodyRef} className="terminal-body terminal-demo-body">
        {/* Ligne d'invite avec commande */}
        <div className="terminal-line terminal-line--command">
          <span className="terminal-prompt">fanta@dell-wyse:~$</span>
          <code className="terminal-demo-command-text">
            {commandText}
          </code>
          {!hasTriggered && (
            <span className="terminal-cursor" aria-hidden="true" />
          )}

          {/* Bouton d'incitation à l'exécution si pas encore déclenché */}
          {!hasTriggered && (
            <button
              type="button"
              className="terminal-enter-btn"
              onClick={(e) => {
                e.stopPropagation();
                triggerExecution();
              }}
              title={isEn ? "Press Enter to run" : "Appuyer sur Entrée pour exécuter"}
            >
              <span>{isEn ? "Press Enter" : "Appuyer sur Entrée"}</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 10 4 15 9 20" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
            </button>
          )}
        </div>

        {/* Bannière ASCII officielle de install.sh */}
        {showBanner && (
          <div className="terminal-ascii-container">
            <svg
              viewBox="0 0 118 20"
              preserveAspectRatio="xMinYMid meet"
              className="terminal-ascii-svg"
              role="img"
              aria-label="Logo Bobine ASCII"
            >
              <path
                fill="currentColor"
                d="M3,0h20v1h-20z M1,1h26v1h-26z M1,2h2v1h-2z M7,2h2v1h-2z M18,2h2v1h-2z M23,2h5v1h-5z M1,3h2v1h-2z M7,3h2v1h-2z M18,3h2v1h-2z M23,3h6v1h-6z M1,4h2v1h-2z M4,4h23v1h-23z M28,4h2v1h-2z M1,5h29v1h-29z M53,5h6v1h-6z M73,5h6v1h-6z M2,6h10v1h-10z M20,6h7v1h-7z M28,6h2v1h-2z M53,6h6v1h-6z M73,6h6v1h-6z M3,7h22v1h-22z M28,7h2v1h-2z M53,7h6v1h-6z M73,7h6v1h-6z M3,8h10v1h-10z M16,8h5v1h-5z M23,8h7v1h-7z M53,8h6v1h-6z M3,9h6v1h-6z M17,9h13v1h-13z M36,9h13v1h-13z M53,9h16v1h-16z M73,9h6v1h-6z M81,9h16v1h-16z M103,9h12v1h-12z M2,10h5v1h-5z M17,10h2v1h-2z M20,10h2v1h-2z M26,10h5v1h-5z M35,10h15v1h-15z M53,10h17v1h-17z M73,10h6v1h-6z M81,10h17v1h-17z M102,10h15v1h-15z M1,11h5v1h-5z M27,11h4v1h-4z M34,11h7v1h-7z M45,11h6v1h-6z M53,11h8v1h-8z M64,11h8v1h-8z M73,11h6v1h-6z M81,11h8v1h-8z M92,11h7v1h-7z M101,11h6v1h-6z M112,11h6v1h-6z M0,12h6v1h-6z M13,12h2v1h-2z M23,12h3v1h-3z M28,12h4v1h-4z M33,12h6v1h-6z M46,12h6v1h-6z M53,12h6v1h-6z M66,12h6v1h-6z M73,12h6v1h-6z M81,12h7v1h-7z M93,12h6v1h-6z M100,12h18v1h-18z M0,13h6v1h-6z M14,13h2v1h-2z M18,13h2v1h-2z M28,13h4v1h-4z M33,13h6v1h-6z M46,13h6v1h-6z M53,13h6v1h-6z M66,13h6v1h-6z M73,13h6v1h-6z M81,13h6v1h-6z M93,13h6v1h-6z M100,13h18v1h-18z M0,14h11v1h-11z M15,14h3v1h-3z M20,14h12v1h-12z M33,14h7v1h-7z M45,14h7v1h-7z M53,14h7v1h-7z M66,14h6v1h-6z M73,14h6v1h-6z M81,14h6v1h-6z M93,14h6v1h-6z M100,14h6v1h-6z M1,15h3v1h-3z M5,15h21v1h-21z M27,15h5v1h-5z M34,15h17v1h-17z M53,15h18v1h-18z M73,15h6v1h-6z M81,15h6v1h-6z M93,15h6v1h-6z M101,15h15v1h-15z M0,16h5v1h-5z M6,16h1v1h-1z M8,16h9v1h-9z M18,16h3v1h-3z M22,16h9v1h-9z M35,16h15v1h-15z M53,16h17v1h-17z M73,16h6v1h-6z M81,16h6v1h-6z M93,16h6v1h-6z M102,16h15v1h-15z M1,17h4v1h-4z M7,17h8v1h-8z M16,17h3v1h-3z M20,17h1v1h-1z M24,17h7v1h-7z M38,17h10v1h-10z M53,17h15v1h-15z M73,17h6v1h-6z M81,17h6v1h-6z M93,17h6v1h-6z M105,17h10v1h-10z M2,18h27v1h-27z M5,19h21v1h-21z"
              />
            </svg>
            <div className="terminal-ascii-caption">
              <span className="terminal-ascii-tag">
                {isEn ? "Open-Source Gym Video Playout System" : "Régie Vidéo & Streaming Libre pour Salle de Sport"}
              </span>
              <span className="terminal-ascii-meta">
                Debian 13 (trixie) · Dell Wyse 5070 · FastAPI + Next.js (v3.0.5)
              </span>
            </div>
          </div>
        )}

        {/* Invite interactive reproduisant select_update_channel de install.sh */}
        {showBanner && (
          <div className="terminal-channel-prompt">
            <div className="terminal-channel-prompt__header">
              <span className="terminal-channel-prompt__label">
                {isEn ? "Release channel:" : "Canal de mise à jour :"}
              </span>
            </div>

            <div className="terminal-channel-prompt__choices">
              <button
                type="button"
                className={`terminal-channel-prompt__btn ${channel === "stable" ? "is-selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectChannelPrompt("stable");
                }}
                disabled={channelPromptAnswered}
              >
                <span className="terminal-prompt-num">1)</span>
                <span className="terminal-prompt-name">
                  {isEn ? "Stable (default, recommended)" : "Stable (par défaut, recommandé)"}
                </span>
              </button>

              <button
                type="button"
                className={`terminal-channel-prompt__btn ${channel === "beta" ? "is-selected" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectChannelPrompt("beta");
                }}
                disabled={channelPromptAnswered}
              >
                <span className="terminal-prompt-num">2)</span>
                <span className="terminal-prompt-name">
                  {isEn
                    ? "Beta — early access to features in development"
                    : "Bêta — accès anticipé aux fonctionnalités en cours de test"}
                </span>
              </button>
            </div>

            <div className="terminal-channel-prompt__query">
              <span className="terminal-prompt-qtext">
                {isEn
                  ? `Your choice [1/2] (${channel === "beta" ? "2" : "1"}) : `
                  : `Votre choix [1/2] (${channel === "beta" ? "2" : "1"}) : `}
              </span>
              <span className="terminal-prompt-qval">
                {channelPromptAnswered ? (channel === "beta" ? "2" : "1") : ""}
              </span>
              {!channelPromptAnswered && (
                <span className="terminal-cursor" aria-hidden="true" />
              )}
            </div>

            {channelPromptAnswered && (
              <div className="terminal-channel-prompt__confirmation">
                <span className="terminal-channel-prompt__badge">
                  {channel === "beta" ? "Bêta" : "Stable"}
                </span>
                <span className="terminal-channel-prompt__detail">
                  {isEn
                    ? `Update channel set to '${channel}' (/etc/bobine/update-channel)`
                    : `Canal configuré sur '${channel}' (/etc/bobine/update-channel)`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Défilement des 18 étapes de install.sh */}
        {showBanner && channelPromptAnswered && (
          <div className="terminal-steps-list">
            {STEPS.map((step, idx) => {
              const isDone = idx < completedSteps;
              const isCurrent = idx === currentRunningStep;

              if (!isDone && !isCurrent) return null;

              return (
                <div
                  key={step.id}
                  className={`terminal-line terminal-line--output terminal-step-row ${
                    isDone ? "step-done" : "step-running"
                  }`}
                >
                  <span className="terminal-step-num">
                    [{step.num}/18]
                  </span>
                  {isDone ? (
                    <span className="terminal-ok">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  ) : (
                    <span className="terminal-spinner">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" className="terminal-spinner-icon" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </span>
                  )}
                  <span className="terminal-step-title">
                    {isEn ? step.labelEn : step.labelFr}
                  </span>
                  <span className="terminal-step-detail">
                    — {isEn ? step.detailEn(channel) : step.detailFr(channel)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Bilan final récapitulatif fidèle à install.sh */}
        {isCompleted && (
          <div className="terminal-demo-summary-box">
            <div className="terminal-summary-header">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <strong>{isEn ? "Bobine — Installation completed successfully" : "Bobine — Installation terminée avec succès"}</strong>
            </div>

            <div className="terminal-summary-table">
              <div className="terminal-summary-row">
                <span className="summary-key">Canal</span>
                <span className="summary-val">
                  <code>{channel === "beta" ? "beta (rolling release)" : "stable (Vx.y.z)"}</code>
                  <span className="summary-alt">(/etc/bobine/update-channel)</span>
                </span>
              </div>
              <div className="terminal-summary-row">
                <span className="summary-key">Admin</span>
                <span className="summary-val">http://bobine.local <span className="summary-alt">(et http://&lt;IP&gt;:8000)</span></span>
              </div>
              <div className="terminal-summary-row">
                <span className="summary-key">Kiosk</span>
                <span className="summary-val">http://127.0.0.1:8000/kiosk <span className="summary-alt">(écran cinéma HDMI-0)</span></span>
              </div>
              <div className="terminal-summary-row">
                <span className="summary-key">Config</span>
                <span className="summary-val">/etc/bobine/config.toml</span>
              </div>
              <div className="terminal-summary-row">
                <span className="summary-key">Journal</span>
                <span className="summary-val">/var/log/bobine/install-2026-09-06.log</span>
              </div>
              <div className="terminal-summary-row">
                <span className="summary-key">Contrôle</span>
                <span className="summary-val"><code>bobine &#123;start|stop|restart|status|logs&#125;</code></span>
              </div>
              <div className="terminal-summary-row">
                <span className="summary-key">Diagnostic</span>
                <span className="summary-val"><code>sudo ./install.sh --check</code></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

