"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

interface BobineBrowserMockupProps {
  locale: Locale;
}

export default function BobineBrowserMockup({ locale }: BobineBrowserMockupProps) {
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<"dashboard" | "login" | "planning" | "library" | "kiosk" | "remote">("dashboard");
  const [copied, setCopied] = useState(false);

  const tabsConfig = [
    {
      id: "dashboard" as const,
      label: isEn ? "Dashboard" : "Tableau de bord",
      url: "http://bobine.local/admin",
      badge: isEn ? "Admin" : "Admin",
    },
    {
      id: "login" as const,
      label: isEn ? "Authentication" : "Connexion",
      url: "http://bobine.local/login",
      badge: isEn ? "Auth" : "Sécurité",
    },
    {
      id: "planning" as const,
      label: isEn ? "Timetable" : "Planning Grille",
      url: "http://bobine.local/admin/planning",
      badge: isEn ? "Schedule" : "Planning",
    },
    {
      id: "library" as const,
      label: isEn ? "Workouts" : "Médiathèque",
      url: "http://bobine.local/admin/library",
      badge: isEn ? "Media" : "Vidéos",
    },
    {
      id: "kiosk" as const,
      label: isEn ? "Member Cinema" : "Borne Membre",
      url: "http://bobine.local/kiosk",
      badge: isEn ? "Playout" : "Kiosque",
    },
    {
      id: "remote" as const,
      label: isEn ? "Coach Remote" : "Télécommande",
      url: "http://bobine.local/remote",
      badge: isEn ? "Mobile" : "Mobile",
    },
  ];

  const currentTab = tabsConfig.find((t) => t.id === activeTab) || tabsConfig[0];

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentTab.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="browser-mockup-wrap">
      {/* Outer Browser Window Frame */}
      <div className="browser-window">
        {/* Top Browser Bar: Controls, Tabs & Address Bar */}
        <div className="browser-topbar">
          <div className="browser-nav-left">
            <div className="terminal-dots">
              <span className="dot dot--red" />
              <span className="dot dot--yellow" />
              <span className="dot dot--green" />
            </div>

            <div className="browser-nav-arrows">
              <button type="button" className="browser-nav-btn" aria-label="Previous page">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button type="button" className="browser-nav-btn" aria-label="Next page">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button type="button" className="browser-nav-btn" aria-label="Reload page">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </div>
          </div>

          {/* URL Address Bar */}
          <div className="browser-address-bar" onClick={handleCopyUrl} role="button" tabIndex={0} title={isEn ? "Click to copy URL" : "Cliquer pour copier l'URL"}>
            <div className="browser-address-shield">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{isEn ? "Local Playout" : "Réseau Local"}</span>
            </div>
            <div className="browser-address-text">
              <span className="browser-protocol">http://</span>
              <span className="browser-host">bobine.local</span>
              <span className="browser-path">{currentTab.url.replace("http://bobine.local", "")}</span>
            </div>
            <div className="browser-address-copy">
              {copied ? (
                <span className="browser-copied-badge">{isEn ? "Copied" : "Copié"}</span>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Viewport App Tabs Switcher */}
        <div className="browser-tabs-bar">
          {tabsConfig.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`browser-tab-btn ${isActive ? "is-active" : ""}`}
              >
                <span className="browser-tab-badge">{tab.badge}</span>
                <span className="browser-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Viewport Body (Realistic Simulated Screens) */}
        <div className="browser-viewport-body">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="mock-app-screen mock-screen-dashboard">
              <div className="mock-dash-top">
                <div className="mock-dash-brand">
                  <div className="mock-logo-dot" />
                  <strong>BOBINE CONTROL</strong>
                  <span className="mock-status-pill is-online">● SYSTEM ONLINE (v2.0.1)</span>
                </div>
                <div className="mock-dash-metrics">
                  <div className="mock-metric">
                    <span className="mock-metric-lbl">CPU</span>
                    <span className="mock-metric-val">11%</span>
                  </div>
                  <div className="mock-metric">
                    <span className="mock-metric-lbl">RAM</span>
                    <span className="mock-metric-val">1.2 / 8 GB</span>
                  </div>
                  <div className="mock-metric">
                    <span className="mock-metric-lbl">SSD</span>
                    <span className="mock-metric-val">34 / 256 GB</span>
                  </div>
                  <div className="mock-metric">
                    <span className="mock-metric-lbl">TEMP</span>
                    <span className="mock-metric-val">38°C</span>
                  </div>
                </div>
              </div>

              <div className="mock-channels-grid">
                {/* Channel 1: Câblé */}
                <div className="mock-channel-card is-active">
                  <div className="mock-channel-head">
                    <div>
                      <span className="mock-chan-badge is-wired">CANAL 1 · CÂBLÉ HDMI</span>
                      <h4 className="mock-chan-title">Studio 1 — Salle Principale</h4>
                    </div>
                    <span className="mock-live-pulse">EN COURS</span>
                  </div>
                  <div className="mock-chan-preview">
                    <div className="mock-video-thumb">
                      <div className="mock-video-overlay">
                        <span className="mock-video-title">BODYPUMP #124 — Full Body Strength</span>
                        <span className="mock-video-time">34:12 / 55:00 · 1080p60 VA-API</span>
                      </div>
                    </div>
                    <div className="mock-chan-progress">
                      <div className="mock-chan-progress-fill" style={{ width: "62%" }} />
                    </div>
                  </div>
                  <div className="mock-chan-footer">
                    <span>{isEn ? "Next: Spinning Sprint (18:00)" : "Suivant : Spinning Sprint (18h00)"}</span>
                    <div className="mock-chan-actions">
                      <span className="mock-mini-btn">Pause</span>
                      <span className="mock-mini-btn">Volume 85%</span>
                    </div>
                  </div>
                </div>

                {/* Channel 2: Réseau */}
                <div className="mock-channel-card">
                  <div className="mock-channel-head">
                    <div>
                      <span className="mock-chan-badge is-net">CANAL 2 · RÉSEAU RTSP</span>
                      <h4 className="mock-chan-title">Studio 2 — Espace Cardio & Biking</h4>
                    </div>
                    <span className="mock-idle-badge">{isEn ? "STANDBY" : "EN ATTENTE"}</span>
                  </div>
                  <div className="mock-chan-preview is-standby">
                    <div className="mock-standby-screen">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{isEn ? "Scheduled start: 17:30 (YOGA FLOW)" : "Départ programmé : 17h30 (YOGA FLOW)"}</span>
                    </div>
                  </div>
                  <div className="mock-chan-footer">
                    <span>{isEn ? "Playout mode: Automated Timetable" : "Mode : Grille Automatisée"}</span>
                    <span className="mock-mini-btn is-primary">{isEn ? "Force Play" : "Forcer départ"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTH / LOGIN */}
          {activeTab === "login" && (
            <div className="mock-app-screen mock-screen-login">
              <div className="mock-login-box">
                <div className="mock-login-header">
                  <div className="mock-login-logo">BOBINE</div>
                  <p>{isEn ? "Local Playout Administration & Coach Portal" : "Administration Locale & Espace Coach"}</p>
                </div>
                <div className="mock-login-form">
                  <div className="mock-form-group">
                    <label>{isEn ? "Role / Access Level" : "Profil d'accès"}</label>
                    <div className="mock-select-box">
                      <span>{isEn ? "Gym Manager (Full Admin)" : "Gérant de Salle (Administrateur)"}</span>
                    </div>
                  </div>
                  <div className="mock-form-group">
                    <label>{isEn ? "PIN Code or Password" : "Code PIN ou Mot de passe"}</label>
                    <div className="mock-input-box">
                      <span>••••••••</span>
                    </div>
                  </div>
                  <button type="button" className="mock-submit-btn">
                    {isEn ? "Log In to Local System" : "Ouvrir la session locale"}
                  </button>
                  <div className="mock-login-footer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>{isEn ? "100% Offline Authentication — No cloud dependencies" : "Authentification 100% Hors-Ligne — Zéro cloud"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLANNING */}
          {activeTab === "planning" && (
            <div className="mock-app-screen mock-screen-planning">
              <div className="mock-planning-header">
                <div>
                  <strong>{isEn ? "Weekly Timetable Engine" : "Grille Hebdomadaire Automatisée"}</strong>
                  <span className="mock-subtext">{isEn ? "Auto-play triggers without human intervention" : "Déclenchements automatiques sans intervention humaine"}</span>
                </div>
                <div className="mock-planning-actions">
                  <span className="mock-mini-btn is-primary">{isEn ? "+ New Slot" : "+ Nouveau créneau"}</span>
                </div>
              </div>

              <div className="mock-planning-table">
                <div className="mock-grid-row mock-grid-header">
                  <span className="mock-col-time">{isEn ? "Time" : "Heure"}</span>
                  <span>{isEn ? "Mon" : "Lun"}</span>
                  <span>{isEn ? "Tue" : "Mar"}</span>
                  <span>{isEn ? "Wed" : "Mer"}</span>
                  <span>{isEn ? "Thu" : "Jeu"}</span>
                  <span>{isEn ? "Fri" : "Ven"}</span>
                </div>
                <div className="mock-grid-row">
                  <span className="mock-col-time">09:00</span>
                  <span className="mock-slot-pill is-blue">Pilates 45m</span>
                  <span className="mock-slot-pill is-purple">Yoga Stretch</span>
                  <span className="mock-slot-pill is-blue">Pilates 45m</span>
                  <span className="mock-slot-pill is-purple">Yoga Stretch</span>
                  <span className="mock-slot-pill is-green">Body Balance</span>
                </div>
                <div className="mock-grid-row">
                  <span className="mock-col-time">12:30</span>
                  <span className="mock-slot-pill is-red">HIIT Cardio 30m</span>
                  <span className="mock-slot-pill is-orange">BodyPump 45m</span>
                  <span className="mock-slot-pill is-red">HIIT Cardio 30m</span>
                  <span className="mock-slot-pill is-orange">BodyPump 45m</span>
                  <span className="mock-slot-pill is-red">Core Express</span>
                </div>
                <div className="mock-grid-row">
                  <span className="mock-col-time">18:00</span>
                  <span className="mock-slot-pill is-yellow">Spinning Sprint</span>
                  <span className="mock-slot-pill is-orange">BodyPump 55m</span>
                  <span className="mock-slot-pill is-yellow">RPM Biking</span>
                  <span className="mock-slot-pill is-orange">BodyPump 55m</span>
                  <span className="mock-slot-pill is-yellow">Spinning Party</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIBRARY */}
          {activeTab === "library" && (
            <div className="mock-app-screen mock-screen-library">
              <div className="mock-lib-toolbar">
                <div className="mock-lib-search">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>{isEn ? "Search 142 videos..." : "Rechercher parmi 142 cours..."}</span>
                </div>
                <div className="mock-lib-actions">
                  <span className="mock-mini-btn is-primary">{isEn ? "Upload Video (Drag & Drop)" : "Glisser-déposer des vidéos"}</span>
                </div>
              </div>

              <div className="mock-lib-cards-grid">
                <div className="mock-media-card">
                  <div className="mock-media-thumb is-c1">
                    <span className="mock-res-tag">1080p60</span>
                    <span className="mock-dur-tag">55:00</span>
                  </div>
                  <div className="mock-media-info">
                    <strong>BODYPUMP #124 — Full Body</strong>
                    <span>Renforcement · MP4 · 4.2 GB</span>
                  </div>
                </div>

                <div className="mock-media-card">
                  <div className="mock-media-thumb is-c2">
                    <span className="mock-res-tag">1080p60</span>
                    <span className="mock-dur-tag">45:00</span>
                  </div>
                  <div className="mock-media-info">
                    <strong>SPINNING PRO #42 — High Hills</strong>
                    <span>Biking · MP4 · 3.1 GB</span>
                  </div>
                </div>

                <div className="mock-media-card">
                  <div className="mock-media-thumb is-c3">
                    <span className="mock-res-tag">4K UHD</span>
                    <span className="mock-dur-tag">30:00</span>
                  </div>
                  <div className="mock-media-info">
                    <strong>YOGA FLOW #18 — Sun Salutation</strong>
                    <span>Zen & Mobilité · MKV · 5.6 GB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KIOSK CINEMA */}
          {activeTab === "kiosk" && (
            <div className="mock-app-screen mock-screen-kiosk">
              <div className="mock-kiosk-cinema">
                <div className="mock-kiosk-top">
                  <h2>{isEn ? "CHOOSE YOUR WORKOUT SESSION" : "CHOISISSEZ VOTRE SÉANCE DE SPORT"}</h2>
                  <p>{isEn ? "Touch any class to launch immediately on screen" : "Touchez un cours pour lancer la diffusion sur l'écran de la salle"}</p>
                </div>

                <div className="mock-kiosk-grid">
                  <div className="mock-kiosk-cat is-cardio">
                    <div className="mock-kiosk-cat-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <h3>CARDIO & HIIT</h3>
                    <span>24 séances disponibles</span>
                  </div>

                  <div className="mock-kiosk-cat is-strength">
                    <div className="mock-kiosk-cat-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1s-1-.45-1-1v-2.34" />
                        <path d="M14 14.66V17c0 .55.45 1 1 1s1-.45 1-1v-2.34" />
                      </svg>
                    </div>
                    <h3>RENFORCEMENT & MUSCULATION</h3>
                    <span>38 séances disponibles</span>
                  </div>

                  <div className="mock-kiosk-cat is-zen">
                    <div className="mock-kiosk-cat-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <h3>YOGA & ÉTIREMENTS</h3>
                    <span>19 séances disponibles</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REMOTE */}
          {activeTab === "remote" && (
            <div className="mock-app-screen mock-screen-remote">
              <div className="mock-phone-wrap">
                <div className="mock-phone-notch" />
                <div className="mock-phone-content">
                  <div className="mock-remote-header">
                    <span className="mock-remote-badge">{isEn ? "COACH MOBILE REMOTE" : "TÉLÉCOMMANDE COACH"}</span>
                    <strong>Studio 1 · Playout</strong>
                  </div>

                  <div className="mock-remote-track">
                    <strong>BODYPUMP #124</strong>
                    <span>Track 04 · Squats & Quadriceps</span>
                  </div>

                  <div className="mock-remote-dial">
                    <div className="mock-dial-circle">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>

                  <div className="mock-remote-controls">
                    <span className="mock-ctl-btn">-15s</span>
                    <span className="mock-ctl-btn is-play">Pause</span>
                    <span className="mock-ctl-btn">+15s</span>
                  </div>

                  <div className="mock-remote-fader">
                    <span>Vol : 80%</span>
                    <div className="mock-fader-bar">
                      <div className="mock-fader-fill" style={{ width: "80%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
