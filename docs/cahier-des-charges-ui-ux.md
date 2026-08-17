# Cahier des charges — UI/UX du site BobineWeb

Statut : validé à l'issue d'un entretien de cadrage. Le système de thèmes et le sélecteur qu'il décrit sont déjà implémentés (voir §3) ; ce document sert de référence pour la suite (pages restantes, visuels mascotte).

## 1. Contexte et objectif

Ce document complète le [cahier des charges général](cahier-des-charges.md) (périmètre, sitemap, stack) sur le volet strictement visuel et interaction : quelle direction artistique, quel système de couleurs, quelle typographie, quels composants — pour que chaque nouvelle page construite reste cohérente sans re-décider à chaque fois.

## 2. Direction artistique

Deux orientations combinées, choisies explicitement plutôt que l'une ou l'autre :

- **Épuré et minimaliste** comme base : beaucoup de blanc/espace, typographie forte, peu d'éléments décoratifs. Un gérant de salle qui découvre le produit doit comprendre en quelques secondes ce qu'est Bobine, sans être distrait.
- **Chaleureux, mascotte mise en avant** en complément : le hamster endormi du logo (`Assets/Images/logo_bobine.png`) devient un personnage récurrent du site — pas juste un pictogramme dans le coin du logo, mais un élément qui apparaît à des endroits choisis pour humaniser le produit (cf. §7).

**Les illustrations et animations définitives de la mascotte seront produites plus tard** — ce document prévoit leurs emplacements et leur rôle, pas leur rendu final. En attendant, ces emplacements restent vides ou occupés par un espace réservé simple (silhouette, ou rien), jamais par un visuel provisoire de mauvaise qualité qui donnerait une fausse impression de fini.

## 3. Système de couleurs — thèmes dynamiques

Décision structurante : **le site porte le même système de 13 thèmes que l'application Bobine** (`src/app/globals.css`), avec un étalonnage précis des contrastes, des surfaces multi-niveaux et des micro-reliefs.

- **Thème par défaut du site : Lavande** (fond `#eef2ff`, cartes blanches `#ffffff`, texte `#1e1b4b`, accents indigo/violet `#6366f1` / `#4f46e5`) — choisi pour sa clarté, son élégance et sa lisibilité immédiate.
- **12 autres thèmes sélectionnables** : Beige (couleurs officielles Bobine sans rouge), Sombre, Clair, Lune, Menthe, Automne, Hiver, Chili, Ciel, Orchidée, Taupe, Charbon.
- **Choix explicite et persistant** : le thème est sélectionné par l'utilisateur et persisté dans `localStorage` (`bobineweb-theme`).
- **Implémentation** : tokens CSS (`--bg-canvas`, `--bg-card`, `--bg-card-hover`, `--bg-surface-elevated`, `--text-heading`, `--text-main`, `--text-muted`, `--border-subtle`, `--accent-primary`, `--accent-primary-fg`, etc.).
- **Anti-flash** : script inline synchrone dans `<head>` appliquant l'attribut `data-theme` avant le premier rendu.
- **Sélecteur** : menu déroulant accessible avec pastilles de prévisualisation bicolores (fond + accent) pour chaque thème ([`src/components/ThemeSwitcher.tsx`](../src/components/ThemeSwitcher.tsx)).

## 4. Typographie

**Pile système** (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) : zéro poids de chargement, rendu natif sur chaque appareil, contrastes WCAG AA validés.

## 5. Logo & Mascotte

- **Logo** (`public/logo-bobine.png`, wordmark complet ; `public/logo-bobine-icon.png`, pictogramme seul).
- **Icône du site / Favicon** : `public/Bobine_icon.png` et `src/app/icon.png` (mascotte hamster endormi dans le B en pellicule).
- **Rôle de la mascotte** : humaniser le produit aux points clés (accueil, documentation, 404, soutenir).

## 6. Emplacements prévus pour les futurs visuels mascotte

