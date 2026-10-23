# Contribuer à BobineWeb

Ce dépôt contient les sources du site <https://bobine.fit>. Il est publié pour que son travail puisse être lu, et non pour être réutilisé : voir [LICENSE](../../LICENSE). Les contributions restent bienvenues aux conditions ci-dessous, car un lecteur qui repère une erreur est le meilleur relecteur dont le site puisse disposer.

Version anglaise : [CONTRIBUTING.md](../../CONTRIBUTING.md). En participant, vous acceptez de respecter le [code de conduite](CODE_OF_CONDUCT.md). Les vulnérabilités ne se signalent pas par ticket ou demande de fusion : voir [SECURITY.md](SECURITY.md). Le logiciel Bobine a son propre dépôt, [FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine), avec son propre guide de contribution.

## Ce qui est bienvenu

- Les signalements d'erreurs : information fausse ou périmée, lien cassé, problème d'accessibilité, défaut d'affichage, page qui ne fonctionne pas sur un navigateur ou un appareil donné.
- Les suggestions sur le contenu, le design ou la structure du site.
- Les petites corrections bien délimitées : coquille, traduction, style cassé, affirmation inexacte.

Pour tout ce qui dépasse une correction petite et évidente (nouvelle page, changement de comportement, refonte, nouvelle dépendance), ouvrez d'abord un ticket et accordez-vous sur l'approche avant d'écrire du code. Les grosses demandes de fusion non sollicitées risquent d'être refusées, quelle que soit leur qualité. Les tickets et demandes de fusion peuvent être rédigés en français ou en anglais.

## Principes

**Des preuves, pas des suppositions.** Un problème est compris quand vous savez le reproduire et en désigner la cause. Appuyez vos affirmations sur des faits : la page et la langue, le navigateur et sa version, les étapes exactes, le résultat attendu et le résultat observé.

**L'exactitude avant le marketing.** Le site n'annonce jamais une fonctionnalité qui n'est pas livrée dans Bobine, n'affiche jamais de note ou d'avis inventé, et n'écrit jamais un prix en dehors de sa source unique. Si vous n'êtes pas sûr qu'une information est vraie, dites-le dans le ticket plutôt que de modifier le texte.

**Une source par information.** La documentation produit et la FAQ vivent dans `src/content/docs/` et alimentent les pages, le PDF et l'assistant ; les prix et identifiants du matériel vivent dans `src/content/hardware.ts`. Ne recopiez jamais une information à la main dans un autre fichier.

**La cause, pas le symptôme.** Ne masquez pas une erreur par un `try`/`catch` silencieux, une nouvelle tentative ou un cas particulier qui cache la vraie défaillance.

**Dites ce que vous n'avez pas vérifié.** Indiquez précisément ce que vous avez testé, sur quel système et quelle version, et ce que vous n'avez pas pu tester.

## Vous répondez de votre code

Quels que soient les outils que vous utilisez pour écrire du code, vous êtes l'auteur de ce que vous soumettez, et vous en répondez.

- Vous devez pouvoir expliquer chaque ligne de votre changement et sa raison d'être, sans aide, pendant la revue.
- Vous devez l'avoir exécuté. Une demande de fusion qui décrit des vérifications non faites, ou qui cite des fichiers, options ou fonctions inexistants, sera fermée.
- Vous devez avoir le droit de le soumettre (voir « Licence et cession » plus bas), et la provenance de tout bloc important que vous n'avez pas écrit doit être vérifiable.
- Vous devez suivre les conventions et le style du code, et retirer ce qui n'apporte rien : commentaires qui répètent le code, reformatages sans rapport, abstractions spéculatives, descriptions gonflées.
- Les soumissions automatisées ou en masse (scripts ouvrant des demandes de fusion, reformatage massif, mises à jour de dépendances en masse) ne sont pas acceptées. Les mises à jour de dépendances sont gérées par le mainteneur.

Le mainteneur relit les contributions à son rythme. Rendre la relecture courte relève de votre responsabilité.

## Environnement de développement

Node 22 et npm.

```bash
npm ci
cp .env.example .env.local   # facultatif : le site fonctionne sans aucune clé
npm run dev                  # http://localhost:3000
```

Sans aucune clé, le site fonctionne : l'assistant répond 503, le catalogue AliExpress utilise son instantané et la version affichée retombe sur une valeur par défaut. Ne committez jamais `.env.local` ni une clé.

Avant d'ouvrir une demande de fusion, lancez les mêmes vérifications que la CI :

```bash
npx tsc --noEmit    # TypeScript, 0 erreur
npm run lint        # ESLint, 0 erreur
npm run build       # compilation de production
```

Si vous touchez aux styles, aux simulateurs d'installation ou aux scripts shell, lancez aussi les garde-fous que la CI leur applique :

```bash
node scripts/ci/glass-check.mjs          # jetons de verre, aucune valeur figée, contraste du texte sur les 16 thèmes
bash scripts/ci/check-simulator-sync.sh  # simulateurs alignés sur public/install.sh et public/install-tor.sh
bash scripts/ci/policy-check.sh          # politique du dépôt (entrées de racine, secrets, emoji)
```

`public/install-tor.sh` doit rester identique à sa copie de déploiement `deploy/onion/install-client.sh` (`cmp`, contrôlé par la CI).

