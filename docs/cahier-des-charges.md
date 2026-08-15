# Cahier des charges — Site web Bobine (BobineWeb)

Statut : validé à l'issue d'un entretien de cadrage avec le porteur du projet, puis implémenté — le site est en production sur bobine.fit. Le §16 documente désormais l'état **réel** du projet (structure, MCP, dépendances), et non plus la proposition initiale de scaffolding ; voir aussi `Start.md` pour l'historique du setup.

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
- `/demo-3d` — démo 3D interactive (Wyse 5070 + écran, Three.js/`@react-three/fiber`) : test de faisabilité né en cours de route, hors périmètre V1 initial mais désormais dans la navigation principale — voir §16.1 pour la stack.
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

### 16.1. Arborescence de fichiers (état actuel)

```
BobineWeb/
├── .claude/                     # gitignored — config locale agent Claude Code
│   └── launch.json              # preview du serveur de dev
├── .gemini/                     # gitignored — miroir de .mcp.json pour Gemini CLI
│   └── settings.json
├── .agent/ , .agents/           # gitignorés, réservés à d'autres outils agent IA locaux
│                                 # (vides pour l'instant — même convention que Bobine/.gitignore)
├── .github/
│   └── workflows/
│       └── ci.yml               # lint + build sur push/PR
├── .mcp.json                    # serveurs MCP du projet (GitHub, Vercel — cf. §16.2)
├── assets/                      # gitignored — sources brutes des modèles 3D/vidéos (dizaines de Mo,
│   ├── models/                  # jamais commitées ; seule la version optimisée dans public/ l'est)
│   └── Video/
├── docs/
│   ├── cahier-des-charges.md    # ce document
│   └── cahier-des-charges-ui-ux.md
├── public/
│   ├── logo-bobine.png
│   ├── logo-bobine-icon.png
│   ├── models/                  # modèles glTF Binary optimisés (gltf-transform : simplification
│   │   ├── wyse5070.glb         # géométrique + compression meshopt + textures WebP)
│   │   └── tv3d.glb
│   └── videos/                  # vidéos de démo compressées (ffmpeg) — gitignored tant qu'aucun
│                                 # contenu libre de droit n'a remplacé le placeholder de test
├── src/
│   ├── app/
│   │   ├── [locale]/            # "fr" | "en" — routing i18n (cf. §9)
│   │   │   ├── page.tsx                        # accueil
│   │   │   ├── fonctionnalites/page.tsx
│   │   │   ├── demo-3d/page.tsx                # démo 3D interactive (cf. §4)
│   │   │   ├── documentation/
│   │   │   │   ├── layout.tsx                  # mise en page à sidebar
│   │   │   │   ├── page.tsx                    # vue d'ensemble
│   │   │   │   ├── demarrage-rapide/page.mdx    # tutoriel d'installation (priorité n°1)
│   │   │   │   ├── utilisation/page.mdx
│   │   │   │   ├── faq/page.mdx
│   │   │   │   └── developpeurs/page.mdx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                    # liste, alimentée par l'API GitHub Releases
│   │   │   │   └── [slug]/page.tsx             # rendu Markdown + pièces jointes GitHub (vidéo/image)
│   │   │   ├── soutenir/page.tsx
│   │   │   ├── a-propos/page.tsx
│   │   │   ├── mentions-legales/page.tsx
│   │   │   ├── confidentialite/page.tsx
│   │   │   └── opengraph-image.tsx             # image de partage générée dynamiquement
│   │   ├── icon.png              # favicon (convention Next.js, pas de favicon.ico séparé)
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── globals.css          # tokens de design, système des 13 thèmes (cf. §3 du volet UI/UX)
│   ├── components/
│   │   ├── icons/                # GitHubIcon, CoffeeCupIcon
│   │   ├── three/                # scène 3D : PowerDemoScene, TvModel, WyseModel, PowerDemoLoader
│   │   ├── Header.tsx, Footer.tsx, ThemeSwitcher.tsx, LocaleSwitcher.tsx
│   │   ├── DocsSidebar.tsx       # navigation de la documentation (section active)
│   │   ├── GitHubAttachmentMedia.tsx  # <video>/<img> pour les pièces jointes GitHub du blog
│   │   └── Shot.tsx              # emplacement capture d'écran/GIF (placeholder tutoriel)
│   ├── lib/
│   │   ├── i18n.ts
│   │   ├── themes.ts
│   │   └── github-releases.ts   # fetch des releases Bobine pour le blog
│   ├── messages/                # dictionnaires de traduction fr.json / en.json
│   ├── mdx-components.tsx
│   └── proxy.ts                 # middleware de routing i18n
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
- `.agent/` et `.agents/` sont réservés dans `.gitignore` pour la config locale d'autres outils agent IA (au cas où), même s'ils sont vides actuellement — seuls `.claude/` et `.gemini/` sont réellement utilisés à ce jour.

### 16.3. `package.json` (dépendances — état actuel)

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
    "@mdx-js/loader": "^3",
    "@mdx-js/react": "^3",
    "@next/mdx": "16.3.1",
    "@react-three/drei": "^10.7.8",
    "@react-three/fiber": "^9.7.0",
    "@vercel/analytics": "^2.0.1",
    "meshoptimizer": "^1.2.0",
    "next": "16.3.1",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1",
    "three": "^0.185.1"
  },
  "devDependencies": {
    "@types/mdx": "^2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.185.4",
    "eslint": "^9",
    "eslint-config-next": "16.3.1",
    "typescript": "^5"
  }
}
```

Notes sur les écarts avec la proposition initiale :
- `next-intl` n'a finalement pas été retenu : l'i18n est faite « à la main » (`src/lib/i18n.ts` + `src/messages/*.json` + `src/proxy.ts`), plus simple pour le volume de contenu du site.
- `react-markdown` + `remark-gfm` : rendu du corps des releases GitHub sur le blog.
- `three`, `@react-three/fiber`, `@react-three/drei`, `meshoptimizer` : ajoutés pour la démo 3D (`/demo-3d`, cf. §4) — chargés uniquement sur cette route (`next/dynamic`, `ssr: false`), sans impact sur le poids des autres pages.

## 17. Historique et suite

Étapes initiales (toutes réalisées, cf. `Start.md`) : validation du cahier des charges, création du dépôt, scaffolding Next.js suivant la structure du §16, construction de la page d'accueil et du tutoriel d'installation, extension au reste de l'arborescence, intégration et ajustement de la scène 3D (voile TV plaqué bord à bord, vidéo de démo versionnée, header sticky au défilement).

Suite envisagée :
- Remplacer la vidéo de démo de `/demo-3d` (`kiosk-demo.mp4`) par une capture HD finale du logiciel avant toute mise en avant de cette page.
- Explorer un rendu "live" (DOM/iframe plaqué en 3D) de l'écran du kiosk sur `/demo-3d`, en complément de la vidéo pré-enregistrée actuelle.

---

*Document rédigé par entretien de cadrage — réponses retenues : portée complète dès la V1 ; stack Next.js + MDX ; hébergement Vercel avec portabilité vers un auto-hébergement futur (DuckDNS) ; bilingue FR/EN dès le lancement ; aucun tracking ; tutoriel d'installation entièrement nouveau (pas une reprise du README) ; page de soutien simple (dons) ; communauté centrée sur GitHub ; éditeur du site « Fanta », contact clement.barillot3901@gmail.com ; dépôt github.com/FantasmaGlad/BobineWeb ; blog automatique depuis les releases GitHub ; pas de page comparatif dédiée ; logo actuel conservé tel quel.*
