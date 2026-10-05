# CDC — Miroir Tor (.onion) du site et du dépôt APT de Bobine

Statut : EN SERVICE depuis le 2026-09-19 (installation faite sur la machine hote ; site et depot APT testes via Tor,
paquet .deb de 47,6 Mo telecharge et verifie par apt). Ce document est la reference d'exploitation du miroir.
Evolutions livrees depuis : Baamix visible sur le miroir en mode sans reseau (message explicatif), logos Tor, encart et liens de soutien a Tor,
variante Tor du Pong (`deploy/onion/overlay/`), version GitHub lue cote serveur, carte d'installation « Option C » et
script `install-tor.sh` dans la documentation, ASCII art Tor (demo terminal, script, en-tete de apt.bobine.fit
variante Tor), mode Tor de la demo terminal, CI verte (regles React en avertissement), Baamix qui court dans sa roue en fin de message et machine a ecrire
fiabilisee sur reseau lent (attend le rendu Markdown).
Ce document reste le cahier des charges d'origine (les decisions y sont notees, quelques details ont evolue :
serveur web dedie sous le groupe `debian-tor`, site tire depuis la branche `onion-site` par cle de deploiement).

## 1. Contexte et objectif

Bobine est un logiciel libre (AGPL-3.0) pensé pour rendre leur souveraineté aux salles de sport. Prolonger cette
logique jusqu'à la distribution : permettre d'installer et de mettre à jour Bobine **sans dépendre d'un
hébergeur, d'un CDN ou d'un DNS commercial**, et sans que l'utilisateur révèle son adresse IP à qui que ce soit.

Objectifs :

1. Publier le dépôt APT (`apt.bobine.fit`) en **service onion v3**, installable via `apt-transport-tor`.
2. Publier le site (`bobine.fit`) en service onion, en miroir de la version en ligne.
3. Annoncer ces adresses depuis le site clair (en-tête `Onion-Location`, page de documentation), pour qu'elles
   soient visibles et vérifiables.
4. Le faire **pour l'amour du jeu et la découverte** : projet volontairement modeste, sans promesse de
   disponibilité commerciale ni de service anonyme « garanti ».

Hors périmètre : le fonctionnement de Baamix (l'IA repose sur des API tierces, incompatible avec l'esprit du miroir),
le catalogue matériel et les liens d'affiliation (les routes restent, avec une page de renvoi : voir 6.3), toute
collecte de données.

## 2. Principes (philosophie du libre)

- **Le miroir n'est pas la source de vérité.** Vercel et la branche `gh-pages` du dépôt `FantasmaGlad/Bobine`
  restent la source. L'onion est un miroir en lecture seule, reconstructible à tout moment.
- **La confiance vient de la signature GPG, pas du transport.** Tor chiffre et authentifie le lien ; la clé
  `941B 6F52 6A72 59F4 694C F4BC 1B5D 18A9 76FA AD15` continue de signer les paquets. Un miroir compromis ne
  peut pas fournir un paquet accepté par apt.
- **Reproductible et documenté.** Toute la configuration (torrc, serveur web, synchronisation) est publiée dans
  le dépôt, de sorte que n'importe qui puisse monter son propre miroir onion (esprit AGPL).
- **Aucun pistage.** Pas de journaux d'accès, pas de mesure d'audience, pas de ressource tierce sur le miroir.
- **Honnêteté.** Le site n'affirme jamais un anonymat total : Tor protège l'adresse IP et le contenu du transport,
  pas l'utilisateur contre ses propres erreurs.

## 3. Infrastructure hôte

Machine existante, allumée 24/7, réseau local `192.168.1.x` (Debian 13 « trixie », x86_64, 4 cœurs, 15 Go de
RAM, ~14 Go de disque libre). Constat au 2026-09-19 : `tor` non installé (paquet disponible en 0.4.9.12),
`caddy` installé mais inactif, `docker` actif, ports 80/443 libres, accès SSH par clé, compte `fanta` avec droits sudo.
La machine héberge par ailleurs d'autres services (serveurs de jeu, PostgreSQL) : le miroir doit y rester isolé.

