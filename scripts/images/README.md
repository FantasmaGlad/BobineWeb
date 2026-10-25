# Images du site

`node scripts/images/convert.mjs` génère les variantes locales AVIF et WebP, les aperçus sociaux 1200 × 630 et le manifeste `src/content/media.json`. Il utilise `sharp`, installé avec les dépendances de développement. Le build du site consomme les fichiers générés ; il ne télécharge aucune image.

`sources.json` décrit chaque image : source locale, alternatives françaises et anglaises, crédit, provenance et version du logiciel lorsqu’il s’agit d’une capture. Les originaux de `originals/` montrent Bobine 5.0.5 dans une instance de démonstration isolée, avec trois clips synthétiques. Ils ne contiennent pas de bibliothèque personnelle ni de données de salle. Pour renouveler une capture, remplacer son original et sa version, puis relancer la conversion.

`channels/` contient les icônes Stable, Bêta et Canary du logiciel, issues de `Assets/Images/channel-icons/` dans [Bobine](https://github.com/FantasmaGlad/Bobine/tree/main/Assets/Images/channel-icons). Le même script en produit les PNG et WebP de 256 px utilisés dans le site et le PDF.

`node scripts/ci/check-images.mjs` vérifie les alternatives, les fichiers générés, les icônes actuelles et le plafond de 250 Ko par image hors catalogue matériel. Les crédits publiés sont accessibles sur `/fr/credits` et `/en/credits` ; les marques ont leurs notices dans `NOTICE.md`.
