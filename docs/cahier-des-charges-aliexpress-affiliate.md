# CDC — Intégration AliExpress Affiliate API (`/materiel/aliexpress`)

Statut : IMPLÉMENTÉ et en production — 2026-09-19 (Linux, Windows, Android ; macOS redirigé vers Windows et Linux
faute d'offre fiable). Le panier « Mon Pack » est commun avec Amazon, groupé par plateforme. Restent : mention légale
à jour (faite le 2026-09-19), suivi des commissions dans Portals, éventuelle demande de l'API Advanced.

## 1. Contexte et objectif

Une application AliExpress Affiliates API (app_key `547912`, catégorie « Affiliates API ») a été
créée et approuvée sur l'AliExpress Open Platform. Le groupe de permissions actif est
« Aliexpress Affiliates API (Default) » (API Standard pour éditeurs). Sont **inactifs** : l'API
Advanced (produits populaires, smart match) et l'API SKU Dimension.

Objectif : proposer sur `/materiel/aliexpress` une sélection matérielle réelle, avec produits,
images et prix issus de l'API, liens de suivi affilié générés par AliExpress, dans **la même
expérience UI/UX que la page Amazon** (onglets OS, formes, gammes, fiche produit, alternatives,
barre d'achat mobile), mais avec l'**identité visuelle officielle AliExpress** pour que les deux
plateformes soient immédiatement distinguables.

Contraintes du projet : zéro emoji (SVG filaires uniquement), jamais de faux produit,
`rel="nofollow sponsored noopener noreferrer" target="_blank"` sur tout lien marchand, toute
nouvelle route déclarée dans `src/app/sitemap.ts`, contenu FR/EN.

## 2. Ce que l'API Default permet (à confirmer dans la doc de la console)

Passerelle IOP, requêtes signées (HMAC-SHA256 sur les paramètres triés, secret côté serveur).

| Méthode | Usage dans Bobine |
|---|---|
| `aliexpress.affiliate.product.query` | Phase de sélection : trouver des candidats par mot-clé, catégorie, fourchette de prix. Usage éditorial/CLI, pas à chaque visite. |
| `aliexpress.affiliate.productdetail.get` | Rafraîchir prix, image, note, ventes, lien affilié des produits retenus (par lot d'IDs). |
| `aliexpress.affiliate.link.generate` | Transformer une URL produit en lien de suivi (`tracking_id` de Bobine). |
| `aliexpress.affiliate.category.get` | Référentiel de catégories pour affiner les recherches. |
| `aliexpress.affiliate.order.list` (si exposée) | Suivi interne des commissions, hors interface publique. |

Paramètres de localisation à fixer : `ship_to_country=FR`, `target_currency=EUR`,
`target_language=FR` (EN sur la locale anglaise).

Non disponible tant que l'API Advanced n'est pas activée : `hotproduct.query` et smart match. La
demande est faisable depuis la console (« Apply », avec l'email d'inscription Portals). Le CDC ne
doit **pas** en dépendre.

## 3. Prérequis à fournir avant de coder

1. **`tracking_id`** : `Bobine` (AliExpress Portals, équivalent du tag Amazon
   `fantasmaglad-21`). Sans lui, aucune commission.
2. **Variables d'environnement** (Vercel + `.env.local`, jamais dans le code ni dans `hardware`) :
   `ALIEXPRESS_APP_KEY`, `ALIEXPRESS_APP_SECRET`, `ALIEXPRESS_TRACKING_ID`. Les ajouter en
   commentaire dans `.env.example`, valeurs vides.
3. **Rotation du secret** : l'app secret a été collé en clair dans une conversation. Le régénérer
   dans la console avant la mise en production, puis ne le saisir que dans Vercel/`.env.local`.
4. **Callback URL** : `https://bobine.fit/api/aliexpress/callback` (route minimale, voir 5.4).
5. Relire les conditions du programme (durée de cache des prix autorisée, mentions obligatoires)
   avant de figer les durées de la section 5.3.

## 4. Modèle de données

Fichier source de vérité : `src/content/aliexpressHardware.ts`, **parallèle** à `hardware.ts`
(qui reste Amazon uniquement, ne jamais y mélanger les deux plateformes ; l'id d'un produit AliExpress est un product_id).

- Même structure : OS (Linux, Windows, macOS, Android) × formes (Mini PC, PC Portable, Tablette)
  × 4 gammes (Essentiel, Recommandé, Pro, Premium). Les textes éditoriaux (titres, résumés,
  cibles) sont réutilisés depuis les gammes Amazon pour rester cohérents.
- Le fichier ne contient **que des identifiants curatés** : `productId` AliExpress + rôle
  (unité principale / alternative / câble / kit clavier-souris…), plus un **instantané de
  secours** (titre, prix, image locale, date). Prix et lien affilié sont rafraîchis par l'API.
- Règle héritée : chaque gamme propose au moins 2 unités centrales (1 principale + 1
  alternative), chacune vérifiée individuellement.
- Type de référence : `AliProductRef { productId, role, fallback: { title, priceEur, imageUrl, checkedAt } }`.
- Images : l'URL renvoyée par l'API sert au rafraîchissement, mais une copie locale WebP
  (`/images/hardware/ali-*.webp`) est conservée pour l'instantané, comme pour Amazon.

### Curation (obligatoire, humaine)

`product.query` renvoie du volume, pas de la qualité. Un script CLI
`scripts/aliexpress-search.mjs` (hors bundle) liste des candidats par gamme avec note, ventes,
vendeur et prix ; le mainteneur valide chaque produit à la main (compatibilité Linux/Bobine,
ventilateur ou non, RAM/stockage réels, avis) avant de l'inscrire. Critères minimum proposés :
note vendeur/produit élevée, volume de ventes significatif, livraison vers la France, vendeur
officiel/boutique de marque lorsque c'est possible. Ne jamais indiquer « fanless » pour une
machine ventilée.

## 5. Architecture technique

### 5.1 Client API serveur

`src/lib/aliexpress/client.ts` : signature, appel `fetch`, gestion d'erreurs typée, timeout court.
`import "server-only"` : le secret ne doit jamais atteindre le bundle client.

### 5.2 Couche de données

`src/lib/aliexpress/catalog.ts` expose `getAliexpressCatalog(locale)` : lit les IDs curatés,
appelle `productdetail.get` par lots, fusionne avec l'instantané. Si l'API échoue ou si un
produit disparaît (retiré, hors stock, non livrable), le produit retombe sur l'instantané avec
la mention « prix constaté le JJ/MM » ; un produit absent des deux est masqué, jamais inventé.

### 5.3 Cache et quotas

Rendu serveur avec cache (`revalidate` ou `unstable_cache`, à choisir après lecture de
`node_modules/next/dist/docs/` conformément aux règles du projet) : rafraîchissement toutes les
6 à 24 h, jamais par visite, pour rester sous les quotas et garder une page rapide. Les liens
affiliés générés sont mis en cache avec le prix.

### 5.4 Routes

- `/[locale]/materiel/aliexpress` : page complète, en Server Component qui charge le catalogue
  puis le passe au composant d'affichage.
- `/api/aliexpress/callback` : GET minimal (lit `code`, répond 200, ne stocke rien) ; nécessaire
  pour la validation de la Callback URL. Le proxy exclut déjà `/api`.
- Aucun endpoint public ne relaie l'API brute (pas de proxy ouvert vers AliExpress).

### 5.5 Composants

Réutiliser au maximum `HardwareBundleTabs`, `HardwareAccessoriesGrid`, `HardwareCartBar` en les
rendant agnostiques de la plateforme (données injectées, libellés du bouton d'achat et logo
paramétrés) plutôt que de dupliquer 700 lignes. Le squelette `platform-skeleton` disparaît de
`aliexpress/page.tsx`.

## 6. UI/UX : identique à Amazon, habillage AliExpress

**Structure et comportements identiques** : onglets OS + formes, sélecteur de gamme, fiche
produit (image, titre, badges de specs, prix, bouton d'achat), « Autres marques à considérer »
en défilement horizontal, barre d'achat mobile, hauteurs et alignements stabilisés
(section 9 du CDC sélecteur), bandeau de plateformes inchangé, animations existantes
(ripple, confetti sur ajout).

**Bouton d'achat** : « Voir sur AliExpress » / « View on AliExpress », icône SVG filaire de
lien externe. Prix affiché « à partir de » ou « prix constaté le … » (jamais présenté comme
garanti, les prix AliExpress varient selon le pays, les coupons et le vendeur).

### Palette (classe `platform-theme-aliexpress`, à raffiner dans `globals.css`)

Le thème actuel (fond pêche) est conservé comme base ; les ajustements alignent le rendu sur
le site officiel (blanc, rouge-orangé, dégradé rouge vers orange sur les CTA).

| Rôle | Valeur proposée | Note |
|---|---|---|
| Accent primaire | `#E62E04` | rouge AliExpress officiel |
| Accent secondaire (dégradé CTA) | `#FF6A00` | dégradé `#E62E04` vers `#FF6A00` sur `.btn-primary` |
| Fond de page | `#FFF6F2` (existant) ou `#F5F5F5` | à trancher sur maquette |
| Cartes | `#FFFFFF` + bordure `#FFD9C7` | relief franc, conforme à la règle d'élévation |
| Titres / texte | `#191919` / `#2B2B2B` | encre sombre |
| `--text-muted` | `#8A3B1F` (existant, ratio > 6:1 sur fond clair) | jamais l'accent en texte courant |
| Texte sur bouton | `#FFFFFF`, gras 14px minimum | `#E62E04` donne ~4,4:1 : acceptable en texte gras large, sinon `#D42A00` (~5:1) |

Le prix reste en rouge accent, en gras, comme sur AliExpress. L'accent `#FF4747` actuel reste
utilisable pour les décorations et bordures mais pas pour du texte courant (contraste ~3,4:1).

## 7. SEO, légal et transparence

- Ajouter `/materiel/aliexpress` avec priorité/fréquence adaptées dans `staticRoutes`
  (déjà référencé ; revoir la priorité une fois la page réelle) et un schéma `ItemList`
  Schema.org comme la page Amazon (uniquement des produits réels).
- Mention d'affiliation : ajouter dans `/mentions-legales` la formule requise par le programme
  AliExpress Portals (texte exact à reprendre des conditions), sans l'afficher sur la page
  matériel (même règle que pour Amazon).
- Métadonnées de page : retirer « Bientôt / Coming soon ».
- Documentation du projet (affiliation) : faite (état réel et renvoi vers ce CDC, règle « jamais de faux produit » conservée).
- Baamix : à évaluer en phase 3 seulement (injecter le catalogue AliExpress dans
  `buildProjectKnowledge()` ou un module dédié, sans jamais coder de produits en dur).

## 8. Phases

1. **Fondations** : variables d'environnement, client signé, script de recherche, route callback,
   test de bout en bout sur un ID connu (`productdetail.get` + `link.generate`).
2. **Curation** : sélection humaine et vérification produit par produit ; création de
   `aliexpressHardware.ts` avec instantanés et images locales.
3. **UI** : généralisation des composants, thème AliExpress affiné, page réelle, états
   d'erreur/indisponible, FR/EN, sitemap, JSON-LD, mentions légales, documentation du projet.
4. **Plus tard** : panier « Mon Pack » AliExpress (aujourd'hui scopé Amazon, clé = ASIN, à
   généraliser en `platform:id`), demande API Advanced, suivi des commissions.

## 9. Hors périmètre

- Pas de panier commun Amazon + AliExpress (checkout séparés, plateformes distinctes).
- Pas de catalogue généré automatiquement sans validation humaine.
- Pas de bascule automatique de langue/devise liée à la plateforme.
- Pas d'affichage de « meilleur prix » comparatif entre Amazon et AliExpress.

## 10. Points ouverts

1. `tracking_id` : RÉSOLU, `Bobine` (défini par défaut dans Portals le 2026-09-19).
2. Durée de cache des prix autorisée par les conditions du programme.
3. Fond de page final : pêche existant ou gris clair `#F5F5F5` (à valider sur maquette).
4. Périmètre initial : RÉSOLU, **Windows uniquement** (Mini PC et PC Portable) pour valider
   mise en page, style et recherches. Linux, macOS et Android viennent après validation de
   Windows ; les onglets des OS non ouverts restent visibles mais inertes (« Bientôt »).
5. Faut-il demander dès maintenant l'API Advanced (produits populaires) pour la phase 4 ?

## 11. Critères de validation

- `npx tsc --noEmit` sans erreur, `npm run build` passe, aucun secret dans le dépôt ni dans le
  bundle client (vérifier par recherche dans `.next/static`).
- Page fonctionnelle même API coupée (instantanés) et sans faux produit.
- Tous les liens marchands portent le bon `tracking_id` et les attributs `rel`/`target`.
- Contrôles mobile par détection de coupure au caractère (cf. mémoire du projet), thème
  AliExpress lisible (contraste vérifié), animations désactivées sous `prefers-reduced-motion`.