`npm run build:onion` construit le miroir Tor statique et est réservé à la CI : il supprime `src/app/api` et `src/proxy.ts` et refuse de tourner ailleurs. Pour tester le miroir en local, copiez le dépôt, avec son `node_modules`, dans un dossier temporaire.

Next.js 16 comporte des ruptures par rapport aux versions précédentes : lisez le guide pertinent dans `node_modules/next/dist/docs/` avant d'écrire du code.

## Conventions du projet

- **Aucun emoji** dans l'interface, la documentation ou le code. Les icônes sont en SVG filaire (`fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`) ou en typographie.
- **Deux langues** : français (par défaut) et anglais. Un changement visible met à jour les deux.
- **Miroir Tor** : toute nouvelle fonctionnalité doit marcher sans route serveur ni ressource tierce quand `IS_ONION` est vrai, ou se dégrader proprement. Ne chargez aucune police, aucun script ni décodeur depuis l'extérieur du site.
- **Pages légales** : tout nouveau stockage local, cookie, outil de mesure, prestataire ou flux de données impose de modifier `mentions-legales` et `confidentialite`, et leur ligne « dernière mise à jour », dans le même changement.
- **Commentaires** : ils expliquent un pourquoi durable (une contrainte, un piège, un choix non évident). Pas d'historique, pas de code commenté, pas de bannière décorative.
- **Secrets** : jamais dans le code, un commentaire, une capture d'écran ou un journal. Les variables sont listées dans `.env.example`.

## Commits

BobineWeb utilise les [Conventional Commits](https://www.conventionalcommits.org/), en minuscules, avec une portée :

```
type(scope): description courte à l'impératif
```

| Type | Usage |
|---|---|
| `feat` | une fonctionnalité visible |
| `fix` | une correction de bug |
| `refactor` | un changement sans effet sur le comportement |
| `perf` | une amélioration de performance mesurée |
| `docs` | documentation seule |
| `build`, `ci`, `chore` | outillage, pipelines, maintenance |
| `revert` | annulation d'un commit précédent |

Exemples tirés de l'historique :

```
feat(materiel): catalogue AliExpress reel pour Windows via l'API Affiliate
fix(securite): comparaison des deux security.txt avec des noms de fichiers fixes
docs(onion): option d'installation APT via Tor, FAQ, script et documentation projet
```

- Les messages peuvent être en français ou en anglais, de façon cohérente au sein d'une demande de fusion.
- Pour tout changement non trivial, ajoutez un corps en liste à puces : la cause résolue, le mécanisme introduit et la façon dont c'est testé.
- Un changement logique par commit ; chaque commit doit compiler. Ne laissez aucun commit « fixup » ou « corrections de revue » dans l'historique final.
- Tenez votre branche à jour en la rebasant sur `main` plutôt qu'en y fusionnant `main`.

## Demandes de fusion

Ouvrez la demande de fusion vers `main`. La description doit contenir :

1. **Quoi et pourquoi** : le problème, avec le numéro du ticket s'il y en a un.
2. **Comment** : l'approche, et les alternatives écartées quand c'est pertinent.
3. **Vérification** : les commandes exactes lancées et leur résultat, ainsi que les navigateurs et appareils contrôlés.
4. **Risques** : ce qui pourrait régresser, et comment on s'en apercevrait.
5. **Documentation** : ce que vous avez mis à jour, ou pourquoi rien n'avait à l'être.

Une demande de fusion est acceptée quand la CI est verte, la revue terminée et le changement conforme à la direction du site. Une décision de ne pas fusionner porte sur le changement, pas sur vous ; la raison est donnée. Les demandes de fusion venant de forks sont vérifiées par la CI sans accès à aucun secret.

## Licence et cession de droits

BobineWeb n'est pas un logiciel open source : [LICENSE](../../LICENSE) n'autorise que la lecture. Parce que le site doit rester une oeuvre cohérente que son titulaire peut maintenir et publier, toute contribution est cédée à Bobine.

En soumettant une contribution (demande de fusion, correctif, texte, traduction ou tout autre contenu), vous déclarez que :

1. vous en êtes l'auteur ou avez le droit de la soumettre, et qu'elle ne porte atteinte aux droits de personne ;
2. vous cédez à Bobine, à titre gratuit, pour le monde entier et pour toute la durée de la protection, l'ensemble des droits patrimoniaux sur la contribution, pour tous les modes d'exploitation, y compris les droits de reproduction, de représentation, d'adaptation, de traduction, de distribution et de licence, sous toutes formes et sur tous supports ;
3. Bobine peut utiliser la contribution sous la licence du dépôt ou sous toute autre licence de son choix ;
4. vos droits moraux, que la loi ne permet pas de céder, sont conservés : vous pouvez être cité comme contributeur si vous le demandez.

Si vous ne pouvez pas accepter cela, ne soumettez pas de code : vous pouvez toujours ouvrir un ticket pour décrire le problème ou l'idée, et le mainteneur écrira le changement.

Les contributions au logiciel Bobine se font dans [son propre dépôt](https://github.com/FantasmaGlad/Bobine), sous sa propre licence.

## Historique du document

| Date | Modification |
|---|---|
| 2026-10-13 | Adoption du guide de contribution. |
