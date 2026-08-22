import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";


import CodeBlock from "@/components/CodeBlock";
import { buildMetadata } from "@/lib/seo";
import ShareButton from "@/components/ShareButton";
import DownloadPdfButton from "@/components/DownloadPdfButton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEn = locale === "en";
  return buildMetadata({
    locale: locale as Locale,
    pathname: "/documentation/developpeurs",
    title: isEn
      ? "Developer Reference & REST API Documentation — Bobine"
      : "Documentation Développeurs & API REST — Bobine | Régie Vidéo Libre",
    description: isEn
      ? "Complete technical reference for software engineers: local REST API endpoints, WebSockets protocol, systemd architecture, and AGPL-3.0 development."
      : "Référence technique complète pour développeurs : endpoints de l'API REST locale, protocole WebSockets, architecture des services systemd et code source.",
    keywords: [
      "API REST Bobine",
      "Documentation développeurs Bobine",
      "WebSockets régie vidéo",
      "Architecture logicielle Bobine",
      "systemd Bobine",
      "Gym playout developer API",
    ],
  });
}

export default async function DeveloppeursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";

  const breadcrumbs = [
    { name: "Bobine", url: `/${locale}` },
    { name: "Documentation", url: `/${locale}/documentation` },
    { name: isEn ? "Developers" : "Développeurs", url: `/${locale}/documentation/developpeurs` },
  ];

  return isEn ? (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Architecture & API Reference</span>
          <h1 style={{ margin: 0 }}>Developer Documentation & Architecture</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="developpeurs" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/developpeurs"
            title="Bobine Developer Documentation & Architecture"
            description="Technical reference, REST API, WebSockets and architectural overview of Bobine."
          />
        </div>
      </div>

      <p>
        This documentation provides an in-depth reference for software engineers and integrators working with the Bobine platform: architecture, local REST API endpoints, real-time WebSocket protocol, background systemd supervisors, and AGPL-3.0 contribution guidelines.
      </p>

      <div className="docs-callout docs-callout--info">
        <div className="docs-callout__content">
          <div className="docs-callout__title">100% Local & Privacy-Preserving</div>
          <div>All APIs and WebSocket streams run exclusively on the local network (LAN / Wi-Fi) of the mini PC. No media, authentication keys, or analytics are ever transmitted to third-party cloud servers.</div>
        </div>
      </div>

      <h2 id="software-stack">Software Stack</h2>
      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Technology</th>
              <th>Role & Responsibility</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Backend API</strong></td>
              <td>Python 3.11+, FastAPI, Uvicorn</td>
              <td>High-throughput asynchronous REST API and WebSocket events</td>
            </tr>
            <tr>
              <td><strong>State Bus & Cache</strong></td>
              <td>Redis 7 (Pub/Sub & Distributed Locks)</td>
              <td>Inter-worker state synchronization, rate-limiting, and locking</td>
            </tr>
            <tr>
              <td><strong>Persistence</strong></td>
              <td>SQLite + SQLAlchemy 2.0</td>
              <td>Workout metadata, weekly schedules, playlists, and settings</td>
            </tr>
            <tr>
              <td><strong>Playout Engine</strong></td>
              <td>MPV + VA-API (Intel iHD & AMD mesa-va-drivers)</td>
              <td>Zero-copy hardware video decoding (1080p60 & 4K) via IPC Unix socket</td>
            </tr>
            <tr>
              <td><strong>Frontend UI</strong></td>
              <td>Next.js 16 (App Router), React 19, TS</td>
              <td>Universal responsive web app (Admin, Kiosk, Remote, Radio)</td>
            </tr>
            <tr>
              <td><strong>Hardware Control</strong></td>
              <td>libcec (HDMI-CEC) + ALSA</td>
              <td>Automated TV standby/wake and multi-channel audio routing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="local-development">Local Development Workflow</h2>
      <p>Prerequisites: Node.js ≥ 20, Python ≥ 3.11, active local Redis server.</p>

      <CodeBlock>
        <code>{`# 1. Backend (FastAPI + Redis) — running on port 8001
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
redis-server --daemonize yes
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# 2. Frontend (Next.js App Router) — running on port 3000
cd frontend
npm install
npm run dev`}</code>
      </CodeBlock>

      <h2 id="rest-api-reference">Local REST API Reference</h2>
      <p>
        The Bobine daemon exposes a clean, typed REST API on <code>http://bobine.local/api</code> (or <code>http://127.0.0.1:8000/api</code>):
      </p>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--get">GET</span>
          <span className="docs-api-endpoint">/api/health</span>
        </div>
        <p>Machine-readable health check endpoint queried continuously by the systemd watchdog.</p>
        <CodeBlock>
          <code>{`// Response (200 OK)
{
  "status": "healthy",
  "redis": "connected",
  "database": "ok",
  "kiosk_active": true,
  "uptime_seconds": 86420
}`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--get">GET</span>
          <span className="docs-api-endpoint">/api/status</span>
        </div>
        <p>Returns the real-time playback state, active workout, progress, and screen routing status.</p>
        <CodeBlock>
          <code>{`// Response (200 OK)
{
  "state": "playing",
  "current_workout": {
    "id": "w_982a7f",
    "title": "RPM Sprint 45",
    "category": "Spinning",
    "duration_seconds": 2700
  },
  "timecode": 1420.5,
  "volume": 80,
  "next_scheduled_class": {
    "title": "Yoga Vinyasa",
    "starts_in_seconds": 840
  }
}`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--post">POST</span>
          <span className="docs-api-endpoint">/api/playout/play</span>
        </div>
        <p>Starts immediate video playout for a specified workout ID.</p>
        <CodeBlock>
          <code>{`// Request body
{ "workout_id": "w_982a7f", "target_display": "hdmi_wired" }

// Response (200 OK)
{ "success": true, "message": "Playout started" }`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--post">POST</span>
          <span className="docs-api-endpoint">/api/playout/volume</span>
        </div>
        <p>Adjusts master hardware sound volume level (0 to 100).</p>
        <CodeBlock>
          <code>{`// Request body
{ "level": 85 }

// Response (200 OK)
{ "success": true, "current_volume": 85 }`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--post">POST</span>
          <span className="docs-api-endpoint">/api/cec/power-on</span>
        </div>
        <p>Sends an HDMI-CEC wakeup signal to the connected television screen.</p>
      </div>

      <h2 id="websocket-events">Real-Time WebSocket Protocol</h2>
      <p>
        Clients connect to <code>ws://bobine.local/ws/events</code> to receive instantaneous state changes across all devices:
      </p>

      <CodeBlock>
        <code>{`// Broadcast event on state change:
{
  "event": "PLAYBACK_STATE_CHANGED",
  "payload": {
    "state": "playing",
    "workout_id": "w_982a7f",
    "timecode": 45.2,
    "volume": 80
  }
}`}</code>
      </CodeBlock>

      <h2 id="systemd-services">Systemd Supervisor Architecture</h2>
      <p>Bobine is managed by 3 isolated systemd services for fault tolerance:</p>
      <ul>
        <li><code>bobine-backend.service</code> — Python FastAPI application, Redis connection, and SQLite daemon.</li>
        <li><code>bobine-kiosk.service</code> — Lightweight X11 session running Chromium in kiosk mode displaying the wired cinema screen.</li>
        <li><code>bobine-watchdog.service</code> — Proactive health supervisor polling <code>/api/health</code> every 10s and triggering automated component restarts if needed.</li>
      </ul>

      <h2 id="contributing-community">Community, Contact & Contribution</h2>
      <p>
        Bobine is licensed under the <strong>AGPL-3.0</strong> copyleft license. We welcome contributions, bug reports, and hardware compatibility tests.
      </p>

      <div className="docs-contact-box">
        <div><strong>GitHub Repository</strong> — <a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noreferrer">github.com/FantasmaGlad/Bobine</a></div>
        <div><strong>Discussions & Support</strong> — <a href="https://github.com/FantasmaGlad/Bobine/discussions" target="_blank" rel="noreferrer">GitHub Discussions</a></div>
        <div><strong>Security & Bug Reports</strong> — Open an issue or contact the maintainers via GitHub.</div>
      </div>
    </>
  ) : (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <span className="feature-category-label">Architecture & Référence API</span>
          <h1 style={{ margin: 0 }}>Documentation Développeurs & Architecture</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <DownloadPdfButton locale={locale as Locale} chapterId="developpeurs" />
          <ShareButton
            locale={locale as Locale}
            pathname="/documentation/developpeurs"
            title="Documentation Développeurs Bobine"
            description="Synthèse technique de l'architecture logicielle, des APIs REST et des WebSockets de Bobine."
          />
        </div>
      </div>

      <p>
        Cette documentation constitue la référence technique pour les développeurs et intégrateurs du système Bobine : architecture système, endpoints de l&apos;API REST locale, protocole d&apos;événements WebSockets temps réel, superviseurs systemd et guide de contribution AGPL-3.0.
      </p>

      <div className="docs-callout docs-callout--info">
        <div className="docs-callout__content">
          <div className="docs-callout__title">100% Local & Respect de la vie privée</div>
          <div>L&apos;ensemble des APIs et flux WebSockets s&apos;exécute exclusivement sur le réseau local (LAN / Wi-Fi) du mini PC. Aucun média, clé d&apos;authentification ou donnée télémétrique n&apos;est transmis à des serveurs tiers.</div>
        </div>
      </div>

      <h2 id="stack-technique">Stack Technique Détaillée</h2>
      <div className="docs-table-wrapper">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Couche</th>
              <th>Technologie</th>
              <th>Rôle & Responsabilité</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Backend API</strong></td>
              <td>Python 3.11+, FastAPI, Uvicorn</td>
              <td>API REST asynchrone ultra-rapide et gestion des connexions WebSockets</td>
            </tr>
            <tr>
              <td><strong>Bus d&apos;état & Cache</strong></td>
              <td>Redis 7 (Pub/Sub & Verrous distribués)</td>
              <td>Synchronisation multi-workers, limitation de débit et verrous anti-concurrence</td>
            </tr>
            <tr>
              <td><strong>Persistance</strong></td>
              <td>SQLite + SQLAlchemy 2.0</td>
              <td>Métadonnées des vidéos, planning hebdomadaire, playlists et paramètres</td>
            </tr>
            <tr>
              <td><strong>Moteur de Lecture</strong></td>
              <td>MPV + VA-API (Intel iHD & AMD mesa-va-drivers)</td>
              <td>Décodage matériel vidéo zero-copy (1080p60 et 4K) piloté via socket IPC Unix</td>
            </tr>
            <tr>
              <td><strong>Interface Frontend</strong></td>
              <td>Next.js 16 (App Router), React 19, TS</td>
              <td>Application web universelle et réactive (Admin, Kiosque, Télécommande, Radio)</td>
            </tr>
            <tr>
              <td><strong>Contrôle Matériel</strong></td>
              <td>libcec (HDMI-CEC) + ALSA</td>
              <td>Allumage/veille automatique du téléviseur et routage audio multi-canaux</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="developpement-local">Développement Local</h2>
      <p>Prérequis : Node.js ≥ 20, Python ≥ 3.11, serveur Redis actif en local.</p>

      <CodeBlock>
        <code>{`# 1. Backend (FastAPI + Redis) — port 8001
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
redis-server --daemonize yes
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# 2. Frontend (Next.js App Router) — port 3000
cd frontend
npm install
npm run dev`}</code>
      </CodeBlock>

      <h2 id="reference-api-rest">Référence de l&apos;API REST Locale</h2>
      <p>
        Le démon Bobine expose une API REST complète et typée sur <code>http://bobine.local/api</code> (ou <code>http://127.0.0.1:8000/api</code>) :
      </p>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--get">GET</span>
          <span className="docs-api-endpoint">/api/health</span>
        </div>
        <p>Point de contrôle de santé machine interrogé en continu par le chien de garde systemd.</p>
        <CodeBlock>
          <code>{`// Réponse JSON (200 OK)
{
  "status": "healthy",
  "redis": "connected",
  "database": "ok",
  "kiosk_active": true,
  "uptime_seconds": 86420
}`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--get">GET</span>
          <span className="docs-api-endpoint">/api/status</span>
        </div>
        <p>Retourne l&apos;état de diffusion en temps réel, le cours en cours, le timecode et le volume.</p>
        <CodeBlock>
          <code>{`// Réponse JSON (200 OK)
{
  "state": "playing",
  "current_workout": {
    "id": "w_982a7f",
    "title": "RPM Sprint 45",
    "category": "Spinning",
    "duration_seconds": 2700
  },
  "timecode": 1420.5,
  "volume": 80,
  "next_scheduled_class": {
    "title": "Yoga Vinyasa",
    "starts_in_seconds": 840
  }
}`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--post">POST</span>
          <span className="docs-api-endpoint">/api/playout/play</span>
        </div>
        <p>Déclenche la lecture immédiate d&apos;une vidéo par son identifiant unique.</p>
        <CodeBlock>
          <code>{`// Corps de requête
{ "workout_id": "w_982a7f", "target_display": "hdmi_wired" }

// Réponse JSON (200 OK)
{ "success": true, "message": "Lecture démarrée" }`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--post">POST</span>
          <span className="docs-api-endpoint">/api/playout/volume</span>
        </div>
        <p>Ajuste le volume sonore général de la salle (valeur de 0 à 100).</p>
        <CodeBlock>
          <code>{`// Corps de requête
{ "level": 85 }

// Réponse JSON (200 OK)
{ "success": true, "current_volume": 85 }`}</code>
        </CodeBlock>
      </div>

      <div className="docs-api-card">
        <div className="docs-api-header">
          <span className="docs-method-badge docs-method--post">POST</span>
          <span className="docs-api-endpoint">/api/cec/power-on</span>
        </div>
        <p>Transmet une commande HDMI-CEC d&apos;allumage direct au téléviseur raccordé.</p>
      </div>

      <h2 id="flux-websockets">Protocole d&apos;Événements WebSockets</h2>
      <p>
        Les interfaces clientes se connectent à <code>ws://bobine.local/ws/events</code> pour recevoir les mises à jour en direct :
      </p>

      <CodeBlock>
        <code>{`// Message JSON diffusé à tous les clients connectés :
{
  "event": "PLAYBACK_STATE_CHANGED",
  "payload": {
    "state": "playing",
    "workout_id": "w_982a7f",
    "timecode": 45.2,
    "volume": 80
  }
}`}</code>
      </CodeBlock>

      <h2 id="services-systemd">Architecture des Services Systemd</h2>
      <p>Bobine est orchestré par 3 unités systemd indépendantes :</p>
      <ul>
        <li><code>bobine-backend.service</code> — Application FastAPI Python, bus Redis et démon SQLite.</li>
        <li><code>bobine-kiosk.service</code> — Session graphique X11 allégée affichant Chromium en plein écran sur la TV.</li>
        <li><code>bobine-watchdog.service</code> — Superviseur de résilience interrogeant <code>/api/health</code> toutes les 10s avec relance automatique.</li>
      </ul>

      <h2 id="contact-communaute">Communauté, Contact & Contribution</h2>
      <p>
        Bobine est publié sous licence <strong>AGPL-3.0</strong>. Les contributions de code, rapports de bugs et retours d&apos;expérience matériel sont les bienvenus.
      </p>

      <div className="docs-contact-box">
        <div><strong>Dépôt GitHub</strong> — <a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noreferrer">github.com/FantasmaGlad/Bobine</a></div>
        <div><strong>Discussions & Support</strong> — <a href="https://github.com/FantasmaGlad/Bobine/discussions" target="_blank" rel="noreferrer">Discussions GitHub</a></div>
        <div><strong>Sécurité & Signalement</strong> — Ouvrez une issue ou contactez les mainteneurs sur GitHub.</div>
      </div>
    </>
  );
}
