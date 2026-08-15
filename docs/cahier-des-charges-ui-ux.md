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

Décision structurante : **le site porte le même système de 13 thèmes que l'application Bobine** (`frontend/src/app/globals.css`), pas une palette simplifiée propre au site. Cohérence totale entre le produit et sa vitrine : quelqu'un qui a choisi un thème dans l'app retrouve la même ambiance colorée sur le site.

- **Thème par défaut du site : Beige** (fond `#ede8d0`, texte/accent `#372528`) — différent du défaut sombre de l'application elle-même, choisi spécifiquement pour la vitrine (plus chaleureux, cohérent avec la direction artistique du §2).
- **12 autres thèmes sélectionnables** : Sombre (le défaut de l'app, renommé ici pour être sélectionnable explicitement), Clair, Lune, Menthe, Automne, Hiver, Chili, Ciel, Orchidée, Taupe, Charbon, Lavande — valeurs strictement identiques à celles de l'app (mêmes hex), pas de réinterprétation.
- **Choix explicite, pas `prefers-color-scheme`** : le thème est un réglage que la personne choisit (sélecteur dans le header) et qui persiste (`localStorage`), pas la préférence système du navigateur — même logique que l'application, qui traite déjà ce choix comme un réglage persisté plutôt qu'une préférence OS.
- **Implémentation** : tokens CSS `--bg-main`, `--bg-surface`, `--bg-surface-elevated`, `--text-main`, `--text-muted`, `--text-dim`, `--border-color`, `--border-focus`, `--accent-primary`, `--accent-primary-fg`, `--logo-filter` par thème (`:root[data-theme="…"]`, `src/app/globals.css`). Le logo (pictogramme noir sur fond transparent) s'inverse automatiquement sur fond sombre via `--logo-filter`, comme dans l'app.
- **Anti-flash** : un script inline dans `<head>` (`src/app/[locale]/layout.tsx`) applique le thème stocké avant le premier rendu, pour éviter un flash du thème par défaut suivi d'un changement brusque.
- **Sélecteur** : `<select>` natif dans le header (`ThemeSwitcher`), à côté du sélecteur de langue — accessible clavier/lecteur d'écran nativement, pas de composant custom lourd.

## 4. Typographie

**Pile système** (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`) — déjà en place, confirmée : zéro poids de chargement, rendu natif sur chaque appareil. La personnalité de marque vient de la mascotte et du système de thèmes, pas d'une police custom. À reconsidérer seulement si la direction artistique évolue nettement (ex. si la mascotte s'accompagne d'un lettrage/logo type qui appelle une police d'accompagnement).

## 5. Logo & mascotte

- **Logo actuel** (`public/logo-bobine.png`, wordmark complet ; `public/logo-bobine-icon.png`, pictogramme seul) confirmé suffisant tel quel, aucune retouche prévue.
- **Rôle de la mascotte** : au-delà du logo, le hamster doit apparaître à des endroits choisis pour installer un ton chaleureux sans nuire à l'épure générale — pas partout, pas en fond décoratif permanent.

## 6. Emplacements prévus pour les futurs visuels mascotte

Liste concrète à remplir une fois les illustrations produites — chaque emplacement est fonctionnel dès maintenant (texte seul ou espace réservé), prêt à recevoir le visuel sans changement de structure :

- **Page d'accueil** — un emplacement hero à côté ou sous le pitch principal (`src/app/[locale]/page.tsx`), pour une illustration ou une courte animation de la mascotte.
- **Page 404 / contenu manquant** — la mascotte endormie se prête bien à un « rien à voir ici, il dort » plutôt qu'une page d'erreur générique.
- **Page Soutenir** — un petit visuel à côté de l'appel au don, plus chaleureux qu'un simple bouton.
- **Favicon/icône animée** — non prioritaire, à évaluer une fois les autres emplacements en place.
- **Étapes clés du tutoriel d'installation** — une petite occurrence de la mascotte aux moments charnières (début, fin) du guide pas-à-pas, sans alourdir les captures d'écran techniques elles-mêmes.

## 7. Composants UI (état actuel)

- **Boutons** (`.button`) : fond `--accent-primary`, texte `--accent-primary-fg`, un seul style plein pour l'action principale, variante « outline » (fond transparent, bordure `--border`) pour l'action secondaire.
- **Cartes** (fonctionnalités, documentation, blog) : bordure `--border`, coin arrondi `0.75rem`, pas d'ombre — cohérent avec la platitude épurée plutôt qu'un style « SaaS » à ombres portées.
- **Header** : logo + nav horizontale + sélecteurs (thème, langue) groupés à droite, une seule ligne qui wrap en mobile.
- **Footer** : tagline + liens légaux/GitHub, sobre, texte `--text-muted`.
- **Corps de blog** (`.release-body`) : rendu Markdown (react-markdown + remark-gfm) des releases GitHub, styles minimaux (code, listes, liens en `--accent-primary`).

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
