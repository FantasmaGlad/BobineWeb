# CDC — Sélecteur multi-plateformes du Hub Matériel (`/materiel`)

Statut : IMPLÉMENTÉ — 2026-09-17, affiné le même jour suite aux retours utilisateur (section 3/4/6
mises à jour pour refléter l'état final, voir historique git). AliExpress reste un placeholder
"En construction" tant qu'aucun partenariat n'est signé.

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

**Desktop** : rail **sticky** (`position: sticky`, largeur 4rem) collé au bord gauche du shell de
page (`PlatformThemeShell`), sous le header. Ne recouvre jamais le contenu, seulement décalé.

**Mobile** (< 900px) : suite aux retours utilisateur, le rail est devenu un **overlay flottant**
(`position: fixed`, colonne verticale, centré verticalement contre le bord droit de l'écran,
`right: 0.75rem; top: 50%`), sans fond ni bordure — juste les deux icônes flottantes. Ce choix
évite tout bandeau de fond qui se désaccorderait visuellement de la page en dessous, et laisse le
contenu de la page utiliser toute la largeur.

## 4. Icônes & animation

- Les **vraies icônes officielles** de chaque application (telles que publiées sur le Google Play
  Store) sont utilisées, récupérées et recadrées en 192×192 (`amazon-icon-mark.webp`,
  `aliexpress-icon-mark.webp`) — remplace la première itération en SVG recréé à la main, jugée
  insuffisamment reconnaissable par l'utilisateur.
- Coins arrondis à 22% (`border-radius: 22%`) pour un rendu "icône Android" cohérent avec le
  style app-icon des deux images sources.
- Aucun fond, cercle ou ombre derrière l'icône : uniquement l'icône elle-même, toujours pleinement
  opaque (pas d'assombrissement à l'état inactif — testé et jugé peu lisible).
- Flottement continu léger (`translateY` oscillant, ±6px, ~3.2s, déphasé entre les deux icônes)
  pour l'effet « addictif » demandé, désactivé sous `prefers-reduced-motion: reduce`.
- État actif/hover : léger agrandissement (`scale`). État clic : compression brève (`scale(0.88)`).
  Nom de la plateforme retiré de l'affichage visuel (icône seule) ; reste accessible via
  `aria-label`/`title` sur le lien.

## 5. Effets de clic type confetti

Utilitaire autonome `src/lib/confettiBurst.ts` (canvas, particules rectangulaires colorées,
zéro emoji, zéro librairie externe, nettoyage automatique, respect de
`prefers-reduced-motion`). Déclenché à deux endroits précis, pas systématiquement sur tous les
boutons du site :
1. Clic sur une icône du bandeau plateforme (couleurs de la marque ciblée).
2. Clic « Ajouter au pack » réussi (`AddToCartButton`), déjà présent sur toute la page
   matériel — moment le plus pertinent pour la récompense visuelle.

## 6. Palettes de marque

Un composant client `PlatformThemeShell` lit le pathname et applique `platform-theme-amazon` /
`platform-theme-aliexpress` sur le **shell de page entier** (bandeau + contenu), pas seulement sur
le conteneur interne — première version avait le thème sur le conteneur interne uniquement,
laissant une bande de fond au thème global (clair/sombre) visible derrière le bandeau plateforme
et le sélecteur d'OS ; corrigé en remontant le thème au niveau du shell. Ces classes redéfinissent
localement les variables CSS déjà consommées par tous les composants existants (`--bg-canvas`,
`--bg-card`, `--text-muted`, `--accent-primary`, etc.). Aucune modification du thème global du
site (les 17 thèmes restent intacts partout ailleurs).

- **Amazon** : palette exacte fournie par l'utilisateur — `#ff9900` (accent), `#333e48` (encre/
  texte), `#ffffff` (fond). Boutons primaires en léger dégradé orange pour un rendu plus fidèle au
  style Amazon réel (`.platform-theme-amazon .btn-primary`), sans toucher aux classes globales.
- **AliExpress** : fond pêche très clair, encre anthracite, texte atténué brique sombre, accent
  rouge-orangé (`#FF4747`) avec texte bouton blanc.

## 7. Page AliExpress

Aperçu structurel (pas un simple texte) : onglets de catégorie et de gamme visibles mais inertes
(non cliquables), carte produit en squelette avec effet "shimmer" reprenant exactement la mise en
page Amazon, message "En construction" superposé en overlay. Objectif : montrer où le catalogue
apparaîtra sans jamais afficher de faux produit ni de fausse promesse de date.

## 8. Hors périmètre de cette itération

- Pas de vrai catalogue AliExpress ni de recherche produit sur cette plateforme.
- Pas de panier partagé entre plateformes (le panier "Mon Pack" reste scopé Amazon).
- Pas de bascule automatique de langue/devise liée à la plateforme.
