# Cahier des charges — Site web Bobine (BobineWeb)

Statut : validé à l'issue d'un entretien de cadrage avec le porteur du projet. Prêt pour le scaffolding technique (§17, voir aussi `Start.md`).

## 1. Contexte et objectif

Bobine (l'alternative open-source et auto-hébergée à LesMills Cinema, licence AGPL-3.0) vient de publier sa **V2.0.0** sur GitHub. Le nom de domaine **bobine.fit** a été acheté. Le produit dispose déjà d'un README bilingue et d'une documentation technique (`docs/ARCHITECTURE.md`), mais pas de site web dédié — alors que le README du projet annonce déjà ce site comme prochaine étape.

**Objectif de BobineWeb** : un site vitrine qui présente Bobine et convainc, et qui héberge la documentation ainsi que le tutoriel d'installation. Priorité explicite : s'adresser **en premier au consommateur** (gérant de salle non technicien), **en second au développeur**.

## 2. Public cible et priorités

1. **Prioritaire — le consommateur.** Gérant ou coach de salle de sport, studio boutique, hôtel, espace kiné/rééducation, à la recherche d'une alternative à LesMills Cinema. Ne connaît pas forcément git ni la ligne de commande. Vient sur le site pour comprendre ce qu'est Bobine, se convaincre (vs. solution propriétaire), puis être guidé pas à pas jusqu'à une salle qui diffuse ses cours.
2. **Secondaire — le développeur/contributeur.** Vient consulter l'architecture technique, l'API, ou contribuer au dépôt GitHub.

Conséquence directe sur la hiérarchie de l'information : la navigation principale met en avant la vitrine et un tutoriel d'installation grand public bien visible ; la documentation développeur reste accessible mais en retrait (rubrique dédiée, pas la porte d'entrée).

## 3. Périmètre (in / out V1)

Portée retenue : **site complet dès le départ** (pas de MVP minimal suivi d'itérations).

**In (V1)** : vitrine, documentation consommateur + développeur, tutoriel d'installation, blog/changelog, page de soutien au projet, pages légales, bilingue FR/EN.

**Out (V1)** — voir détail au §16.

## 4. Arborescence proposée (sitemap)

- `/` — Accueil : pitch, pourquoi Bobine (vs. LesMills Cinema), fonctionnalités clés, démo, CTA vers le tutoriel d'installation.
- `/fonctionnalites` — détail des fonctionnalités (planification, borne à la demande, radio, télécommande, mode coach audio...).
- `/documentation` — racine de la doc, avec sous-sections :
  - `/documentation/demarrage-rapide` — **tutoriel d'installation pas-à-pas grand public** (priorité n°1, voir §5).
  - `/documentation/utilisation` — guide d'utilisation (admin, cinéma membre, radio, télécommande).
  - `/documentation/faq` — FAQ / dépannage.
  - `/documentation/developpeurs` — doc technique (synthèse + liens vers `ARCHITECTURE.md`, API, guide de contribution).
- `/blog` — actualités, notes de version. **Généré automatiquement** à partir des tags/releases GitHub du dépôt `Bobine` (pas de rédaction manuelle en V1).
- `/soutenir` — soutenir le projet (dons).
- `/a-propos` — histoire du projet, licence.
- `/mentions-legales`, `/confidentialite` — pages légales.
- Lien externe mis en avant : dépôt GitHub (code, Issues, Discussions, Releases).

Le téléchargement ne nécessite pas de page dédiée : un bouton « Installer Bobine » renvoie vers `/documentation/demarrage-rapide`, qui elle-même s'appuie sur `git clone` + `install.sh` (pas de binaire à télécharger séparément).

## 5. Documentation & tutoriel d'installation — exigence prioritaire

C'est la fonctionnalité explicitement requise en premier :

- **Public visé** : un gérant de salle non technicien, du premier contact avec Bobine jusqu'à une salle qui diffuse ses cours — sans présupposer de connaissances git/ligne de commande au-delà du strict nécessaire.
- **Contenu neuf**, pas une simple reprise du README : captures d'écran/GIFs annotés à chaque étape sensible (flashage de la clé USB, installation Debian, `git clone` + `sudo ./install.sh`, première ouverture de `bobine.local`).
- La documentation technique existante (`docs/ARCHITECTURE.md`, déjà exhaustive) reste la référence de fond pour le public développeur ; la doc du site en est la version grand public, avec des liens vers elle pour qui veut aller plus loin.
- Recherche full-text : non nécessaire en V1 vu le volume raisonnable de contenu prévu (sommaire + ancrage par page suffisent) — à revoir si le volume de doc grandit.
- Pas de versionnage multi-release en V1 (cycle de release encore jeune) : une seule doc « dernière version ».

## 6. Identité visuelle & design

- **Logo existant** (`Bobine/Assets/Images/logo_bobine.png` + icône) : un « B » en pellicule de film enroulée autour d'un hamster endormi, noir sur blanc — ton sobre et attachant. Réutilisé tel quel pour le site.
- **Couleur d'accent** : reprise du rouge de marque déjà utilisé dans l'application (`--accent-primary: #e4002b`, thème « clair » par défaut de Bobine) comme couleur d'accent du site, pour une cohérence visuelle produit ↔ site.
- Base neutre noir / blanc / gris, cohérente avec un logo en noir et blanc.
- Mode sombre à prévoir (a minima clair/sombre automatique) — cohérent avec un produit qui propose lui-même 13 thèmes.
- Ton éditorial direct et concret, orienté bénéfice pour le gérant de salle (« vous gardez le contrôle », « ça marche hors ligne ») plutôt que jargon SaaS.
- **Logo** : confirmé suffisant tel quel pour un usage web (favicon, déclinaisons de tailles) — pas de rafraîchissement graphique prévu en V1.

## 7. Stack technique

- **Next.js (App Router) + TypeScript**, contenu doc/blog en **MDX** — cohérent avec le frontend Bobine déjà en Next.js/TS, réutilisation directe de compétences et d'outillage.
- Pas de CMS externe en V1 : contenu en fichiers MDX versionnés dans le dépôt `BobineWeb` (pas de dépendance tierce imposée, cohérent avec l'esprit du produit). À reconsidérer si le volume de contenu grandit beaucoup ou si une personne non technique doit pouvoir éditer sans passer par git.
- Rendu à privilégier : `next build && next start` (ou export statique si aucune brique serveur n'est nécessaire) pour rester exécutable n'importe où — voir contrainte de portabilité au §8.

## 8. Hébergement & déploiement

- **Dépôt** : [github.com/FantasmaGlad/BobineWeb](https://github.com/FantasmaGlad/BobineWeb) (à créer, public comme le reste du projet).
- **Clé de déploiement** : une paire de clés SSH dédiée a été générée (`~/.ssh/bobineweb_deploy`), suivant le même schéma que les autres dépôts de ce poste (alias `github.com-bobineweb` dans `~/.ssh/config`). La clé publique est à coller dans *BobineWeb → Settings → Deploy keys* (cocher *Allow write access* pour pouvoir pousser depuis ce poste) — clé publique reproduite dans `Start.md`.
- **V1 : Vercel**, projet lié au dépôt GitHub `BobineWeb`, déploiement automatique à chaque push sur `main`, previews sur chaque pull request. Palier gratuit suffisant pour un site vitrine.
- DNS : `bobine.fit` pointé vers Vercel.
- **Contrainte de portabilité explicitement demandée** : garder la possibilité de migrer un jour vers un hébergement personnel (matériel perso + DuckDNS). En conséquence : éviter les briques propriétaires Vercel non standard (Vercel KV/Blob, logique Edge Middleware avancée) sauf besoin clairement justifié, pour que le site reste déployable ailleurs sans réécriture.

## 9. Internationalisation (FR / EN)

- Bilingue **dès le lancement**, cohérent avec le README déjà bilingue.
- Routing par préfixe de langue (`/fr/...`, `/en/...`), sélecteur de langue explicite (pas seulement une détection automatique silencieuse).
- Contrainte de charge de travail à anticiper : tout contenu publié doit exister dans les deux langues dès la V1 (pas de FR complet + EN partiel qui traîne).

## 10. Analytics & vie privée

- **Vercel Web Analytics activé** (`@vercel/analytics`) — cookieless, n'identifie pas les visiteurs individuellement, pas de bandeau de consentement nécessaire. Décision révisée par rapport au « aucun tracking » initial : ce choix reste cohérent avec le positionnement du produit (pas de Google Analytics, pas de profilage), tout en donnant une visibilité basique sur la fréquentation.
- Toujours pas de Google Analytics ni d'équivalent avec cookies/profilage.

## 11. Pages légales & conformité

- **Mentions légales** : éditeur du site — **Fanta** —, contact : **clement.barillot3901@gmail.com**, hébergeur : Vercel Inc. Projet non commercial (pas de vente, dons volontaires uniquement, cf. §12) : les mentions restent volontairement simples (identité de l'éditeur + contact, hébergeur), sans donnée d'entreprise puisqu'il n'y en a pas.
- **Contact** : pas de formulaire dédié — un simple lien `mailto:clement.barillot3901@gmail.com` sur le site (évite d'avoir besoin d'une brique serveur pour le formulaire, cohérent avec la contrainte de portabilité du §8).
- **Politique de confidentialité** : minimale vu l'absence de tracking et de compte utilisateur ; à publier dès qu'un lien de don ou un embed tiers (ex. vidéo GitHub) peut déposer un cookie.
- Pas de bandeau cookie nécessaire tant qu'aucun tracking ni cookie non essentiel n'est posé.

## 12. Soutien au projet

- Page « Soutenir » simple : lien [Ko-fi](https://ko-fi.com/fantasmaglad) (GitHub Sponsors non disponible sur le compte au moment du lancement), sans promesse de service commercial. Pas de tarification ni de facturation à gérer en V1.

## 13. Communauté & support

- Un seul canal mis en avant : **GitHub** (Issues pour les bugs, Discussions pour les questions/idées). Le site pointe vers ces deux entrées plutôt que de dupliquer un système de support propre.

## 14. SEO

Le README cible déjà une liste de mots-clés (« alternative open source à LesMills Cinema », « logiciel de planification de cours collectifs », etc.) — le site doit reprendre et étendre ce positionnement : title/meta par page, `sitemap.xml`, Open Graph (image de partage avec le logo), données structurées (`Organization`/`SoftwareApplication`) pertinentes.

## 15. Non-objectifs (V1)

- Pas d'espace compte utilisateur / logique SaaS.
- Pas de Discord ni de forum dédié (GitHub seul suffit, cf. §13).
- Pas d'offre commerciale payante (installation/support facturé) — seulement des dons, cf. §12.
- Pas de multi-version de la documentation.
- Pas de CMS headless externe.
- Pas de page comparatif dédiée face à LesMills Cinema (le ton « Pourquoi Bobine » de la home suffit) — confirmé, à reconsidérer plus tard si besoin.

## 16. Structure technique détaillée

### 16.1. Arborescence de fichiers proposée

```
BobineWeb/
├── .claude/
│   ├── launch.json              # preview du serveur de dev (cf. Bobine/.claude/launch.json)
│   └── settings.local.json      # gitignored
├── .github/
│   └── workflows/
│       └── ci.yml               # build + lint sur push/PR (miroir du ci.yml de Bobine)
├── .mcp.json                    # serveurs MCP du projet (GitHub, Vercel — cf. §16.2)
├── docs/
│   └── cahier-des-charges.md    # ce document
├── public/
│   ├── favicon.ico
│   ├── logo-bobine.png          # copié depuis Bobine/Assets/Images/logo_bobine.png
│   ├── logo-bobine-icon.png     # copié depuis Bobine/Assets/Images/logo_bobine_icon.png
│   └── og-image.png             # image de partage réseaux sociaux
├── src/
│   ├── app/
│   │   ├── [locale]/            # "fr" | "en" — routing i18n (cf. §9)
│   │   │   ├── page.tsx                        # accueil
│   │   │   ├── fonctionnalites/page.tsx
│   │   │   ├── documentation/
│   │   │   │   ├── page.tsx                    # sommaire de la doc
│   │   │   │   ├── demarrage-rapide/page.mdx    # tutoriel d'installation (priorité n°1)
│   │   │   │   ├── utilisation/page.mdx
│   │   │   │   ├── faq/page.mdx
│   │   │   │   └── developpeurs/page.mdx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                    # liste, alimentée par l'API GitHub Releases
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── soutenir/page.tsx
│   │   │   ├── a-propos/page.tsx
│   │   │   ├── mentions-legales/page.tsx
│   │   │   └── confidentialite/page.tsx
│   │   ├── layout.tsx
│   │   ├── sitemap.ts
│   │   └── globals.css          # tokens de design (--accent-primary: #e4002b, etc.)
│   ├── components/
│   │   ├── nav/
│   │   ├── docs/                # sommaire doc, fil d'ariane
│   │   └── ui/
│   ├── content/                 # MDX non lié à une route (fragments réutilisables)
│   ├── lib/
│   │   ├── i18n.ts
│   │   └── github-releases.ts   # fetch des releases Bobine pour le blog
│   └── messages/                # dictionnaires de traduction fr.json / en.json
├── scripts/
│   └── sync-og-assets.ts        # optionnel : régénère les images de partage
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

### 16.2. Configuration MCP (`.mcp.json`)

Deux serveurs MCP couvrent l'essentiel des besoins (GitHub pour le dépôt/Issues/PR, Vercel pour les déploiements) :

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "vercel": {
      "type": "http",
      "url": "https://mcp.vercel.com/FantasmaGlad/bobineweb"
    }
  }
}
```

Notes :
- Les deux serveurs utilisent OAuth : la première connexion ouvre une fenêtre de navigateur pour autoriser l'accès (**nécessite une session interactive** — ne fonctionne pas dans un agent non-interactif/headless).
- L'URL Vercel scopée `/<org>/<projet>` ne fonctionne qu'une fois le projet Vercel créé et lié au dépôt ; en attendant, utiliser `https://mcp.vercel.com` (portée compte entier) puis affiner.
- Alternative en ligne de commande, équivalente à ce fichier :
  ```bash
  claude mcp add --transport http github https://api.githubcopilot.com/mcp/
  claude mcp add --transport http vercel https://mcp.vercel.com
  ```
- **Gemini CLI** : mêmes serveurs configurés en local dans `.gemini/settings.json` (format `httpUrl` au lieu de `type`/`url`) — fichier volontairement non versionné (cf. `.gitignore`, même convention que `Bobine/.gitignore` pour l'outillage IA local).

### 16.3. `package.json` (dépendances de départ)

```json
{
  "name": "bobineweb",
  "version": "0.1.0",
  "private": true,
  "license": "AGPL-3.0-or-later",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.10",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "next-intl": "^3",
    "@next/mdx": "^16"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/mdx": "^2",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "typescript": "^5"
  }
}
```

Versions à réaligner sur celles réellement disponibles au moment du scaffolding (`npm create next-app@latest`) plutôt que recopiées telles quelles.

## 17. Prochaines étapes

1. Validation de ce cahier des charges (retours, annotations, ajustements).
2. Création du dépôt `github.com/FantasmaGlad/BobineWeb`, ajout de la clé de déploiement (§8).
3. Scaffolding Next.js suivant la structure du §16 — voir `Start.md` pour le prompt d'exécution complet.
4. Construction en priorité de la page d'accueil et du tutoriel d'installation (le cœur de la mission), puis extension au reste de l'arborescence.

---

*Document rédigé par entretien de cadrage — réponses retenues : portée complète dès la V1 ; stack Next.js + MDX ; hébergement Vercel avec portabilité vers un auto-hébergement futur (DuckDNS) ; bilingue FR/EN dès le lancement ; aucun tracking ; tutoriel d'installation entièrement nouveau (pas une reprise du README) ; page de soutien simple (dons) ; communauté centrée sur GitHub ; éditeur du site « Fanta », contact clement.barillot3901@gmail.com ; dépôt github.com/FantasmaGlad/BobineWeb ; blog automatique depuis les releases GitHub ; pas de page comparatif dédiée ; logo actuel conservé tel quel.*
