# Prompt de recherche Perplexity — refonte du catalogue matériel Bobine

Généré le 2026-09-17, réécrit pour imposer un format de rapport strict et sans
ambiguïté. À copier-coller tel quel dans Perplexity (mode Recherche / Pro —
pas le mode rapide).

---

## PROMPT

Tu es un chasseur de bonnes affaires spécialisé en matériel informatique, chargé de trouver les MEILLEURS produits actuellement en vente sur **Amazon.fr** pour équiper des salles de sport avec une régie vidéo (lecture de vidéos de cours en boucle, écran allumé 8 à 16h/jour, parfois 24/7, en environnement commercial).

## FORMAT DE RAPPORT OBLIGATOIRE — LIS CECI EN PREMIER

Tu dois répondre EXACTEMENT selon ce gabarit, sans t'en écarter, sans le résumer, sans fusionner de gammes, sans sauter d'accessoire. Voici le gabarit exact, avec un exemple rempli pour une gamme :

```
=== WINDOWS ===

--- Mini PC ---

Gamme 1 — Essentiel
  Unité centrale (2-3 marques différentes) :
    - Beelink Mini S12 Pro (Intel N100, 16 Go/512 Go) — 359 € — 4,3★ (612 avis) — https://www.amazon.fr/dp/XXXXXXXXXX
    - Minisforum UM790 (AMD Ryzen 7) — 389 € — 4,4★ (203 avis) — https://www.amazon.fr/dp/XXXXXXXXXX
    - GMKtec NucBox G3 (Intel N100) — 329 € — 4,2★ (890 avis) — https://www.amazon.fr/dp/XXXXXXXXXX
  Câble HDMI : [Nom] — [Prix] — [Lien]
  Câble réseau Ethernet : [Nom] — [Prix] — [Lien]
  Clavier : [Nom] — [Prix] — [Lien]
  Souris : [Nom] — [Prix] — [Lien]
  Télécommande (si pertinent pour cette gamme) : [Nom] — [Prix] — [Lien]

Gamme 2 — Recommandé
  [même structure complète : unité centrale 2-3 marques + tous les accessoires]

Gamme 3 — Pro
  [même structure complète]

Gamme 4 — Premium
  [même structure complète]

--- Laptop ---

Gamme 1 — Essentiel
  Unité centrale (2-3 marques différentes) : ...
  Hub/dock USB-C vers HDMI : [Nom] — [Prix] — [Lien]
  Support vertical pour laptop fermé : [Nom] — [Prix] — [Lien]
  Souris : [Nom] — [Prix] — [Lien]

Gamme 2, 3, 4 : [même structure complète]

=== LINUX ===

--- Mini PC ---
[même structure que Windows Mini PC, 4 gammes complètes]

--- Laptop ---
[même structure que Windows Laptop, 4 gammes complètes]

=== MAC ===

--- Mini PC (Mac Mini / Mac Studio) ---
[4 gammes complètes : unité centrale 2-3 offres Apple/reconditionné, câble HDMI, câble réseau, clavier, souris]

--- Laptop (MacBook Air / MacBook Pro) ---
[4 gammes complètes : unité centrale 2-3 offres, hub/dock USB-C ou Thunderbolt, support laptop, souris]

=== ANDROID ===

--- Tablettes ---
[4 gammes complètes : unité centrale 2-3 marques (Samsung, Xiaomi, Lenovo...), hub USB-C vers HDMI, câble de charge USB-C, support mural antivol]
```

**Règles strictes de ce format :**
1. Les 4 catégories `=== WINDOWS ===`, `=== LINUX ===`, `=== MAC ===`, `=== ANDROID ===` doivent apparaître séparément, dans cet ordre, chacune bien délimitée.
2. À l'intérieur de chaque OS, sépare bien `--- Mini PC ---` de `--- Laptop ---` (Android n'a que `--- Tablettes ---`).
3. Chaque combinaison OS × Type doit avoir SES 4 gammes (Essentiel, Recommandé, Pro, Premium) écrites en entier, jamais résumées ou fusionnées.
4. Pour l'unité centrale de chaque gamme, propose **au moins 2 à 3 marques différentes** (pas 3 fois le même fabricant avec une config différente).
5. **Chaque produit cité, sans une seule exception, doit avoir son lien Amazon.fr direct.** Un produit sans lien ne compte pas comme une réponse valide — c'est non négociable, y compris pour les accessoires (câbles, télécommande, support, souris, clavier).
6. N'invente et ne déduis JAMAIS un produit, un prix, une note ou un lien. Tu dois avoir réellement consulté chaque fiche Amazon.fr. Si un ASIN n'est pas clair dans l'URL, dis-le plutôt que d'en fabriquer un. Si un produit est en rupture de stock, ne le propose pas.

## Les 4 gammes (à respecter pour chaque catégorie)
1. **Essentiel** — premier prix qui reste fiable, aucun superflu.
2. **Recommandé** — le meilleur compromis global, le choix par défaut.
3. **Pro** — pensé pour un usage exigeant (multi-écrans, sessions longues, charge élevée).
4. **Premium** — haut de gamme, sans compromis sur la qualité ou la durabilité.

## Objectifs tarifaires par gamme (à respecter, réalistes selon le segment)

Ce sont des objectifs de prix pour l'unité centrale, pas des limites absolues à tout prix — mais ne t'en écarte que si un produit est vraiment exceptionnel. **Sois réaliste par segment : n'applique jamais une fourchette Windows/Linux à Apple, dont le prix plancher réel est bien plus élevé.**

