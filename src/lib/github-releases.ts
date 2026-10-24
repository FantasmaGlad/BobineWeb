import "server-only";

import { fetchRepoReleases } from "@/lib/githubApi";

export interface BobineRelease {
  slug: string;
  title: string;
  publishedAt: string;
  url: string;
  body: string;
  isPrerelease?: boolean;
}

const FALLBACK_RELEASES: BobineRelease[] = [
  {
    slug: "beta",
    title: "Bobine — Bêta & Canary (accès anticipé)",
    publishedAt: "2026-10-24T09:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/beta",
    body: `Bobine — Canaux Bêta (curé) & Canary (build automatique)

Accès anticipé aux fonctionnalités en cours de développement : le canal Bêta propose des lots sélectionnés et testés avant leur passage en Stable, tandis que le canal Canary est reconstruit automatiquement à chaque commit sur la branche principale.

Réservés aux utilisateurs ayant activé un canal anticipé dans Réglages > Mises à jour logicielles, via install.sh --channel=beta|canary, ou via l'assistant Tauri.

### Téléchargements directs du canal Bêta

- Android & Google Books : [Bobine-beta.apk](https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.apk)
- Android TV : [Bobine-TV-beta.apk](https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-TV-beta.apk)
- Windows (x86_64) : [Bobine-Setup-beta.exe](https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta.exe)
- Windows ARM64 (Snapdragon) : [Bobine-Setup-beta-arm64.exe](https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta-arm64.exe)
- Linux Bureau Debian/Ubuntu (x86_64) : [bobine_beta_amd64.deb](https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_amd64.deb)
- Linux Bureau Debian/Ubuntu ARM64 : [bobine_beta_arm64.deb](https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_arm64.deb)
- Linux Bureau Fedora/RHEL (x86_64) : [bobine-beta.x86_64.rpm](https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-beta.x86_64.rpm)
- Linux Bureau Fedora/RHEL ARM64 : [bobine-beta.aarch64.rpm](https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-beta.aarch64.rpm)
- Linux Bureau Arch Linux (x86_64) : [bobine-beta-x86_64.pkg.tar.zst](https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-beta-x86_64.pkg.tar.zst)
- macOS : [Bobine-beta.dmg](https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.dmg)
- Bobine Assistant (x86_64) : [bobine-assistant](https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-assistant)
- Bobine Assistant ARM64 : [bobine-assistant-arm64](https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-assistant-arm64)
- Script Appliance : \`curl -fsSL https://bobine.fit/install.sh | sudo bash -s -- --channel=beta\`

### Retour à la version Stable

À tout moment et sans perte de données : Réglages > Mises à jour logicielles > Canal Stable.`,
    isPrerelease: true,
  },
  {
    slug: "V5.0.5",
    title: "Bobine V5.0.5 « Résonance » — Unification des Dépôts Linux (packages.bobine.fit), Mises à Jour Multi-Distributions (.deb, .rpm, pacman), Support Étendu des Puces & Raffinement Apple Liquid Glass",
    publishedAt: "2026-10-24T12:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V5.0.5",
    body: `La version 5.0.5 « Résonance » unifie l'ensemble des dépôts de paquets Linux signés sous https://packages.bobine.fit (/debian, /fedora, /arch) pour les 16 distributions prises en charge en x86_64 et ARM64, ajoute la détection et l'installation natives des mises à jour .deb, .rpm et .pkg.tar.zst directement depuis l'application, étend la matrice de compatibilité matérielle (Qualcomm Snapdragon 8 Gen 2 / Gen 3 / 8 Elite, Snapdragon X Elite / Plus, Apple Silicon M1–M4, Intel Core Ultra / N100, AMD Ryzen, MediaTek Dimensity, Google Tensor, Raspberry Pi 5) et parachève le design Apple Liquid Glass sur les interfaces de périphériques (/devices) et de stockage (/storage).`,
    isPrerelease: false,
  },
  {
    slug: "V5.0.0",
    title: "Bobine V5.0.0 « Orchidée » — Support Natif PC ARM64 (Snapdragon, Windows ARM, Linux ARM), Google Books, Trois Canaux de Mise à Jour & Sous-titres",
    publishedAt: "2026-10-17T09:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V5.0.0",
    body: `La version 5.0.0 « Orchidée » est une version majeure : elle introduit la compatibilité native avec les PC ARM64 et processeurs Qualcomm Snapdragon X Elite / X Plus (installeur natif Windows 11 ARM64 Bobine-Setup-5.0.0-arm64.exe, paquet Linux ARM64 bobine_5.0.0_arm64.deb et binaire bobine-assistant-arm64 pour Snapdragon, NVIDIA DGX Spark, Raspberry Pi 5 et Orange Pi), ainsi que la prise en charge des Google Books via le paquet APK Android (et bientôt en téléchargement natif sur le Google Play Store). Elle déploie également un nouveau système à trois canaux de mise à jour (Stable / Bêta / Canary) avec migration transparente et déclinaison du logo officiel par canal, une nouvelle identité visuelle glassmorphism inspirée d'Apple sur l'ensemble de l'interface (16 thèmes recalibrés, recouvrement en pause façon Netflix sur /cinema, transitions animées), le support complet des sous-titres (.srt/.vtt multilingues par cours vidéo), la consolidation de la découverte réseau mDNS (bobine.local avec boucle de ré-annonce résiliente aux changements d'IP DHCP/Wi-Fi), et le glisser-déposer avec miniatures dans le planning (/schedule) et le palmarès (/metrics).`,
    isPrerelease: false,
  },
  {
    slug: "V4.0.3",
    title: "Bobine V4.0.3 — Compatibilité Firefox 157 Certifiée de Bout en Bout, Transcodage H.264 à la Demande & Diagnostic Navigateur",
    publishedAt: "2026-10-15T18:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V4.0.3",
    body: `La version 4.0.3 Stable certifie de bout en bout l'interface d'administration et l'ensemble des lecteurs réseau (/radio, /kiosk, /cinema, /coach) sur Firefox 157 via des tests automatisés (reprise d'envoi de fichiers après coupure réseau, conformité HTTP des flux vidéo et lecture H.264), introduit la génération à la demande d'une version H.264 compatible lorsqu'un navigateur client ne peut pas décoder un flux HEVC/10 bits natif sans altérer le fichier original, et ajoute un module de diagnostic local du navigateur dans les Réglages.`,
    isPrerelease: false,
  },
  {
    slug: "V4.0.2",
    title: "Bobine V4.0.2 — Support Dédié Android TV & Google TV, Résolution des Conflits HDMI et Expérience Grand Écran",
    publishedAt: "2026-10-14T09:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V4.0.2",
    body: `La version 4.0.2 Stable introduit le support officiel d'Android TV & Google TV (paquet Bobine-TV-4.0.2.apk, interface kiosque Leanback 16:9 et navigation 100% télécommande), la gestion intelligente du stockage externe amovible USB (USB-OTG / SSD / clé USB pour contourner les 4-8 Go de mémoire interne des box TV), et la fiabilisation complète du double affichage HDMI sur ordinateurs portables et tablettes avec élimination définitive des écrans noirs. Préparation de la distribution automatique via Google Play Store.`,
    isPrerelease: false,
  },
  {
    slug: "V3.0.5",
    title: "Bobine V3.0.5 — Console Régie Coach Responsive, Hub d'Ambiances Visuelles, Moteur Vidéo Gapless & Métriques d'Assiduité",
    publishedAt: "2026-09-12T18:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V3.0.5",
    body: `La version 3.0.5 Stable déploie une Console Régie Coach responsive (/coach) avec pupitre audio 64px, minuteur interpolé à 10 Hz, Stage Monitor 16:9 en direct et palette d'ambiances 1-clic. Elle intègre également le Hub d'Ambiances Visuelles (/backgrounds) avec prévisualisations vidéo 16:9 et assignation par piste musicale, le moteur vidéo Gapless A/B Deck (/cinema) avec fondu croisé de 0,4s éliminant tout écran noir inter-cours, le tableau de bord d'assiduité (/metrics) avec histogramme 24h et notation 5 étoiles, ainsi que la supervision matérielle étendue (puissance instantanée en Watts, Wh, températures CPU/GPU et RAM en MT/s).`,
    isPrerelease: false,
  },
  {
    slug: "V3.0.4",
    title: "Bobine V3.0.4 — Support Manettes & Contrôles Universels, Désinstallation Multi-Plateforme & Fiabilisation Système",
    publishedAt: "2026-09-11T16:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V3.0.4",
    body: `Bobine V3.0.4 introduit le support universel des manettes de jeu via l'API HTML5 Gamepad (Xbox Series/One, PlayStation DualSense/DualShock 4, Nintendo Switch Pro, 8BitDo) avec navigation spatiale 2D, des télécommandes multimédias physiques et de la souris sur toutes les interfaces. Cette mouture intègre le défilement horizontal fluide des titres longs (composant MarqueeText) avec imposition stricte des dimensions des miniatures 16:9, la désinstallation automatique 1-clic multi-OS (/api/system/uninstall) avec mot de passe de confirmation, l'affichage cinématique sur pause avec métadonnées FFprobe, et l'élimination définitive des saccades et du watchdog destructif.`,
    isPrerelease: false,
  },
  {
    slug: "V3.0.3",
    title: "Bobine V3.0.3 — Élimination du Gel Vidéo au Seek, Mode Cinéma Réseau et Imports Atomiques",
    publishedAt: "2026-09-10T14:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V3.0.3",
    body: `La version 3.0.3 élimine définitivement les gels d'image au seek sur décodeurs matériels stricts via une stratégie à 4 verrous (pause préalable, garde anti-réentrance, période de grâce 3s et watchdog d'images peintes). Elle déverrouille l'accès réseau à la vitrine complète du mode cinéma (/cinema), sécurise les imports vidéo via des opérations atomiques garantissant zéro orphelin corrompu, et optimise les I/O de la base SQLite sur stockage interne rapide Android.`,
    isPrerelease: false,
  },
  {
    slug: "V3.0.2",
    title: "Bobine V3.0.2 — Sortie Officielle Android Native, Accélération Matérielle Multi-OS & Qualité 4K Intégrale",
    publishedAt: "2026-09-09T20:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V3.0.2",
    body: `Bobine V3.0.2 marque la sortie officielle de l'application native Android (.apk) avec double affichage tactile / HDMI et moteur FastAPI embarqué (Chaquopy). Cette version apporte également l'accélération matérielle multi-OS du réencodage (MediaCodec, VideoToolbox, VA-API), la priorité accordée à la meilleure qualité vidéo avec conservation intégrale des flux 2K/4K natifs sans sous-échantillonnage, l'annulation réactive des imports avec estimation en direct (ETA), et les miniatures Full HD 1080p.`,
    isPrerelease: false,
  },
  {
    slug: "V3.0.1",
    title: "Bobine V3.0.1 — Canal Stable/Bêta, Dépôt APT Officiel & Fiabilité Multi-Plateformes",
    publishedAt: "2026-09-08T18:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V3.0.1",
    body: `La version 3.0.1 introduit le canal de mise à jour Stable/Bêta ("Programme Bobine Beta"), le dépôt APT officiel packages.bobine.fit/debian signé GPG pour Debian/Ubuntu, l'ouverture simultanée admin + kiosque sur PC, et la résolution dynamique des URLs réseau.`,
    isPrerelease: false,
  },
  {
    slug: "V3.0.0",
    title: "Bobine V3.0.0 — Sortie Officielle Multi-Plateforme & Souveraineté Numérique",
    publishedAt: "2026-09-06T12:53:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V3.0.0",
    body: `Bobine V3.0.0 marque l'ouverture au grand public avec des applications natives en 1 clic pour Windows, Linux et macOS, une architecture unifiée sans Redis (FastAPI + SQLite), l'anti-veille native Screen Wake Lock et la sauvegarde universelle ZIP.`,
    isPrerelease: false,
  },
  {
    slug: "V2.0.1",
    title: "Bobine V2.0.1 — Accélération Matérielle Intel/AMD & Nouvel Installeur Rapide",
    publishedAt: "2026-08-22T11:55:21Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V2.0.1",
    body: `Bobine est une régie vidéo et sonore autonome et libre (licence AGPL-3.0) conçue pour équiper les studios et salles de sport : diffusion automatique de cours collectifs programmés à la seconde, sauvegarde et restauration en un clic, borne tactile adhérent à la demande, télécommande mobile locale sans application, et radio d'ambiance 24/7 avec annonces vocales.

Incluant borne à la demande, expérience adhérent soignée — tout en gardant le contrôle total de son environnement.
Code source ouvert, données sur votre matériel, aucun compte à créer, aucun service qui peut être coupé unilatéralement.

Cette version 2.0.1 apporte le support étendu de l'accélération matérielle (Intel QuickSync et AMD Radeon VA-API), l'installateur bootstrap en 1 ligne, la gestion des modes d'installation (épuré et verbeux), ainsi que les liens vers le site officiel et le soutien communautaire.

---

## Liens Officiels & Communauté

- **Site Web Officiel & Documentation** : [https://bobine.fit](https://bobine.fit)
- **Guide de Démarrage Rapide** : [https://bobine.fit/fr/documentation/demarrage-rapide](https://bobine.fit/fr/documentation/demarrage-rapide)
- **Soutenir le Projet (Ko-fi)** : [https://ko-fi.com/fantasmaglad](https://ko-fi.com/fantasmaglad) ou [https://bobine.fit/fr/soutenir](https://bobine.fit/fr/soutenir)

---

## Pourquoi un système open source plutôt qu'une solution propriétaire

Les studios et salles de sport diffusent de plus en plus de cours vidéo pré-enregistrés, animés par un coach à l'écran. Les solutions du marché reposent presque toutes sur le même modèle : plateforme fermée, abonnement mensuel obligatoire (150 à 400 €/mois par écran), et un service qui s'arrête à la moindre coupure internet ou résiliation de contrat.

Bobine répond au même besoin avec une architecture différente :

- **Propriété des données et du matériel.** Vos vidéos, votre configuration, votre planning restent sur votre machine. Pas de compte, pas d'éditeur tiers entre vous et vos adhérents.
- **Coût maîtrisé.** Un investissement matériel unique (un mini PC d'occasion à 40–80 € suffit) et aucun abonnement récurrent.
- **Fonctionnement 100% hors ligne.** Une fois installé, la diffusion des cours ne dépend d'aucune connexion internet.
- **Continuité de service garantie.** Le code étant open source (licence AGPL-3.0), le fonctionnement du système ne dépend pas de la pérennité d'une entreprise tierce.
- **Autonomie opérationnelle.** Démarrage automatique à la mise sous tension, reprise après coupure de courant, redémarrage automatique d'un composant en panne — sans intervention technique sur place.

Studios de cycling, salles de renforcement, espaces fitness d'hôtels et d'entreprises, centres de rééducation, studios de danse : Bobine s'adapte à n'importe quel catalogue de cours collectifs, sans catégorie imposée par l'éditeur.

---

## Fonctionnalités

### Administration centralisée

L'admin web regroupe la gestion de la bibliothèque vidéo, du planning, des réglages des deux écrans et des thèmes visuels. Import par glisser-déposer, envoi en lot, miniatures automatiques, catégories libres.

https://github.com/user-attachments/assets/e33196d8-cfd7-449e-ad7f-0929a0361d10

### Planification automatique des cours

Le planning hebdomadaire se construit une fois ; les cours démarrent ensuite automatiquement à l'heure prévue, sur l'écran assigné, sans intervention le jour même.

https://github.com/user-attachments/assets/12883840-0d1e-44ef-b82c-ad5d2214af69

### Deux sorties d'écran pilotées indépendamment

Un écran câblé (HDMI, pour la borne adhérent) et un écran réseau (n'importe quel appareil avec un navigateur) sont contrôlés séparément, chacun avec son propre contenu et son propre statut, en direct.

https://github.com/user-attachments/assets/f4d1bfc1-b5bc-4961-99b3-3f48703d7c01

### Borne de sélection de cours pour l'adhérent

Un écran plein écran destiné à l'adhérent : catalogue de cours avec animation de lancement, compte à rebours du prochain cours, navigation au tactile ou à la télécommande USB, sans pilote ni appairage à configurer.

https://github.com/user-attachments/assets/887f358c-9706-4173-892e-99ecec774729

### Synchronisation des thèmes en temps réel

Un changement d'habillage visuel appliqué depuis l'admin se propage instantanément à tous les écrans connectés — câblé, réseau, mobile — sans rechargement manuel.

https://github.com/user-attachments/assets/a7c59911-2b63-4c93-b718-df29da764a8d

### Radio d'ambiance intégrée

Un lecteur de musique continu pour l'ambiance de la salle : fondu enchaîné, lecture aléatoire, et rappels vocaux programmés (consignes de sécurité, changements de poste, etc.), diffusable sur un écran ou une enceinte dédiés.

https://github.com/user-attachments/assets/4908f1fe-03d8-4f18-b1c4-772720b4d7fd

### Pilotage complet depuis un téléphone

L'ouverture de \`bobine.local\` depuis un téléphone du réseau local transforme automatiquement l'interface en télécommande, sans application à installer.

Navigation dans l'interface mobile :

https://github.com/user-attachments/assets/a48c8561-23d5-461a-93c6-182748fc3842

Sélection et lancement d'un cours à distance :

https://github.com/user-attachments/assets/d52b46ef-90c2-45ac-b98e-176a5441f763

### Mode coach audio

Diffusion d'un cours audio (comme un cours de RPM avec les 9 morceaux) sur les enceintes reliées au mini PC incluant un contrôle du fond visuel animé à l'écran, piloté depuis le mobile du coach.

https://github.com/user-attachments/assets/cf819efe-b5be-4c02-9209-40f0350cf354

---

## Fiabilité en exploitation

Bobine est conçu pour fonctionner sans supervision technique continue :

- **Supervision automatique** — un chien de garde surveille en continu l'état de la base de données et de l'écran kiosque ; un composant en panne redémarre de lui-même.
- **Reprise après coupure de courant** — l'ensemble des services redémarre automatiquement, sans remise en route manuelle.
- **Compatibilité télécommande USB native** — la borne adhérent et l'écran radio répondent directement à une télécommande USB à dongle, reconnue comme un clavier standard.
- **Aucune installation côté client** — chaque écran et chaque télécommande sont de simples pages web ; aucun logiciel à déployer en dehors du mini PC central.

---

## Prérequis & Matériel Recommandé

- **Mini PC ou thin client x86-64 standard** :
  - **Modèles Intel** : Dell Wyse 5070 (Intel Celeron J4105 ~40–50 € reconditionné), HP ProDesk 400/600 G4/G5 DM, Lenovo ThinkCentre M710q/M720q Tiny, Beelink Mini S12/EQ12 (Intel N100/N5105).
  - **Modèles AMD** : HP EliteDesk 705 G4/G5 Mini (AMD Ryzen 3/5 Pro ~60–80 € reconditionné), Lenovo ThinkCentre M715q/M725q Tiny, HP T630/T730/T740 Thin Client.
  - Le décodage matériel VA-API (Intel QuickSync / iHD ou AMD Radeon / mesa-va-drivers) est automatiquement détecté et configuré (<8% CPU en 1080p60/4K).
- **Mémoire & Stockage** : 4 Go de RAM minimum (8 Go recommandés), SSD de 64 Go à 256 Go.
- **Écrans** : Sortie HDMI principale câblée + écran réseau secondaire sur n'importe quel navigateur.
- **Réseau** : Réseau local Wi-Fi ou Ethernet (aucune connexion internet requise après installation initiale).

Internet n'est nécessaire qu'une seule fois, pour l'installation du système d'exploitation et du logiciel.

---

## Installation & Déploiement

### Option A — Commande d'installation rapide en 1 ligne (recommandée)

\`\`\`bash
curl -sSL https://bobine.fit/install.sh | bash
\`\`\`

### Option B — Clonage manuel

\`\`\`bash
git clone https://github.com/FantasmaGlad/Bobine.git
cd Bobine
sudo ./install.sh
\`\`\`

### Options de contrôle & modes d'installation

- **Interface épurée (par défaut)** : \`sudo ./install.sh\` (progression claire et sobre, logs détaillés dans \`/var/log/bobine/install-*.log\`).
- **Mode verbeux (\`-v\` ou \`--verbose\`)** : \`sudo ./install.sh -v\` ou \`curl -sSL https://bobine.fit/install.sh | bash -s -- -v\` (flux live de compilation).
- **Mode silencieux (\`-q\` ou \`--quiet\`)** : \`sudo ./install.sh -q\` (erreurs et bilan final uniquement).
- **Mode serveur seul (\`--no-kiosk\`)** : \`sudo ./install.sh --no-kiosk\` (backend sans affichage X11 local).
- **Diagnostic de santé (\`--check\`)** : \`sudo ./install.sh --check\` (vérification sans modification).

Guide d'installation complet disponible sur [https://bobine.fit/fr/documentation/demarrage-rapide](https://bobine.fit/fr/documentation/demarrage-rapide).

---

## Licence

Bobine est distribué sous licence **AGPL-3.0**. Le code source est public et auditable, les données restent sur votre matériel, et le fonctionnement du système ne dépend d'aucun service tiers ni d'aucune décision commerciale externe.

**Mots-clés :** affichage dynamique auto-hébergé, signalétique numérique salle de sport, alternative open source LesMills Cinema, planification vidéo cours collectifs, lecteur vidéo fitness à la demande, borne de cours virtuels, radio d'ambiance studio, télécommande mobile fitness, logiciel libre hors ligne, local-first, sans abonnement.`,
  },
  {
    slug: "V2.0.0",
    title: "Bobine V2.0.0 — Official Release",
    publishedAt: "2026-08-16T17:00:00Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V2.0.0",
    body: `Bobine est une régie vidéo et sonore autonome et libre (licence AGPL-3.0) conçue pour équiper les studios et salles de sport : diffusion automatique de cours collectifs programmés à la seconde, sauvegarde et restauration en un clic, borne tactile adhérent à la demande, télécommande mobile locale sans application, et radio d'ambiance 24/7 avec annonces vocales.

Incluant borne à la demande, expérience adhérent soignée — tout en gardant le contrôle total de son environnement.
Code source ouvert, données sur votre matériel, aucun compte à créer, aucun service qui peut être coupé unilatéralement.

Cette version 2.0 marque la maturité du produit : robustesse à toute épreuve (redémarrage, coupure de courant, panne d'un composant), pilotage mobile complet, et une expérience adhérent stable sur grand écran via télécommande / souris comme sur téléphone pour les administrateurs.

---

## Pourquoi un système open source plutôt qu'une solution propriétaire

Les studios et salles de sport diffusent de plus en plus de cours vidéo pré-enregistrés, animés par un coach à l'écran. Les solutions du marché reposent presque toutes sur le même modèle : plateforme fermée, abonnement mensuel obligatoire, et un service qui s'arrête à la moindre coupure internet ou résiliation de contrat.

Bobine répond au même besoin avec une architecture différente :

- **Propriété des données et du matériel.** Vos vidéos, votre configuration, votre planning restent sur votre machine. Pas de compte, pas d'éditeur tiers entre vous et vos adhérents.
- **Coût maîtrisé.** Un investissement matériel unique (un mini PC ou thin client d'occasion suffit) et aucun abonnement récurrent.
- **Fonctionnement hors ligne.** Une fois installé, la diffusion des cours ne dépend d'aucune connexion internet.
- **Continuité de service garantie.** Le code étant open source (licence AGPL-3.0), le fonctionnement du système ne dépend pas de la pérennité d'une entreprise tierce.
- **Autonomie opérationnelle.** Démarrage automatique à la mise sous tension, reprise après coupure de courant, redémarrage automatique d'un composant en panne — sans intervention technique sur place.

---

## Fonctionnalités de la version 2.0

### Administration centralisée

L'admin web regroupe la gestion de la bibliothèque vidéo, du planning, des réglages des deux écrans et des thèmes visuels. Import par glisser-déposer, envoi en lot, miniatures automatiques, catégories libres.

https://github.com/user-attachments/assets/e33196d8-cfd7-449e-ad7f-0929a0361d10

### Planification automatique des cours

Le planning hebdomadaire se construit une fois ; les cours démarrent ensuite automatiquement à l'heure prévue, sur l'écran assigné, sans intervention le jour même.

https://github.com/user-attachments/assets/12883840-0d1e-44ef-b82c-ad5d2214af69

### Deux sorties d'écran pilotées indépendamment

Un écran câblé (HDMI, pour la borne adhérent) et un écran réseau (n'importe quel appareil avec un navigateur) sont contrôlés séparément, chacun avec son propre contenu et son propre statut, en direct.

https://github.com/user-attachments/assets/f4d1bfc1-b5bc-4961-99b3-3f48703d7c01

### Borne de sélection de cours pour l'adhérent

Un écran plein écran destiné à l'adhérent : catalogue de cours avec animation de lancement, compte à rebours du prochain cours, navigation au tactile ou à la télécommande USB, sans pilote ni appairage à configurer.

https://github.com/user-attachments/assets/887f358c-9706-4173-892e-99ecec774729

### Synchronisation des thèmes en temps réel

Un changement d'habillage visuel appliqué depuis l'admin se propage instantanément à tous les écrans connectés — câblé, réseau, mobile — sans rechargement manuel.

https://github.com/user-attachments/assets/a7c59911-2b63-4c93-b718-df29da764a8d

### Radio d'ambiance intégrée

Un lecteur de musique continu pour l'ambiance de la salle : fondu enchaîné, lecture aléatoire, et rappels vocaux programmés (consignes de sécurité, changements de poste, etc.), diffusable sur un écran ou une enceinte dédiés.

https://github.com/user-attachments/assets/4908f1fe-03d8-4f18-b1c4-772720b4d7fd

### Pilotage complet depuis un téléphone

L'ouverture de \`bobine.local\` depuis un téléphone du réseau local transforme automatiquement l'interface en télécommande, sans application à installer.

https://github.com/user-attachments/assets/a48c8561-23d5-461a-93c6-182748fc3842

### Mode coach audio

Diffusion d'un cours audio sur les enceintes reliées au mini PC incluant un contrôle du fond visuel animé à l'écran, piloté depuis le mobile du coach.

https://github.com/user-attachments/assets/cf819efe-b5be-4c02-9209-40f0350cf354

---

## Fiabilité en exploitation

Bobine est conçu pour fonctionner sans supervision technique continue :

- **Supervision automatique** — un chien de garde surveille en continu l'état de la base de données et de l'écran kiosque ; un composant en panne redémarre de lui-même.
- **Reprise après coupure de courant** — l'ensemble des services redémarre automatiquement, sans remise en route manuelle.
- **Compatibilité télécommande USB native** — la borne adhérent et l'écran radio répondent directement à une télécommande USB à dongle, reconnue comme un clavier standard.
- **Aucune installation côté client** — chaque écran et chaque télécommande sont de simples pages web ; aucun logiciel à déployer en dehors du mini PC central.

---

## Licence

Bobine est distribué sous licence **AGPL-3.0**. Le code source est public et auditable.`,
  },
];

