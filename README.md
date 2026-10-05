# bobine.fit

Portail web et documentation officielle de **Bobine** — régie vidéo et système de diffusion multimédia autonome open-source pour salles de sport et studios fitness.

- **URL de production** : [https://bobine.fit](https://bobine.fit)
- **Dépôt principal** : [github.com/FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine)
- **Licence** : AGPL-3.0

---

## Architecture

- **Framework** : Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Langues** : français (défaut) et anglais, pages générées statiquement sous `/fr` et `/en`
- **Régie 3D** : Three.js / React Three Fiber / Drei (scène Wyse 5070, écran HD, mascotte Baamix à 360°)
- **Design system** : CSS pur à variables, 17 thèmes (8 clairs, 9 sombres) calibrés WCAG AA/AAA
- **SEO et GEO** : sitemap multilingue (`/sitemap.xml`, alias `/sitemap-bobine.xml`), `robots.txt` ouvert aux robots classiques et IA, `public/llms.txt`, JSON-LD, hreflang, canoniques
- **Hors-ligne** : Service Worker, polices système
- **Hébergement** : Vercel derrière Cloudflare (WAF, SSL Full Strict, HTTP/3, Brotli)
- **Boutique matériel** : `/materiel/amazon` (prix constatés) et `/materiel/aliexpress` (API Affiliate, prix rafraîchis toutes les 6 h), panier « Mon Pack » commun
- **Assistant IA Baamix** : Hugging Face puis OpenRouter en repli, catalogue et contexte de la boutique reconstruits à chaque requête (`src/app/api/chat/route.ts`, `src/lib/catalog/`)
- **Miroir Tor (.onion)** : export statique du site + dépôt APT en services onion v3, hébergés sur le Dell Wyse 5070 du mainteneur (pas sur Vercel). Site `http://bobinedaoki42tt33rxacmtaab2gxvxb2orqgcyhvowv3aggxhruvrid.onion/`, dépôt APT `tor+http://rzvwjat5pidtxtwzcsvew7yc5ugfjvzz432ecpn3s5mlch4cs7vvmqad.onion/`. Construit par le workflow `.github/workflows/onion-mirror.yml`, déployé par `deploy/onion/`. Détails : `docs/cahier-des-charges-onion-tor.md`.

## Structure du dépôt

| Dossier | Contenu |
|---|---|
| `src/app/` | Routes (App Router), `sitemap.ts`, `robots.ts`, `proxy.ts`, routes `api/` |
| `src/components/` | Composants React (`hardware/`, `icons/`, `three/`) |
| `src/content/` | Source de vérité : `docs/chapters.ts`, `docs/faq-data.ts`, `hardware.ts`, `aliexpressHardware.ts` |
| `src/lib/` | SEO, i18n, thèmes, catalogue, AliExpress, PDF, miroir Tor |
| `public/` | `llms.txt`, scripts d'installation, modèles 3D, images |
| `scripts/` | Instantané AliExpress, préparation du miroir Tor, génération de l'art ASCII |
| `deploy/onion/` | Déploiement reproductible du miroir Tor |
| `docs/` | Cahiers des charges et suivi des offres Amazon |
| `.github/workflows/` | CI, miroir Tor, nettoyage des déploiements Vercel |

Le contenu produit (documentation, FAQ, PDF, assistant Baamix) vient d'une seule source : `src/content/docs/`. Ne jamais le dupliquer à la main.

---

## Variables d'environnement

Voir `.env.example`. `HF_TOKEN` et `OPENROUTER_API_KEY` alimentent Baamix (au moins une des deux). `ALIEXPRESS_APP_KEY`, `ALIEXPRESS_APP_SECRET` et `ALIEXPRESS_TRACKING_ID` alimentent le catalogue AliExpress (sans elles, le site affiche l'instantané `src/content/aliexpress-snapshot.json`). `GITHUB_TOKEN` est optionnel (limite de taux de l'API GitHub). Ne jamais committer de secret.

## Scripts AliExpress

```bash
node --env-file=.env.local scripts/aliexpress-search.mjs "mini pc ryzen 5" --min 150 --max 400 --sort LAST_VOLUME_DESC   # recherche de candidats
node --env-file=.env.local scripts/aliexpress-snapshot.mjs   # régénère l'instantané et les images depuis src/content/aliexpress-ids.json
```

---

## Commandes

```bash
npm install          # Installation des dépendances
npm run dev          # Serveur de développement (http://localhost:3000)
npx tsc --noEmit     # Vérification TypeScript (0 erreur attendue)
npm run lint         # ESLint
npm run build        # Compilation de production
npm run build:onion  # Export statique du miroir Tor (RÉSERVÉ À LA CI : supprime src/app/api et src/proxy.ts)
```

Avant tout commit : `npx tsc --noEmit` et `npm run build` sans erreur.