Un service onion **n'a besoin d'aucun port entrant ouvert sur la box** : le démon Tor initie des connexions
sortantes. Aucune redirection de port, aucun DNS, aucune IP publique fixe.

## 4. Architecture cible

```
Client apt (tor+http) ─► réseau Tor ─► tor (service caché) ─► socket UNIX local ─► serveur web statique
                                                                                   │
                                            /srv/onion/apt  ◄── git pull (gh-pages du dépôt Bobine)
                                            /srv/onion/site ◄── export du site (voir 6.2)
```

Deux services onion distincts (une adresse par usage) : un pour l'APT, un pour le site. Chacun a sa propre clé.

### 4.1 Composants

| Composant | Choix | Raison |
|---|---|---|
| Démon | `tor` (paquet Debian) | Dépôt officiel Debian, mises à jour automatiques via `unattended-upgrades` déjà actif |
| Type de service | Onion v3 (`HiddenServiceVersion 3`) | v2 supprimé du réseau |
| Serveur web | Caddy (déjà installé) écoutant **uniquement** sur un socket UNIX local (repli : `127.0.0.1:8081` et `:8082`) | Statique, léger, journaux désactivés |
| Contenu APT | Clone en lecture seule de la branche `gh-pages` | Miroir exact, resynchronisé automatiquement |
| Isolation | Utilisateur système dédié `onion`, unités systemd durcies | Le miroir ne touche pas aux autres services |
| Durcissement Tor | `HiddenServiceNonAnonymousMode` **non** activé | Le service reste un vrai service caché (le serveur reste anonyme) |

### 4.2 Fichiers de configuration à produire (dans ce dépôt, sous `deploy/onion/`)

- `torrc.d/bobine-onion.conf` : deux `HiddenServiceDir` (`/var/lib/tor/bobine-apt/`, `/var/lib/tor/bobine-site/`),
  `HiddenServicePort 80 unix:/run/onion/<service>.sock` (repli : `127.0.0.1:8081` / `8082`), `HiddenServicePoWDefensesEnabled 1`.
- `Caddyfile.onion` : deux sites statiques sur loopback, `auto_https off`, aucun journal, en-têtes de sécurité
  (`X-Content-Type-Options`, `Referrer-Policy: no-referrer`, pas de ressource externe).
- `bobine-onion-sync.service` + `.timer` : synchronisation (voir 5.2).
- `README.md` : procédure complète pour reproduire le miroir.
- `install-client.sh` : installation cliente en une commande (paquet `apt-transport-tor`, clé, source), à publier
  dans la documentation avec son empreinte à vérifier avant exécution (pas de `curl | sh` aveugle).

## 5. Dépôt APT en .onion

### 5.1 Utilisation côté utilisateur

```bash
sudo apt install apt-transport-tor
curl -fsSL https://apt.bobine.fit/bobine.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/bobine.gpg
echo "deb [signed-by=/etc/apt/keyrings/bobine.gpg] tor+http://<adresse-apt>.onion/ stable main" | sudo tee /etc/apt/sources.list.d/bobine-onion.list
sudo apt update && sudo apt install bobine
```

Note : `http` sur un service onion est acceptable (le chiffrement de bout en bout est assuré par Tor). La clé GPG
peut aussi être récupérée depuis l'onion lui-même (`/bobine.gpg`) ; le site doit toutefois recommander de
**comparer l'empreinte** avec celle publiée sur plusieurs canaux (site, dépôt GitHub, `llms.txt`).

### 5.2 Synchronisation

- Timer systemd toutes les 15 minutes : `git fetch` + `git reset --hard origin/gh-pages` dans `/srv/onion/apt`
  (clone en lecture seule, clé de déploiement en lecture uniquement, ou HTTPS public sans clé).
- Vérification avant publication : présence et validité de `InRelease` (`gpg --verify` avec la clé publique
  attendue). Si la vérification échoue, **on garde l'ancienne copie** et on lève une alerte.
- Bascule atomique (répertoire temporaire puis lien symbolique) pour ne jamais servir un état à moitié copié.
- Coût disque : quelques dizaines de Mo à quelques centaines de Mo (paquets `.deb` du `pool/`), à surveiller.