export async function getBobineReleases(): Promise<BobineRelease[]> {
  const releases = await fetchRepoReleases();
  if (!releases || releases.length === 0) return FALLBACK_RELEASES;

  return releases.map((release) => ({
    slug: release.tag_name,
    title: release.name || release.tag_name,
    publishedAt: release.published_at ?? "",
    url: release.html_url,
    body: release.body ?? "",
    isPrerelease: Boolean(release.prerelease || release.tag_name.toLowerCase() === "beta"),
  }));
}

export async function getBobineRelease(
  slug: string
): Promise<BobineRelease | null> {
  const releases = await getBobineReleases();
  return releases.find((release) => release.slug.toLowerCase() === slug.toLowerCase()) ?? null;
}

export async function getBobineStableReleases(): Promise<BobineRelease[]> {
  const releases = await getBobineReleases();
  const stable = releases.filter((release) => !release.isPrerelease);
  return stable.length > 0 ? stable : FALLBACK_RELEASES.filter((r) => !r.isPrerelease);
}

export async function getBobineBetaRelease(): Promise<BobineRelease | null> {
  const releases = await getBobineReleases();
  return (
    releases.find((release) => release.isPrerelease || release.slug.toLowerCase() === "beta") ??
    FALLBACK_RELEASES.find((r) => r.slug === "beta") ??
    null
  );
}
