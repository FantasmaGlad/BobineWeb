import "server-only";

const REPO = "FantasmaGlad/Bobine";

export interface BobineRelease {
  slug: string;
  title: string;
  publishedAt: string;
  url: string;
  body: string;
}

interface GitHubReleaseApiResponse {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
}

const FALLBACK_RELEASES: BobineRelease[] = [
  {
    slug: "V2.0.1",
    title: "Bobine V2.0.1 — Accélération Matérielle Intel/AMD & Nouvel Installeur Rapide",
    publishedAt: "2026-08-22T11:55:21Z",
    url: "https://github.com/FantasmaGlad/Bobine/releases/tag/V2.0.1",
    body: `Bobine est une régie vidéo et sonore autonome et libre (licence AGPL-3.0) conçue pour équiper les studios et salles de sport : diffusion automatique de cours collectifs programmés à la seconde, contrôle direct du téléviseur par HDMI-CEC, borne tactile adhérent à la demande, télécommande mobile locale sans application, et radio d'ambiance 24/7 avec annonces vocales.

Incluant borne à la demande, expérience adhérent soignée — tout en gardant le contrôle total de son environnement.
Code source ouvert, données sur votre matériel, aucun compte à créer, aucun service qui peut être coupé unilatéralement.

Cette version 2.0.1 apporte le support étendu de l'accélération matérielle (Intel QuickSync et AMD Radeon VA-API), l'installateur bootstrap en 1 ligne, la gestion des modes d'installation (épuré et verbeux), ainsi que les liens vers le site officiel et le soutien communautaire.

---

## Liens Officiels & Communauté

- **Site Web Officiel & Documentation** : [https://bobine.fit](https://bobine.fit)
- **Guide de Démarrage Rapide** : [https://bobine.fit/fr/documentation/demarrage-rapide](https://bobine.fit/fr/documentation/demarrage-rapide)
- **Démo Virtuelle 3D** : [https://bobine.fit/fr/demo-3d](https://bobine.fit/fr/demo-3d)
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

- **Supervision automatique** — un chien de garde surveille en continu l'état de Redis, de la base de données et de l'écran kiosque ; un composant en panne redémarre de lui-même.
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
- **Écrans** : Sortie HDMI principale câblée (avec support HDMI-CEC pour allumage/veille TV automatique) + écran réseau secondaire sur n'importe quel navigateur.
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
    body: `Bobine est une régie vidéo et sonore autonome et libre (licence AGPL-3.0) conçue pour équiper les studios et salles de sport : diffusion automatique de cours collectifs programmés à la seconde, contrôle direct du téléviseur par HDMI-CEC, borne tactile adhérent à la demande, télécommande mobile locale sans application, et radio d'ambiance 24/7 avec annonces vocales.

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

- **Supervision automatique** — un chien de garde surveille en continu l'état de Redis, de la base de données et de l'écran kiosque ; un composant en panne redémarre de lui-même.
- **Reprise après coupure de courant** — l'ensemble des services redémarre automatiquement, sans remise en route manuelle.
- **Compatibilité télécommande USB native** — la borne adhérent et l'écran radio répondent directement à une télécommande USB à dongle, reconnue comme un clavier standard.
- **Aucune installation côté client** — chaque écran et chaque télécommande sont de simples pages web ; aucun logiciel à déployer en dehors du mini PC central.

---

## Licence

Bobine est distribué sous licence **AGPL-3.0**. Le code source est public et auditable.`,
  },
];

export async function getBobineReleases(): Promise<BobineRelease[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
      headers,
      next: { revalidate: 1800 },
    });

    if (!res.ok) return FALLBACK_RELEASES;

    const releases = (await res.json()) as GitHubReleaseApiResponse[];
    if (!Array.isArray(releases) || releases.length === 0) {
      return FALLBACK_RELEASES;
    }

    const validReleases = releases
      .filter((release) => !release.draft)
      .map((release) => ({
        slug: release.tag_name,
        title: release.name || release.tag_name,
        publishedAt: release.published_at ?? "",
        url: release.html_url,
        body: release.body ?? "",
      }));

    return validReleases.length > 0 ? validReleases : FALLBACK_RELEASES;
  } catch {
    return FALLBACK_RELEASES;
  }
}

export async function getBobineRelease(
  slug: string
): Promise<BobineRelease | null> {
  const releases = await getBobineReleases();
  return releases.find((release) => release.slug.toLowerCase() === slug.toLowerCase()) ?? null;
}
