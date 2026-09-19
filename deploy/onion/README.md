# Miroir Tor de Bobine (deploy/onion)

Tout ce qu'il faut pour reproduire le miroir .onion (site + depot APT) sur une machine Debian.
Voir aussi `docs/cahier-des-charges-onion-tor.md`.

## Principe

```
Tor Browser / apt --> reseau Tor --> tor (service cache) --> socket UNIX /run/onion/*.sock --> Caddy (fichiers statiques)
```

Aucun port n'est ouvert sur la box. Le contenu est tire depuis GitHub par un timer (`sync.sh`) :
le depot APT (branche `gh-pages` de Bobine) et le site (branche `onion-site` de BobineWeb, produite par
le workflow `onion-mirror`). Avant toute bascule, `sync.sh` verifie la signature GPG du depot APT.

## Installation (resume)

1. `apt install tor caddy apt-transport-tor` (Caddy sert seulement de serveur statique ici ; le service systeme reste inactif).
2. Creer l'utilisateur `onion` (systeme), `/srv/onion`, `/etc/bobine-onion/`, `/usr/local/lib/bobine-onion/`.
3. Copier `Caddyfile.onion` vers `/etc/bobine-onion/Caddyfile`, les `*.service` et `*.timer` vers `/etc/systemd/system/`, `sync.sh` vers `/usr/local/lib/bobine-onion/`.
4. Ajouter `torrc.bobine-onion.conf` a `/etc/tor/torrc`, puis `systemctl restart tor@default`.
   Les adresses sont dans `/var/lib/tor/bobine-apt/hostname` et `/var/lib/tor/bobine-site/hostname`.
5. Cle de deploiement en lecture seule pour le depot prive BobineWeb (dans `/var/lib/onion/.ssh/`), puis
   `systemctl enable --now bobine-onion-web.service bobine-onion-sync.timer`.

## Points d'attention

- Le serveur web tourne dans le groupe `debian-tor` : Tor abandonne ses privileges et ne peut ouvrir que des sockets de ce groupe.
- **Sauvegarder** `/var/lib/tor/bobine-*/hs_ed25519_secret_key` hors ligne : sans elle, l'adresse est perdue.
- `journalctl -u bobine-onion-sync` montre la derniere synchronisation ; un echec conserve l'ancienne copie.
