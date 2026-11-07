# Synchronisation documentaire

Deux index distants servent uniquement à la recherche documentaire des mainteneurs : `bobine-web-store` (documentation du site et fichiers canoniques de Bobine) et `bobine-frameworks-store` (documentations officielles aux versions verrouillées). Le site n’a plus de lecteur de ces index : l’assistant Baamix et la recherche distante ont été retirés ; la recherche de la documentation est statique et locale.

Le corpus web reprend les chapitres et la FAQ de `src/content/docs`, puis `docs/ARCHITECTURE.md`, `docs/ARCHITECTURE.en.md`, `assistant/README.md` (assistant d’installation), `media/README.md` et `media/PROTOCOL.md` du dépôt Bobine. Le corpus frameworks reprend neuf sources Git versionnées : Next.js, Tauri, FFmpeg, Pydantic, FastAPI et systemd. Aucun document interne, fichier d’environnement ni conversation n’est exporté.

```sh
npm run test:rag
npm run check:rag -- --corpus=web
npm run sync:rag
```

Le checkout de Bobine est cherché dans `../Bobine`, puis `../../Bobine`, ou au chemin `BOBINE_SOURCE_DIR`. Les scripts utilisent les Application Default Credentials en local et une identité GitHub fédérée en CI. Le compte de synchronisation dispose des droits d’import et de mise à jour ; le compte de lecture n’effectue que des recherches. Les variables sont décrites dans `.env.example`.

Chaque document porte un identifiant stable, un hash de contenu, la plateforme, la langue, l’URL source et, pour les frameworks, la version et la révision. L’empreinte ne couvre que le texte et l’identité documentaire : une URL ou une révision qui bouge ne réimporte pas le corpus. `sources.lock.json` fige les commits des sources Git ; les versions Next.js suivent les deux `package-lock.json`, Tauri suit `Cargo.lock`. La documentation Tauri est un instantané du site documentaire de la majeure 2 : elle n’est pas une référence exacte de chaque patch du runtime. Les versions Python, FFmpeg et systemd sont des cibles documentaires explicites ; elles ne prouvent pas la version installée sur tous les appareils. Pour changer ces cibles, modifier `upstream.mjs`, puis régénérer et examiner le verrou.

Une synchronisation :

1. Exporte et contrôle les sources ; refuse un corpus vide, les doublons et les secrets locaux.
2. Ne téléverse que les nouveaux contenus, dans le préfixe `sync-v2/` du bucket.
3. Déclenche un import incrémental Discovery Engine et attend son résultat. Un échec transitoire précisément identifié peut être repris une seule fois, après vérification de son objet GCS ; une erreur permanente, une reprise échouée ou un nombre de documents incorrect est un échec.
4. Vérifie que la génération est interrogeable, avec les filtres de métadonnées, pour chaque framework.
5. Désactive les documents retirés des sources, puis enregistre le manifeste vérifié. Les contenus historiques restent récupérables ; aucune purge de bucket n’est effectuée.

Le workflow `rag-sync.yml` s’exécute après chaque changement des sources sur `main` et une fois par jour à 4 h 23 UTC. Le passage quotidien récupère la branche principale de Bobine et rattrape les changements d’architecture et de verrous ; une publication du site est indexée en quelques minutes par le déclenchement sur `push`. Une modification locale n’est synchronisée que par l’exécution explicite de `npm run sync:rag`. Un workflow échoué reste visible dans GitHub Actions ; il n’est jamais présenté comme une synchronisation réussie.

Les documents sont indexés par sous-section et par question de FAQ, avec un court document de navigation par chapitre : une recherche tombe sur la bonne section plutôt que sur un chapitre entier. Les longues spécifications sont découpées par paquets d’environ 8 000 caractères, sans perte. Les recherches excluent les fiches sans métadonnées et les documents désactivés ; le paramètre de version applique une égalité exacte. Le corpus web contient 163 documents (environ 135 Kio) et le corpus frameworks 1 178 documents (environ 11 Mio) au 2026-11-07.

## Qualité de recherche

`relaxQuery` (dans `results.mjs`) transforme une question en mots alternatifs, car le moteur exige sinon tous les mots. Un mot isolé est ancré sur « bobine » pour le corpus web ; la recherche de frameworks n’utilise pas d’ancre. Le filtre `ACTIVE_FILTER` et `frameworkFilter` sont partagés par la synchronisation, la recherche et les tests : ne jamais les dupliquer.
