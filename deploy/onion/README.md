# Miroir Tor de Bobine (deploy/onion)

Le miroir sert le site et les dépôts signés APT, DNF et Pacman sur une machine Debian, sans port entrant ouvert sur la box.

## Principe

```text
Navigateur / apt / dnf / pacman -> Tor -> service onion -> socket UNIX -> Caddy
```

Le timer `sync.sh` tire `FantasmaGlad/bobine-packages@gh-pages` et `FantasmaGlad/BobineWeb@onion-site` toutes les quinze minutes. Les trois familles de paquets partagent l'adresse onion historique du dépôt APT. Caddy réécrit `/dists/*` et `/pool/*` vers `/debian` pour conserver les sources APT existantes.

Avant la bascule atomique, `verify-packages.py` vérifie la clé principale épinglée, les signatures APT/DNF/Pacman, les sommes SHA-256 des index puis des binaires, les tailles et l'expiration APT si elle est présente. Les trois canaux et les deux architectures de chaque famille sont obligatoires. Il produit `mirror-packages.json` (versions vérifiées) et `latest.json` (version stable APT commune aux deux architectures). Un refus conserve la copie servie. La génération précédente reste disponible ; seules les générations achevées plus anciennes sont nettoyées. Le dépôt Git des paquets utilise un répertoire distinct du dépôt APT historique.

## Fichiers

| Fichier | Rôle |
|---|---|
| `torrc.bobine-onion.conf` | deux services onion v3, à ajouter à `/etc/tor/torrc` |
| `Caddyfile.onion` | serveur sur sockets UNIX, compatibilité APT et CSP locale |
| `bobine-onion-web.service` | Caddy durci, lecture seule sur `/srv/onion` |
| `bobine-onion-sync.service`, `bobine-onion-sync.timer` | synchronisation périodique |
| `sync.sh` | extraction, personnalisation, vérification et bascule atomique |
| `verify-packages.py` | vérificateur commun, Python 3.11 minimum et GnuPG |
| `test-verify-packages.py` | refus d'une clé absente, d'index et de binaires altérés |
| `site-signature.py`, `test-site-signature.py` | manifeste signé de la branche du site : fabrication (CI) et vérification (hôte), et ses refus |
| `overlay/apt/` | adaptations du portail et des commandes au transport Tor |

## Installation

1. Installer `tor`, `caddy`, `python3` et `gnupg`. Le service Caddy système reste inactif.
2. Créer deux utilisateurs système distincts, pour que le serveur web, exposé sur Tor, ne puisse jamais lire la clé de déploiement : `onion-sync` (synchronisation, seul à lire la clé) et `onion-web` (Caddy), avec le groupe commun `onion-data` pour les copies servies.
   ```bash
   groupadd --system onion-data
   useradd --system --home-dir /var/lib/onion-sync --create-home --shell /usr/sbin/nologin --gid onion-data onion-sync
   useradd --system --no-create-home --shell /usr/sbin/nologin --gid debian-tor --groups onion-data onion-web
   install -d -m 2750 -o onion-sync -g onion-data /srv/onion
   install -d -m 0700 -o onion-sync -g onion-data /var/lib/onion-sync/.ssh
   install -d /etc/bobine-onion /usr/local/lib/bobine-onion
   ```
3. Copier `Caddyfile.onion` vers `/etc/bobine-onion/Caddyfile`, les unités vers `/etc/systemd/system/`, puis `sync.sh`, `verify-packages.py`, `site-signature.py` et `overlay/` vers `/usr/local/lib/bobine-onion/`.
4. Ajouter `torrc.bobine-onion.conf` à `/etc/tor/torrc`, puis redémarrer `tor@default`. Les adresses sont dans `/var/lib/tor/bobine-apt/hostname` et `/var/lib/tor/bobine-site/hostname`.
5. Installer la clé de déploiement GitHub en lecture seule dans `/var/lib/onion-sync/.ssh/` (propriétaire `onion-sync`, mode 0600), puis y créer `known_hosts` avec les clés d'hôte de `github.com` vérifiées auprès de la page officielle des empreintes de GitHub (`ssh-keyscan -t ed25519 github.com` ne suffit pas sans cette vérification) : `sync.sh` impose la vérification stricte et signale un fichier absent. Activer ensuite `bobine-onion-web.service` et `bobine-onion-sync.timer`.

### Signature de la branche du site

