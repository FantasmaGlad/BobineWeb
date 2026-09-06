import type { Locale } from "@/lib/i18n";

export type FaqCategory = "license" | "compare" | "hardware" | "offline";

export interface FaqItem {
  q: string;
  a: string;
  category: FaqCategory;
}

export const FAQ_CATEGORY_LABELS: Record<Locale, Record<FaqCategory, string>> = {
  fr: {
    license: "Licence & Coûts",
    compare: "Comparatifs",
    hardware: "Matériel",
    offline: "Hors-ligne",
  },
  en: {
    license: "License & Cost",
    compare: "Comparisons",
    hardware: "Hardware",
    offline: "Offline",
  },
};

export const FAQ_ITEMS: Record<Locale, FaqItem[]> = {
  fr: [
    {
      category: "license",
      q: "Bobine est-il vraiment 100% gratuit et sans redevance ?",
      a: "Oui. Logiciel libre sous licence AGPL-3.0 : aucun abonnement, aucune redevance par écran, aucun compte obligatoire. Vous êtes l'unique propriétaire de votre matériel et de vos médias.",
    },
    {
      category: "compare",
      q: "En quoi Bobine diffère-t-il d'un outil d'affichage publicitaire / dynamique (Anthias, Screenly, Xibo, Yodeck) ?",
      a: "Les outils d'affichage dynamique généralistes font défiler des diaporamas ou des pages web en boucle, mais ils ne sont pas adaptés aux studios de fitness : pas d'allumage TV par HDMI-CEC synchronisé à la seconde, pas de borne tactile membre pour lancer un cours à la demande, pas de télécommande smartphone par QR code et pas de radio 24/7 avec fondu sonore. Bobine est spécialement pensé comme une régie de cours collectifs.",
    },
    {
      category: "compare",
      q: "En quoi Bobine remplace-t-il Les Mills Cinema, Wexer ou Spivi ?",
      a: "Même expérience haut de gamme en salle (cours planifiés, borne tactile membre à la demande, diffusion 1080p60/4K), mais sans abonnement exorbitant (0 € vs 150-400 €/mois) et sans catalogue imposé. Vous êtes propriétaire de vos appareils et tout tourne 100% hors-ligne sur SSD local.",
    },
    {
      category: "offline",
      q: "Ai-je besoin d'une connexion internet pour faire tourner Bobine au quotidien ?",
      a: "Non, pas au quotidien. Internet n'est requis qu'une seule fois lors de l'installation initiale pour télécharger les paquets Debian. Ensuite, la salle diffuse ses cours de manière 100% autonome.",
    },
    {
      category: "hardware",
      q: "Quel matériel informatique faut-il acheter ?",
      a: "Un mini PC x86-64 standard : Intel (Dell Wyse 5070 Celeron J4105 ~40-50 €, Lenovo ThinkCentre Tiny, Beelink N100) ou AMD (HP EliteDesk 705 G4/G5 Ryzen 3/5 Pro ~60-80 €, Lenovo M715q), 4 à 8 Go de RAM, et un écran HDMI standard.",
    },
    {
      category: "hardware",
      q: "Que se passe-t-il en cas de coupure de courant ou de plantage ?",
      a: "Un chien de garde systemd surveille en continu la santé des services et relance automatiquement les composants en cas d'anomalie. Les services redémarrent instantanément et de façon autonome dès le retour du courant électrique.",
    },
  ],
  en: [
    {
      category: "license",
      q: "Is Bobine truly 100% free with no recurring fees?",
      a: "Yes. Free and open-source software under the copyleft AGPL-3.0 license. Zero subscription fees, zero royalties per screen, and no user accounts. Your only investment is standard refurbished hardware.",
    },
    {
      category: "compare",
      q: "How does Bobine differ from general digital signage tools (Anthias, Screenly, Xibo, Yodeck)?",
      a: "General digital signage players loop slides and ad banners, but lack fitness-specific features: automated HDMI-CEC TV wake/standby synchronized to timetables, interactive touch member kiosk, QR-code smartphone remote, and 24/7 background audio with voice crossfade. Bobine is purpose-built for gym studio playout.",
    },
    {
      category: "compare",
      q: "How does Bobine replace proprietary systems like Les Mills Cinema, Wexer, or Spivi?",
      a: "Same premium studio workout experience — automated weekly timetables, on-demand member touchscreen kiosk, 1080p60/4K playout — without recurring monthly fees ($0 vs $150-$400/mo) or locked catalogs. You own your devices, and playback is 100% offline from local SSD.",
    },
    {
      category: "offline",
      q: "Do I need an active internet connection to run Bobine for daily operations?",
      a: "No, not for daily operations. Internet is only required once during the initial setup. Afterwards, your gym plays workout videos entirely offline from local storage.",
    },
    {
      category: "hardware",
      q: "What hardware do I need to equip my gym?",
      a: "A standard refurbished x86-64 mini PC: Intel (Dell Wyse 5070 Celeron J4105 ~40-50 EUR, Lenovo ThinkCentre Tiny, Beelink N100) or AMD (HP EliteDesk 705 G4/G5 Ryzen 3/5 Pro ~60-80 EUR, Lenovo M715q), 4-8GB RAM, and an HDMI TV display.",
    },
    {
      category: "hardware",
      q: "What happens if there is a power cut or system crash?",
      a: "A local systemd supervisor continuously monitors process health and restarts failing components automatically. All services boot autonomously upon power restoration after a blackout.",
    },
  ],
};

