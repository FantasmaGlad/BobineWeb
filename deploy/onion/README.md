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
| `overlay/apt/` | adaptations du portail et des commandes au transport Tor |

## Installation

1. Installer `tor`, `caddy`, `python3` et `gnupg`. Le service Caddy système reste inactif.
2. Créer l'utilisateur système `onion`, `/srv/onion`, `/etc/bobine-onion/` et `/usr/local/lib/bobine-onion/`.
3. Copier `Caddyfile.onion` vers `/etc/bobine-onion/Caddyfile`, les unités vers `/etc/systemd/system/`, puis `sync.sh`, `verify-packages.py` et `overlay/` vers `/usr/local/lib/bobine-onion/`.
4. Ajouter `torrc.bobine-onion.conf` à `/etc/tor/torrc`, puis redémarrer `tor@default`. Les adresses sont dans `/var/lib/tor/bobine-apt/hostname` et `/var/lib/tor/bobine-site/hostname`.
5. Installer la clé de déploiement GitHub en lecture seule dans `/var/lib/onion/.ssh/`, puis activer `bobine-onion-web.service` et `bobine-onion-sync.timer`.

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