## 6. Site bobine.fit en .onion

### 6.1 Annonce depuis le site clair (Vercel)

Ajout, dans `next.config`, d'un en-tête `Onion-Location: http://<adresse-site>.onion<chemin>` sur les pages HTML.
Tor Browser propose alors automatiquement « .onion disponible ». Sans effet pour les autres navigateurs.
Décision à trancher : garder une adresse statique ou la lire dans une variable d'environnement (recommandé, pour
changer d'adresse sans modifier le code).

### 6.2 Contenu servi par l'onion (choix à arbitrer)

| Option | Principe | Avantages | Limites |
|---|---|---|---|
| A. Export statique | `next build` avec sortie statique, copié dans `/srv/onion/site` | Aucun processus applicatif, minimal, très sûr | Les routes dynamiques (`/api/*`, proxy, ISR, blog GitHub) ne fonctionnent pas ; il faudra une version « miroir » réduite |
| B. `next start` local | Application complète sur loopback derrière l'onion | Fonctionnalités complètes | Processus Node supplémentaire, mises à jour de dépendances, appels sortants (GitHub, IA) qui sortent du réseau Tor |
| C. Reverse proxy vers `bobine.fit` | Caddy relaie vers le site public | Trivial, toujours à jour | Le trafic sort de Tor vers le web clair ; Vercel/Cloudflare voient l'IP de la machine ; perd l'intérêt « indépendant » |

**Retenu : A (export statique)**, avec une bannière discrète « miroir Tor : certaines fonctions
(assistant Baamix, panier boutique) ne sont disponibles que sur bobine.fit ». C'est la seule option cohérente avec
la philosophie (aucune dépendance sortante).

### 6.2 bis Construction et livraison du miroir (workflow `onion-mirror`)

`.github/workflows/onion-mirror.yml` construit l'export (`npm run build:onion`, qui retire `src/app/api` et `src/proxy.ts`
sur le runner jetable), vérifie qu'il ne contient aucun lien marchand, aucune ressource externe chargée
automatiquement ni outil de mesure, puis publie le résultat sur la branche orpheline `onion-site` (un seul commit,
forcé, identité `fanta`). Déclencheurs : push sur `main`, exécution quotidienne (blog et version lus sur GitHub
Releases), lancement manuel, et événement `bobine-release` à envoyer depuis le dépôt Bobine à chaque release.

