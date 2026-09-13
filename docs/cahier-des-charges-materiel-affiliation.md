# Cahier des Charges — Hub Matériel (/materiel), Affiliation & Financement Open-Source

**Date** : 13 Septembre 2026  
**Auteur** : Clément Barillot (FantasmaGlad)  
**Projet** : Bobine Fit (`bobine.fit` / `FantasmaGlad/BobineWeb`)  
**Statut** : Spécification validée & Feuille de route active  

---

## 1. Vision Stratégique & Objectifs

Bobine est un logiciel de régie vidéo et d'automatisation audiovisuelle 100% libre et gratuit (GNU AGPL-3.0). Pour garantir son indépendance, pérenniser l'hébergement de son infrastructure et accompagner les gérants de salle de sport sans jamais imposer d'abonnement logiciel, le projet s'appuie sur un modèle de **financement éthique par le matériel et le mécénat** :

1. **Aiguillage & Démystification** : Répondre au frein principal des exploitants et coachs (« Quel matériel acheter pour que le studio tourne sans bug ? »).
2. **Recommandations testées par profil d'OS** : Présenter des bundles fiables, silencieux et économiques (de 40 € à 190 €) adaptés aux 5 profils d'exécution réels de Bobine.
3. **Monétisation transparente par affiliation** : Générer des commissions d'apporteur d'affaires (Amazon Partenaires, AliExpress, reconditionneurs) sans aucun surcoût pour l'acheteur.
4. **Prospection de partenaires constructeurs B2B** : Établir des partenariats officiels avec des constructeurs (HP, Dell, Lenovo) et des reconditionneurs engagés (AfB Shop).
5. **Mécénat communautaire & institutionnel** : Structurer GitHub Sponsors et Open Collective pour les clubs et passionnés souhaitant soutenir le projet.

---

## 2. Identifiants & Comptes d'Affiliation

| Plateforme | Identifiant / Store ID | Statut | Usage principal |
|---|---|---|---|
| **Amazon Partenaires (FR/EU)** | `fantasmaglad-21` | **Actif & Validé** | Câbles HDMI certifiés, télécommandes 2.4 GHz, mini PC neufs/Renewed, hubs USB-C |
| **AliExpress Portals** | En cours de validation | En cours | Mini PC Intel Alder Lake N100/N97 abordables, récepteurs, adaptateurs |
| **Reconditionneurs (Awin / Direct)** | À prospecter | Phase 2 | Dell Wyse 5070, HP EliteDesk Mini (Back Market, AfB Shop, Recommerce) |
| **GitHub Sponsors** | `FantasmaGlad` | En validation | Paliers de mécénat pour clubs indépendants et développeurs |

### Règles strictes d'implémentation des liens marchands
- **Format d'URL Amazon** : `https://www.amazon.fr/dp/<ASIN>?tag=fantasmaglad-21`
- **Attributs HTML obligatoires** : Tout lien externe d'affiliation doit obligatoirement comporter :
  ```html
  <a href="..." target="_blank" rel="nofollow sponsored noopener noreferrer">
  ```
- **Transparence légale (DGCCRF / Amazon Operating Agreement)** : Affichage systématique en pied de page et dans les mentions légales de la formule :
  *« En tant que Partenaire Amazon, bobine.fit réalise un bénéfice sur les achats remplissant les conditions requises. »*
- **Design System** : Zéro emoji dans les boutons d'achat, étiquettes de prix ou fiches techniques. Icônes vectorielles SVG filaires exclusives.

---

## 3. Matrice des 4 Bundles Matériels par OS

Chaque pack correspond à un profil d'utilisation concret en club de fitness :