| Catégorie | Essentiel | Recommandé | Pro | Premium |
|---|---|---|---|---|
| Windows — Mini PC | 150-200 € max | 300-450 € | 500-700 € | 900-1600 € |
| Windows — Laptop | 300-420 € | 450-650 € | 700-1000 € | 1400-1900 € |
| Linux — Mini PC | 150-220 € max | 350-500 € | 550-750 € | 1000-1600 € |
| Linux — Laptop | 300-450 € | 500-750 € | 900-1300 € | 1700-2000 € |
| Mac — Mini PC (Mac Mini/Studio) | 700-950 € | 950-1300 € | 1500-2200 € | 2500-3500 € |
| Mac — Laptop (MacBook Air/Pro) | 1000-1300 € | 1300-1800 € | 1900-2600 € | 2800-3500 € |
| Android — Tablette | 200-320 € | 350-500 € | 550-750 € | 900-1200 € |

Pour les accessoires, reste dans des budgets cohérents avec la gamme : câbles/télécommande/souris entre 5 € et 20 € en gamme 1-2, jusqu'à 30-40 € en gamme 3-4 pour du matériel certifié/tressé ; hubs USB-C simples entre 20 € et 35 € en gamme 1-2, docks Thunderbolt multiport entre 150 € et 250 € en gamme 3-4 ; supports muraux/laptop entre 15 € et 30 € en gamme 1-2, jusqu'à 60-80 € en gamme 3-4 pour du renforcé antivol.

Si tu ne trouves rien de correct dans la fourchette indiquée pour une gamme, dis-le explicitement plutôt que de forcer un produit hors budget ou de mauvaise qualité pour respecter le prix.

## Critère de qualité (à appliquer à CHAQUE produit)
- Note ≥ 4,0/5 avec un minimum de 100 avis (pas un listing anecdotique à 3 avis).
- Produit actuellement achetable et livrable en France, pas un import douteux ou un reconditionné sans garantie claire.
- Rapport qualité/prix réellement avantageux, pas juste "le moins cher" : le meilleur compromis fiabilité/specs/prix pour un usage professionnel en continu. Signale les promos en cours.
- Écarte les vendeurs tiers à mauvais indicateurs (délais flous, avis vendeur médiocres, dropshipping).
- Pour tout appareil sans surveillance en continu (mini PC notamment) : refroidissement fiable (fanless si possible, sinon ventilateur reconnu discret/fiable dans les avis).

## Contraintes spécifiques par OS
- **Linux (Mini PC ET Laptop)** : privilégie les puces **AMD** — meilleur support out-of-the-box du GPU intégré via les pilotes libres AMDGPU/Mesa. Évite le Wi-Fi Broadcom (pilotes fermés problématiques sous Linux) ; préfère Intel ou Realtek pour le Wi-Fi/Bluetooth. Signale tout composant notoirement mal supporté trouvé dans les avis ou forums (veille, tactile, capteurs).
- **Windows (Mini PC ET Laptop)** : Intel ou AMD, peu importe — uniquement fiabilité/specs/prix.
- **Mac** : Mac Mini / Mac Studio / MacBook Air / MacBook Pro uniquement. Vérifie que le prix Amazon.fr n'a pas dérivé par rapport à l'Apple Store, et signale toute offre reconditionnée Apple certifiée intéressante.
- **Android** : tablettes tactiles robustes pensées pour un usage borne/pupitre (pas un usage nomade grand public).

## Contexte : catalogue ACTUEL du site (à battre, pas à recopier)
Mini PC : B20E Pentium 6500Y (150,90 €) / HP EliteDesk 800 Mini reconditionné (161 €) en Essentiel ; Beelink Mini S12 Pro N100 (359 €) / Mini PC Industriel Fanless N100 (592 €) en Recommandé ; Minisforum UM760 Slim Ryzen 5 (539 €) / Minisforum MS-01 i9-13900H (709 €) en Pro ; Mini PC AX9 Max Ryzen AI 9 HX 470 (1549 €) en Premium.
Laptops : de 322,99 € (Essentiel) à 1922,29 € (Premium, ThinkPad X1 Carbon Gen 12), MSI Modern 14 sans OS (705,31 €, Recommandé Linux), Dell XPS 13 (1779 €, Premium Windows).
Apple : Mac Mini M6 base (1049 €) à Mac Studio M5 Max (2999 €) ; MacBook Air 15" M4 (1269 €) à MacBook Pro 16" M5 Pro (3099 €).
Tablettes : Samsung Galaxy Tab A9+ (285 €) à Samsung Galaxy Tab S10 Ultra (1099,99 €).
Câbles/accessoires : DP-HDMI (10,99 €), HDMI 2.1 (10,44 €), Thunderbolt 4 (12,34 €), Ethernet Cat 7 (8,79 €) et Cat 6A (5,85 €), souris Logitech M185 (11,99 €), clavier G-Lab Keyz Hydrogen (18,76 €), télécommandes (9,57 € et 14,99 €), hubs USB-C (25,99 € et 27,99 €), dock Thunderbolt 4 (229,99 € — regarde particulièrement ce segment, il évolue vite), supports muraux/laptop (23 € à 78,59 €).

Pour chaque gamme, indique en une phrase si l'offre actuelle du site reste la meilleure ou si tu proposes mieux/moins cher. Ne recommande jamais deux fois le même produit physique sous deux liens différents dans des catégories différentes.

**Rappel final : respecte le gabarit de la section "FORMAT DE RAPPORT OBLIGATOIRE" à la lettre. Une réponse qui fusionne des gammes, omet des accessoires, ou omet un seul lien n'est pas acceptable.**
