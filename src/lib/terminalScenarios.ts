import type { TerminalScenario, TerminalLine } from "@/components/InteractiveTerminal";

// ============================================================================
// 1. SCENARIOS INSTALLATEUR (Démarrage Rapide & Page Doc)
// ============================================================================

export const installerScenarios: TerminalScenario[] = [
  {
    id: "standard",
    badge: {
      fr: "Recommandé",
      en: "Recommended",
      variant: "success",
    },
    tabLabel: {
      fr: "Installation Standard",
      en: "Standard Setup",
    },
    title: {
      fr: "Installation complète tout-en-un (Kiosk + Audio + API)",
      en: "Complete All-In-One Setup (Kiosk + Audio + API)",
    },
    description: {
      fr: "Télécharge, compile et configure l'ensemble des composants Bobine sur Debian 13 en une seule commande.",
      en: "Downloads, compiles, and configures all Bobine components on Debian 13 in a single automated command.",
    },
    baseCommand: "curl -fsSL https://bobine.fit/install.sh | bash",
    availableFlags: [
      {
        id: "lang-en",
        flag: "--lang=en",
        labelFr: "Langue Anglaise",
        labelEn: "English Language",
        descFr: "Force les messages d'installation en anglais",
        descEn: "Forces installer messages to English",
      },
      {
        id: "no-kiosk",
        flag: "--no-kiosk",
        labelFr: "Mode Serveur (sans kiosk)",
        labelEn: "Server Mode (no kiosk)",
        descFr: "Installe le backend seul, sans Chromium ni X11",
        descEn: "Installs backend only, without Chromium or X11",
      },
      {
        id: "verbose",
        flag: "-v",
        labelFr: "Mode Verbeux",
        labelEn: "Verbose Output",
        descFr: "Affiche le journal détaillé et le build en direct",
        descEn: "Shows full compilation and build logs in real time",
      },
      {
        id: "dry-run",
        flag: "--dry-run",
        labelFr: "Simulation (Dry-Run)",
        labelEn: "Dry-Run Simulation",
        descFr: "Affiche ce qui serait fait sans modifier le disque",
        descEn: "Displays scheduled actions without writing to disk",
      },
      {
        id: "skip-packages",
        flag: "--skip-packages",
        labelFr: "Sans paquets apt",
        labelEn: "Skip apt packages",
        descFr: "Mise à jour rapide après un git pull",
        descEn: "Fast update after a git pull without touching apt",
      },
    ],
    getOutput: (flags: string[], isEn: boolean): TerminalLine[] => {
      const isEnglish = flags.includes("--lang=en") || isEn;
      const isNoKiosk = flags.includes("--no-kiosk");
      const isVerbose = flags.includes("-v");
      const isDryRun = flags.includes("--dry-run");
      const isSkipPkg = flags.includes("--skip-packages");

      const lines: TerminalLine[] = [
        {
          type: "dim",
          text: isEnglish
            ? "Bobine Installer v5.1.0 · Debian 13 (trixie) · Dell Wyse 5070"
            : "Bobine Installateur v5.1.0 · Debian 13 (trixie) · Dell Wyse 5070",
        },
      ];

      if (isDryRun) {
        lines.push({
          type: "warn",
          text: isEnglish
            ? "[dry-run mode active] No filesystem changes will be committed"
            : "[mode simulation actif] Aucune modification ne sera écrite sur le disque",
        });
      }

      if (isSkipPkg) {
        lines.push({
          type: "info",
          text: isEnglish
            ? "Skipping apt dependencies (assuming packages already in place)"
            : "Ignorer les dépendances apt (paquets système déjà en place)",
        });
      } else if (isVerbose) {
        lines.push({
          type: "dim",
          text: "Hit:1 http://deb.debian.org/debian trixie InRelease",
        });
        lines.push({
          type: "dim",
          text: "Reading package lists... Done (Building dependency tree)",
        });
      }

      lines.push({
        type: "success",
        text: isEnglish
          ? "Hardware: Intel Celeron J4105 / VA-API QuickSync acceleration ready"
          : "Matériel : Intel Celeron J4105 / Accélération VA-API QuickSync active",
      });

      lines.push({
        type: "success",
        text: isEnglish
          ? "Storage: NVMe partition /var/lib/bobine mounted (112 GB free)"
          : "Stockage : Partition NVMe /var/lib/bobine montée (112 Go libres)",
      });

      if (!isNoKiosk) {
        lines.push({
          type: "success",
          text: isEnglish
            ? "Display: HDMI-1 connected (1080p60) · VA-API hardware decoding enabled"
            : "Affichage : Sortie HDMI-1 (1080p60) · Décodage matériel VA-API activé",
        });
        lines.push({
          type: "success",
          text: isEnglish
            ? "Audio: Stereo jack / USB Gym PA amplifier sink detected and unmuted"
            : "Audio : Sortie sono Jack 3.5mm / Amplificateur détectée et active",
        });
      } else {
        lines.push({
          type: "info",
          text: isEnglish
            ? "Server Mode: Chromium kiosk & X11 skipped (Backend API only)"
            : "Mode Serveur : Kiosk Chromium & X11 ignorés (Backend API seul)",
        });
      }

      lines.push({
        type: "success",
        text: isEnglish
          ? "Systemd: 4/4 services enabled and active (backend, kiosk, audio-guard, watchdog)"
          : "Services : 4/4 unités systemd activées et en cours d'exécution",
      });

      lines.push({
        type: "success",
        text: isEnglish
          ? "Healthcheck: API HTTP 200 OK (http://127.0.0.1:1903/api/health — 11ms)"
          : "Contrôle santé : API HTTP 200 OK (http://127.0.0.1:1903/api/health — 11ms)",
      });

      lines.push({
        type: "prompt",
        text: isEnglish
          ? "Bobine is ready! Open http://bobine.local:1903 on your phone to control."
          : "Bobine est prêt ! Ouvrez http://bobine.local:1903 depuis votre smartphone.",
      });

      return lines;
    },
  },
  {
    id: "check",
    badge: {
      fr: "Diagnostic",
      en: "Diagnostic",
      variant: "info",
    },
    tabLabel: {
      fr: "Diagnostic Système (--check)",
      en: "System Health (--check)",
    },
    title: {
      fr: "Diagnostic de santé et statut des 4 services Bobine",
      en: "Health diagnostic & status of the 4 Bobine services",
    },
    description: {
      fr: "Inspecte l'état des services systemd, les ports réseaux, les processus et l'accélération vidéo sans rien modifier.",
      en: "Inspects systemd service states, listening network ports, processes, and video acceleration without altering the system.",
    },
    baseCommand: "sudo ./install.sh --check",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "dim",
        text: isEn
          ? "Bobine Health Diagnostic Report"
          : "Rapport de Diagnostic & Contrôle de Santé Bobine",
      },
      {
        type: "success",
        text: isEn ? "bobine-backend.service     [ACTIVE / RUNNING] (pid 1420, mem: 48MB)" : "bobine-backend.service     [ACTIF / RUNNING] (pid 1420, mem: 48 Mo)",
      },
      {
        type: "success",
        text: isEn ? "bobine-kiosk.service       [ACTIVE / RUNNING] (Chromium x11 on :0)" : "bobine-kiosk.service       [ACTIF / RUNNING] (Chromium x11 sur :0)",
      },
      {
        type: "success",
        text: isEn ? "bobine-audio-guard.service [ACTIVE / RUNNING] (PipeWire / ALSA)" : "bobine-audio-guard.service [ACTIF / RUNNING] (PipeWire / ALSA)",
      },
      {
        type: "success",
        text: isEn ? "bobine-watchdog.service    [ACTIVE / RUNNING] (supervisor ping 5s)" : "bobine-watchdog.service    [ACTIF / RUNNING] (chien de garde ping 5s)",
      },
      {
        type: "info",
        text: isEn ? "Network: 0.0.0.0:1903 (API/Web) LISTEN" : "Réseau : 0.0.0.0:1903 (API/Web) ÉCOUTE",
      },
      {
        type: "success",
        text: isEn ? "GPU: Intel iHD driver VA-API QuickSync decoding H.264/HEVC OK" : "GPU : Pilote Intel iHD VA-API QuickSync décodage H.264/HEVC OK",
      },
      {
        type: "prompt",
        text: isEn ? "All systems healthy. Uptime: 4 days, 18 hours." : "Tous les systèmes sont sains. Uptime : 4 jours, 18 heures.",
      },
    ],
  },
  {
    id: "as-user",
    badge: {
      fr: "Root Direct",
      en: "Direct Root",
      variant: "warning",
    },
    tabLabel: {
      fr: "Machine sans sudo (--as-user)",
      en: "No-sudo Root (--as-user)",
    },
    title: {
      fr: "Installation en root direct avec compte cible dédié",
      en: "Direct root setup targeting a specific user account",
    },
    description: {
      fr: "Permet d'installer sur une Debian minimale sans le paquet sudo, en attribuant automatiquement les droits kiosk et GPU à l'utilisateur spécifié.",
      en: "Enables automated installation on minimal Debian systems without sudo, assigning kiosk permissions and GPU groups to the specified user.",
    },
    baseCommand: "su - -c \"$PWD/install.sh --as-user admin -y\"",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "dim",
        text: isEn
          ? "Direct root session detected (no sudo dependency)"
          : "Session root direct détectée (sans dépendance sudo)",
      },
      {
        type: "info",
        text: isEn
          ? "Target user specified: admin (UID 1000, GID 1000)"
          : "Compte utilisateur cible : admin (UID 1000, GID 1000)",
      },
      {
        type: "success",
        text: isEn
          ? "Added user admin to groups: video, render, audio, dialout, input"
          : "Utilisateur admin ajouté aux groupes : video, render, audio, dialout, input",
      },
      {
        type: "success",
        text: isEn
          ? "Configured /home/admin/.xsession for automated Chromium kiosk boot"
          : "Fichier /home/admin/.xsession configuré pour le lancement automatique du kiosk",
      },
      {
        type: "success",
        text: isEn
          ? "Systemd user environment created and verified successfully"
          : "Environnement utilisateur systemd créé et validé avec succès",
      },
    ],
  },
];

