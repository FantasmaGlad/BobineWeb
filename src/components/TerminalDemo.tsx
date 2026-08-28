"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Locale } from "@/lib/i18n";

const ASCII_ART = `   ████████████████████                                                                                                 
 ██████████████████████████                                                                                             
 ██    ██         ██   █████                                                                                            
 ██    ██         ██   ██████                                                                                           
 ██ ███████████████████████ ██                                                                                          
 █████████████████████████████                       ██████              ██████                                         
  ██████████        ███████ ██                       ██████              ██████                                         
   ██████████████████████   ██                       ██████              ██████                                         
   ██████████   █████  ███████                       ██████                                                             
   ██████        █████████████      █████████████    ████████████████    ██████  ████████████████      ████████████     
  █████          ██ ██    █████    ███████████████   █████████████████   ██████  █████████████████    ███████████████   
 █████                     ████   ███████    ██████  ████████   ████████ ██████  ████████   ███████  ██████     ██████  
██████       ██        ███  ████ ██████       ██████ ██████       ██████ ██████  ███████     ██████ ██████████████████  
██████        ██  ██        ████ ██████       ██████ ██████       ██████ ██████  ██████      ██████ ██████████████████  
███████████    ███  ████████████ ███████     ███████ ███████      ██████ ██████  ██████      ██████ ██████              
 ███ █████████████████████ █████  █████████████████  ██████████████████  ██████  ██████      ██████  ███████████████    
█████ █ █████████ ███ █████████    ███████████████   █████████████████   ██████  ██████      ██████   ███████████████   
 ████  ████████ ███ █   ███████       ██████████     ███████████████     ██████  ██████      ██████      ██████████     
  ███████████████████████████                                                                                           
     █████████████████████`;

interface StepItem {
  id: string;
  labelFr: string;
  labelEn: string;
  detailFr: string;
  detailEn: string;
  durationMs: number;
}

const STEPS: StepItem[] = [
  {
    id: "hw",
    labelFr: "Détection matérielle & GPU",
    labelEn: "Hardware & GPU discovery",
    detailFr: "Intel Celeron J4105 (VA-API QuickSync actif)",
    detailEn: "Intel Celeron J4105 (VA-API QuickSync active)",
    durationMs: 380,
  },
  {
    id: "storage",
    labelFr: "Stockage NVMe & partitions",
    labelEn: "NVMe storage & data partitions",
    detailFr: "Disque 256 Go monté (/var/lib/bobine)",
    detailEn: "256 GB drive mounted (/var/lib/bobine)",
    durationMs: 340,
  },
  {
    id: "video",
    labelFr: "Sortie vidéo & CEC",
    labelEn: "Video output & HDMI-CEC",
    detailFr: "Écran Samsung 65\" sur bus HDMI-0 (1080p60 + CEC auto)",
    detailEn: "Samsung 65\" screen on HDMI-0 (1080p60 + auto CEC)",
    durationMs: 380,
  },
  {
    id: "audio",
    labelFr: "Moteur Audio sono",
    labelEn: "Sound system audio engine",
    detailFr: "Interface analogique calibrée (Jack 3.5mm vers sono)",
    detailEn: "Calibrated analog interface (3.5mm jack to gym PA)",
    durationMs: 320,
  },
  {
    id: "systemd",
    labelFr: "Services Systemd",
    labelEn: "Systemd daemon units",
    detailFr: "5/5 unités actives (backend, kiosk, audio-guard, watchdog)",
    detailEn: "5/5 units active (backend, kiosk, audio-guard, watchdog)",
    durationMs: 400,
  },
  {
    id: "health",
    labelFr: "Vérification de santé API",
    labelEn: "API Healthcheck verification",
    detailFr: "HTTP 200 OK (http://127.0.0.1:8000/api/health — 12ms)",
    detailEn: "HTTP 200 OK (http://127.0.0.1:8000/api/health — 12ms)",
    durationMs: 300,
  },
];

const COMMAND_TEXT = "curl -fsSL https://bobine.fit/install.sh | bash";