La branche `onion-site` est publiée par la CI. Sans signature, quiconque peut y pousser (ou détourner un jeton d'écriture) change ce que la machine sert. Le manifeste `SHA256SUMS` de tous les fichiers est donc signé en CI (`SHA256SUMS.asc`) par une clé GnuPG **dédiée au miroir** (jamais la clé des paquets), et `sync.sh` le vérifie avant toute personnalisation : empreinte épinglée sur la machine, aucun fichier ajouté, retiré ou modifié, aucun lien, et refus d'un `built:` plus ancien que celui déjà servi (`/srv/onion/.site-built`).

1. Sur un poste de confiance, créer la clé, sans phrase secrète (elle est lue par la CI), et noter l'empreinte :
   ```bash
   export GNUPGHOME="$(mktemp -d)"
   gpg --batch --quick-generate-key 'Bobine onion mirror <onion-mirror@bobine.fit>' ed25519 sign 2y
   gpg --list-secret-keys --with-colons | awk -F: '/^fpr:/ {print $10; exit}'
   ```
2. Ajouter la clé privée (`gpg --armor --export-secret-keys EMPREINTE`) au secret `ONION_SIGNING_KEY` de BobineWeb ; garder une sauvegarde hors ligne, puis supprimer le trousseau temporaire. Renouveler la clé avant son expiration (deux ans) : installer d'abord la nouvelle empreinte sur la machine, puis changer le secret.
3. Sur la machine du miroir : `gpg --armor --export EMPREINTE > /usr/local/lib/bobine-onion/site-signing.pub.asc` et `echo EMPREINTE > /etc/bobine-onion/site-signing.fpr` (propriétaire `root`, lecture seule). Tant que `site-signing.fpr` est absent, `sync.sh` avertit et n'exige pas la signature : à installer **après** une première publication signée, sinon le site reste sur l'ancienne copie.
4. Vérifier : après le prochain passage de `bobine-onion-sync.service`, le journal ne doit plus contenir « signature du site n'est pas vérifiée ».

### Migration depuis l'ancien utilisateur unique `onion`

Avant la séparation, Caddy et la synchronisation partageaient l'utilisateur `onion` : le serveur web pouvait lire la clé de déploiement. Sur une machine déjà installée :

1. Arrêter `bobine-onion-web.service` et `bobine-onion-sync.timer`, créer les utilisateurs et le groupe de l'étape 2.
2. `mv /var/lib/onion/.ssh /var/lib/onion-sync/.ssh && chown -R onion-sync:onion-data /var/lib/onion-sync && chmod 0700 /var/lib/onion-sync/.ssh`, puis `chown -R onion-sync:onion-data /srv/onion && chmod -R g+rX,o-rwx /srv/onion`.
3. Copier les unités et `sync.sh` à jour, `systemctl daemon-reload`, relancer `bobine-onion-sync.service` puis `bobine-onion-web.service` et le minuteur.
4. **Remplacer la clé de déploiement** : l'ancienne était lisible par le serveur web. En créer une nouvelle (`ssh-keygen -t ed25519`), l'ajouter à `BobineWeb` en lecture seule, retirer l'ancienne sur GitHub. Supprimer ensuite l'utilisateur `onion` et `/var/lib/onion`.

## Contrôles avant publication

`sync.sh` n'échange la copie servie qu'après les vérifications de chaque arbre ; en cas d'échec l'ancienne copie reste servie.
- Dépôt de paquets : `verify-packages.py` (signatures, empreintes, tailles), puis les overlays de `overlay/apt/` adaptent le portail à Tor (`site-tor.py` pour `assets/site.js`, `mirror-files-tor.py` pour les `.repo` et les fichiers propres au web classique) et `no-clearnet-check.py` refuse la copie si un fichier texte mène encore à `bobine.fit`, `packages.bobine.fit` ou GitHub.
- Site : `overlay/site/commands-tor.py` transforme les commandes `curl` du contenu (installateurs, clé et dépôts) en commandes par le service onion et le proxy SOCKS, puis `check-commands.py` refuse la copie si une commande mène encore au web classique.
- `python3 deploy/onion/test-overlay-apt.py` essaie ces overlays (lancé par la CI) ; la CI les applique aussi à l'export réel du site.

Le groupe `debian-tor` permet à Tor d'ouvrir les sockets de Caddy après abandon de ses privilèges. Sauvegarder les clés des services onion hors ligne : leur perte entraîne celle des adresses.

## Clients

`public/install-tor.sh` est la source unique de l'installateur client. Le script détecte `apt`, `dnf` ou `pacman`, installe Tor, récupère la clé par SOCKS et vérifie son empreinte. `--channel=stable|beta|canary` choisit le canal ; le défaut est Stable en mode non interactif.

- APT : `apt-transport-tor`, source `tor+http://<onion>/debian`, clé dédiée par `signed-by`.
- DNF : dépôt `/fedora/<canal>/$basearch/`, `gpgcheck=1`, `repo_gpgcheck=1`, proxy `socks5h`.
- Pacman : dépôt `/arch/<canal>/$arch`, signature obligatoire des paquets et de la base, transfert par SOCKS uniquement pour les adresses onion. La synchronisation utilise `pacman -Syu`.

Les pages du portail ne chargent aucune ressource du web classique. Leurs commandes et liens de téléchargement pointent vers les miroirs locaux.

## Vérification

```bash
python3 deploy/onion/verify-packages.py /chemin/vers/gh-pages
python3 deploy/onion/test-verify-packages.py /chemin/vers/gh-pages
bash scripts/ci/smoke-onion.sh
```

La sonde utilise Tor sur `127.0.0.1:9050` et vérifie le site, son âge, l'installateur servi, les signatures des trois canaux et la version stable des trois familles sur les deux architectures. `EXPECTED_VERSION` permet d'épingler cette version ; sinon elle est lue dans la dernière release publique. `TOR_PROBE_ENABLED=true` active le workflow de contrôle en direct. `journalctl -u bobine-onion-sync` montre la synchronisation ; toute modification de la clé principale exige une nouvelle revue de l'empreinte épinglée.
