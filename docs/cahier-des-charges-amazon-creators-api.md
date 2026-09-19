# CDC — Prix Amazon en direct via l'API Creators (À FAIRE PLUS TARD)

Statut : EN ATTENTE — 2026-09-19. Rien n'est implémenté. Ce document rassemble ce qui a été établi
pour reprendre le chantier sans repartir de zéro. Les prix Amazon restent pour l'instant
« constatés » à la main (`PRICE_CHECKED_AT` dans `src/content/hardware.ts`).

## 1. Objectif

Afficher sur `/materiel/amazon` des prix rafraîchis en direct, comme sur AliExpress
(voir [`cahier-des-charges-aliexpress-affiliate.md`](cahier-des-charges-aliexpress-affiliate.md)), et
retirer la mention « constaté le » pour les produits rafraîchis (champ `HardwareItem.isLive`, déjà géré
par l'interface).

## 2. Ce qui bloque aujourd'hui

1. **Mauvais type d'identifiants.** Les clés `amzn1.application-oa2-client...` sont des identifiants
   Login with Amazon. Testé le 2026-09-19 : le jeton est refusé avec `invalid_scope` pour le scope
   `creatorsapi::default`, sur les trois points d'entrée 3.1, 3.2 et 3.3. Il faut un identifiant
   **Creators API** créé dans Associates Central (rubrique Creators API).
2. **Éligibilité.** La documentation Amazon indique qu'il faut au moins 10 ventes qualifiantes sur
   les 30 derniers jours pour accéder à l'API. Le compte est récent : à vérifier lors de la création
   de l'identifiant.
3. Les clés d'accès AWS de l'ancienne PA-API 5.0 ne fonctionnent pas (PA-API est retirée depuis mai 2026).

## 3. Ce qu'il faut fournir

| Élément | Où le trouver | Variable d'environnement (Vercel + `.env.local`) |
|---|---|---|
| Credential ID | Associates Central, Creators API | `AMAZON_CREATORS_CREDENTIAL_ID` |
| Credential Secret | idem (type « Sensitive » dans Vercel) | `AMAZON_CREATORS_CREDENTIAL_SECRET` |
| Version des identifiants (2.1, 2.2, 2.3, 3.1, 3.2, 3.3) | idem, affichée avec les identifiants | `AMAZON_CREATORS_VERSION` |
| Tag partenaire | `fantasmaglad-21` (déjà connu, `AMAZON_STORE_ID`) | inutile |

Les variables `AMAZON_CREATORS_CLIENT_ID` et `AMAZON_CREATORS_CLIENT_SECRET` déjà ajoutées dans Vercel
correspondent aux clés Login with Amazon inutilisables ; elles peuvent être supprimées.

## 4. Ce qui est connu de l'API (à revalider sur la doc officielle au moment de coder)

Source : documentation Amazon (affiliate-program.amazon.com/creatorsapi/docs) et bibliothèque cliente
communautaire `python-amazon-paapi`.

- **Hôte de l'API** : `https://creatorsapi.amazon`, opération `POST /catalog/v1/getItems`.
- **Marché** : en-tête `x-marketplace: www.amazon.fr` (France).
- **Corps** : `itemIds` (10 ASIN maximum par appel), `partnerTag`, `resources`
  (par exemple `itemInfo.title`, `offersV2.listings.price`, `images.primary.large`).
- **Jeton OAuth 2.0** (`client_credentials`), durée de vie 3600 s environ, à mettre en cache :
  - familles 2.x (Cognito, corps `application/x-www-form-urlencoded`, scope `creatorsapi/default`,
    en-tête `Authorization: Bearer <jeton>, Version <version>`) :
    2.1 `creatorsapi.auth.us-east-1.amazoncognito.com`, 2.2 `creatorsapi.auth.eu-south-2.amazoncognito.com`,
    2.3 `creatorsapi.auth.us-west-2.amazoncognito.com` (chemin `/oauth2/token`) ;
  - familles 3.x (Login with Amazon, corps JSON, scope `creatorsapi::default`,
    en-tête `Authorization: Bearer <jeton>`) :
    3.1 `api.amazon.com`, 3.2 `api.amazon.co.uk`, 3.3 `api.amazon.co.jp` (chemin `/auth/o2/token`).
  - Pour amazon.fr, la version attendue est probablement celle de la région Europe (2.2 ou 3.2).

## 5. Plan d'implémentation (calqué sur AliExpress)

1. `src/lib/amazon/client.ts` (`import "server-only"`) : obtention et cache du jeton, appel `getItems`
   par lots de 10 ASIN, erreurs typées.
2. `src/lib/amazon/catalog.ts` : liste des ASIN de `HARDWARE_BUNDLES` et `STANDALONE_ACCESSORIES`,
   rafraîchissement via `unstable_cache` (6 h), fusion prix / disponibilité / image, repli produit par
   produit sur le prix statique, `isLive: true` pour les produits rafraîchis.
3. `src/app/[locale]/materiel/amazon/page.tsx` : charger le catalogue rafraîchi et le passer à
   `HardwareBundleTabs` (`bundles`, `checkedAt`), comme la page AliExpress.
4. Cas à gérer : produit indisponible ou sans offre (masquer le prix, garder le lien), prix qui varie
   fortement, respect des conditions Amazon sur l'affichage des prix (mention d'horodatage si la donnée
   a plus de quelques heures).
5. Mettre à jour les règles du projet (section « Prix Amazon en direct ») et retirer ce statut « en attente ».

## 6. Repli si l'API reste inaccessible

Conserver les prix constatés à la main (`PRICE_CHECKED_AT`) et les revérifier périodiquement.
Aucun contournement (extraction de pages Amazon) : interdit par les conditions du programme.