// ============================================================================
// 2. SCENARIOS DE DÉPANNAGE & ERREURS COURANTES (FAQ / Dépannage)
// ============================================================================

export const troubleshootingScenarios: TerminalScenario[] = [
  {
    id: "port-conflict",
    badge: {
      fr: "Diagnostic",
      en: "Diagnostic",
      variant: "warning",
    },
    tabLabel: {
      fr: "Port 1903 occupé",
      en: "Port 1903 busy",
    },
    title: {
      fr: "Port 1903 déjà utilisé : Bobine prend un port de repli",
      en: "Port 1903 already in use: Bobine falls back to another port",
    },
    description: {
      fr: "Quand un autre service tient déjà le port 1903, Bobine démarre sur un port voisin (1904 à 1913) et le signale. La commande bobine diagnose indique le port réel et le remède.",
      en: "When another service already holds port 1903, Bobine starts on a neighbouring port (1904 to 1913) and says so. The bobine diagnose command shows the real port and the remedy.",
    },
    baseCommand: "bobine diagnose",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "info",
        text: isEn ? "State: warning" : "État : warning",
      },
      {
        type: "warn",
        text: isEn ? "  warning port_fallback: Bobine listens on port 1904: port 1903 was not available at startup." : "  warning port_fallback : Bobine écoute sur le port 1904 : le port 1903 n'était pas disponible au démarrage.",
      },
      {
        type: "dim",
        text: isEn ? "    remedy: Free port 1903 or choose another (BOBINE_PORT), then restart Bobine; the current addresses are in Settings → Documentation." : "    remède : Libérer le port 1903 ou en choisir un autre (BOBINE_PORT), puis redémarrer Bobine ; les adresses à jour sont dans Réglages → Documentation.",
      },
      {
        type: "info",
        text: isEn ? "Who holds the port? sudo ss -ltnp 'sport = :1903'" : "Qui tient le port ? sudo ss -ltnp 'sport = :1903'",
      },
    ],
  },
  {
    id: "gpu-acceleration",
    badge: {
      fr: "Diagnostic GPU",
      en: "GPU Diagnostic",
      variant: "info",
    },
    tabLabel: {
      fr: "Accélération GPU (vainfo)",
      en: "GPU VA-API (vainfo)",
    },
    title: {
      fr: "Vérifier le décodage matériel QuickSync / VA-API (Intel/AMD)",
      en: "Verify hardware acceleration decoding via VA-API (Intel/AMD)",
    },
    description: {
      fr: "Garantit que les vidéos 1080p60 et 4K sont décodées directement par la puce graphique sans surcharger le processeur (< 8% CPU).",
      en: "Ensures that 1080p60 and 4K workout videos are decoded directly by the GPU with low CPU usage (< 8%).",
    },
    baseCommand: "vainfo",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "dim",
        text: "libva info: VA-API version: 1.20 (libva 2.20.0)",
      },
      {
        type: "dim",
        text: "libva info: Trying to open /usr/lib/x86_64-linux-gnu/dri/iHD_drv_video.so",
      },
      {
        type: "success",
        text: isEn ? "Driver: Intel iHD driver for Intel(R) Gen Graphics (J4105)" : "Pilote : Intel iHD pour processeurs graphiques Intel(R) Gen (J4105)",
      },
      {
        type: "stdout",
        text: "  VAProfileH264ConstrainedBaseline: VAEntrypoint_VLD",
      },
      {
        type: "stdout",
        text: "  VAProfileH264Main               : VAEntrypoint_VLD (Hardware 1080p60)",
      },
      {
        type: "stdout",
        text: "  VAProfileH264High               : VAEntrypoint_VLD (Hardware 1080p60)",
      },
      {
        type: "stdout",
        text: "  VAProfileHEVCMain               : VAEntrypoint_VLD (Hardware 4K 60fps)",
      },
      {
        type: "prompt",
        text: isEn ? "Hardware acceleration active: zero CPU bottleneck detected." : "Accélération matérielle active : zéro goulot d'étranglement CPU.",
      },
    ],
  },
  {
    id: "backup-export",
    badge: {
      fr: "Sauvegarde",
      en: "Backup",
      variant: "success",
    },
    tabLabel: {
      fr: "Exporter la configuration",
      en: "Export the configuration",
    },
    title: {
      fr: "Sauvegarder toute la configuration en fichiers JSON lisibles",
      en: "Back up the whole configuration as readable JSON files",
    },
    description: {
      fr: "Réglages, playlists, planning, sorties audio : un fichier par famille, rangé en dossiers, que l'on peut lire, comparer et réappliquer. Les médias eux-mêmes ne sont pas inclus.",
      en: "Settings, playlists, schedule, audio outputs: one file per family, in folders, that you can read, compare and re-apply. The media files themselves are not included.",
    },
    baseCommand: "bobine config export ./sauvegarde",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "success",
        text: isEn ? "19 file(s) written to ./sauvegarde" : "19 fichier(s) écrit(s) dans ./sauvegarde",
      },
      {
        type: "dim",
        text: isEn ? "To re-apply: bobine config apply ./sauvegarde (dry run), then --yes to write." : "Pour réappliquer : bobine config apply ./sauvegarde (essai à blanc), puis --yes pour écrire.",
      },
    ],
  },
  {
    id: "kiosk-logs",
    badge: {
      fr: "Journal X11",
      en: "X11 Logs",
      variant: "warning",
    },
    tabLabel: {
      fr: "Logs Kiosk Chromium",
      en: "Chromium Kiosk Logs",
    },
    title: {
      fr: "Consulter les logs en direct de la borne Chromium plein écran",
      en: "Inspect real-time logs for the full-screen Chromium kiosk",
    },
    description: {
      fr: "Permet de vérifier que l'interface membre s'affiche sans erreur de rendu WebGL et sans crash Xorg.",
      en: "Validates that the member-facing kiosk renders smoothly without WebGL errors or Xorg display crashes.",
    },
    baseCommand: "sudo journalctl -u bobine-kiosk -n 25 --no-pager",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "dim",
        text: "-- Journal begins at Thu 2026-08-28 08:00:00 CEST --",
      },
      {
        type: "info",
        text: "bobine-kiosk[1450]: Starting X11 server on display :0 (HDMI-1 1920x1080@60Hz)",
      },
      {
        type: "info",
        text: "bobine-kiosk[1450]: Launching Chromium Kiosk with flags --kiosk --noerrdialogs --autoplay-policy=no-user-gesture-required",
      },
      {
        type: "success",
        text: "bobine-kiosk[1450]: Navigated to http://127.0.0.1:1903/kiosk (DOM ready in 320ms)",
      },
      {
        type: "success",
        text: isEn ? "bobine-kiosk[1450]: Audio output route mapped to stereo sound system" : "bobine-kiosk[1450]: Route audio assignée à l'amplificateur sono de la salle",
      },
    ],
  },
];

