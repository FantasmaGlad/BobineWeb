# BobineWeb

Site web de [Bobine](https://github.com/FantasmaGlad/Bobine) — vitrine, documentation et tutoriel d'installation. Déployé sur [bobine.fit](https://bobine.fit).

Voir [`docs/cahier-des-charges.md`](docs/cahier-des-charges.md) pour le contexte produit et les décisions techniques, et [`Start.md`](Start.md) pour le prompt de setup initial.

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

Next.js (App Router) + TypeScript, contenu documentation/blog en MDX, i18n FR/EN par segment de route (`/fr/...`, `/en/...`). Le blog est généré automatiquement depuis les [releases GitHub](https://github.com/FantasmaGlad/Bobine/releases) du dépôt Bobine.

## Licence

AGPL-3.0-or-later — voir [`LICENSE`](https://github.com/FantasmaGlad/Bobine/blob/main/LICENSE) du projet Bobine.
