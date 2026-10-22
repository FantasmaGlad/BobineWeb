# Miroir Tor de Bobine (deploy/onion)

Tout ce qu'il faut pour reproduire le miroir .onion (site + dépôt APT) sur une machine Debian.

## Principe

```
Tor Browser / apt --> réseau Tor --> tor (service caché) --> socket UNIX /run/onion/*.sock --> Caddy (fichiers statiques)
```

Aucun port n'est ouvert sur la box. Le contenu est tiré depuis GitHub par un timer (`sync.sh`, toutes les 15 minutes) :
le dépôt APT (branche `gh-pages` de Bobine) et le site (branche `onion-site` de BobineWeb, produite par
le workflow `onion-mirror`). Avant toute bascule, `sync.sh` vérifie l'empreinte de la clé publiée et la signature GPG de
`InRelease` pour chacune des trois suites du dépôt APT (`stable`, `beta`, `canary`) présentes dans la copie : une
signature invalide, ou aucune suite signée, garde l'ancienne copie en service.

## Fichiers

| Fichier | Rôle |
|---|---|
| `torrc.bobine-onion.conf` | deux services onion v3 (dépôt APT et site), à ajouter à `/etc/tor/torrc` |
| `Caddyfile.onion` | serveur statique sur sockets UNIX, politique de sécurité du site (aucune ressource externe) |
| `bobine-onion-web.service` | serveur Caddy durci, en lecture seule sur `/srv/onion` |
| `bobine-onion-sync.service`, `bobine-onion-sync.timer` | synchronisation et vérification toutes les 15 minutes |
| `sync.sh` | tire les deux branches, vérifie, applique les personnalisations du miroir, bascule par lien symbolique |
| `overlay/apt/` | personnalisations de la page du dépôt APT propres au miroir (jamais poussées dans le dépôt source) |
| `install-client.sh` | copie de `public/install-tor.sh` (script `curl ... \| bash` du client, option `--channel=stable\|beta\|canary`) ; la CI contrôle qu'elle reste identique |

## Installation (résumé)

1. `apt install tor caddy apt-transport-tor` (Caddy sert seulement de serveur statique ici ; le service système reste inactif).
2. Créer l'utilisateur `onion` (système), `/srv/onion`, `/etc/bobine-onion/`, `/usr/local/lib/bobine-onion/`.
3. Copier `Caddyfile.onion` vers `/etc/bobine-onion/Caddyfile`, les `*.service` et `*.timer` vers `/etc/systemd/system/`, `sync.sh` et `overlay/` vers `/usr/local/lib/bobine-onion/`.
4. Ajouter `torrc.bobine-onion.conf` à `/etc/tor/torrc`, puis `systemctl restart tor@default`.
   Les adresses sont dans `/var/lib/tor/bobine-apt/hostname` et `/var/lib/tor/bobine-site/hostname`.
5. Clé de déploiement en lecture seule pour le dépôt privé BobineWeb (dans `/var/lib/onion/.ssh/`), puis
   `systemctl enable --now bobine-onion-web.service bobine-onion-sync.timer`.

## Côté client

Un poste Debian ou Ubuntu s'abonne au dépôt par Tor avec `install-client.sh` (publié sur le site sous `/install-tor.sh`) : il installe
`apt-transport-tor`, récupère la clé par Tor, vérifie son empreinte puis écrit la source
`deb [signed-by=...] tor+http://<adresse onion>/ <canal> main`. Le canal est la suite APT : `--channel=stable|beta|canary`
(sans l'option, le script pose la question sur un terminal, sinon il prend `stable`).

## Points d'attention

- Le serveur web tourne dans le groupe `debian-tor` : Tor abandonne ses privilèges et ne peut ouvrir que des sockets de ce groupe.
- **Sauvegarder** `/var/lib/tor/bobine-*/hs_ed25519_secret_key` hors ligne : sans elle, l'adresse est perdue.
- `journalctl -u bobine-onion-sync` montre la dernière synchronisation ; un échec conserve l'ancienne copie.
- Si l'empreinte de la sous-clé de signature des paquets change côté Bobine, mettre à jour `APT_FPR` dans `sync.sh` : sans cela, la synchronisation du dépôt APT est refusée.