### Pack 1 : Linux Appliance (Le choix n°1 Bobine — Éco-Responsable & 24/7)
*Cible : Studio de cycling immersif, cours virtuels quotidiens, régie autonome sans bureau.*
- **Unité centrale recommandée** : **Dell Wyse 5070 avec processeur Intel Pentium Silver J5005** (4 cœurs jusqu'à 2.80 GHz, iGPU Intel UHD Graphics 605 à 18 unités d'exécution).
  - *Pourquoi le J5005 est supérieur au J4105* : L'iGPU UHD 605 embarque 50% d'unités d'exécution supplémentaires (18 EUs vs 12 EUs) et une fréquence turbo plus élevée (2.8 GHz vs 2.5 GHz), assurant un fondu Gapless A/B Deck ultra-fluide et une lecture 4K 60fps sans micro-saccades. Le Celeron J4105 reste le repli d'occasion le plus économique.
  - *Spécifications idéales* : 8 Go de mémoire vive DDR4, SSD M.2 SATA ou NVMe de 64 à 256 Go.
  - *Points forts* : Refroidissement passif fanless (zéro ventilateur, aucun composant en rotation, n'aspire ni la magnésie ni la poussière de studio), consommation électrique record de 4W à 8W en diffusion continue, décodage matériel VA-API QuickSync natif.
  - *Prix indicatif d'occasion* : 50 € à 80 € (eBay, Back Market, AfB Shop) / 85 € à 110 € (Amazon Renewed garanti).
- **Câblage vidéo** : Câble DisplayPort vers HDMI 2.0 blindé 4K 60Hz (~8 € - 12 €).
- **Réseau** : Câble Ethernet RJ45 Cat 6 blindé ou dongle Wi-Fi double bande USB Realtek/Intel (~10 €).
- **Contrôle studio** : Télécommande sans fil 2.4 GHz de présentation avec récepteur USB plug-and-play (~12 €).
- **Budget total estimé** : **~65 € à 99 €** (selon le canal d'achat choisi).

### Pack 2 : Windows Desktop (Polyvalence & Performance 4K)
*Cible : Clubs souhaitant une machine Windows 11 multitâche capable d'alimenter un mur LED ou un grand écran 4K60.*
- **Unité centrale** : Mini PC Intel N100 / N97 (Beelink S12 Pro, Minisforum) ou HP ProDesk / EliteDesk Mini reconditionné (Intel Core i5-8500T ou AMD Ryzen 5 Pro).
  - *Points forts* : Démarrage silencieux, double sortie HDMI 4K, mode Clamshell natif.
  - *Prix indicatif* : 120 € à 160 €.
- **Câblage vidéo** : Câble HDMI 2.1 Ultra High Speed 48 Gbps certifié (évite toute désynchronisation 4K 60fps) (~10 €).
- **Contrôle studio** : Manette sans fil 2.4 GHz / Bluetooth (8BitDo Ultimate C ou Xbox) reconnue nativement par l'API HTML5 Gamepad de Bobine (~25 € - 40 €).
- **Budget total estimé** : **~155 € à 210 €**.

### Pack 3 : macOS Desktop & Studio (MacBook & Mac Mini)
*Cible : Coachs et gérants équipés en Apple Silicon (MacBook Air / Pro, Mac Mini M1/M2/M4).*
- **Unité centrale** : Mac Mini Apple Silicon ou MacBook portable du coach.
  - *Points forts* : Décodage matériel VideoToolbox ultra-efficace, silence absolu, gestion de veille `caffeinate`.
- **Connectique essentielle** : Hub multiport USB-C vers HDMI 4K 60Hz avec port de recharge Power Delivery (PD 100W) pour alimenter le Mac tout en diffusant sur l'écran du studio (~25 € - 35 €).
- **Câblage vidéo** : Câble HDMI blindé haute vitesse (~8 €).
- **Support & Rangement** : Support vertical en aluminium pour MacBook en mode bureau fermé (clamshell) (~18 €).
- **Budget accessoires estimé** : **~50 € à 65 €** (hors Mac).

### Pack 4 : Android Tactile & Mobilité (Tablette Coach & Affichage HDMI)
*Cible : Pupitre coach tactile déporté avec affichage miroir ou étendu HDMI sur grand écran.*
- **Unité centrale** : Tablette tactile Android ARM64 API 34+ (Xiaomi Pad 6 / Pad 8, Samsung Galaxy Tab A9+).
  - *Points forts* : Console coach `/coach` réactive au doigt sur la tablette, sortie vidéo HDMI `/cinema` fluide via MediaCodec.
  - *Prix indicatif* : 150 € à 250 €.
- **Connectique vidéo active** : Câble ou hub adaptateur USB-C vers HDMI avec port de charge Power Delivery (permet une diffusion ininterrompue 24/7 sans vider la batterie) (~18 € - 25 €).
- **Fixation studio** : Support pupitre inclinable sécurisé pour vélo de cycling ou fixation murale VESA (~20 € - 35 €).
### 3.5 Découpage en 3 Gammes par OS (Essentiel, Équilibré, Pro)
Pour chaque profil d'OS, l'utilisateur a le choix entre 3 niveaux de puissance et de budget :
1. **Gamme Essentielle (Premier Prix)** : Répond aux besoins fondamentaux (1080p60 fluide, 1 écran, contrôle standard).
2. **Gamme Équilibrée (Recommandée)** : Meilleur rapport confort/durabilité (SSD plus spacieux, 8 à 16 Go de RAM, connectique renforcée).
3. **Gamme Pro (Performance 4K & Double Écran)** : Aucun compromis technique (double sortie HDMI/DP 4K60, réencodage matériel instantané, manettes sans fil haute précision, administration fluide).

### 3.6 Comparateur Direct Multi-Canaux d'Achat (Amazon vs Reconditionné/eBay vs AliExpress)
Sur chaque carte de bundle, l'interface propose un **tableau comparatif direct en toute transparence** selon le canal d'achat préféré du gérant :

| Canal d'Achat | Avantages & Profil d'Usage | Délai de Livraison | Niveau de Prix |
|---|---|---|---|
| **Amazon (Prime / Renewed)** | Livraison express 24-48h, garantie A à Z, retour immédiat sans friction | 1 à 2 jours | Prix standard |
| **Reconditionné / eBay / AfB** | Économie circulaire, châssis pro déclassés d'entreprises, prix plancher d'occasion | 3 à 5 jours | Économie de 20% à 40% |
| **AliExpress Direct Usine** | Prix ultra-compétitifs sur les câbles, télécommandes et mini PC N100 | 7 à 12 jours | Économie de 40% à 60% |

#### Exemple d'affichage comparatif direct dans l'interface (Pack Linux Dell Wyse 5070 J5005) :
- **Unité centrale** (Dell Wyse 5070 J5005 8 Go) : Amazon Renewed (89 €) · eBay / Reconditionné (59 €) · AliExpress N100 (109 €)
- **Câble DisplayPort vers HDMI 4K** : Amazon (8,99 €) · eBay (7,50 €) · AliExpress (4,20 €)
- **Télécommande 2.4 GHz USB** : Amazon (11,90 €) · eBay (9,90 €) · AliExpress (5,50 €)
- **TOTAL ESTIMÉ DU PACK COMPLET** :
  - **Option Amazon Rapide** : **~109 €** (prêt sous 24h)
  - **Option Reconditionné Éco** : **~76 €** (meilleur rapport qualité/prix)
  - **Option AliExpress Éco** : **~118 €** (matériel neuf direct usine)

---

## 4. Feuille de Route Partenariats Constructeurs & Reconditionneurs (B2B)

Au-delà de l'affiliation grand public Amazon, Bobine engagera une prospection ciblée auprès d'acteurs industriels et du reconditionnement :

### A. Constructeurs de matériel informatique (PC & Mini PC)
- **HP (Hewlett-Packard)** :
  - *Périmètre* : Gammes professionnelles **HP EliteDesk 800 Mini** et **HP ProDesk 400 Mini**, programme officiel **HP Renew** (reconditionné certifié usine).
  - *Argumentaire* : Bobine valorise la durabilité et la réparabilité des châssis HP auprès des exploitants de salles de sport.
- **Dell Technologies** :
  - *Périmètre* : Gammes **Dell Wyse 5070** (référence du kiosque Bobine) et **Dell OptiPlex Micro**.
- **Lenovo** :
  - *Périmètre* : Gamme **ThinkCentre Tiny** (M720q, M920q).
- **Beelink & Minisforum** :
  - *Périmètre* : Constructeurs de mini PC neufs Intel N100 / AMD Ryzen basse consommation. Partenariats d'affiliation directe et dotation de machines de test.

### B. Reconditionneurs informatiques engagés (Éco-responsabilité & RSE)
- **AfB Shop (France / Allemagne)** :
  - *Profil* : Entreprise d'insertion et acteur majeur du reconditionnement informatique d'entreprise en Europe.
  - *Opportunité* : Création d'un « Pack Bobine Officiel Reconditionné » avec garantie 12 à 24 mois pour les salles de sport, et code partenaire reversant un pourcentage au projet libre.
- **Back Market / Trade Discount / Recommerce** :
  - *Profil* : Marketplaces de reconditionné grand public et pro via programmes Awin / Daisycon.

### C. Marques d'accessoires et de connectique
- **Anker & Ugreen** : Câbles HDMI certifiés, hubs USB-C Power Delivery et alimentations GaN compactes.
- **8BitDo** : Manettes et télécommandes sans fil de haute précision compatibles Gamepad API.

---

## 5. Spécifications Techniques de la Page `/materiel`

1. **Route et I18n** :
   - `src/app/[locale]/materiel/page.tsx`
   - Chemin FR : `/fr/materiel` (Titre : *Guide Matériel & Bundles Recommandés pour Salle de Sport*)
   - Chemin EN : `/en/materiel` (Titre : *Hardware Guide & Recommended Gym Playout Bundles*)
2. **Navigation & Sitemap** :
   - Ajout du lien dans le Header sticky (`.site-header`) et dans le Footer.
   - Déclaration obligatoire dans `src/app/sitemap.ts` (`staticRoutes` avec priorité `0.9` et fréquence `monthly`).
3. **Composants d'interface dédiés** :
   - `HardwareBundleTabs.tsx` : Sélecteur d'OS fluide (Linux, Windows, macOS, Android).
   - `HardwareBundleCard.tsx` : Présentation du pack (image, specs CPU/RAM/Watts, composants inclus, prix estimé, boutons d'achat Amazon avec tag `fantasmaglad-21` et marchands alternatifs).
   - `HardwareAccessoryGrid.tsx` : Grille d'accessoires individuels (câbles, télécommandes, hubs).
   - `HardwareRoiCalculator.tsx` : Simulateur budgétaire comparant le coût du matériel Bobine face aux bornes propriétaires (Les Mills Cinema, Wexer).
4. **Données Structurées SEO (JSON-LD)** :
   - `BreadcrumbsJsonLd` (Accueil > Guide Matériel).
   - `ItemList` contenant des entités `Product` avec `name`, `description`, `offers` (prix indicatifs) et `brand: "Bobine Fit"`.
5. **Avertissement Légal Sticky / Footer** :
   - Bloc de divulgation d'affiliation conforme Amazon Associates et DGCCRF.

---

## 6. Prochaines Étapes Opérationnelles

1. [x] Création et validation du compte Amazon Partenaires (`fantasmaglad-21`).
2. [x] Mise à jour des mentions légales de `bobine.fit` avec la clause d'affiliation officielle.
3. [x] Rédaction du présent Cahier des Charges dans `docs/cahier-des-charges-materiel-affiliation.md`.
4. [ ] Validation du compte AliExpress Affiliation (en attente d'approbation).
5. [ ] Configuration des paliers GitHub Sponsors sur le profil `FantasmaGlad`.
6. [ ] Développement et déploiement du composant et de la page `/materiel`.
7. [ ] Prise de contact avec AfB Shop pour étudier un partenariat pilote de fourniture de Wyse 5070 reconditionnés.
