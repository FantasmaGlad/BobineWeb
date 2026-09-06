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
            ? "Bobine Installer v3.0.0 · Debian 13 (trixie) · Dell Wyse 5070"
            : "Bobine Installateur v3.0.0 · Debian 13 (trixie) · Dell Wyse 5070",
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
          ? "Healthcheck: API HTTP 200 OK (http://127.0.0.1:8000/api/health — 11ms)"
          : "Contrôle santé : API HTTP 200 OK (http://127.0.0.1:8000/api/health — 11ms)",
      });

      lines.push({
        type: "prompt",
        text: isEnglish
          ? "Bobine is ready! Open http://bobine.local:8000 on your phone to control."
          : "Bobine est prêt ! Ouvrez http://bobine.local:8000 depuis votre smartphone.",
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
      fr: "Diagnostic de santé et statut des 5 services Bobine",
      en: "Health diagnostic & status of all 5 Bobine services",
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
        text: isEn ? "Network: 0.0.0.0:8000 (API/Web) & 0.0.0.0:8001 (Stream) LISTEN" : "Réseau : 0.0.0.0:8000 (API/Web) & 0.0.0.0:8001 (Stream) ÉCOUTE",
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
    baseCommand: "su - -c \"$PWD/install.sh --as-user fanta -y\"",
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
          ? "Target user specified: fanta (UID 1000, GID 1000)"
          : "Compte utilisateur cible : fanta (UID 1000, GID 1000)",
      },
      {
        type: "success",
        text: isEn
          ? "Added user fanta to groups: video, render, audio, dialout, input"
          : "Utilisateur fanta ajouté aux groupes : video, render, audio, dialout, input",
      },
      {
        type: "success",
        text: isEn
          ? "Configured /home/fanta/.xsession for automated Chromium kiosk boot"
          : "Fichier /home/fanta/.xsession configuré pour le lancement automatique du kiosk",
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
      fr: "Erreur Courante",
      en: "Common Error",
      variant: "danger",
    },
    tabLabel: {
      fr: "Conflit Port 8000",
      en: "Port 8000 Conflict",
    },
    title: {
      fr: "Résolution : Port 8000 déjà occupé (Address already in use)",
      en: "Resolution: Port 8000 already occupied (Address already in use)",
    },
    description: {
      fr: "Se produit lorsqu'un ancien processus Uvicorn ou un autre serveur web retient le port HTTP. Cette commande libère le port et relance l'API proprement.",
      en: "Occurs when a stale Uvicorn instance or another web process holds the HTTP port. This command frees the port and restarts the API cleanly.",
    },
    baseCommand: "sudo fuser -k 8000/tcp && sudo systemctl restart bobine-backend",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "error",
        text: isEn ? "ERROR: [Errno 98] error while attempting to bind on address ('0.0.0.0', 8000): address already in use" : "ERREUR : [Errno 98] impossible de lier l'adresse ('0.0.0.0', 8000) : adresse déjà utilisée",
      },
      {
        type: "info",
        text: isEn ? "8000/tcp: killed lingering process PID 2841" : "8000/tcp : processus résiduel PID 2841 arrêté avec succès",
      },
      {
        type: "dim",
        text: isEn ? "Restarting bobine-backend.service via systemd..." : "Redémarrage de bobine-backend.service via systemd...",
      },
      {
        type: "success",
        text: isEn ? "bobine-backend.service restarted successfully" : "bobine-backend.service redémarré avec succès",
      },
      {
        type: "success",
        text: isEn ? "HTTP GET http://127.0.0.1:8000/api/health returned 200 OK (8ms)" : "HTTP GET http://127.0.0.1:8000/api/health a retourné 200 OK (8ms)",
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
      variant: "default",
    },
    tabLabel: {
      fr: "Test Sauvegarde ZIP",
      en: "ZIP Backup Test",
    },
    title: {
      fr: "Export et vérification d'intégrité d'une sauvegarde complète",
      en: "Export and integrity check of a full backup",
    },
    description: {
      fr: "Teste l'export ZIP complet (vidéothèque, planning, réglages) et vérifie l'intégrité de la base SQLite embarquée.",
      en: "Tests the full ZIP export (video library, schedule, settings) and checks the integrity of the embedded SQLite database.",
    },
    baseCommand: "bobine-cli backup export --verify",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "dim",
        text: "bobine-cli v3.0.0 — backup module",
      },
      {
        type: "info",
        text: isEn ? "Exporting video library, schedule, and settings..." : "Export de la vidéothèque, du planning et des réglages...",
      },
      {
        type: "success",
        text: "archive: bobine-backup-2026-09-06.zip (842 MB)",
      },
      {
        type: "stdout",
        text: "  videos        : 128 files",
      },
      {
        type: "stdout",
        text: "  schedule      : 24 recurring slots",
      },
      {
        type: "stdout",
        text: "  database      : bobine.db (SQLite)",
      },
      {
        type: "stdout",
        text: "  integrity     : PRAGMA integrity_check -> ok",
      },
      {
        type: "prompt",
        text: isEn ? "Backup archive verified and ready to restore on any machine." : "Archive de sauvegarde vérifiée et prête à être restaurée sur n'importe quelle machine.",
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
        text: "bobine-kiosk[1450]: Navigated to http://127.0.0.1:8000/kiosk (DOM ready in 320ms)",
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
      fr: "Local Dev",
      en: "Local Dev",
      variant: "info",
    },
    tabLabel: {
      fr: "Lancer en local (Uvicorn)",
      en: "Local Dev Server",
    },
    title: {
      fr: "Démarrage du serveur Backend avec rechargement à chaud (Hot Reload)",
      en: "Start Backend API Server with Hot Reloading",
    },
    description: {
      fr: "Lance FastAPI sur le port 8000 avec documentation Swagger interactive disponible sur http://localhost:8000/docs.",
      en: "Launches FastAPI on port 8000 with interactive Swagger docs accessible at http://localhost:8000/docs.",
    },
    baseCommand: "cd backend && .venv/bin/uvicorn app.main:app --reload --port 8000",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "info",
        text: "INFO:     Will watch for changes in ['/home/fanta/Bobine/backend']",
      },
      {
        type: "info",
        text: "INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)",
      },
      {
        type: "dim",
        text: "INFO:     Started reloader process [19450] using WatchFiles",
      },
      {
        type: "success",
        text: "INFO:     FastAPI app initialized: routes registered (/api/playback, /api/settings, /api/audio, /api/kiosk)",
      },
      {
        type: "prompt",
        text: isEn ? "Interactive OpenAPI documentation available at http://127.0.0.1:8000/docs" : "Documentation interactive OpenAPI disponible sur http://127.0.0.1:8000/docs",
      },
    ],
  },
  {
    id: "api-health",
    badge: {
      fr: "REST API",
      en: "REST API",
      variant: "success",
    },
    tabLabel: {
      fr: "Requête GET /api/health",
      en: "GET /api/health Query",
    },
    title: {
      fr: "Interrogation de l'état de santé de l'API REST",
      en: "Querying REST API system health and active channels",
    },
    description: {
      fr: "Retourne l'état instantané du serveur, des 2 canaux de diffusion (Câblé / Réseau) et du moteur audio.",
      en: "Returns real-time status for the playout engine, dual independent display channels, and audio mixer.",
    },
    baseCommand: "curl -s http://127.0.0.1:8000/api/health | jq .",
    getOutput: (): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify(
          {
            status: "ok",
            version: "3.0.0",
            uptime_seconds: 144200,
            hardware: {
              gpu: "Intel Celeron J4105 (iHD VA-API)",
              storage_free_gb: 112.4,
              cpu_load_pct: 4.2,
            },
            channels: {
              wired: {
                state: "playing",
                media_id: "rpm-masterclass-85",
                progress_sec: 1420,
                duration_sec: 3300,
              },
              network: {
                state: "idle",
                target_ip: "192.168.1.120",
              },
            },
            audio_guard: {
              active_sink: "alsa_output.pci-0000_00_1f.3.analog-stereo",
              ducking_active: false,
            },
          },
          null,
          2
        ),
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
      en: "Start Class (POST /api/playback)",
    },
    title: {
      fr: "Déclenchement d'une vidéo de cours collectif par appel HTTP",
      en: "Trigger a group fitness class video via HTTP POST",
    },
    description: {
      fr: "Permet d'intégrer Bobine avec vos systèmes tiers (bornes RFID, tourniquets, applications de réservation).",
      en: "Integrates Bobine with third-party gym software (RFID gates, booking systems, turnstiles).",
    },
    baseCommand: "curl -X POST http://127.0.0.1:8000/api/playback/play -H 'Content-Type: application/json' -d '{\"channel\":\"wired\",\"media_id\":\"bodypump-118\"}'",
    getOutput: (): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify(
          {
            success: true,
            channel: "wired",
            media: {
              id: "bodypump-118",
              title: "BodyPump 118 — Full Body Power",
              category: "Renforcement",
              duration: "55 min",
              resolution: "1920x1080@60fps",
            },
            cec_command_sent: "KEY_POWER_ON (TV display wake)",
            audio_ducking: "Radio background paused (crossfade 2s)",
            started_at: "2026-08-28T12:20:00Z",
          },
          null,
          2
        ),
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
      en: "Unit Tests (pytest)",
    },
    title: {
      fr: "Exécution de la suite de tests automatisés Backend",
      en: "Running the automated Backend test suite",
    },
    description: {
      fr: "Vérifie la résolution des conflits de planning, l'export de sauvegarde et l'intégrité de la base SQLite.",
      en: "Validates timetable conflict resolution, backup export, and SQLite database integrity.",
    },
    baseCommand: "cd backend && .venv/bin/pytest -v tests/",
    getOutput: (_flags: string[], isEn: boolean): TerminalLine[] => [
      {
        type: "dim",
        text: "rootdir: /home/fanta/Bobine/backend, configfile: pyproject.toml",
      },
      {
        type: "dim",
        text: "collected 24 items",
      },
      {
        type: "success",
        text: "tests/test_scheduler.py::test_conflict_resolution PASSED             [ 12%]",
      },
      {
        type: "success",
        text: "tests/test_scheduler.py::test_recurring_timetable_dispatch PASSED    [ 25%]",
      },
      {
        type: "success",
        text: "tests/test_cec.py::test_standby_and_wake_payloads PASSED            [ 50%]",
      },
      {
        type: "success",
        text: "tests/test_audio.py::test_crossfade_and_voice_ducking PASSED        [ 75%]",
      },
      {
        type: "success",
        text: "tests/test_kiosk.py::test_on_demand_trigger PASSED                   [100%]",
      },
      {
        type: "prompt",
        text: isEn ? "24 passed in 0.68s (100% test coverage for core playout logic)" : "24 validés en 0.68s (100% de couverture sur la logique de diffusion)",
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
      fr: "Piloter la Radio Sono",
      en: "Control Gym Radio",
    },
    title: {
      fr: "Gestion de la musique d'ambiance 24/7 avec fondu enchaîné",
      en: "24/7 background gym audio management with smart crossfade",
    },
    description: {
      fr: "Déclenche la lecture d'une playlist musicale d'ambiance avec fondu sonore paramétrable entre chaque piste.",
      en: "Triggers playback of a background music playlist with customizable audio crossfade between tracks.",
    },
    baseCommand: "curl -X POST http://127.0.0.1:8000/api/audio/play -H 'Content-Type: application/json' -d '{\"playlist_id\":\"energy-hits\",\"crossfade_sec\":4}'",
    getOutput: (): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify(
          {
            status: "playing",
            mode: "continuous_radio",
            active_playlist: "Energy Hits & Workout Beats",
            total_tracks: 84,
            crossfade_duration_seconds: 4,
            ducking_on_voice: true,
            hardware_sink: "analog-stereo",
          },
          null,
          2
        ),
      },
    ],
  },
  {
    id: "voice-announcement",
    badge: {
      fr: "Annonce Vocale",
      en: "Voice Reminder",
      variant: "warning",
    },
    tabLabel: {
      fr: "Annonce vocale automatique",
      en: "Auto Voice Reminder",
    },
    title: {
      fr: "Diffusion d'une annonce vocale avec atténuation automatique de la musique",
      en: "Broadcast a voice announcement with automatic background audio ducking",
    },
    description: {
      fr: "Baisse automatiquement le volume de la musique de fond à 20%, diffuse l'annonce de sécurité ou de fin de séance, puis remonte la musique en douceur.",
      en: "Automatically ducks background music down to 20%, broadcasts the gym reminder, and smoothly restores volume.",
    },
    baseCommand: "curl -X POST http://127.0.0.1:8000/api/audio/announcement -H 'Content-Type: application/json' -d '{\"audio_id\":\"closing-reminder-10m\"}'",
    getOutput: (): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify(
          {
            success: true,
            announcement: "Fermeture de l'espace dans 10 minutes (pensez à ranger vos haltères)",
            ducking_applied: "Music lowered to 20% (-14dB)",
            announcement_duration_sec: 7.2,
            restore_crossfade_sec: 1.5,
          },
          null,
          2
        ),
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
      fr: "Obtenir l'URL Télécommande",
      en: "Get Remote URL",
    },
    title: {
      fr: "Récupération du lien direct et QR code de télécommande coach",
      en: "Fetch coach smartphone remote control direct URL and QR code",
    },
    description: {
      fr: "Génère l'URL d'accès réseau local sans mot de passe pour piloter la diffusion depuis n'importe quel smartphone connecté au Wi-Fi de la salle.",
      en: "Generates the local network URL to control playback from any coach phone on the gym Wi-Fi without app installation.",
    },
    baseCommand: "curl -s http://127.0.0.1:8000/api/kiosk/remote-info | jq .",
    getOutput: (): TerminalLine[] => [
      {
        type: "json",
        text: JSON.stringify(
          {
            remote_url: "http://192.168.1.50:8000/remote",
            mdns_url: "http://bobine.local:8000/remote",
            active_channel: "wired",
            current_media: "Les Mills RPM 85 (Masterclass)",
            pin_required: false,
          },
          null,
          2
        ),
      },
    ],
  },
];
