import type { Locale } from "@/lib/i18n";

export const USAGE_SECTIONS: ReadonlyArray<{ id: string; title: Record<Locale, string> }> = [
  { id: "admin-dashboard", title: { fr: "Panneau d'administration", en: "Admin Dashboard" } },
  { id: "workout-library", title: { fr: "Bibliothèque & Formats Vidéo Recommandés", en: "Workout Library & Video Formats" } },
  { id: "settings-displays", title: { fr: "Paramètres & Routage d'écran", en: "Settings & Screen Routing" } },
  { id: "system-health-watchdog", title: { fr: "Santé et Supervision Automatique", en: "System Health & Watchdog Supervisor" } },
  { id: "weekly-scheduling", title: { fr: "Planification & Automatisation", en: "Weekly Scheduling & Automation" } },
  { id: "member-cinema-on-demand-kiosk", title: { fr: "Cinéma membre (borne à la demande)", en: "Member Cinema (On-Demand Kiosk)" } },
  { id: "network-secondary-display", title: { fr: "Écran réseau secondaire", en: "Network Secondary Display" } },
  { id: "coach-audio-mode", title: { fr: "Mode coach audio", en: "Coach Audio Mode" } },
  { id: "background-radio", title: { fr: "Radio 24/7 & Rappels Vocaux", en: "24/7 Background Music & Voice Alerts" } },
  { id: "mobile-phone-remote", title: { fr: "Télécommande mobile (QR Code)", en: "Mobile Phone Remote (QR Code)" } },
  { id: "wireless-hardware-remote", title: { fr: "Télécommandes physiques sans fil", en: "Wireless Hardware Remotes" } },
];

export function usageSectionTitle(id: string, locale: Locale): string {
  return USAGE_SECTIONS.find((section) => section.id === id)?.title[locale] ?? id;
}