// ============================================================================
// 3. SCENARIOS POUR DÉVELOPPEURS (Développeurs & API)
// ============================================================================

export const developerScenarios: TerminalScenario[] = [
  {
    id: "dev-server",
    badge: {
      fr: "Développement",
      en: "Development",
      variant: "info",
    },
    tabLabel: {
      fr: "Serveur de développement",
      en: "Development server",
    },
    title: {
      fr: "Lancer le backend FastAPI en local",
      en: "Run the FastAPI backend locally",
    },
    description: {
      fr: "Lance le backend sur le port par défaut 1903 ; la documentation interactive de l'API est servie sur /docs.",
      en: "Runs the backend on the default port 1903; the interactive API documentation is served at /docs.",
    },
    baseCommand: "cd backend && .venv/bin/python run_backend.py",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "info",
        text: "INFO:     Uvicorn running on http://0.0.0.0:1903 (Press CTRL+C to quit)",
      },
      {
        type: "success",
        text: isEn ? "Bobine listens on port 1903." : "Bobine écoute sur le port 1903.",
      },
      {
        type: "dim",
        text: isEn ? "Interactive API documentation: http://127.0.0.1:1903/docs" : "Documentation interactive de l'API : http://127.0.0.1:1903/docs",
      },
    ],
  },
  {
    id: "api-health",
    badge: {
      fr: "API REST",
      en: "REST API",
      variant: "success",
    },
    tabLabel: {
      fr: "Requête GET /api/health",
      en: "GET /api/health Query",
    },
    title: {
      fr: "Interroger l'état de santé de Bobine",
      en: "Query Bobine's health",
    },
    description: {
      fr: "Retourne l'état du serveur, de la base de données et du kiosque ; la commande bobine status ajoute l'état de lecture des deux canaux.",
      en: "Returns the state of the server, the database and the kiosk; the bobine status command adds the playback state of both channels.",
    },
    baseCommand: "curl -s http://127.0.0.1:1903/api/health | jq .",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify({ status: "ok", components: { database: "ok", kiosk: "ok" } }, null, 2),
      },
      {
        type: "dim",
        text: isEn ? "Same data: bobine status → Bobine on http://127.0.0.1:1903 : ok" : "Mêmes données : bobine status → Bobine sur http://127.0.0.1:1903 : ok",
      },
    ],
  },
  {
    id: "api-play",
    badge: {
      fr: "Lecture REST",
      en: "Playout REST",
      variant: "default",
    },
    tabLabel: {
      fr: "Lancer un cours (POST /api/playback)",
      en: "Start a class (POST /api/playback)",
    },
    title: {
      fr: "Déclencher une vidéo de cours par appel HTTP",
      en: "Trigger a class video via HTTP POST",
    },
    description: {
      fr: "Les mêmes routes que l'interface et que la commande bobine : POST /api/playback/{canal}/{action}, canal cable ou network. Le premier paramètre de load est l'identifiant de la vidéo.",
      en: "The same routes as the interface and the bobine command: POST /api/playback/{channel}/{action}, channel cable or network. The load parameter is the video identifier.",
    },
    baseCommand: "curl -X POST http://127.0.0.1:1903/api/playback/cable/load -H 'Content-Type: application/json' -d '{\"video_id\": 12}'",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify({ state: { state: "playing", current_video: { id: 12, title: "Cours 12" }, volume: 100 } }, null, 2),
      },
      {
        type: "dim",
        text: isEn ? "Same action: bobine playback cable load video_id=12 → cable : playing" : "Même action : bobine playback cable load video_id=12 → cable : playing",
      },
    ],
  },
  {
    id: "pytest",
    badge: {
      fr: "Tests & CI",
      en: "Tests & CI",
      variant: "success",
    },
    tabLabel: {
      fr: "Tests unitaires (pytest)",
      en: "Unit tests (pytest)",
    },
    title: {
      fr: "Exécuter la suite de tests du backend",
      en: "Run the backend test suite",
    },
    description: {
      fr: "Vérifie la diffusion, le planning, la configuration, la sécurité réseau et les imports, avec une base SQLite d'essai isolée.",
      en: "Checks playout, scheduling, configuration, network security and imports, against an isolated SQLite test database.",
    },
    baseCommand: "cd backend && .venv/bin/python -m pytest -q",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "dim",
        text: "........................................................................ [100%]",
      },
      {
        type: "prompt",
        text: isEn ? "1393 passed, 8 skipped in 69s" : "1393 réussis, 8 ignorés en 69 s",
      },
    ],
  },
];

