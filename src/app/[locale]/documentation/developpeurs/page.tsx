import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";

import CodeBlock from "@/components/CodeBlock";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "en" ? "Developer Documentation" : "Documentation développeurs",
  };
}

export default async function DeveloppeursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEn = locale === "en";

  return isEn ? (
    <>
      <h1>Developer Documentation & Architecture</h1>
      <p>
        This page provides a technical overview of the Bobine software architecture, stack, and local development workflow. Complete documentation lives in the main repository:
      </p>

      <ul>
        <li><a href="https://github.com/FantasmaGlad/Bobine/blob/main/docs/ARCHITECTURE.md" target="_blank" rel="noreferrer"><strong>docs/ARCHITECTURE.md</strong></a> — multi-worker backend, SQLite data model, distributed Redis state bus, MPV hardware player, REST API, and WebSockets.</li>
        <li><a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noreferrer"><strong>GitHub Repository</strong></a> — source code, Issues, Discussions, and Releases.</li>
      </ul>

      <h2 id="software-stack">Software Stack</h2>
      <ul>
        <li><strong>Backend</strong> — Python 3.11+, FastAPI with <code>uvicorn</code> (4 workers), SQLAlchemy, SQLite, Redis (Pub/Sub state bus, distributed locks), APScheduler, <code>ffmpeg</code> &amp; Intel VA-API for hardware decoding.</li>
        <li><strong>Frontend</strong> — Next.js (App Router, static export served by backend in production), React 19, TypeScript, Vanilla CSS with 13 dynamic themes, and WebSockets.</li>
        <li><strong>Runtime &amp; Playout</strong> — Debian 13, Chromium kiosk mode (X11), <code>systemd</code> supervisors, <code>avahi-daemon</code> for mDNS discovery.</li>
        <li><strong>Installer</strong> — <code>install.sh</code> (Bash, idempotent automated deployment).</li>
      </ul>

      <h2 id="architecture-overview">Architecture Overview</h2>
      <p>
        A single on-premise mini PC runs the multi-worker backend (shared state via Redis, distributed locks preventing race conditions), the Chromium kiosk display for the wired screen, and serves the static Next.js interface (admin, cinema kiosk, mobile remote). All other devices (network secondary screen, remotes, staff laptops) are simple web browsers connecting over local Wi-Fi — zero media ever leaves your local network.
      </p>

      <h2 id="local-development">Local Development</h2>
      <p>Prerequisites: Node.js ≥ 20, Python ≥ 3.11, local active Redis server.</p>

      <CodeBlock>
        <code># Backend (FastAPI + Redis) — port 8001 in dev
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
redis-server &
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Frontend (Next.js)
cd frontend
npm install
npm run dev</code>
      </CodeBlock>

      <h2 id="contributing">Contributing</h2>
      <p>
        Issues and pull requests are warmly welcome on the official repository. Bobine is released under the <strong>AGPL-3.0</strong> copyleft license: any modified version operated as a network service must make its source code available under the same license terms.
      </p>
    </>
  ) : (
    <>
      <h1>Documentation développeurs & Architecture</h1>
      <p>
        Cette page présente une synthèse de l&apos;architecture technique, de la stack et du flux de développement local de Bobine. La référence complète vit dans le dépôt officiel :
      </p>

      <ul>
        <li><a href="https://github.com/FantasmaGlad/Bobine/blob/main/docs/ARCHITECTURE.md" target="_blank" rel="noreferrer"><strong>docs/ARCHITECTURE.md</strong></a> — stack, architecture multi-worker, modèle de données SQLite, bus d&apos;état Redis, lecteur matériel MPV, API REST et WebSockets.</li>
        <li><a href="https://github.com/FantasmaGlad/Bobine" target="_blank" rel="noreferrer"><strong>Dépôt GitHub</strong></a> — code source, Issues, Discussions et Releases.</li>
      </ul>

      <h2 id="stack-technique">Stack technique</h2>
      <ul>
        <li><strong>Backend</strong> — Python 3.11+, FastAPI avec <code>uvicorn</code> (4 workers), SQLAlchemy, SQLite, Redis (bus d&apos;état Pub/Sub, verrous distribués), APScheduler, <code>ffmpeg</code> et VA-API Intel pour le décodage matériel.</li>
        <li><strong>Frontend</strong> — Next.js (App Router, export statique servi par le backend en production), React 19, TypeScript, CSS vanilla avec 13 thèmes commutables à chaud, WebSockets.</li>
        <li><strong>Exploitation</strong> — Debian 13, Chromium en kiosque (X11), <code>systemd</code>, <code>avahi-daemon</code> pour la découverte mDNS.</li>
        <li><strong>Installation</strong> — <code>install.sh</code> (Bash, déploiement automatisé et idempotent).</li>
      </ul>

      <h2 id="architecture-en-bref">Architecture en bref</h2>
      <p>
        Un seul mini PC sur le réseau local fait tourner le backend multi-worker (état partagé via Redis, verrous distribués), le kiosque Chromium pour l&apos;écran câblé, et sert l&apos;interface Next.js (admin, cinéma membre, télécommande mobile). Les autres appareils (écran réseau, télécommandes, PC d&apos;admin) sont de simples navigateurs qui pointent vers le mini PC — aucun média ne quitte le réseau local.
      </p>

      <h2 id="developpement-local">Développement local</h2>
      <p>Prérequis : Node.js ≥ 20, Python ≥ 3.11, Redis local actif.</p>

      <CodeBlock>
        <code># Backend (FastAPI + Redis) — port 8001 en dev
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
redis-server &
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

# Frontend (Next.js)
cd frontend
npm install
npm run dev</code>
      </CodeBlock>

      <h2 id="contribuer">Contribuer</h2>
      <p>
        Les Issues et pull requests sont les bienvenues sur le dépôt principal. Le projet est sous licence <strong>AGPL-3.0</strong> : toute version modifiée exploitée comme service réseau doit rendre son code source disponible sous la même licence.
      </p>
    </>
  );
}
