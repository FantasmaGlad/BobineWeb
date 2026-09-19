# CDC — Sélecteur multi-plateformes du Hub Matériel (`/materiel`)

Statut : IMPLÉMENTÉ — 2026-09-17, mis à jour le 2026-09-19. AliExpress n'est plus un placeholder : la page
affiche un vrai catalogue (voir [`cahier-des-charges-aliexpress-affiliate.md`](cahier-des-charges-aliexpress-affiliate.md)).
Les sections 7, 8 et 10 ci-dessous sont conservées comme historique et signalées comme dépassées.

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
- `/[locale]/materiel/aliexpress` → catalogue AliExpress réel (Linux, Windows, Android ; macOS redirigé vers
  Windows et Linux), habillé avec la palette de marque AliExpress.
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

- **Amazon** (mis à jour le 2026-09-19) : fond blanc, textes `#0F1111` / `#565959`, bordures et accents en gris
  (`#ADB1B8`, `#D5D9D9`), prix en rouge `#B12704`. Aplats uniquement, aucun dégradé.
- **AliExpress** (mis à jour le 2026-09-19) : fond blanc, gris neutres, rouge `#E62E04` réservé à l'onglet actif,
  au bouton d'achat, aux prix et à la bordure de la fiche. Aplats uniquement, aucun dégradé.

## 7. Page AliExpress (DÉPASSÉ : squelette initial)

Aperçu structurel (pas un simple texte) : onglets de catégorie et de gamme visibles mais inertes
(non cliquables), carte produit en squelette avec effet "shimmer" reprenant exactement la mise en
page Amazon, message "En construction" superposé en overlay. Objectif : montrer où le catalogue
apparaîtra sans jamais afficher de faux produit ni de fausse promesse de date.

## 8. Hors périmètre de cette itération (DÉPASSÉ : le panier est désormais commun aux deux plateformes)

- Pas de vrai catalogue AliExpress ni de recherche produit sur cette plateforme.
- Pas de panier partagé entre plateformes (le panier "Mon Pack" reste scopé Amazon).
- Pas de bascule automatique de langue/devise liée à la plateforme.

## 9. Stabilisation de la mise en page de la fiche produit (post-lancement)

Retours utilisateur après mise en production : la hauteur et la position des éléments de la
fiche produit variaient trop d'une gamme/OS à l'autre (titres de longueurs différentes, nombre
variable de marques alternatives), donnant une impression de mise en page instable au changement
de gamme. Corrections apportées (toutes dans `HardwareBundleTabs.tsx` / `globals.css`) :

- **Ligne titre + badges** (`.hw-tier-specs-row`) : reste sur une seule ligne sur desktop quelle
  que soit la longueur du titre (troncature `ellipsis`), au lieu de se replier sur 1 ou 2 lignes
  selon le produit. Sur mobile, retour au comportement libre (titre complet, retour à la ligne).
- **Hauteur minimale de la fiche** : `calc(100vh - 13rem)` pour les OS avec le sélecteur Mini
  PC/PC Portable, `calc(100vh - 16.5rem)` pour Android (qui n'a qu'une seule forme de matériel,
  donc pas ce sélecteur) — évite un vide disproportionné en bas de fiche pour Android par rapport
  aux autres OS.
- **"Autres marques à considérer"** : défilement horizontal avec flèche (`.hw-alt-units__row`)
  au lieu d'un empilement vertical, pour que la fiche ne change jamais de hauteur selon qu'une
  gamme propose 1 ou 2 marques alternatives.
- **Badges de gamme retirés** (ex : "Cockpit Studio", "Pack Studio Mobile", "Haut de Gamme") :
  jugés redondants avec le nom de la gamme (Essentiel/Recommandé/Pro/Premium) lui-même.
- **Sous-titre et badge "Usage type" retirés** de l'en-tête de chaque forme de matériel : jugés
  redondants une fois le produit affiché (l'utilisateur voit déjà quelle machine est proposée).

## 10. Prochaines étapes (DÉPASSÉ : partenariat AliExpress signé, catalogue livré)

- Signer un vrai partenariat d'affiliation AliExpress puis construire son catalogue réel
  (mêmes exigences de vérification ASIN/prix/image que pour Amazon).
- Étendre le sélecteur à d'autres plateformes si de nouveaux partenariats se présentent
  (structure de route déjà prête à être dupliquée : `/materiel/<plateforme>`).
- Réévaluer si une bascule automatique de langue/devise par plateforme devient pertinente une
  fois AliExpress réellement actif (hors périmètre pour l'instant, cf. section 8).

## 11. Mise à jour du 2026-09-19 : hauteurs verrouillées et fiche adaptée à l'écran

Remplace les règles de la section 9 sur la hauteur minimale de la fiche : chaque bloc (titre, résumé, produit
principal, alternatives, accessoires) a une hauteur fixe, les textes trop longs défilent sur une ligne
(`MarqueeText`), le sélecteur de forme est toujours affiché (formes absentes grisées) et la fiche se resserre
sous 880 px puis 760 px de hauteur d'écran pour tenir dans la fenêtre malgré le bandeau défilant du site.
