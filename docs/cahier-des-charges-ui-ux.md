# Cahier des charges — UI/UX du site BobineWeb

Statut : validé à l'issue d'un entretien de cadrage. Le système de thèmes et le sélecteur qu'il décrit sont déjà implémentés (voir §3) ; ce document sert de référence pour la suite (pages restantes, visuels mascotte).

## 1. Contexte et objectif

Ce document complète le [cahier des charges général](cahier-des-charges.md) (périmètre, sitemap, stack) sur le volet strictement visuel et interaction : quelle direction artistique, quel système de couleurs, quelle typographie, quels composants — pour que chaque nouvelle page construite reste cohérente sans re-décider à chaque fois.

## 2. Direction artistique

Deux orientations combinées, choisies explicitement plutôt que l'une ou l'autre :

- **Épuré et minimaliste** comme base : beaucoup de blanc/espace, typographie forte, peu d'éléments décoratifs. Un gérant de salle qui découvre le produit doit comprendre en quelques secondes ce qu'est Bobine, sans être distrait.
- **Chaleureux, mascotte mise en avant** en complément : le hamster endormi du logo (`Assets/Images/logo_bobine.png`) devient un personnage récurrent du site — pas juste un pictogramme dans le coin du logo, mais un élément qui apparaît à des endroits choisis pour humaniser le produit (cf. §7).

**Les illustrations et animations définitives de la mascotte seront produites plus tard** — ce document prévoit leurs emplacements et leur rôle, pas leur rendu final. En attendant, ces emplacements restent vides ou occupés par un espace réservé simple (silhouette, ou rien), jamais par un visuel provisoire de mauvaise qualité qui donnerait une fausse impression de fini.

## 3. Système de couleurs — thèmes dynamiques (18 Thèmes classés)

Décision structurante : **le site porte un système complet de 18 thèmes bicolores classés en deux collections distinctes** (`src/app/globals.css`, `src/lib/themes.ts`) :

- **Collection Claire (8 thèmes épurés & lumineux)** :
  - `clair` (Thème par défaut : Minimalisme pur, albâtre `#f8fafc` & ardoise `#0f172a`)
  - `beige` (Sable chaud & moka naturel)
  - `ciel` (Azur aérien & bleu océan)
  - `menthe` (Vert botanique & émeraude)
  - `lavande` (Améthyste & indigo doux)
  - `aurore` (Ambre doré & pêche)
  - `glacier` (Givre polaire & cyan doux)
  - `rose` (Quartz & pivoine)
- **Collection Sombre (10 variations riches & contrastées)** :
  - `sombre` (Studio moderne & titane)
  - `charbon` (OLED noir pur & monochrome)
  - `lune` (Indigo nuit & violet cosmique)
  - `hiver` (Glacier boréal & cyan néon)
  - `chili` (Crimson rubis & rouge vif)
  - `automne` (Ambre toasté & cuir espresso)
  - `orchidee` (Cyberpunk magenta & néo-violet)
  - `taupe` (Espresso moka & bronze chaud)
  - `foret` (Vert sapin & émeraude nocturne)
  - `abysse` (Océan abyssal & bleu électrique)
- **Sélecteur de Thème Segmenté** ([`src/components/ThemeSwitcher.tsx`](../src/components/ThemeSwitcher.tsx)) :
  - Deux onglets dédiés : **☀️ Thèmes Clairs (8)** et **🌙 Thèmes Sombres (10)**.
  - Grille tactile de cartes avec pastilles bicolores (fond + accent), descriptions d'ambiance et coche de sélection active.
  - Persistance dans `localStorage` (`bobineweb-theme`) et synchronisation synchrone multi-onglets via `useSyncExternalStore`.

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

## 7. Architecture de Layout & Ergonomie Tablette / Mobile

- **Structure de la fenêtre (Viewport)** :
  - **Desktop** : Header et Footer fixes symétriques avec zone centrale défilable sans scroll parasite.
  - **Tablette & Mobile (Breakpoint 1024px)** :
    - Menu compact avec bouton hamburger tactile ($\ge 44\text{px}$).
    - Panneau latéral tactile [`MobileDrawer.tsx`](../src/components/MobileDrawer.tsx) avec fond flouté (`backdrop-filter: blur(10px)`), cibles tactiles $\ge 48\text{px}$, accès direct aux sous-chapitres de documentation et contrôles de personnalisation intégrés.
    - Navigation de documentation contextuelle [`DocsMobileNav.tsx`](../src/components/DocsMobileNav.tsx) : barre collante avec sélecteur de chapitre déroulant et recherche plein écran.
    - Comparateur [`ComparisonTable.tsx`](../src/components/ComparisonTable.tsx) adaptatif : bascule automatique en cartes comparatives sur mobile pour une lisibilité totale sans zoom.
- **Règle éditoriale stricte** : Zéro emoji dans toute l'interface et les contenus textuels (remplacés par des icônes SVG vectorielles ou de la typographie claire).
- **Export & Sauvegarde** : Bouton d'export PDF vectoriel (`window.print()` avec styles `@media print` optimisés) et notification hors-ligne auto-dissimulée à 5s.

## 8. Optimisations Graphiques & Performance WebGL (0% GPU au repos)

- **Rendu à la demande (`frameloop="demand"`)** : Arrêt complet de la boucle de calcul quand la caméra est statique (0 FPS / 0% GPU). Rendu uniquement lors d'une interaction utilisateur (glissement de souris, zoom).
- **Mise en cache des ombres** : Pas de recalcul d'ombres en temps réel au repos.
- **Mise en veille hors champ (`IntersectionObserver`)** : Démontage/pause automatique du canvas WebGL lorsque la section n'est plus visible dans la fenêtre.
- **Résolution native (`dpr={1}`) et profil `low-power`** : Évite toute surconsommation sur les écrans haute densité (Retina/4K).

## 9. Référencement & Découverte IA (SEO / GEO)

- **Fichiers pour agents et moteurs IA** : [`public/llms.txt`](../public/llms.txt) (résumé structuré pour Perplexity, ChatGPT, Claude, Gemini).
- **Manifeste PWA** : [`src/app/manifest.ts`](../src/app/manifest.ts) générant `/manifest.webmanifest`.
- **Données structurées Schema.org** : [`src/components/JsonLd.tsx`](../src/components/JsonLd.tsx) (`SoftwareApplication`, `Organization`, `WebSite`).
- **Sitemap dynamique & Robots.txt** : 39 routes indexées avec métadonnées multilingues et directives pour tous les robots d'indexation IA.

## 10. Accessibilité

- Contrastes WCAG AA validés sur l'ensemble des 18 thèmes.
- Cibles tactiles $\ge 48\text{px}$ sur l'ensemble des boutons et liens mobiles.
- `:focus-visible` avec `--border-focus` sur les éléments interactifs.
- Navigation au clavier fluide sur les onglets et les modèles 3D.

