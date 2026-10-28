# Synchronisation documentaire

Le site utilise les chapitres et le catalogue publics comme sources. Le corpus technique reprend les fichiers canoniques du dépôt Bobine, puis des documentations officielles versionnées. Aucun document de suivi interne, fichier d’environnement ni conversation n’est exporté.

```sh
npm run test:rag
npm run check:rag -- --corpus=web
npm run sync:rag
```

Le checkout de Bobine est recherché dans `../Bobine`, puis dans `../../Bobine` (dossiers regroupés sous un dossier parent), ou au chemin `BOBINE_SOURCE_DIR`. Les scripts utilisent les Application Default Credentials localement et une identité GitHub fédérée en CI. Le compte de synchronisation dispose de droits d’import et de mise à jour ; le compte utilisé par le site est distinct. Les variables sont décrites dans `.env.example`.

Chaque document porte un identifiant stable, un hash de contenu, la plateforme, la langue, l’URL source et, pour les frameworks, la version et la révision. `sources.lock.json` fige les sources Git. Les versions Next.js suivent les deux package-lock ; Tauri suit Cargo.lock. La documentation Tauri est un instantané du site documentaire de la majeure 2 : elle n’est pas une référence exacte de chaque patch du runtime. Les versions Python, FFmpeg et systemd sont des cibles documentaires explicites ; elles ne prouvent pas la version installée sur tous les appareils. Pour changer ces cibles, modifier `upstream.mjs`, puis régénérer et examiner le verrou. Les références Linux sans tag sont identifiées par leur URL et leur hash de contenu.

Une synchronisation :

1. Exporte et contrôle les sources ; refuse un corpus vide, les doublons et les secrets locaux.
2. Ne téléverse que les nouveaux contenus, dans le préfixe `sync-v2/` du bucket.
3. Déclenche un import incrémental Discovery Engine et attend son résultat. Un échec transitoire précisément identifié peut être repris une seule fois, après vérification de son objet GCS ; une erreur permanente, une reprise échouée ou un nombre de documents incorrect est un échec.
4. Vérifie que la génération est interrogeable, avec les filtres de métadonnées, pour chaque framework.
5. Désactive les documents retirés des sources, puis enregistre le manifeste vérifié. Les contenus historiques restent récupérables ; aucune purge de bucket n’est effectuée.

Une génération inchangée ne déclenche pas de nouvel import ; sa recherche est néanmoins vérifiée. Les recherches du site et des outils de recherche excluent les anciennes fiches sans métadonnées et les documents désactivés. Le paramètre de version des outils de recherche applique une égalité exacte et ne reformule pas simplement la requête.

Le workflow `rag-sync.yml` s’exécute après les changements des sources du site sur main et chaque heure à la minute 23 UTC. Le passage horaire récupère également la branche principale de Bobine et rattrape les changements d’architecture et de verrous. Une modification locale n’est synchronisée que par l’exécution explicite de la commande. Un workflow échoué reste visible dans GitHub Actions ; il n’est jamais présenté comme une synchronisation réussie.

La recherche du site dispose d’un délai limité et conserve le contexte local en cas d’échec. La génération de la réponse reste dépendante du fournisseur d’inférence. Les nouvelles variables Vercel ne sont prises en compte qu’à la création d’un déploiement.
