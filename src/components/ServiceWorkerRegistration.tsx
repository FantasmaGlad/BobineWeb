"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

export default function ServiceWorkerRegistration({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [isOffline, setIsOffline] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // 1. Enregistrement du Service Worker en production
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker actif:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Échec enregistrement Service Worker:", err);
        });
    }

    // 2. Gestion des changements de connectivité réseau
    const handleOnline = () => {
      setIsOffline(false);
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowToast(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showToast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`offline-toast ${isOffline ? "offline-toast--offline" : "offline-toast--online"}`}
    >
      <div className="offline-toast__icon">
        {isOffline ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
        )}
      </div>
      <div className="offline-toast__content">
        <span className="offline-toast__title">
          {isOffline
            ? isEn
              ? "Offline Mode Active"
              : "Mode Hors-Ligne Actif"
            : isEn
            ? "Connection Restored"
            : "Connexion Rétablie"}
        </span>
        <span className="offline-toast__desc">
          {isOffline
            ? isEn
              ? "All documentation pages remain 100% accessible."
              : "La documentation reste 100% consultable."
            : isEn
            ? "You are back online."
            : "Vous êtes à nouveau en ligne."}
        </span>
      </div>
      <button
        type="button"
        className="offline-toast__close"
        onClick={() => setShowToast(false)}
        aria-label="Fermer"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
