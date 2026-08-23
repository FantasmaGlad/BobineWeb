# bobine.fit

Portail web et documentation officielle de **Bobine** — régie vidéo et système de diffusion multimédia autonome open-source pour salles de sport et studios fitness.

- **URL de production** : [https://bobine.fit](https://bobine.fit)
- **Dépôt principal** : [github.com/FantasmaGlad/Bobine](https://github.com/FantasmaGlad/Bobine)
- **Licence** : AGPL-3.0

---

## Architecture & Spécifications

- **Framework** : Next.js 16 (App Router, Turbopack, React 19)
- **Rendu** : Génération statique complète (SSG — 47 routes localisées FR/EN)
- **Régie 3D** : Three.js / React Three Fiber / Drei (scène interactive Wyse 5070 & écran HD)
- **Design System** : CSS pur avec variables dynamiques — 18 thèmes bicolores classés (8 Clairs, 10 Sombres)
- **SEO & GEO** : Sitemap multilingue dynamique, JSON-LD enrichi, métadonnées Googlebot, favicons haute fidélité (multiples de 48px)
- **Performances** : 100% Hors-ligne (PWA / Service Worker), polices système zéro latence
- **Déploiement** : Vercel Edge Network

---

## Commandes

```bash
npm install     # Installation des dépendances
npm run dev     # Serveur de développement (http://localhost:3000)
npm run build   # Compilation de production statique
npm run lint    # Validation ESLint & TypeScript
```

