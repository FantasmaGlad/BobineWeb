# bobine.fit

Portail web et documentation officielle de **Bobine** — régie vidéo et système de diffusion multimédia autonome open-source pour salles de sport et studios fitness.

- **URL de production** : [https://bobine.fit](https://bobine.fit)
- **Dépôt principal** : [github.com/FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine)
- **Licence** : AGPL-3.0

---

## Architecture & Spécifications

- **Framework** : Next.js 16 (App Router, Turbopack, React 19)
- **Rendu** : Génération statique (SSG) des pages localisées FR/EN, avec régénération incrémentale (6 h) de la boutique AliExpress
- **Régie 3D** : Three.js / React Three Fiber / Drei (scène interactive Wyse 5070, écran HD et mascotte Baamix 360°)
- **Design System** : CSS pur avec variables dynamiques — 17 thèmes calibrés pour des contrastes WCAG AAA/AA (8 Clairs, 9 Sombres)
- **SEO & GEO** : Sitemap multilingue dynamique, JSON-LD enrichi, métadonnées Googlebot, favicons haute fidélité (multiples de 48px)
- **Performances** : 100% Hors-ligne (PWA / Service Worker), polices système zéro latence
- **Infrastructure & Sécurité** : Proxy inverse Cloudflare (Anti-DDoS, WAF, Bot Fight Mode, SSL Full Strict, HTTP/3, Brotli) en amont de Vercel Edge Network


- **Boutique matériel** : `/materiel/amazon` (prix constatés) et `/materiel/aliexpress` (API Affiliate, prix rafraîchis toutes les 6 h), panier « Mon Pack » commun
- **Assistant IA Baamix** : Hugging Face puis OpenRouter en repli, catalogue et contexte de la boutique reconstruits à chaque requête (`src/app/api/chat/route.ts`, `src/lib/catalog/`)
- **Miroir Tor (.onion)** : export statique du site + dépôt APT en services onion v3, hébergés sur le Dell Wyse 5070 du mainteneur (pas sur Vercel). Site `http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/`, dépôt APT `tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/`. Construit par le workflow `.github/workflows/onion-mirror.yml`, déployé par `deploy/onion/`. Détails : les règles du projet section 13 et `docs/cahier-des-charges-onion-tor.md`.

---

## Variables d'environnement

Voir `.env.example`. `ALIEXPRESS_APP_KEY`, `ALIEXPRESS_APP_SECRET` et `ALIEXPRESS_TRACKING_ID` alimentent le catalogue AliExpress (sans elles, le site affiche l'instantané `src/content/aliexpress-snapshot.json`). `OPENROUTER_API_KEY` alimente Baamix. Ne jamais committer de secret.

## Scripts AliExpress

```bash
node --env-file=.env.local scripts/aliexpress-search.mjs "mini pc ryzen 5" --min 150 --max 400 --sort LAST_VOLUME_DESC   # recherche de candidats
node --env-file=.env.local scripts/aliexpress-snapshot.mjs   # régénère l'instantané et les images depuis src/content/aliexpress-ids.json
```

---

## Commandes

```bash
npm install     # Installation des dépendances
npm run dev     # Serveur de développement (http://localhost:3000)
npm run build   # Compilation de production statique
npm run build:onion  # Export statique du miroir Tor (RÉSERVÉ À LA CI : supprime src/app/api et src/proxy.ts)
npm run lint    # Validation ESLint & TypeScript
```

