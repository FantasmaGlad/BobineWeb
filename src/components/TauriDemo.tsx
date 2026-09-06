"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Locale } from "@/lib/i18n";
import TauriIcon from "@/components/icons/TauriIcon";

interface TauriDemoProps {
  locale: Locale;
}

export default function TauriDemo({ locale }: TauriDemoProps) {
  const isEn = locale === "en";

  // États de la simulation
  // 0: Scan réseau, 1: Audit matériel, 2: Déploiement en cours, 3: Terminé
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const restartDemo = useCallback(() => {
    clearTimer();
    setStep(0);
    setProgress(0);
    setIsPlaying(true);
    setHasStarted(true);
  }, []);

  const skipToEnd = useCallback(() => {
    clearTimer();
    setStep(3);
    setProgress(100);
    setIsPlaying(false);
    setHasStarted(true);
  }, []);

  // Détection d'entrée dans le viewport
  useEffect(() => {
    if (hasStarted) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      restartDemo();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !hasStarted) {
          restartDemo();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted, restartDemo]);

  // Orchestration séquentielle de la simulation
  useEffect(() => {
    if (!isPlaying) return;

    if (step === 0) {
      timerRef.current = setTimeout(() => {
        setStep(1);
      }, 1200);
    } else if (step === 1) {
      timerRef.current = setTimeout(() => {
        setStep(2);
        setProgress(20);
      }, 1600);
    } else if (step === 2) {
      if (progress < 100) {
        timerRef.current = setTimeout(() => {
          setProgress((prev) => Math.min(prev + 25, 100));
        }, 550);
      } else {
        timerRef.current = setTimeout(() => {
          setStep(3);
          setIsPlaying(false);
        }, 450);
      }
    }

    return clearTimer;
  }, [step, progress, isPlaying]);

  return (
    <div
      ref={containerRef}
      className="tauri-demo-container"
      role="region"
      aria-label={isEn ? "Bobine Assistant Tauri demo" : "Démonstration Bobine Assistant Tauri"}
    >
      <div className="tauri-demo-window">
        {/* En-tête de fenêtre façon macOS / desktop */}
        <div className="tauri-demo-header">
          <div className="tauri-demo-dots" aria-hidden="true">
            <span className="tauri-demo-dot" />
            <span className="tauri-demo-dot" />
            <span className="tauri-demo-dot" />
          </div>

          <div className="tauri-demo-title">
            <TauriIcon size={14} className="tauri-demo-title-icon" />
            <span>Bobine Assistant — {isEn ? "Remote Deployment & Network Control" : "Déploiement Distant & Supervision Réseau"}</span>
          </div>

          <div className="tauri-demo-controls">
            <button
              type="button"
              className="terminal-ctrl-btn"
              onClick={restartDemo}
              title={isEn ? "Restart simulation" : "Rejouer la simulation"}
              aria-label={isEn ? "Restart simulation" : "Rejouer la simulation"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
              </svg>
              <span>{isEn ? "Replay" : "Rejouer"}</span>
            </button>

            {step < 3 && (
              <button
                type="button"
                className="terminal-ctrl-btn"
                onClick={skipToEnd}
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
          </div>
        </div>

        {/* Corps applicatif */}
        <div className="tauri-demo-body">
          {/* Panneau 1 : Découverte Réseau */}
          <div className="tauri-demo-card">
            <div className="tauri-demo-card-header">
              <span className="tauri-demo-section-label">
                {isEn ? "1. Local Network Discovery (mDNS & /24 Subnet Sweep)" : "1. Découverte Réseau Local (mDNS & Balayage /24)"}
              </span>
              <span className={`tauri-demo-status-badge ${step >= 1 ? "is-found" : "is-scanning"}`}>
                {step === 0
                  ? (isEn ? "Scanning network..." : "Balayage réseau...")
                  : (isEn ? "Host discovered" : "Appareil localisé")}
              </span>
            </div>

            <div className="tauri-demo-device-row">
              <div className="tauri-demo-device-info">
                <span className="tauri-demo-device-name">Dell Wyse 5070 — bobine.local</span>
                <span className="tauri-demo-device-ip">IP : 192.168.1.50 · Port : 8000 · SSH : 22</span>
              </div>
              <span className="tauri-demo-signal-badge">
                {isEn ? "Ethernet 1 Gbit/s · Latency 0.8ms" : "Ethernet 1 Gbit/s · Latence 0.8ms"}
              </span>
            </div>
          </div>

          {/* Panneau 2 : Audit Matériel SSH */}
          {step >= 1 && (
            <div className="tauri-demo-card">
              <div className="tauri-demo-card-header">
                <span className="tauri-demo-section-label">
                  {isEn ? "2. Automated SSH Hardware Audit" : "2. Audit Matériel Automatisé par SSH"}
                </span>
                <span className="tauri-demo-status-badge is-found">
                  {isEn ? "Compatible appliance" : "Appliance certifiée"}
                </span>
              </div>

              <div className="tauri-demo-audit-grid">
                <div className="tauri-demo-audit-item">
                  <span className="tauri-demo-audit-key">CPU</span>
                  <span className="tauri-demo-audit-val">Intel Celeron J4105 (4 cœurs @ 1.50GHz)</span>
                </div>
                <div className="tauri-demo-audit-item">
                  <span className="tauri-demo-audit-key">GPU / VA-API</span>
                  <span className="tauri-demo-audit-val">Intel UHD Graphics 600 (QuickSync actif)</span>
                </div>
                <div className="tauri-demo-audit-item">
                  <span className="tauri-demo-audit-key">RAM</span>
                  <span className="tauri-demo-audit-val">4.0 Go DDR4 (3.8 Go allouables)</span>
                </div>
                <div className="tauri-demo-audit-item">
                  <span className="tauri-demo-audit-key">{isEn ? "Storage" : "Stockage"}</span>
                  <span className="tauri-demo-audit-val">256 Go NVMe (/var/lib/bobine)</span>
                </div>
              </div>
            </div>
          )}

          {/* Panneau 3 : Déploiement distant */}
          {step >= 2 && (
            <div className="tauri-demo-card tauri-demo-card--deploy">
              <div className="tauri-demo-card-header">
                <span className="tauri-demo-section-label">
                  {isEn ? "3. Remote Deployment Pipeline (v3.0.0)" : "3. Déploiement Distant Automatisé (v3.0.0)"}
                </span>
                <span className="tauri-demo-progress-percent">{progress}%</span>
              </div>

              <div className="tauri-demo-progress-track">
                <div className="tauri-demo-progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <div className="tauri-demo-log-list">
                <div className="tauri-demo-log-line is-done">
                  <span className="tauri-demo-log-ok">[OK]</span>
                  <span>{isEn ? "System packages & Python virtualenv prepared" : "Paquets système & virtualenv Python configurés"}</span>
                </div>
                {progress >= 45 && (
                  <div className="tauri-demo-log-line is-done">
                    <span className="tauri-demo-log-ok">[OK]</span>
                    <span>{isEn ? "SQLite local engine & config.toml initialized (no Redis)" : "Base SQLite locale & config.toml initialisés (sans Redis)"}</span>
                  </div>
                )}
                {progress >= 70 && (
                  <div className="tauri-demo-log-line is-done">
                    <span className="tauri-demo-log-ok">[OK]</span>
                    <span>{isEn ? "Chromium X11 Kiosk & Screen Wake Lock API configured" : "Kiosque Chromium X11 & anti-veille Screen Wake Lock configurés"}</span>
                  </div>
                )}
                {progress >= 100 && (
                  <div className="tauri-demo-log-line is-done">
                    <span className="tauri-demo-log-ok">[OK]</span>
                    <span>{isEn ? "4/4 Systemd units active & API healthcheck HTTP 200" : "4/4 Services systemd actifs & contrôle de santé validé HTTP 200"}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Panneau 4 : Bilan final et actions */}
          {step === 3 && (
            <div className="tauri-demo-success">
              <div className="tauri-demo-success-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="tauri-demo-check-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <strong>{isEn ? "Bobine Appliance v3.0.0 — Successfully Deployed" : "Bobine Appliance v3.0.0 — Déploiement terminé avec succès"}</strong>
              </div>

              <div className="tauri-demo-actions-row">
                <a
                  href="https://github.com/FantasmaGlad/Bobine/releases/download/V3.0.0/bobine-assistant"
                  className="tauri-demo-btn-assistant"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TauriIcon size={14} />
                  <span>{isEn ? "Download Bobine Assistant binary" : "Télécharger Bobine Assistant"}</span>
                </a>

                <a
                  href={`/${locale}/documentation`}
                  className="tauri-demo-btn-docs"
                >
                  <span>{isEn ? "Explore Technical Guide" : "Consulter la documentation technique"}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