export interface TroubleshootRow {
  issue: string;
  cause: string;
  solution: string;
}

export const TROUBLESHOOTING_ROWS: Record<Locale, TroubleshootRow[]> = {
  fr: [
    {
      issue: "http://bobine.local inaccessible",
      cause: "La box / routeur bloque le protocole mDNS (Bonjour)",
      solution: "Utilisez l'IP locale (ex: http://192.168.1.50). Tapez 'hostname -I' sur le mini PC pour la connaître.",
    },
    {
      issue: "Écran noir sur la TV en HDMI",
      cause: "Le kiosque Chromium a rencontré une anomalie X11 au démarrage",
      solution: "Relancez avec 'sudo systemctl restart bobine-kiosk'. Vérifiez le câble HDMI.",
    },
    {
      issue: "Pas de son sur la TV ou la sono",
      cause: "Sortie audio HDMI muette ou mal routée",
      solution: "Ouvrez 'alsamixer' pour démuter l'HDMI, ou définissez la sortie avec 'pactl set-default-sink'.",
    },
    {
      issue: "Vidéo saccadée / CPU saturé (>30%)",
      cause: "Accélération matérielle VA-API inactive",
      solution: "Vérifiez avec 'vainfo'. Installez le pilote adapté : intel-media-va-driver-non-free (Intel) ou mesa-va-drivers (AMD Radeon).",
    },
    {
      issue: "Conflit de port 8000 / 8001",
      cause: "Un ancien processus orphelin occupe le port web",
      solution: "Tuez le processus bloquant avec 'sudo fuser -k 8000/tcp' puis relancez les services.",
    },
    {
      issue: "La TV ne s'allume pas en HDMI-CEC",
      cause: "Option CEC désactivée sur la TV ou droits utilisateur",
      solution: "Activez le CEC (Anynet+, Bravia Sync, Simplink) dans le menu TV. Ajoutez l'utilisateur : 'sudo usermod -aG video,dialout $USER'.",
    },
  ],
  en: [
    {
      issue: "http://bobine.local unreachable",
      cause: "Router / Wi-Fi blocks mDNS (Bonjour)",
      solution: "Use direct IP address (e.g. http://192.168.1.50). Run 'hostname -I' on the mini PC to find it.",
    },
    {
      issue: "Black screen on wired TV",
      cause: "Chromium kiosk encountered an X11 launch issue",
      solution: "Run 'sudo systemctl restart bobine-kiosk'. Check HDMI cable connection.",
    },
    {
      issue: "No sound through HDMI / Speakers",
      cause: "Audio sink misconfigured or muted",
      solution: "Run 'alsamixer' to unmute HDMI, or set default sink via 'pactl set-default-sink'.",
    },
    {
      issue: "Video stutter / high CPU load (>30%)",
      cause: "VA-API hardware acceleration disabled",
      solution: "Run 'vainfo'. Verify intel-media-va-driver-non-free (Intel) or mesa-va-drivers (AMD Radeon) is installed.",
    },
    {
      issue: "Port 8000 / 8001 Conflict",
      cause: "Stale process holding web server port",
      solution: "Kill lingering processes with 'sudo fuser -k 8000/tcp' and restart services.",
    },
    {
      issue: "TV does not power on via HDMI-CEC",
      cause: "CEC disabled in TV settings or missing user group permissions",
      solution: "Enable HDMI-CEC (Anynet+, Bravia Sync, Simplink) in TV menu. Add user: 'sudo usermod -aG video,dialout $USER'.",
    },
  ],
};
