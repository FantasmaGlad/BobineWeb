# Guide de développement de BobineWeb

Guide technique du dépôt : où modifier quoi, sources de vérité, conventions et pièges connus. La présentation du projet est dans [`README.md`](../README.md) ; les règles de contribution dans [`CONTRIBUTING.md`](../CONTRIBUTING.md) (version française : [`docs/fr/CONTRIBUTING.md`](fr/CONTRIBUTING.md)).

---

## Sommaire

1. [Démarrer en cinq minutes](#1-démarrer-en-cinq-minutes)
2. [Où modifier quoi](#2-où-modifier-quoi)
3. [Pages et routes](#3-pages-et-routes)
4. [Carte du dépôt](#4-carte-du-dépôt)
5. [Sources de vérité](#5-sources-de-vérité)
6. [Référencement (SEO) et découverte par les IA (GEO)](#6-référencement-seo-et-découverte-par-les-ia-geo)
7. [Assistant Baamix](#7-assistant-baamix)
8. [Boutique matériel et affiliation](#8-boutique-matériel-et-affiliation)
9. [Miroir Tor](#9-miroir-tor)
10. [Design system](#10-design-system)
11. [Variables d'environnement](#11-variables-denvironnement)
12. [Commandes, validation et livraison](#12-commandes-validation-et-livraison)
13. [Pièges connus](#13-pièges-connus)
14. [Documentation de fond](#14-documentation-de-fond)
15. [Glossaire](#15-glossaire)

---

## 1. Démarrer en cinq minutes

```bash
npm install
cp .env.example .env.local   # renseigner HF_TOKEN ou OPENROUTER_API_KEY pour tester Baamix
npm run dev                  # http://localhost:3000
```

Sans aucune clé, le site fonctionne : Baamix répond 503, le catalogue AliExpress utilise son instantané `src/content/aliexpress-snapshot.json`, la version affichée retombe sur une valeur de repli.

Stack : Next.js 16 (App Router, Turbopack), React 19, TypeScript, CSS pur à variables, Three.js (React Three Fiber, Drei), MDX, `@react-pdf/renderer`. Hébergement Vercel derrière Cloudflare. Deux langues : français (défaut) et anglais.

Next.js 16 a des ruptures par rapport aux versions précédentes : avant d'écrire du code, lire le guide pertinent dans `node_modules/next/dist/docs/`.

---

## 2. Où modifier quoi

| Je veux... | Fichier ou dossier |
|---|---|
| Changer un texte de la documentation, de la FAQ, du PDF ou de ce que sait Baamix | `src/content/docs/chapters.ts`, `src/content/docs/faq-data.ts` (source unique) |
| Ajouter ou changer un produit Amazon (prix, ASIN, gamme) | `src/content/hardware.ts`, puis `docs/suivi-offres-amazon-materiel.txt` |
| Ajouter ou changer un produit AliExpress | `src/content/aliexpressHardware.ts` puis `node --env-file=.env.local scripts/aliexpress-snapshot.mjs` |
| Ajouter une page | `src/app/[locale]/<page>/page.tsx` + entrée dans `staticRoutes` de `src/app/sitemap.ts` + lien dans l'en-tête ou le pied de page |
| Changer le titre, la description ou l'image sociale d'une page | `generateMetadata` de la page, via `buildMetadata()` dans `src/lib/seo.ts` |
| Changer les données structurées (JSON-LD) | `src/components/JsonLd.tsx`, `BreadcrumbsJsonLd.tsx`, `FaqJsonLd.tsx` |
| Ouvrir ou fermer un robot d'indexation | `src/app/robots.ts` (liste `CRAWLERS`) |
| Changer le résumé destiné aux moteurs conversationnels | `public/llms.txt` et `public/llms-full.txt` |
| Changer le comportement ou le prompt de Baamix | `src/app/api/chat/route.ts`, `src/lib/catalog/promptContext.ts` |
| Changer un thème de couleurs | `src/lib/themes.ts` et `src/app/globals.css` |
| Changer les textes de l'interface | `src/messages/fr.json`, `src/messages/en.json` et les pages elles-mêmes |
| Changer une règle de redirection ou l'en-tête `Onion-Location` | `src/proxy.ts` |
| Changer les en-têtes de sécurité ou de cache | `next.config.ts` |
| Changer le script d'installation | `public/install.sh` (servi aussi par `src/app/install.sh/route.ts`), `public/install-tor.sh` |
| Changer ce qui est publié sur le miroir Tor | `.github/workflows/onion-mirror.yml`, `deploy/onion/`, `scripts/prepare-onion.mjs` |
| Mettre à jour une mention légale ou la politique de confidentialité | `src/app/[locale]/mentions-legales/page.tsx`, `confidentialite/page.tsx` |

---

## 3. Pages et routes

Toutes les pages existent sous `/fr` et `/en` (`src/app/[locale]/`). La racine `/` redirige en 308 vers `/fr`.

| Route | Contenu |
|---|---|
| `/` | Accueil : téléchargement par système (détection de la plateforme), démonstration du terminal, installation headless |
| `/fonctionnalites` | Fonctionnalités et modules techniques |
| `/documentation` | Hub d'installation (Windows, macOS, Linux, Android, appliance Debian, APT, Tor) |
| `/documentation/utilisation`, `/documentation/faq`, `/documentation/developpeurs` | Guide d'utilisation, FAQ filtrable, API et architecture |
| `/documentation/demarrage-rapide`, `/documentation/manifeste` | Redirections vers les pages ci-dessus |
| `/comparatif` et `/comparatif/{les-mills-cinema, wexer-fitness-on-demand, radical-fitness-yako, affichage-dynamique-fitness}` | Études comparatives |
| `/materiel` | Redirige vers `/materiel/amazon` |
| `/materiel/amazon`, `/materiel/aliexpress` | Boutique : 4 systèmes, Mini PC ou PC portable, 4 gammes, panier « Mon Pack » |
| `/baamix` | Assistant IA en plein écran (contenu indexable, FAQ, JSON-LD) |
| `/blog`, `/blog/[slug]` | Une page par release GitHub (stable et bêta) |
| `/a-propos`, `/soutenir` | Auteur et gouvernance, dons |
| `/mentions-legales`, `/confidentialite` | Pages légales |
| `/securite` | Politique de divulgation de vulnérabilités (contact, périmètre, délais) |
| `/demo-3d` | Scène 3D immersive (pas dans le sitemap) |

Routes serveur : `/api/chat` (Baamix), `/api/catalog`, `/api/github-stats`, `/api/aliexpress/callback`, `/install.sh`. Elles n'existent pas dans le miroir Tor. Fichiers publics : `/.well-known/security.txt` (RFC 9116, `/security.txt` redirige dessus), `/.well-known/security.asc` (clé publique OpenPGP pour chiffrer les rapports) et `/.well-known/openpgpkey/` (Web Key Directory). Fichiers générés : `/sitemap.xml` (alias `/sitemap-bobine.xml`), `/robots.txt`, `/manifest.webmanifest`, `/{locale}/opengraph-image`.

---

## 4. Carte du dépôt

```
src/app/                  App Router : sitemap.ts, robots.ts, manifest.ts, globals.css, api/
src/app/[locale]/         Pages localisées et layout racine
src/components/           Composants React ; hardware/ (boutique), icons/ (SVG), three/ (3D)
src/content/              Données éditoriales : docs/, hardware.ts, aliexpressHardware.ts, aliexpress-*.json
src/lib/                  seo.ts, i18n.ts, themes.ts, onion.ts, github-releases.ts, releaseChannels.ts,
                          catalog/ (catalogue unifié), aliexpress/ (client API), pdf/ (export PDF),
                          hardwareCart.tsx (panier), chatBlocks.ts, detectPlatform.ts
src/messages/             Chaînes d'interface fr.json et en.json
src/styles/split/         Feuilles CSS par domaine ; le reste est dans src/app/globals.css
src/proxy.ts              Redirections (www vers apex, préfixe de langue) et en-tête Onion-Location
public/                   llms.txt, llms-full.txt, install.sh, install-tor.sh, BingSiteAuth.xml, sw.js,
                          draco/ (décodeur 3D local), models/, images/, videos/, favicons
scripts/                  aliexpress-search.mjs, aliexpress-snapshot.mjs, prepare-onion.mjs, tor-art/
scripts/ci/               Contrôles réutilisés par les workflows (politique, miroir Tor, site de sécurité, tests en direct)
scripts/security-txt/     Signature de security.txt
security/                 Site de divulgation security.bobine.fit (security/site, publié par GitHub Pages)
deploy/onion/             Déploiement reproductible du miroir Tor (Caddy, systemd, torrc, sync.sh)
docs/                     Cahiers des charges, suivi des offres Amazon, variantes françaises (fr/)
.github/workflows/        ci, deploy, preview, onion-mirror, live-tor, security-site-watch, codeql, vercel-cleanup
.github/actions/          deploy-vercel (seule étape propre à l'hébergeur)
```

---

## 5. Sources de vérité

Chaque information vit à un seul endroit. Ne jamais la recopier à la main ailleurs.

| Information | Source unique | Consommateurs |
|---|---|---|
| Documentation, FAQ, installation | `src/content/docs/chapters.ts`, `faq-data.ts` | Pages `Docs*.tsx`, PDF (`src/lib/pdf/`), prompt de Baamix |
| Produits Amazon, prix, ASIN | `src/content/hardware.ts` | Boutique, panier, catalogue de Baamix |
| Produits AliExpress | `src/content/aliexpressHardware.ts` + `aliexpress-snapshot.json` | Boutique, catalogue de Baamix, rafraîchissement toutes les 6 h |
| Version courante du logiciel | API GitHub Releases (`src/lib/github-releases.ts`, `releaseChannels.ts`) | JSON-LD, badge, boutons de téléchargement, pages de blog, Baamix |
| Adresses `.onion` | `src/lib/onion.ts` | Documentation, pied de page, scripts, `llms.txt` |
| Thèmes | `src/lib/themes.ts` | Sélecteur, CSS, scène 3D |

Règles de contenu : ne jamais présenter une fonctionnalité non livrée (Android = étude de faisabilité, iOS = piste non engagée), ne jamais écrire un prix ou un ASIN en dehors de `hardware.ts`, ne jamais afficher de note ou d'avis inventé.

---

## 6. Référencement (SEO) et découverte par les IA (GEO)

- **Sitemap** : `src/app/sitemap.ts`, une entrée par page et par langue, avec `hreflang` fr, en et `x-default`. Toute nouvelle page doit y être déclarée dans `staticRoutes`. Les articles de blog utilisent la date de publication de la release comme `lastmod`. Même contenu sous `/sitemap-bobine.xml` (alias à soumettre si Search Console garde un état d'échec).
- **Robots** : `src/app/robots.ts` autorise explicitement les robots classiques et d'IA générative (Googlebot, Bingbot, GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot et d'autres) et ferme `/api/`. Cloudflare doit rester en « ne pas bloquer les robots IA ».
- **Métadonnées** : toute page passe par `buildMetadata()` (`src/lib/seo.ts`) : titre, description, canonique, hreflang, OpenGraph (image par défaut 1200x630 générée par `[locale]/opengraph-image.tsx`), Twitter Card. Une page `"use client"` ne peut pas exporter de métadonnées : créer un `page.tsx` serveur qui rend la vue cliente (modèle : `soutenir/page.tsx` + `components/SupportView.tsx`).
- **Données structurées** : `SoftwareApplication`, `Person`, `Organization`, `WebSite`, `FAQPage`, `BreadcrumbList`, `ItemList` (boutique), `WebApplication` (Baamix). Pas d'`aggregateRating` : le projet n'a aucun système d'avis.
- **Moteurs conversationnels** : `public/llms.txt` (résumé, fiche d'entité) et `public/llms-full.txt` (version longue). Garder cohérents l'auteur, les adresses et les fonctionnalités avec `JsonLd.tsx`.
- **Favicons** : carrés, multiples de 48 px (48, 96, 192, 512), `favicon.ico` multi-résolution.
- **Bing** : `public/BingSiteAuth.xml`.
- **Sécurité** : la clé OpenPGP de réception des rapports (empreinte `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2`, expire en octobre 2028) est distincte de la clé de signature du dépôt APT ; sa partie privée ne figure jamais dans le dépôt. `public/.well-known/security.txt` est signé en clair avec cette clé (RFC 9116) et expire le 2027-04-07 : le renouveler avant cette date en éditant `scripts/security-txt/security.txt` puis en lançant `bash scripts/security-txt/sign.sh` dans un terminal interactif (le script contrôle les champs, la date d'expiration, signe et vérifie ; la phrase secrète est saisie par son propriétaire). Ne jamais éditer directement le fichier signé. L'empreinte est aussi publiée dans le dépôt officiel du logiciel (`SECURITY.md`, `docs/security/`), sur `security.bobine.fit` (GitHub Pages, servi depuis `security/site/` de ce dépôt) et dans le DNS (TXT `openpgp4fpr`, `OPENPGPKEY`) : autant de canaux de vérification indépendants. Le workflow `.github/workflows/security-site-watch.yml` contrôle chaque jour le CNAME, le statut Pages, l'empreinte sur tous les canaux, la signature de `security.txt` et les échéances d'expiration.
- **International** : les pages `/en` sont traduites mais leurs URL gardent des slugs français (`/en/fonctionnalites`). Passer à des slugs anglais, une redirection de `/` selon `Accept-Language` et des liens entrants anglophones est la piste principale pour le marché anglophone.

Vérification rapide du sitemap :

```bash
curl -s https://bobine.fit/sitemap.xml | grep -c "<url>"
curl -sI -A "Googlebot" https://bobine.fit/sitemap.xml | head -3
```

---

## 7. Assistant Baamix

Mascotte hamster et assistant conversationnel : répond sur l'installation, les fonctionnalités et le choix de matériel, avec fiches produit et tableaux comparatifs construits depuis le catalogue réel.

- **Composant unique** : `src/components/BobineChatbot.tsx`, en `variant="bubble"` (bulle flottante du layout) ou `variant="page"` (page `/baamix`). Ne jamais le dupliquer.
- **Serveur** : `src/app/api/chat/route.ts`. Hugging Face (`deepseek-ai/DeepSeek-V4.1-Flash:deepinfra`) en premier, puis repli sur OpenRouter (modèles gratuits). Un flux vide ou en erreur déclenche le candidat suivant. Au moins une clé est requise, sinon 503.
- **Prompt** : reconstruit à chaque requête depuis `chapters.ts` (`buildProjectKnowledge()`) et l'API GitHub (`buildVersionInfo()`). Aucun bloc de connaissances produit codé en dur.
- **Catalogue** : `src/lib/catalog/` unifie Amazon et AliExpress. Le serveur reconstruit le détail des produits vus par le visiteur depuis le catalogue, jamais depuis du texte envoyé par le client.
- **Blocs de réponse** : ```` ```product ```` et ```` ```compare ````, analysés par `src/lib/chatBlocks.ts` ; le serveur ajoute lui-même ces blocs quand le modèle les oublie.
- **Miroir Tor** : aucun appel réseau, le chat s'ouvre sur un message qui explique pourquoi il ne répond pas.

---

## 8. Boutique matériel et affiliation

- **Structure** : 4 systèmes (Linux, Windows, macOS, Android) x jusqu'à 3 formes (Mini PC, PC portable, Tablette) x 4 gammes (Essentiel, Recommandé, Pro, Premium). Chaque gamme propose au moins deux unités centrales dont les ASIN sont vérifiés un à un.
- **Amazon** : prix constatés à la main, date `PRICE_CHECKED_AT` dans `hardware.ts`. Chaque lien porte `tag=fantasmaglad-21` et `rel="nofollow sponsored noopener noreferrer"`. La mention légale du Partenaire Amazon figure uniquement dans les mentions légales.
- **AliExpress** : programme Portals, identifiants dans les variables `ALIEXPRESS_*`. Pas d'offre macOS (la page redirige vers Windows et Linux, jamais de faux produit). Prix rafraîchis côté serveur toutes les 6 h.
- **Panier « Mon Pack »** : commun aux deux plateformes, stocké dans le navigateur (`bobine-hardware-cart-v1`). Amazon : un seul lien d'ajout au panier. AliExpress : un onglet par clic.
- **Mise en page** : hauteurs de bloc verrouillées quel que soit le système ou la gamme (texte défilant `MarqueeText`, infobulles). Aplats de couleur uniquement, aucun dégradé, aucun badge de nom de gamme.
- **Le site ne vend rien** : les achats se font chez Amazon et AliExpress. Ne jamais laisser entendre qu'il garantit, livre ou rembourse.

---

## 9. Miroir Tor

Version statique du site et dépôt APT accessibles en `.onion`, hébergés sur une machine personnelle du mainteneur (pas sur Vercel).

- **Construction** : `npm run build:onion` retire `src/app/api` et `src/proxy.ts`, puis exporte (`NEXT_PUBLIC_BOBINE_ONION=1`, constante `IS_ONION` dans `src/lib/onion.ts`). Ce script est réservé à la CI : il refuse de tourner ailleurs.
- **Publication** : `.github/workflows/onion-mirror.yml` (à chaque push sur `main` hors documentation, chaque jour et à la demande) construit, vérifie (aucun lien d'affiliation, aucune ressource externe, aucune mesure d'audience) puis pousse une branche orpheline `onion-site`.
- **Déploiement** : `deploy/onion/` (README inclus). Un timer tire le contenu et vérifie les signatures GPG avant de basculer.
- **Règle** : toute nouvelle fonctionnalité doit marcher sans route serveur ni ressource tierce quand `IS_ONION` est vrai, ou se dégrader proprement. Pas de `fetch("/api/...")` sans garde, pas de police, script ou décodeur chargé depuis l'extérieur.
- Détails : [`docs/cahier-des-charges-onion-tor.md`](cahier-des-charges-onion-tor.md) et [`deploy/onion/README.md`](../deploy/onion/README.md).

---

## 10. Design system

- 17 thèmes dans `src/lib/themes.ts` : 8 clairs (`clair` par défaut, `beige`, `ciel`, `menthe`, `lavande`, `aurore`, `glacier`, `rose`) et 9 sombres (`charbon`, `lune`, `hiver`, `chili`, `automne`, `orchidee`, `taupe`, `foret`, `abysse`). `:root` est toujours synchronisé sur `clair` pour éviter tout flash au chargement.
- Contrastes WCAG AA et AAA. Jamais d'accent vif pour `--text-muted` : encre sombre feutrée sur thème clair, gris neutre sur thème sombre. Surfaces : `--bg-canvas` contre `--bg-card` avec bordure `--border-subtle`.
- **Aucun emoji** dans l'interface, la documentation ou le code. Icônes en SVG filaire (`fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`).
- Three.js : le composant de scène et un chargeur client portant `"use client"` qui appelle `dynamic(..., { ssr: false })` ; les Server Components n'importent que le chargeur. Modèle Baamix : `public/models/baamix.glb`.
- En-tête collant, tiroir mobile à partir de 1024 px, détection de plateforme après montage uniquement (jamais pendant le rendu serveur).
- Animations (ondulation des boutons, cascade du tiroir, confirmation de téléchargement) : toutes désactivées sous `prefers-reduced-motion`. Pour étendre l'ondulation à un bouton, ajouter son sélecteur dans `RIPPLE_SELECTOR` (`src/lib/globalRipple.ts`).

---

## 11. Variables d'environnement

Voir `.env.example`. Aucune clé dans le code.

| Variable | Rôle |
|---|---|
| `HF_TOKEN` | Baamix, fournisseur principal (Hugging Face) |
| `OPENROUTER_API_KEY` | Baamix, repli (au moins une des deux clés est requise) |
| `HF_MODEL`, `OPENROUTER_MODEL` | Forcer un autre modèle (optionnel) |
| `ALIEXPRESS_APP_KEY`, `ALIEXPRESS_APP_SECRET`, `ALIEXPRESS_TRACKING_ID` | Catalogue AliExpress en direct (sans elles : instantané) |
| `GITHUB_TOKEN` | Limite de taux de l'API GitHub (optionnel) |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ZONE_ID` | Gestion de la zone `bobine.fit` (Email Routing, DNS) par API. Usage local uniquement, aucune fonction du site ne les lit |

### Courrier du domaine

Réception : Cloudflare Email Routing (MX `route1/2/3.mx.cloudflare.net`) redirige vers la boîte du mainteneur : `clement.barillot@`, `contact@`, `security@`, `info@`, `support@`, `admin@`, `webmaster@`, `postmaster@`, `abuse@`, `hostmaster@`, `privacy@`, `legal@` et `conduct@bobine.fit` (signalements du code de conduite du dépôt Bobine). Le catch-all est désactivé : toute autre adresse est rejetée. Envoi depuis ces adresses : Resend (SMTP `smtp.resend.com`, DKIM et SPF sur `send.bobine.fit`). Authentification : SPF, DKIM (Resend et Cloudflare) et DMARC (`p=none`, rapports agrégés vers `security@bobine.fit` ; passer à `quarantine` puis `reject` après quelques semaines de rapports propres). Le site ne publie qu'un lien `mailto:` (pied de page, tiroir mobile, `/baamix`, pages légales) : aucune route serveur n'envoie de courrier.

Lister les règles de redirection :

```bash
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/email/routing/rules"
```

Scripts AliExpress :

```bash
node --env-file=.env.local scripts/aliexpress-search.mjs "mini pc ryzen 5" --min 150 --max 400 --sort LAST_VOLUME_DESC
node --env-file=.env.local scripts/aliexpress-snapshot.mjs   # régénère l'instantané et les images
```

---

## 12. Commandes, validation et livraison

```bash
npm run dev          # développement
npx tsc --noEmit     # TypeScript, 0 erreur attendue
npm run lint         # ESLint, 0 erreur (les avertissements react-hooks sont volontaires)
npm run build        # production
npm run build:onion  # miroir Tor, réservé à la CI
bash scripts/ci/policy-check.sh   # politique du dépôt (secrets, emoji, entrées autorisées)
```

Avant tout commit : `npx tsc --noEmit` puis `npm run build`, sans erreur. Les messages suivent `type(scope): description` en minuscules (voir [`CONTRIBUTING.md`](../CONTRIBUTING.md)).

Livraison, entièrement pilotée par GitHub (`.github/workflows/`) :

| Workflow | Rôle |
|---|---|
| `ci.yml` | Sur chaque demande de fusion et avant tout déploiement : politique du dépôt, types, lint, build, export et contrôle du miroir Tor, contrôle du site de sécurité. Le statut unique `ci-ok` est celui à exiger sur `main` |
| `deploy.yml` | Sur `main` : validation, déploiement du site (action `deploy-vercel`), publication de `security/site` sur GitHub Pages, puis tests en direct (`scripts/ci/smoke-*.sh`) |
| `preview.yml` | Prévisualisation des demandes de fusion issues de ce dépôt (jamais des forks : aucun secret) |
| `onion-mirror.yml` | Construit, vérifie et publie le miroir Tor sur la branche `onion-site` |
| `live-tor.yml` | Interroge le vrai service onion à travers Tor |
| `security-site-watch.yml` | Surveillance quotidienne du site de sécurité et de l'empreinte OpenPGP |
| `codeql.yml` | Analyse statique de sécurité |
| `vercel-cleanup.yml` | Chaque lundi, ne garde que la dernière production |

Changer d'hébergeur ne demande que de remplacer `.github/actions/deploy-vercel` et le workflow `vercel-cleanup.yml` : les workflows appellent l'action, jamais le CLI de l'hébergeur directement.

Secrets et variables GitHub : secret `VERCEL_TOKEN`, variables `VERCEL_TEAM_ID` et `VERCEL_PROJECT_ID`. Aucun secret n'est lisible par une demande de fusion venant d'un fork.

---

## 13. Pièges connus

- **Sitemap et Search Console** : une adresse de sitemap déjà en échec reste en échec. Soumettre `/sitemap-bobine.xml` et lire l'erreur réelle avec « Inspection de l'URL » en test en direct.
- **Page sans métadonnées** : une page `"use client"` n'a ni titre, ni canonique, ni hreflang. Séparer en page serveur et vue cliente.
- **Données structurées** : jamais de note ni d'avis inventé (risque d'action manuelle de Google).
- **Image sociale** : une image OpenGraph déclarée en 1200x630 doit réellement faire 1200x630.
- **Badge de méthode d'installation** : une grille CSS à deux colonnes, pas un flex à trois éléments (coupure de mot en plein milieu sur mobile).
- **Contrôles mobiles** : un test de débordement ne détecte pas une coupure de mot en plein milieu ; vérifier ligne par ligne.
- **Prix Amazon en direct** : indisponible tant que l'API Creators n'est pas accessible (voir `docs/cahier-des-charges-amazon-creators-api.md`).
- **Hébergeur** : l'intégration Git de Vercel est désactivée par `vercel.json` ; seule la chaîne `deploy.yml` publie. La branche `onion-site` porte son propre `vercel.json` qui lui interdit tout déploiement.

---

## 14. Documentation de fond

| Document | Sujet |
|---|---|
| [`docs/cahier-des-charges.md`](cahier-des-charges.md) | Cadrage global du site, structure technique |
| [`docs/cahier-des-charges-ui-ux.md`](cahier-des-charges-ui-ux.md) | UI et UX |
| [`docs/cahier-des-charges-materiel-affiliation.md`](cahier-des-charges-materiel-affiliation.md) | Vision initiale du hub matériel (prix obsolètes : n'en retenir que la stratégie) |
| [`docs/cahier-des-charges-selecteur-plateforme-materiel.md`](cahier-des-charges-selecteur-plateforme-materiel.md) | Sélecteur Amazon / AliExpress, hauteurs verrouillées, confetti |
| [`docs/cahier-des-charges-aliexpress-affiliate.md`](cahier-des-charges-aliexpress-affiliate.md) | Intégration de l'API Affiliate AliExpress |
| [`docs/cahier-des-charges-amazon-creators-api.md`](cahier-des-charges-amazon-creators-api.md) | Prix Amazon en direct (à faire plus tard) |
| [`docs/cahier-des-charges-onion-tor.md`](cahier-des-charges-onion-tor.md) | Miroir Tor |
| [`docs/suivi-offres-amazon-materiel.txt`](suivi-offres-amazon-materiel.txt) | Liste datée des produits Amazon, procédure de mise à jour des prix |
| [`deploy/onion/README.md`](../deploy/onion/README.md) | Déploiement du miroir Tor sur une machine Debian |

---

## 15. Glossaire

- **Bobine** : le logiciel de régie vidéo (autre dépôt). **Bobine Assistant** : application d'orchestration réseau (Tauri). **BobineWeb** : ce site.
- **Baamix** : mascotte hamster et assistant IA du site.
- **Playout** : diffusion planifiée de vidéos (cours collectifs) sur les écrans d'une salle.
- **Régie** : poste ou appliance qui pilote la diffusion.
- **Appliance headless** : mini PC Debian sans écran de configuration, installé par `install.sh`.
- **Mon Pack** : panier matériel local au navigateur.
- **Gamme** : niveau de budget d'un pack matériel (Essentiel, Recommandé, Pro, Premium).
- **GEO** : Generative Engine Optimization, adaptation du site aux moteurs de réponse IA.
- **Miroir Tor** : copie statique du site servie en service onion v3 (`IS_ONION`).
- **Instantané AliExpress** : `aliexpress-snapshot.json`, copie des prix et images, utilisée sans clé API.