- **Page d'accueil** — illustration hero à côté ou sous le pitch principal.
- **Page 404 / contenu manquant** — mascotte endormie (« rien à voir ici, il dort »).
- **Page Soutenir** — visuel chaleureux accompagnant les liens de don et contribution.
- **Tutoriel d'installation** — jalons visuels dans les étapes clés.

## 7. Architecture de Layout & Composants UI

- **Structure de la fenêtre (Viewport)** :
  - Viewport verrouillé en pleine hauteur (`height: 100dvh; overflow: hidden`).
  - **Header fixe** en haut (`flex-shrink: 0`, hauteur généreuse symétrique ~5.5rem).
  - **Footer fixe** en bas (`flex-shrink: 0`, hauteur généreuse symétrique ~5.5rem).
  - **Zone centrale (`<main>`)** : seule zone défilable (`flex: 1`, `overflow-y: auto`, `scrollbar-width: thin`).
  - **Optimisation "sans scroll"** : calibrage des densités pour faire tenir le contenu des pages principales directement dans l'écran.
- **Règle éditoriale stricte** : Zéro emoji dans toute l'interface et les contenus textuels (remplacés par des icônes SVG vectorielles ou de la typographie claire).
- **Composants d'immersion et de comparaison** :
  - **Scène 3D Studio RPM** ([`src/components/three/StudioRPMScene.tsx`](../src/components/three/StudioRPMScene.tsx)) : Grille de 8 vélos stationnaires face à l'écran de projection et au boîtier Dell Wyse 5070.
  - **Onglets Profilés** ([`src/components/ProfileTabs.tsx`](../src/components/ProfileTabs.tsx)) : 3 angles éditoriaux sans jargon (*Gérants de salle*, *Adhérents & Coachs*, *Open Source & Souveraineté*).
  - **Tableau Comparatif** ([`src/components/ComparisonTable.tsx`](../src/components/ComparisonTable.tsx)) : Bobine face aux régies fermées et au bricolage.
  - **Schéma Matériel & Terminal Linux** ([`src/components/HardwareDiagram.tsx`](../src/components/HardwareDiagram.tsx)) : Câblage en 3 câbles et console d'installation interactive.
- **Boutons** : `.btn-primary` (accent plein avec halo et flèche), `.btn-secondary` (carte élégante avec icône).
- **Cartes** : `.card-interactive` avec fond de surface distinct, bordure subtile, et micro-élévation au survol.

## 8. Optimisations Graphiques & Performance WebGL (0% GPU au repos)

- **Rendu à la demande (`frameloop="demand"`)** : Arrêt complet de la boucle de calcul quand la caméra est statique (0 FPS / 0% GPU). Rendu uniquement lors d'une interaction utilisateur (glissement de souris, zoom).
- **Mise en cache des ombres (`ContactShadows frames={1}`)** : Calcul unique de la texture d'ombre au montage, sans recalcul par image.
- **Mise en veille hors champ (`IntersectionObserver`)** : Démontage/pause automatique du canvas WebGL lorsque la section n'est plus visible dans la fenêtre.
- **Résolution native (`dpr={1}`) et profil `low-power`** : Évite toute surconsommation sur les écrans haute densité (Retina/4K).

## 9. Référencement & Découverte IA (SEO / GEO)

- **Fichiers pour agents et moteurs IA** : [`public/llms.txt`](../public/llms.txt) (résumé structuré) et [`public/llms-full.txt`](../public/llms-full.txt) (corpus technique complet).
- **Manifeste PWA** : [`src/app/manifest.ts`](../src/app/manifest.ts) générant `/manifest.webmanifest`.
- **Données structurées Schema.org** : [`src/components/JsonLd.tsx`](../src/components/JsonLd.tsx) (`SoftwareApplication`, `Organization`, `WebSite`).
- **Sitemap dynamique & Robots.txt** : 34 routes indexées avec métadonnées multilingues et directives pour les robots d'indexation IA (GPTBot, ClaudeBot, PerplexityBot).

## 10. Accessibilité

- Contrastes WCAG AA validés sur l'ensemble des 13 thèmes.
- `:focus-visible` avec `--border-focus` sur les éléments interactifs.
- Navigation au clavier fluide sur les onglets et les modèles 3D.

