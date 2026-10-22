# Politique de sécurité

Ce dépôt contient les sources du site <https://bobine.fit>. La politique de divulgation des vulnérabilités est publiée et tenue à jour sur le site en ligne ; cette page y renvoie. Lisez toujours la politique en ligne : c'est elle qui s'applique.

Version anglaise : [SECURITY.md](../../SECURITY.md).

## Où se trouve la politique réelle

| Quoi | Où |
|---|---|
| Page de politique (périmètre, engagements, délais, historique des clés) | <https://bobine.fit/fr/securite> ([en](https://bobine.fit/en/security)) |
| Politique lisible par machine, signée OpenPGP ([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)) | <https://bobine.fit/.well-known/security.txt> |
| Site de divulgation dédié, hébergé séparément du site | <https://security.bobine.fit> |
| Politique du logiciel Bobine et du dépôt APT | [FantasmaGlad/Bobine, SECURITY.md](https://github.com/FantasmaGlad/Bobine/blob/main/SECURITY.md) |

## Signaler une vulnérabilité

N'ouvrez pas de ticket, de discussion ni de demande de fusion publics pour une vulnérabilité. Utilisez l'un de ces canaux privés :

1. **Signalement privé de vulnérabilité GitHub** (à privilégier pour tout ce qui est exploitable) : [onglet Security, « Report a vulnerability »](https://github.com/FantasmaGlad/BobineWeb/security/advisories/new). Seul le mainteneur voit le rapport.
2. **E-mail** : [security@bobine.fit](mailto:security@bobine.fit).

Indiquez la page ou la route concernée, les étapes pour reproduire, l'impact observé et, si possible, une preuve de concept minimale.

Tout rapport contenant des détails exploitables doit être chiffré avec la clé OpenPGP de la politique. Si vous ne pouvez pas utiliser PGP, utilisez le signalement privé GitHub, chiffré en transit et visible du seul mainteneur, plutôt qu'un e-mail en clair.

| | |
|---|---|
| Identité | Bobine Security `<security@bobine.fit>` |
| Empreinte | `23CA D324 C507 FB0F 97E6 AECA 6E4C 020E F8BD FEB2` |
| Où la récupérer | <https://bobine.fit/.well-known/security.asc>, <https://security.bobine.fit/security.asc>, `gpg --locate-keys security@bobine.fit` |

Récupérez la clé depuis au moins deux canaux indépendants et vérifiez que l'empreinte correspond avant de l'utiliser. La clé est aussi publiée dans le DNS de `bobine.fit` (enregistrement `openpgp4fpr`).

## Versions prises en charge

Seule la version actuellement servie sur <https://bobine.fit> (la branche `main`) reçoit des correctifs. Il n'y a pas de version antérieure maintenue.

## Périmètre

Dans le périmètre : le site `bobine.fit` et ses routes serveur, le miroir Tor, et les chaînes de construction et de déploiement du dépôt. Hors périmètre : les services tiers, l'ingénierie sociale, le déni de service et les scans massifs, les constats sans impact démontrable, et les erreurs de contenu (à signaler par un ticket ordinaire). La liste complète figure sur la page de politique.

## Recherche de bonne foi

Une recherche menée de bonne foi, dans le périmètre et selon les règles de la page de politique, ne donnera lieu à aucune action de notre part. Il en va de même pour la licence du dépôt : [LICENSE](../../LICENSE), point 4.

## Secrets trouvés dans ce dépôt

Si vous trouvez un identifiant, un jeton ou une clé privée dans le dépôt ou son historique, signalez-le comme une vulnérabilité par les canaux privés ci-dessus. Ne l'utilisez pas.