La machine hôte **tire** cette branche (`git fetch`, même mécanique que `gh-pages` pour l'APT) : aucun accès entrant
vers elle. Les redirections que le proxy Next assurait (`/` vers `/fr/`, `/fr` vers `/fr/`) sont à reproduire dans
Caddy, ainsi que les en-têtes de sécurité et le type MIME de `install.sh`.

### 6.3 Boutique et affiliation : page de renvoi sur le miroir

Le miroir onion **ne contient ni la boutique matériel ni les liens d'affiliation** Amazon/AliExpress : un lien
commercial suivi et un achat sur un site clair contredisent l'objectif de la démarche, et exposeraient
l'utilisateur.

Les routes `/materiel`, `/materiel/amazon` et `/materiel/aliexpress` **restent présentes** dans le miroir (pas de
404, pas de lien cassé depuis la navigation) mais affichent une page unique :

- le logo du Tor Project (voir réserve ci-dessous) au-dessus d'un titre sobre ;
- un court message expliquant la démarche : « Vous êtes sur le miroir Tor de Bobine. La sélection de matériel
  repose sur des liens d'affiliation vers des boutiques en ligne classiques, ce qui n'a pas sa place ici. Elle
  reste disponible sur bobine.fit. » ;
- un lien vers `bobine.fit/materiel`, **en texte visible et sans redirection automatique**, pour que l'utilisateur
  choisisse lui-même de quitter Tor ;
- aucune ressource externe (logo hébergé localement), textes FR et EN, thèmes respectés (variables CSS existantes).

Implémentation (faite) : la variable de build `NEXT_PUBLIC_BOBINE_ONION=1` (`src/lib/onion.ts`) fait remplacer ces routes
par `OnionMirrorNotice` lors de l'export du miroir ; le site Vercel reste inchangé. Le pictogramme est un oignon
filaire dessiné pour Bobine, sans reprise du logo officiel de Tor (réserve ci-dessous). Les notes de version du blog
ne chargent plus aucune image ni vidéo distante sur le miroir : chaque média devient un lien que le lecteur ouvre
lui-même. La même page peut servir à `/baamix` (l'assistant dépend
d'API tierces), avec un message adapté.

Réserve sur le logo : le nom et le logo « Tor » sont des marques du Tor Project. Vérifier leur politique d'usage
avant publication ; y faire figurer une mention du type « Bobine n'est pas affilié au Tor Project ». Solution de
repli, cohérente avec la règle « SVG filaires » du projet : un pictogramme d'oignon dessiné en filaire par nos
soins, sans reprendre le logo officiel.

## 7. Intégration dans le dépôt web (BobineWeb)

Règles du projet à respecter :

1. **Source de contenu unique** : ajouter un chapitre/sous-section « Installer via Tor (.onion) » dans
   `src/content/docs/chapters.ts` (FR et EN) et des entrées dans `faq-data.ts`. Baamix et le PDF se mettent à jour
   seuls. Zéro emoji, icônes SVG filaires uniquement.
2. **Sitemap** : si une page dédiée est créée (ex. `/[locale]/onion`), la déclarer dans `staticRoutes` de
   `src/app/sitemap.ts`. Le miroir onion, lui, n'expose pas de sitemap public utile aux moteurs.
3. **GEO** : mentionner l'existence des adresses onion dans `public/llms.txt` et `public/llms-full.txt`
   (les adresses sont publiques par nature).
4. **Pages légales** : le miroir ne collecte rien ; l'ajouter à `confidentialite` (nouvel hébergement : machine
   personnelle de l'éditeur, service Tor, aucun journal) et mettre à jour la date « Dernière mise à jour ».
   Ne pas promettre plus que ce qui est réel (règle des pages légales : ne rien promettre d'irréel).
5. **Design** : si un badge « Tor » est affiché (pied de page, page d'installation Linux), utiliser les variables
   de thème existantes, valable sur les 17 thèmes.
6. **Détection de plateforme** : la carte d'installation Linux peut proposer la variante onion en option
   secondaire, sans jamais la mettre par défaut.
7. **Publication de l'adresse** : afficher l'adresse en texte copiable (jamais uniquement dans une image), et la
   signer : publier un message GPG signé (`onion-address.txt.asc`) permettant de vérifier que l'adresse vient
   bien du mainteneur.

## 8. Sécurité et exploitation

- **Sauvegarde des clés** : `hs_ed25519_secret_key` (et `hostname`) de chaque service sont **irremplaçables** :
  les perdre équivaut à perdre l'adresse. Sauvegarde chiffrée hors machine, permissions `0700` pour `tor`.
- **Isolation** : Caddy lié à loopback uniquement (`ss -tlnp` doit le confirmer), pare-feu sortant inchangé,
  `fail2ban` sans objet sur ce flux.
- **Durcissement systemd** : `ProtectSystem=strict`, `NoNewPrivileges`, `PrivateTmp`, lecture seule sur `/srv/onion`
  pour le serveur web.
- **Écoute par socket UNIX** (`unix//run/onion/apt.sock`, `HiddenServicePort 80 unix:/run/onion/apt.sock`) de
  préférence à loopback TCP : rien n'est joignable en réseau, même localement.
- **Défense par preuve de travail** : `HiddenServicePoWDefensesEnabled 1` activé dès le départ, plus
  `HiddenServiceEnableIntroDoSDefense 1`.
- **Nettoyage des en-têtes** : `header -Server` côté Caddy, aucun cookie, aucun en-tête révélant la machine.
- **Sauvegarde des clés** : copie chiffrée hors ligne (KeePassXC ou clé USB LUKS) ; dossier `0700`, clé secrète
  `0600`, propriétaire `debian-tor`.
- **Aucun journal** côté Caddy et `Log notice` minimal côté Tor (pas de `SafeLogging` désactivé).
- **Surveillance** : contrôle quotidien (timer) que l'adresse répond via Tor (`torsocks curl`) ; alerte en cas
  d'échec ; fraîcheur du miroir comparée à `Release` de la source.
- **Mises à jour** : `tor` via `unattended-upgrades` ; contrôle mensuel de Caddy.
- **Disponibilité** : dépend de la box et de sa connexion domestique ; assumée comme « au mieux ». Prévoir une
  option ultérieure : deux instances avec **OnionBalance** si l'usage le justifie.
- **Abus** : miroir statique en lecture seule, surface d'attaque minimale ; option `HiddenServiceMaxStreams` et
  `HiddenServicePoWDefensesEnabled` (défense par preuve de travail de Tor) activables en cas d'attaque.

## 9. Étapes de réalisation

1. **Audit de la machine** (fait en partie) : espace disque, absence de conflit de ports, utilisateur dédié.
2. **Installer et configurer Tor** ; générer les deux adresses ; sauvegarder les clés.
3. **Configurer Caddy** en loopback ; servir un contenu de test ; vérifier depuis Tor Browser.
4. **Miroir APT** : clone `gh-pages`, timer de synchronisation, vérification `InRelease`, test `apt update` via
   `tor+http` depuis une machine Debian/Ubuntu propre.
5. **Miroir site** : export statique, bannière miroir, retrait des routes dynamiques ; test complet.
6. **Dépôt web** : en-tête `Onion-Location`, contenu de documentation FR/EN, `llms*.txt`, pages légales, page
   dédiée éventuelle + sitemap.
7. **Publication de l'adresse signée** (GPG) et mention dans le dépôt GitHub.
8. **Validation** : `npx tsc --noEmit` et `npm run build` sans erreur avant tout commit.

## 10. Critères d'acceptation

- `apt update && apt install bobine` réussit via `tor+http://<adresse>.onion/` sur une Debian/Ubuntu vierge, et un
  paquet altéré est refusé par apt (test négatif).
- Le site onion s'ouvre dans Tor Browser, sans ressource externe ni requête sortante (onglet réseau).
- Tor Browser propose le bouton « .onion disponible » sur `bobine.fit`.
- Aucun port entrant nouveau n'est ouvert sur la box ; Caddy n'écoute que sur loopback.
- Un scan externe (nmap) de l'IP publique ne révèle aucun port lié au service ; `ss -tlnp` ne montre rien de
  nouveau hors loopback / socket.
- Aucun journal d'accès n'est écrit sur la machine.
- `/materiel`, `/materiel/amazon` et `/materiel/aliexpress` affichent sur l'onion la page de renvoi (logo Tor,
  message, lien vers bobine.fit) et ne contiennent aucun lien Amazon ni AliExpress.
- Le contenu est mis à jour automatiquement après une release (délai maximal 15 minutes).
- Documentation FR/EN, `llms*.txt` et pages légales à jour ; zéro emoji.
- Tout le nécessaire pour recréer le miroir est dans `deploy/onion/`.

## 11. Points à trancher

1. Une adresse par service (recommandé) ou une seule ?
2. Option d'export statique (A) confirmée pour le site, ou miroir complet (B) ?
3. Adresse vanité `bobine…` (6 caractères, `mkp224o`) : retenue par défaut. Compter quelques minutes de calcul ; 7
   caractères demandent environ une heure, 8 plus d'une journée sur 4 cœurs. Génération sur la machine hôte, clé
   secrète jamais transmise. Une seule adresse vanité suffit, l'autre service peut rester aléatoire.
4. Page dédiée `/onion` ou simple sous-section de la documentation d'installation Linux ?
5. Accepter d'annoncer un service « au mieux » (hébergé sur une machine personnelle) : formulation exacte à valider.

## 12. Règles de dépôt

Auteur et committer : `fanta <193235053+FantasmaGlad@users.noreply.github.com>`. Commits poussés sur `main` = déploiement automatique sur Vercel : valider avant
(`tsc`, `build`).