export default function TerminalDemo({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [copied, setCopied] = useState(false);

  const [typedChars, setTypedChars] = useState(0);
  const [showBanner, setShowBanner] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [currentRunningStep, setCurrentRunningStep] = useState<number>(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearActiveTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startAnimation = useCallback(() => {
    clearActiveTimer();
    setTypedChars(0);
    setShowBanner(false);
    setCompletedSteps(0);
    setCurrentRunningStep(-1);
    setIsCompleted(false);
    setIsPlaying(true);
  }, []);

  const skipToEnd = useCallback(() => {
    clearActiveTimer();
    setTypedChars(COMMAND_TEXT.length);
    setShowBanner(true);
    setCompletedSteps(STEPS.length);
    setCurrentRunningStep(-1);
    setIsCompleted(true);
    setIsPlaying(false);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!isPlaying) return;

    if (typedChars < COMMAND_TEXT.length) {
      timerRef.current = setTimeout(() => {
        setTypedChars((prev) => prev + 1);
      }, 24);
      return () => clearActiveTimer();
    }

    if (typedChars === COMMAND_TEXT.length && !showBanner) {
      timerRef.current = setTimeout(() => {
        setShowBanner(true);
        setCurrentRunningStep(0);
      }, 250);
      return () => clearActiveTimer();
    }
  }, [typedChars, isPlaying, showBanner]);

  // Step progression effect
  useEffect(() => {
    if (!isPlaying || !showBanner || isCompleted) return;

    if (currentRunningStep >= 0 && currentRunningStep < STEPS.length) {
      const step = STEPS[currentRunningStep];
      timerRef.current = setTimeout(() => {
        setCompletedSteps((prev) => prev + 1);
        if (currentRunningStep + 1 < STEPS.length) {
          setCurrentRunningStep((prev) => prev + 1);
        } else {
          setCurrentRunningStep(-1);
          setIsCompleted(true);
        }
      }, step.durationMs);
      return () => clearActiveTimer();
    }
  }, [currentRunningStep, showBanner, isPlaying, isCompleted]);

  const handleCopy = () => {
    navigator.clipboard.writeText(COMMAND_TEXT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="terminal-wrapper terminal-demo-root">
      {/* Top Header Bar */}
      <div className="terminal-header">
        <div className="terminal-dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>

        <div className="terminal-demo-title-group">
          <span className="terminal-title">
            bash — bobine-installer v2.0
          </span>
          <span className="terminal-demo-status-pill">
            <span className={`terminal-demo-status-dot ${isCompleted ? "is-complete" : "is-running"}`} />
            {isCompleted
              ? isEn ? "Installed (200 OK)" : "Opérationnel (200 OK)"
              : isEn ? "Deploying..." : "Déploiement en cours..."}
          </span>
        </div>

        <div className="terminal-demo-actions">
          {/* Replay Button */}
          <button
            type="button"
            className="terminal-ctrl-btn"
            onClick={startAnimation}
            title={isEn ? "Replay animation" : "Rejouer l\x27animation"}
            aria-label={isEn ? "Replay animation" : "Rejouer l\x27animation"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
            </svg>
            <span>{isEn ? "Replay" : "Rejouer"}</span>
          </button>

          {/* Quick skip / Instant view */}
          {!isCompleted && (
            <button
              type="button"
              className="terminal-ctrl-btn"
              onClick={skipToEnd}
              title={isEn ? "Skip animation" : "Passer l\x27animation"}
              aria-label={isEn ? "Skip animation" : "Passer l\x27animation"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
              <span>{isEn ? "Fast View" : "Vue directe"}</span>
            </button>
          )}

          {/* Copy Command Button */}
          <button
            type="button"
            className="terminal-copy-btn"
            onClick={handleCopy}
            aria-label={isEn ? "Copy install command" : "Copier la commande"}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{isEn ? "Copied!" : "Copié !"}</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>{isEn ? "Copy" : "Copier"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div className="terminal-body terminal-demo-body">
        {/* Command Line Input */}
        <div className="terminal-line terminal-line--command">
          <span className="terminal-prompt">$</span>
          <code className="terminal-demo-command-text">
            {COMMAND_TEXT.slice(0, typedChars)}
            {typedChars < COMMAND_TEXT.length && (
              <span className="terminal-cursor" aria-hidden="true">▋</span>
            )}
          </code>
        </div>

        {/* ASCII Art Banner */}
        {showBanner && (
          <div className="terminal-ascii-container">
            <pre className="terminal-ascii-art" aria-label="Logo Bobine ASCII">
              {ASCII_ART}
            </pre>
            <div className="terminal-ascii-caption">
              <span className="terminal-ascii-tag">
                {isEn ? "Open-Source Gym Video Playout System" : "Régie Vidéo & Streaming Libre pour Salle de Sport"}
              </span>
              <span className="terminal-ascii-meta">
                Debian 13 · Dell Wyse 5070 · FastAPI + Next.js
              </span>
            </div>
          </div>
        )}

        {/* Installation Steps Progression */}
        {showBanner && (
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
                  {isDone ? (
                    <span className="terminal-ok">[OK]</span>
                  ) : (
                    <span className="terminal-spinner">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" className="terminal-spinner-icon">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </span>
                  )}
                  <span className="terminal-step-title">
                    {isEn ? step.labelEn : step.labelFr} :
                  </span>
                  <span className="terminal-step-detail">
                    {isEn ? step.detailEn : step.detailFr}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Final Installation Summary Box */}
        {isCompleted && (
          <div className="terminal-demo-success-box">
            <div className="terminal-demo-box-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="terminal-box-check">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <strong>{isEn ? "Bobine Playout Engine — Ready & Operational" : "Serveur Bobine opérationnel — Prêt pour diffusion"}</strong>
            </div>

            <div className="terminal-demo-box-grid">
              <div className="terminal-demo-box-item">
                <span className="terminal-box-label">{isEn ? "Screen Playout (HDMI-0)" : "Diffusion Écran (HDMI-0)"} :</span>
                <code className="terminal-box-url">http://127.0.0.1:8000/kiosk</code>
              </div>
              <div className="terminal-demo-box-item">
                <span className="terminal-box-label">{isEn ? "Web Remote & Studio Admin" : "Télécommande & Admin"} :</span>
                <code className="terminal-box-url">http://bobine.local</code>
              </div>
              <div className="terminal-demo-box-item">
                <span className="terminal-box-label">{isEn ? "CLI Control Command" : "Contrôle Terminal"} :</span>
                <code className="terminal-box-cmd">bobine status</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
