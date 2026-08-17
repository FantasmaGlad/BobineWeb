# BobineWeb

Site web officiel de [Bobine](https://github.com/FantasmaGlad/Bobine) — vitrine, documentation, guide d'installation et démo 3D interactive. Déployé sur [bobine.fit](https://bobine.fit).

Voir [`docs/cahier-des-charges.md`](docs/cahier-des-charges.md) pour le contexte produit et les décisions techniques, et [`docs/cahier-des-charges-ui-ux.md`](docs/cahier-des-charges-ui-ux.md) pour la direction artistique et le système de design.

## Fonctionnalités du site

- **Design system multi-thèmes** : 13 thèmes riches et étalonnés avec dropdown interactif à pastilles bicolores (thème par défaut : *Lavande*).
- **Layout plein écran ergonomique** : Header et Footer fixes symétriques avec zone de lecture centrale défilable sans scroll parasite.
- **Documentation technique** : guides pas-à-pas en MDX pour l'installation, l'exploitation quotidienne et l'architecture logicielle.
- **Démo 3D interactive** : rendu temps réel Three.js / React Three Fiber du matériel Bobine (mini PC Dell Wyse 5070 et affichage vidéo).
- **Synchronisation dynamique du blog** : publication automatisée depuis les releases GitHub officielles.
- **Internationalisation (i18n)** : bilingue Français / Anglais par segment d'URL (`/fr`, `/en`).

## Développement local

Prérequis : Node.js ≥ 20.

```bash
npm install
npm run dev   # http://localhost:3000
```

```bash
npm run build   # build de production
npm run lint     # ESLint
```

## Stack

Next.js (App Router, Turbopack) + TypeScript, React 19, MDX (@next/mdx), Three.js (@react-three/fiber, @react-three/drei), CSS Vanilla avec variables dynamiques et anti-FOUC.

## Outillage IA & MCP

Ce dépôt est développé avec l'assistance d'outils IA :

- `.mcp.json` — configuration des serveurs MCP (GitHub, Vercel).
- `.claude/`, `.gemini/`, `.agents/` — configurations locales par agent (ignorées dans `.gitignore`).

## Licence

AGPL-3.0-or-later — voir [`LICENSE`](https://github.com/FantasmaGlad/Bobine/blob/main/LICENSE) du projet Bobine.