// ============================================================================
// 4. SCENARIOS UTILISATION & EXPLOITATION (Utilisation)
// ============================================================================

export const usageScenarios: TerminalScenario[] = [
  {
    id: "radio-crossfade",
    badge: {
      fr: "Radio 24/7",
      en: "Radio 24/7",
      variant: "info",
    },
    tabLabel: {
      fr: "Piloter la radio",
      en: "Control the radio",
    },
    title: {
      fr: "Gérer la musique d'ambiance 24/7",
      en: "Manage 24/7 background music",
    },
    description: {
      fr: "Chaque sortie radio (cable ou network) se pilote par la même façade : lecture, pause, volume, titre suivant. Le fondu entre pistes se règle dans Réglages.",
      en: "Each radio output (cable or network) is driven by the same facade: play, pause, volume, next track. The crossfade between tracks is set in Settings.",
    },
    baseCommand: "bobine radio cable play",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "success",
        text: "cable : playing",
      },
      {
        type: "dim",
        text: isEn ? "REST equivalent: POST /api/radio/cable/play" : "Équivalent REST : POST /api/radio/cable/play",
      },
    ],
  },
  {
    id: "voice-announcement",
    badge: {
      fr: "Annonce vocale",
      en: "Voice reminder",
      variant: "warning",
    },
    tabLabel: {
      fr: "Rappel immédiat",
      en: "Immediate reminder",
    },
    title: {
      fr: "Diffuser un rappel avec atténuation de la musique",
      en: "Play a reminder with automatic music ducking",
    },
    description: {
      fr: "Joue un rappel de la bibliothèque tout de suite : la musique baisse puis remonte. Sans identifiant, un rappel actif est tiré au hasard.",
      en: "Plays a reminder from the library right away: the music ducks then comes back. Without an identifier, an active reminder is picked at random.",
    },
    baseCommand: "curl -X POST http://127.0.0.1:1903/api/radio/announcements/play-now -H 'Content-Type: application/json' -d '{}'",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify({ id: 3, description: "Fermeture de l'espace dans 10 minutes" }, null, 2),
      },
      {
        type: "dim",
        text: isEn ? "Same action: bobine radio network radio_play_announcement" : "Même action : bobine radio network radio_play_announcement",
      },
    ],
  },
  {
    id: "remote-qr",
    badge: {
      fr: "Télécommande",
      en: "Remote URL",
      variant: "success",
    },
    tabLabel: {
      fr: "Adresses d'accès",
      en: "Access addresses",
    },
    title: {
      fr: "Retrouver les adresses d'accès à Bobine",
      en: "Find Bobine's access addresses",
    },
    description: {
      fr: "Réglages donne chaque adresse par interface (Wi-Fi, Ethernet, VPN) et le nom bobine.local ; sans mot de passe, sur le réseau local seulement.",
      en: "Settings lists each address per interface (Wi-Fi, Ethernet, VPN) and the bobine.local name; no password, local network only.",
    },
    baseCommand: "bobine settings get network",
    getOutput: (): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify(
          {
            port: 1903,
            mdns_url: "http://bobine.local:1903",
            access: [
              { kind: "loopback", url: "http://127.0.0.1:1903" },
              { kind: "lan", interface: "wlan0", url: "http://192.168.1.50:1903" },
              { kind: "mdns", url: "http://bobine.local:1903" },
            ],
          },
          null,
          2
        ),
      },
    ],
  },
];
