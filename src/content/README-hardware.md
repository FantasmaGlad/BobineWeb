# Catalogue matériel

`products.json` contient une fiche par ASIN Amazon. `products.ts` en expose les textes français/anglais et les liens affiliés, sans prix stocké. Les références dont la configuration historique était contradictoire demandent explicitement une vérification de variante. Les critères affichés sont des points à vérifier avant achat ; aucune fiche n’est une certification de l’appareil avec Bobine.

`bundles.json` contient les sélections par système, forme et gamme : ses listes référencent les identifiants des produits, sans recopier leurs caractéristiques. Quatre unités principales distinctes sont proposées par système/forme, réparties dans quatre gammes ; Android TV comporte deux choix distincts. Une fiche fabricant est utilisée lorsque le modèle est identifié mais que l’offre Amazon correspondante n’est pas confirmée. Elle n’a pas d’ASIN inventé et ne peut pas être ajoutée au panier Amazon.

La page Amazon est rendue côté serveur et lit `os`, `form` et `tier` dans l’URL. Les adaptateurs de `bundles.ts` alimentent aussi le catalogue de l’assistant ; les prix Amazon restent nuls jusque dans les anciens paniers et réponses mises en cache. AliExpress conserve son instantané et son rafraîchissement serveur.

Les schémas de `public/images/hardware/editorial/` représentent des catégories d’appareils, pas les produits exacts ni les variantes vendues. Les photographies issues des anciennes fiches Amazon ne sont pas utilisées.

Vérifier toute modification avec `node scripts/ci/check-catalog.mjs` et `node --test scripts/ci/check-catalog.test.mjs`. Le contrôle refuse les références manquantes, les ASIN mal formés, les prix Amazon, les unités répétées et les illustrations absentes. La validité commerciale, la disponibilité et la configuration exacte restent à vérifier chez le vendeur ; un format d’ASIN valide ne les prouve pas.
