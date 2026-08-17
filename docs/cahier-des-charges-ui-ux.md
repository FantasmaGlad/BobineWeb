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
- **Boutons** : `.btn-primary` (accent plein avec halo et flèche), `.btn-secondary` (carte élégante avec icône).
- **Cartes** : `.card-interactive` avec fond de surface distinct, bordure subtile, et micro-élévation au survol.
- **Badges** : `.badge` discrets pour les tags de catégorie, tags de licence et de fonctionnalités.

## 8. Accessibilité

- Contrastes WCAG AA à vérifier pour chaque thème lors de l'ajout de nouveaux composants (les valeurs reprises de l'app ont déjà été calibrées pour ça côté application — cf. commentaires de `frontend/src/app/globals.css` — mais un composant nouveau propre au site doit être revérifié).
- `:focus-visible` avec `--border-focus` sur les éléments interactifs (déjà en place sur le sélecteur de thème, à généraliser aux liens/boutons au fil des pages).
- Sélecteurs natifs (`<select>`) plutôt que des dropdowns custom, pour l'accessibilité clavier/lecteur d'écran gratuite.

## 9. Motion

Transition douce (`0.2s ease`) sur fond/texte lors d'un changement de thème, pas d'autre animation systématique pour l'instant. Les animations de la mascotte (§6) définiront leurs propres règles une fois produites — probablement discrètes et déclenchées (hover, apparition), pas en boucle permanente.

## 10. Prochaines étapes

1. Construire les pages restantes (fonctionnalités, documentation, blog, etc. — déjà scaffoldées avec un contenu minimal, cf. cahier des charges technique §16) en respectant ce système.
2. Vérifier les contrastes des 13 thèmes sur les nouveaux composants au fur et à mesure.
3. Une fois les visuels mascotte produits, les intégrer aux emplacements du §6 sans changement de structure.
