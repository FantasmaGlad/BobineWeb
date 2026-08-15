# Start — Setup technique BobineWeb

Ce document est un prompt à coller tel quel dans une nouvelle session d'agent. Il ne suppose aucun contexte préalable : tout ce qu'il faut savoir est soit ci-dessous, soit dans les fichiers référencés.

## Contexte

**Bobine** est un logiciel open-source (AGPL-3.0) auto-hébergé, alternative à LesMills Cinema pour salles de sport — dépôt principal : [github.com/FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine), déjà en V2.0.0. Le nom de domaine **bobine.fit** a été acheté. **BobineWeb** est le site web dédié (vitrine + documentation + tutoriel d'installation), qui n'existe pour l'instant que sous forme de cahier des charges.

Ta mission dans cette session : mettre en place l'infrastructure technique du projet — dépôt GitHub, scaffolding Next.js, structure de fichiers, connexions MCP, connexion Vercel. **Pas la rédaction du contenu final** (textes marketing, tutoriel détaillé avec captures d'écran, traductions complètes) — ça viendra dans une session dédiée ultérieure, une fois l'ossature en place.

## À lire en premier

**[`docs/cahier-des-charges.md`](docs/cahier-des-charges.md)** — c'est la source de vérité pour toutes les décisions produit/techniques (périmètre, sitemap, stack, design, i18n, hébergement). Ce présent document ne fait qu'exécuter son §16 (Structure technique détaillée) et son §17 (Prochaines étapes) ; en cas de doute ou de contradiction, le cahier des charges fait foi.

