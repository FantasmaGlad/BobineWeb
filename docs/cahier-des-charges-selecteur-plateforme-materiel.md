# CDC — Sélecteur multi-plateformes du Hub Matériel (`/materiel`)

Statut : IMPLÉMENTÉ — 2026-09-17. Routes, bandeau, thèmes de marque, animations et effets de
clic sont en production. AliExpress reste un placeholder "En construction" tant qu'aucun
partenariat n'est signé.

## 1. Contexte et objectif

Le Hub Matériel (`/materiel`) ne propose aujourd'hui que des liens d'affiliation Amazon.
L'objectif est de préparer l'arrivée d'autres plateformes marchandes (AliExpress en premier,
d'autres ensuite) sans dupliquer le catalogue ni casser l'existant. Chaque plateforme devient
une route dédiée, avec son propre habillage de marque, sélectionnable depuis un bandeau
persistant.

## 2. Architecture des routes

- `/[locale]/materiel` → redirection permanente (308, `permanentRedirect`) vers
  `/[locale]/materiel/amazon`. Conserve l'autorité SEO de l'URL historique.
- `/[locale]/materiel/amazon` → contenu actuel (bundles par OS, panier, chatbot Baamix),
  inchangé fonctionnellement, seulement ré-habillé avec la palette de marque Amazon.
- `/[locale]/materiel/aliexpress` → page vide "En construction", repère d'arborescence pour
  la suite, réhabillée avec la palette de marque AliExpress.
- Un layout commun `src/app/[locale]/materiel/layout.tsx` héberge le bandeau de sélection et
  encadre les deux pages enfants.
- `sitemap.ts` référence désormais `/materiel/amazon` (remplace `/materiel`, qui redirige) et
  `/materiel/aliexpress` avec une priorité et une fréquence de crawl plus faibles (page vide).

## 3. Bandeau de sélection de plateforme

**Réponse à « qu'en penses-tu ? »** : un vrai bandeau `position: fixed` plein écran aurait
empiété sur la barre panier flottante déjà présente en bas d'écran (`HardwareCartBar`) et sur
le header sticky en haut. Le compromis retenu : un rail **sticky** (`position: sticky`) collé
sous le header, qui suit le défilement sans jamais se superposer aux éléments flottants
existants. Desktop : colonne verticale à gauche du contenu (largeur fixe ~104px). Le contenu
de la page (bundles, panier) n'est jamais recouvert, seulement décalé.

**Réponse à « comment transposer sur téléphone ? »** : sous 900px, le rail devient une barre
horizontale sticky, positionnée juste sous le header (au-dessus du contenu, jamais en bas —
le bas d'écran mobile est déjà occupé par la barre panier et la buybar tarifaire). Les deux
icônes passent en ligne avec libellé sous chacune, réutilisant le motif déjà validé sur ce
chantier pour le sélecteur d'OS (`hw-os-sidebar`, `order: -1` + `flex-wrap`).

## 4. Icônes & animation

- Deux nouvelles icônes vectorielles dédiées (`amazon-icon-mark.svg`, `aliexpress-icon-mark.svg`),
  format carré arrondi type icône d'application (et non le logo texte déjà utilisé ailleurs sur
  le site), recréées à la main en SVG filaire/plat — même convention que `amazon-logo.svg`
  existant, jamais un fichier de marque téléchargé tel quel.
- Flottement continu léger (`translateY` oscillant, ±6px, ~3.2s, déphasé entre les deux icônes)
  pour l'effet « addictif » demandé, désactivé sous `prefers-reduced-motion: reduce`.
- État actif : halo + léger agrandissement. État clic : compression brève (`scale(0.9)`).

## 5. Effets de clic type confetti

Utilitaire autonome `src/lib/confettiBurst.ts` (canvas, particules rectangulaires colorées,
zéro emoji, zéro librairie externe, nettoyage automatique, respect de
`prefers-reduced-motion`). Déclenché à deux endroits précis, pas systématiquement sur tous les
boutons du site :
1. Clic sur une icône du bandeau plateforme (couleurs de la marque ciblée).
2. Clic « Ajouter au pack » réussi (`AddToCartButton`), déjà présent sur toute la page
   matériel — moment le plus pertinent pour la récompense visuelle.

## 6. Palettes de marque

Chaque page plateforme applique une classe wrapper (`platform-theme-amazon` /
`platform-theme-aliexpress`) qui redéfinit localement les variables CSS déjà consommées par
tous les composants existants (`--bg-canvas`, `--bg-card`, `--text-muted`, `--accent-primary`,
etc.). Aucune modification du thème global du site (les 17 thèmes restent intacts partout
ailleurs) : l'habillage de marque est strictement local à la sous-arborescence `/materiel/*`.

- **Amazon** : fond beige/parchemin, encre marine officielle (`#131A22`), texte atténué brun-moka, accent orange Amazon (`#E47911`) avec texte
  bouton en encre sombre.
- **AliExpress** : fond pêche très clair, encre anthracite, texte atténué brique sombre, accent
  rouge-orangé (`#FF4747`) avec texte bouton blanc.

## 7. Page AliExpress

Placeholder minimal : bandeau de sélection actif sur "AliExpress", message "En construction"
sobre (typographie soignée, aucune icône emoji), aucun faux produit, aucune promesse de date.
Sert uniquement de repère d'arborescence pour la suite.

## 8. Hors périmètre de cette itération

- Pas de vrai catalogue AliExpress ni de recherche produit sur cette plateforme.
- Pas de panier partagé entre plateformes (le panier "Mon Pack" reste scopé Amazon).
- Pas de bascule automatique de langue/devise liée à la plateforme.
