/**
 * Baamix signale un produit achetable avec un bloc ```product {"id":"..."} ``` et une comparaison
 * avec un bloc ```compare {"ids":["...","..."]} ``` (contrat défini par le prompt système). On les
 * extrait avant le rendu Markdown pour afficher de vraies cartes (image, prix, lien, caractéristiques
 * résolus depuis le catalogue, jamais depuis le texte du modèle) à la place des blocs bruts.
 * L'ancienne clé "asin" reste acceptée.
 */
export function parseCatalogBlocks(raw: string): { displayText: string; productIds: string[]; compares: string[][] } {
  const productIds: string[] = [];
  const compares: string[][] = [];

  let displayText = raw.replace(/```(product|compare)\s*([\s\S]*?)```/g, (_match, kind: string, jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr.trim());
      if (kind === "product") {
        const id = typeof parsed?.id === "string" ? parsed.id : typeof parsed?.asin === "string" ? parsed.asin : null;
        if (id && !productIds.includes(id)) productIds.push(id);
      } else if (Array.isArray(parsed?.ids)) {
        const ids = [...new Set((parsed.ids as unknown[]).filter((v): v is string => typeof v === "string"))].slice(0, 4);
        if (ids.length >= 2) compares.push(ids);
      }
    } catch {
      // bloc malformé émis par le modèle : ignoré silencieusement, jamais de crash
    }
    return "";
  });

  // Fence encore ouverte pendant le streaming (fermeture pas encore reçue) :
  // on tronque l'affichage avant le JSON brut plutôt que de le montrer en flash.
  const openFence = displayText.search(/```(product|compare)/);
  if (openFence !== -1) {
    displayText = displayText.slice(0, openFence);
  }

  // Le comparatif fiable est affiché par la carte : on retire les tableaux Markdown que le modèle
  // recopierait malgré la consigne, pour ne pas dupliquer (ni contredire) les données du catalogue.
  if (compares.length > 0) {
    displayText = displayText
      .split("\n")
      .filter((line) => !/^\s*\|/.test(line))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  }

  return { displayText: displayText.trimEnd(), productIds, compares };
}