Répertoire de travail : `/home/fanta/Developpement/web/BobineWeb/` (existe déjà, contient pour l'instant seulement `docs/` et ce fichier).

## Rappel de sécurité (à respecter même si ce document t'autorise la démarche générale)

Ce prompt vaut feu vert de principe pour la démarche décrite. Mais applique quand même les bons réflexes standards :
- **Confirme avec l'utilisateur avant** : de créer le dépôt GitHub (action visible, publique), et avant le premier `git push` (état partagé). Une seule confirmation groupée avant l'étape 2 suffit, pas besoin de reconfirmer à chaque commande ensuite.
- **N'invente jamais d'URL** de DNS/Vercel — toute étape nécessitant une connexion/login (Vercel, autorisation OAuth des serveurs MCP) doit être **guidée** pour que l'utilisateur l'exécute lui-même dans son navigateur, pas simulée.
- `git status` avant toute commande destructive, comme toujours.

## Étapes

### 1. Créer le dépôt GitHub

Le dépôt cible est **`github.com/FantasmaGlad/BobineWeb`** — vérifier s'il existe déjà (`gh repo view FantasmaGlad/BobineWeb`), sinon le créer, public, avec une description courte cohérente avec Bobine :

```bash
gh repo create FantasmaGlad/BobineWeb --public \
  --description "Site web de Bobine — vitrine, documentation et tutoriel d'installation" \
  --homepage "https://bobine.fit"
```

### 2. Ajouter la clé de déploiement

Une paire de clés SSH dédiée a déjà été générée sur ce poste : `~/.ssh/bobineweb_deploy` (privée) / `~/.ssh/bobineweb_deploy.pub` (publique), avec un alias déjà présent dans `~/.ssh/config` :

```
Host github.com-bobineweb
  HostName github.com
  User git
  IdentityFile ~/.ssh/bobineweb_deploy
  IdentitiesOnly yes
```

Clé publique (à ajouter dans *Settings → Deploy keys* du dépôt, avec **Allow write access** coché) :

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID4agc/Awgecbu/re2wp1KBnnYFGvlXMHedMYE5sMyHb bobineweb-deploy
```

Via `gh` CLI (équivalent à un ajout manuel dans l'UI) :

```bash
gh repo deploy-key add ~/.ssh/bobineweb_deploy.pub --title "bobineweb-deploy" --allow-write -R FantasmaGlad/BobineWeb
```

**Important** : toute commande `git` vers ce dépôt doit utiliser l'alias `github.com-bobineweb` (pas `github.com` tout court) dans l'URL du remote, pour que SSH sélectionne la bonne clé — ce poste a plusieurs clés de déploiement pour plusieurs projets.

### 3. Initialiser le dépôt local

```bash
cd /home/fanta/Developpement/web/BobineWeb
git init
git remote add origin git@github.com-bobineweb:FantasmaGlad/BobineWeb.git
```

### 4. Scaffolder Next.js

Le dossier contient déjà `docs/` et `Start.md` — `create-next-app` peut refuser un dossier non vide. Scaffolder dans un dossier temporaire puis fusionner, ou construire la structure manuellement (`package.json`, `next.config.ts`, `tsconfig.json`, `src/app/...`) en s'inspirant du frontend Bobine existant (`/home/fanta/Developpement/web/Bobine/frontend/`) pour les conventions (mêmes versions Next/React, ESLint config).

Dépendances de départ (cf. cahier des charges §16.3 pour le détail, réaligner les versions sur celles réellement publiées au moment du scaffolding) :
- `next`, `react`, `react-dom`, TypeScript, ESLint + `eslint-config-next`
- `next-intl` (i18n FR/EN) ou routing natif App Router par segment `[locale]`
- `@next/mdx` + `@types/mdx` (pages de documentation/blog en MDX)

### 5. Reconstituer la structure de fichiers

Suivre exactement l'arborescence du **§16.1 du cahier des charges** : routes `[locale]/{accueil, fonctionnalites, documentation/*, blog, soutenir, a-propos, mentions-legales, confidentialite}`. Pour cette session, des **stubs** suffisent (route qui rend un titre + un TODO), sauf pour les pages légales (voir étape 7).

Copier les assets logo depuis le dépôt Bobine vers `public/` :
```bash
cp /home/fanta/Developpement/web/Bobine/Assets/Images/logo_bobine.png BobineWeb/public/logo-bobine.png
cp /home/fanta/Developpement/web/Bobine/Assets/Images/logo_bobine_icon.png BobineWeb/public/logo-bobine-icon.png
```

Dans `globals.css`, poser au moins le token de couleur de marque : `--accent-primary: #e4002b;` (rouge Bobine, repris du frontend de l'app).

### 6. Configurer les serveurs MCP

Créer `.mcp.json` à la racine avec le contenu exact du **§16.2 du cahier des charges** (serveurs GitHub et Vercel, transport HTTP). Les deux nécessitent une autorisation OAuth via navigateur à la première connexion — **à faire dans une session interactive**, pas dans ce contexte s'il est non-interactif. Si besoin, guider l'utilisateur vers :
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
claude mcp add --transport http vercel https://mcp.vercel.com
```

### 7. Pages légales (contenu réel, pas un stub)

Contrairement aux autres pages, celles-ci peuvent être rédigées intégralement dès cette session (contenu factuel, pas de rédaction marketing) :
- **Mentions légales** : éditeur du site — **Fanta** —, contact — **clement.barillot3901@gmail.com** —, hébergeur — Vercel Inc.
- **Confidentialité** : le site ne pose aucun cookie de suivi ni traceur (décision produit, cf. cahier des charges §10) ; le préciser explicitement.
- Contact sur le site = simple lien `mailto:clement.barillot3901@gmail.com`, pas de formulaire.

### 8. CI GitHub Actions

Ajouter `.github/workflows/ci.yml` : build (`npm run build`) + lint (`npm run lint`) sur chaque push et pull request — s'inspirer de `Bobine/.github/workflows/ci.yml` pour la structure générale, adapté (un seul job frontend ici, pas de backend Python).

### 9. Premier commit et push

Après confirmation de l'utilisateur (cf. rappel de sécurité en haut) :
```bash
git add -A
git commit -m "chore: scaffold initial de BobineWeb (Next.js, structure, MCP, CI)"
git branch -M main
git push -u origin main
```

### 10. Connecter Vercel

Ceci nécessite une action interactive de l'utilisateur (login) — guider plutôt qu'agir à sa place :
1. Sur [vercel.com](https://vercel.com), *Add New → Project*, importer `FantasmaGlad/BobineWeb`.
2. Une fois déployé, dans *Project Settings → Domains*, ajouter `bobine.fit` et suivre les enregistrements DNS affichés (à reporter chez le registrar du domaine).
3. Garder le rendu `next build`/`next start` standard (pas de fonctionnalités Vercel propriétaires non justifiées), pour rester migrable vers un hébergement personnel plus tard (cf. cahier des charges §8).

### 11. Vérification finale

```bash
npm run lint
npm run build
npm run dev   # vérifier que les routes stub répondent, dans les deux locales /fr et /en
```

## Hors périmètre de cette session

- Contenu marketing final de la page d'accueil et de `/fonctionnalites`.
- Tutoriel d'installation détaillé avec captures d'écran/GIFs (`/documentation/demarrage-rapide`) — c'est la prochaine priorité une fois l'ossature posée, mais demande un travail de rédaction/capture dédié.
- Traductions complètes FR/EN de tout le contenu.
- Script de synchronisation blog ↔ releases GitHub (`lib/github-releases.ts`) : le stub de route suffit pour cette session, l'implémentation réelle peut suivre.
