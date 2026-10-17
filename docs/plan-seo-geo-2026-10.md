# Plan SEO et GEO, octobre 2026

Objectif : que Google, Bing et les moteurs génératifs (Perplexity, ChatGPT Search, Gemini, Claude) trouvent Bobine, affichent des informations à jour (version, plateformes, canaux) et proposent la bonne page pour les requêtes de marque (« Bobine Canary », « Bobine Tor », « Bobine Android TV ») comme pour les requêtes génériques (« régie vidéo salle de sport », « alternative Les Mills Cinema »).

## 1. Constats vérifiés

| Constat | Preuve | Conséquence |
|---|---|---|
| `sitemap.xml` répond 200, XML valide, 70 adresses, pour Googlebot, Google-InspectionTool, Bingbot et les robots IA | Analyses Cloudflare (requêtes `/sitemap.xml`, statut 200) et `curl` avec les agents utilisateurs de ces robots | L'état « Impossible de récupérer le sitemap » de Search Console est conservé d'une lecture ratée ancienne : il ne reflète plus le site |
| Cloudflare ne bloque pas les robots | Règle personnalisée « skip » pour robots vérifiés, IA et adresses SEO ; Bot Fight Mode désactivé ; aucun événement de blocage sur Googlebot | Rien à débloquer côté pare-feu |
| « Page avec redirection » (8) et « Autre page avec balise canonique correcte » (8) | Les pages `/en/...` liaient les chemins français (`/en/fonctionnalites`, `/en/comparatif`...) qui répondent en 308 vers le slug anglais : en-tête, pied de page, menus, sélecteur de langue, fil d'Ariane | Liens internes corrigés : plus aucun lien interne du site ne passe par une redirection |
| « Explorée, actuellement non indexée » (10) | Pages jeunes, peu de liens entrants, peu de contenu propre par intention de recherche | Pages d'atterrissage ajoutées, maillage interne, autorité externe (section 4) |
| Les moteurs IA citent la V2.0.1 | Réponse Perplexity : index ancien, aucune source « version courante » lisible par machine | `latest.json`, `feed.xml`, `lastmod` exact, IndexNow, pages datées |

## 2. Réalisé dans le dépôt

1. **Liens internes sans redirection** : `lp(locale, chemin)` (`src/lib/seo.ts`) produit le slug de la langue ; table unique des slugs dans `src/lib/slugs.ts`, dont `next.config.ts` dérive redirections 308 et réécritures. Le sélecteur de langue vise l'équivalent exact (`/en/privacy` et non `/en/confidentialite`). Le miroir Tor, qui n'a ni réécriture ni redirection, garde les slugs français.
2. **Pages d'atterrissage** (FR et EN, `src/content/landing.ts`, rendues par `LandingPage`) : `/canaux` (hub), `/canaux/stable`, `/canaux/beta`, `/canaux/canary`, `/android-tv`, `/google-book`, `/tor`, `/nouveautes`. Chacune porte un H1 sur la requête visée, une date de mise à jour lue sur GitHub, un tableau de téléchargement réel, une FAQ visible avec `FAQPage`, un `BreadcrumbList` et, pour les canaux, un `SoftwareApplication` avec la version courante.
3. **Fraîcheur** : `/latest.json` (versions et liens des trois canaux), `/feed.xml` (flux Atom des releases, annoncé par `<link rel="alternate">`), versions relues toutes les 2 minutes, `llms.txt` et `llms-full.txt` qui renvoient vers ces sources.
4. **IndexNow** : clé publique à la racine, appel après chaque déploiement réussi (`scripts/ci/indexnow.sh`, job `indexnow` de `deploy.yml`). Couvre Bing (donc ChatGPT Search et Copilot), Yandex, Seznam, Naver.
5. **Sitemap** : nouvelles pages déclarées avec priorités et fréquences.

## 3. À faire dans Search Console et Bing Webmaster Tools (actions du propriétaire)

1. Search Console, Sitemaps : supprimer l'entrée en échec `https://bobine.fit/sitemap.xml`, soumettre `https://bobine.fit/sitemap-bobine.xml` (même contenu, adresse neuve : Search Console garde l'état d'échec d'une adresse déjà lue en erreur), puis `https://bobine.fit/feed.xml`.
2. Inspection de l'URL, « Demander une indexation » pour : `/fr`, `/en`, `/fr/canaux/canary`, `/fr/canaux`, `/fr/android-tv`, `/fr/tor`, `/fr/nouveautes`, `/fr/documentation`.
3. Couverture : lancer « Valider le correctif » sur « Page avec redirection » et « Autre page avec balise canonique » une fois le déploiement fait.
4. Bing Webmaster Tools : importer le site depuis Search Console, soumettre le sitemap, vérifier la clé IndexNow.
5. Suivi : Performances par pays (France, États-Unis, Royaume-Uni, Canada) et par requête de marque.

## 4. Autorité externe (levier principal, non automatisable)

- Liste `awesome-selfhosted` (logiciel AGPL auto-hébergé), AlternativeTo (fiche déjà liée : compléter plateformes, tags « Les Mills », « Wexer », captures), Product Hunt, Show HN, r/selfhosted, forums de gérants de salles.
- Une démonstration vidéo sous-titrée en français et en anglais, liée depuis le README et le site.
- Entité : même description, même auteur, mêmes liens `sameAs` partout (GitHub, Ko-fi, APT, LinkedIn) ; Wikidata si la notoriété le permet.
- README du dépôt `Bobine` : liens vers les pages d'atterrissage (poids des pages), section FAQ, sujets (topics) GitHub et description du dépôt alignés sur les mots-clés.

## 5. Mots-clés visés

| Intention | FR | EN | Page |
|---|---|---|---|
| Marque et canaux | Bobine Canary, Bobine Bêta, Bobine Stable, mise à jour Bobine | Bobine Canary, Bobine Beta, Bobine update channels | `/canaux/*` |
| Version courante | Bobine dernière version, Bobine 5.0.0, nouveautés Bobine | Bobine latest version, Bobine changelog | `/nouveautes`, `latest.json` |
| Appareils | Bobine Android TV, Bobine Chromecast Google TV, Bobine Google Book | Bobine Android TV, Google Book gym app | `/android-tv`, `/google-book` |
| Confidentialité | Bobine Tor, Bobine onion, dépôt APT Tor | Bobine Tor, APT repository over Tor | `/tor` |
| Générique | régie vidéo salle de sport, diffusion cours collectifs vidéo, alternative Les Mills Cinema sans abonnement | gym video playout, Les Mills Cinema alternative, self-hosted fitness software | accueil, comparatifs |

## 6. Limites assumées

- Un moteur IA ne réexplore pas à la demande : on ne peut qu'être accessible, signaler les changements (IndexNow, flux, `lastmod`) et rendre la version lisible par machine.
- Aucun balisage d'avis ou de note : le projet n'a pas de système d'avis.
- L'apparition de liens de site (sitelinks) dans Google dépend de l'autorité et de la structure du site ; les pages et le maillage ci-dessus en sont la condition, pas la garantie.
