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

        {/* ASCII Art Banner — Rendu vectoriel matriciel pixel-perfect garanti sans déformation mobile */}
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
