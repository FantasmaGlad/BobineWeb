import "server-only";
import { PRICE_CHECKED_AT } from "@/content/hardware";
import type { FormFactorKey, OsKey, TierKey } from "@/content/hardware";
import type { StoreView } from "@/lib/storeView";
import {
  FORM_LABELS,
  OS_LABELS,
  TIER_LABELS,
  getTierEntries,
  type CatalogEntry,
} from "./entries";
import type { ServerCatalog } from "./server";
import { HARDWARE_BUNDLES } from "@/content/hardware";

const PLATFORM_LABEL = { amazon: "Amazon", aliexpress: "AliExpress" } as const;

function priceText(e: CatalogEntry): string {
  return e.platform === "aliexpress" ? `${e.price.toFixed(2)} EUR (a partir de)` : `${e.price.toFixed(2)} EUR`;
}

function contextLabel(e: CatalogEntry): string {
  if (e.role === "accessory" || !e.os || !e.form || !e.tier) return "accessoire";
  const base = `${OS_LABELS[e.os]} ${FORM_LABELS[e.form]} ${TIER_LABELS[e.tier]}`;
  return e.role === "main" ? `${base} (unite principale)` : `${base} (alternative)`;
}

/** Index compact de TOUS les produits réellement vendus, deux plateformes confondues. */
export function buildCatalogIndex(catalog: ServerCatalog): string {
  const lines = catalog.entries
    .map((e) => `- ${e.id} | ${PLATFORM_LABEL[e.platform]} | ${contextLabel(e)} | ${e.name} | ${priceText(e)}`)
    .join("\n");
  const aliDate = catalog.aliexpressCheckedAt
    ? `prix AliExpress rafraichis le ${catalog.aliexpressCheckedAt} (indicatifs)`
    : "prix AliExpress issus du dernier instantane (indicatifs)";
  return `(Prix Amazon constates le ${PRICE_CHECKED_AT} ; ${aliDate}. Precise-le si l'utilisateur demande un prix et invite-le a verifier la fiche du vendeur pour le tarif du jour.)\n${lines}`;
}

function detailLine(e: CatalogEntry): string {
  const seller = e.seller
    ? ` | vendeur : ${e.seller.name}${e.seller.rating ? `, ${e.seller.rating} d'avis positifs` : ""}${e.seller.sales != null ? `, ${e.seller.sales} ventes` : ""}`
    : "";
  const role = e.role === "main" ? "unite principale" : e.role === "alternative" ? "alternative" : "accessoire";
  const fan = e.category === "uc" ? ` | ${e.hasFan ? "ventile" : "SANS ventilateur"}` : "";
  return `- ${e.id} | ${PLATFORM_LABEL[e.platform]} | ${role} | ${e.name} | ${priceText(e)} | ${e.specs}${fan}${seller} | ${e.description}`;
}

const VALID_OS: OsKey[] = ["linux", "windows", "macos", "android"];
const VALID_FORM: FormFactorKey[] = ["minipc", "laptop", "tablet"];
const VALID_TIER: TierKey[] = ["essentiel", "recommande", "pro", "premium"];

/**
 * Décrit en détail ce que le visiteur a actuellement sous les yeux dans la boutique. Entrée non
 * fiable (vient du navigateur) : chaque champ est validé, et tout le contenu est reconstruit
 * depuis le catalogue serveur, jamais depuis du texte envoyé par le client.
 */
export function buildStoreViewContext(raw: unknown, catalog: ServerCatalog): string {
  const none = "Le visiteur ne consulte pas la boutique materiel en ce moment (ou aucun produit n'est affiche).";
  const v = raw as Partial<StoreView> | null | undefined;
  if (!v || typeof v !== "object") return none;
  if (v.platform !== "amazon" && v.platform !== "aliexpress") return none;
  if (!VALID_OS.includes(v.os as OsKey) || !VALID_FORM.includes(v.form as FormFactorKey) || !VALID_TIER.includes(v.tier as TierKey)) return none;

  const bundles = v.platform === "aliexpress" ? catalog.aliexpressBundles : HARDWARE_BUNDLES;
  const entries = getTierEntries(bundles, v.platform, v.os as OsKey, v.form as FormFactorKey, v.tier as TierKey);
  if (entries.length === 0) return none;

  const header = `Le visiteur regarde la boutique ${PLATFORM_LABEL[v.platform]}, onglet ${OS_LABELS[v.os as OsKey]}, ${FORM_LABELS[v.form as FormFactorKey]}, gamme ${TIER_LABELS[v.tier as TierKey]}. Produits actuellement affiches (detail complet) :`;
  return `${header}\n${entries.map(detailLine).join("\n")}`;
}

interface RawCartItem {
  platform?: unknown;
  asin?: unknown;
  name?: unknown;
  priceAmazon?: unknown;
}

export function buildCartContext(rawCart: unknown): string {
  const empty = "Le panier « Mon Pack » de l'utilisateur est actuellement vide.";
  if (!Array.isArray(rawCart)) return empty;

  const items = (rawCart as RawCartItem[]).filter(
    (item): item is { platform?: unknown; asin: string; name: string; priceAmazon: number } =>
      typeof item?.asin === "string" && typeof item?.name === "string" && typeof item?.priceAmazon === "number"
  );
  if (items.length === 0) return empty;

  const total = items.reduce((acc, i) => acc + i.priceAmazon, 0);
  const lines = items
    .map((i) => `- ${i.name} (${i.priceAmazon.toFixed(2)} EUR, ${i.platform === "aliexpress" ? "AliExpress" : "Amazon"})`)
    .join("\n");
  return `Le panier « Mon Pack » contient actuellement ${items.length} article(s), total ${total.toFixed(2)} EUR (les deux plateformes sont payees separement) :\n${lines}`;
}

const COMPARE_INTENT = /compar|diff[eé]rence|lequel|laquelle|quel(?:le)? (?:est|choisir)|meilleur|\bvs\b|versus|entre (?:le|la|les|ces)|choisir|hésit|hesit|which|better|difference|choose/i;

function shortName(name: string): string {
  return name.split(" (")[0].trim();
}

/**
 * Filet de sécurité : le modèle gratuit oublie parfois le bloc de comparaison. Si la demande de
 * l'utilisateur est une comparaison et que la réponse n'en contient pas, on en construit un
 * depuis le catalogue réel : produits nommés dans la réponse, sinon ceux affichés à l'écran.
 */
export function buildFallbackCompareBlock(
  userText: string,
  responseText: string,
  storeView: unknown,
  catalog: ServerCatalog
): string | null {
  if (!COMPARE_INTENT.test(userText) || /```compare/.test(responseText)) return null;

  const lower = responseText.toLowerCase();
  const named = catalog.entries.filter((e) => e.category === "uc" && lower.includes(shortName(e.name).toLowerCase()));

  let picked: CatalogEntry[] = named.length >= 2 ? named : [];

  if (picked.length < 2) {
    const v = storeView as Partial<StoreView> | null | undefined;
    if (
      v &&
      (v.platform === "amazon" || v.platform === "aliexpress") &&
      VALID_OS.includes(v.os as OsKey) &&
      VALID_FORM.includes(v.form as FormFactorKey) &&
      VALID_TIER.includes(v.tier as TierKey)
    ) {
      const bundles = v.platform === "aliexpress" ? catalog.aliexpressBundles : HARDWARE_BUNDLES;
      picked = getTierEntries(bundles, v.platform, v.os as OsKey, v.form as FormFactorKey, v.tier as TierKey).filter(
        (e) => e.role !== "accessory"
      );
    }
  }

  const ids = [...new Set(picked.map((e) => e.id))].slice(0, 4);
  if (ids.length < 2) return null;
  return `\n\n\`\`\`compare\n${JSON.stringify({ ids })}\n\`\`\`\n`;
}

/**
 * Filet de sécurité : Baamix doit étayer ses propos avec des fiches produit. Tout produit du catalogue
 * cité dans la réponse (par son nom ou son identifiant) sans fiche ni comparatif reçoit un bloc product,
 * dans l'ordre de citation, quatre au maximum. Les produits déjà dans le panier sont ignorés.
 */
export function buildFallbackProductBlocks(responseText: string, cartIds: string[], catalog: ServerCatalog): string {
  const covered = new Set<string>(cartIds);
  for (const m of responseText.matchAll(/```(?:product|compare)\s*([\s\S]*?)```/g)) {
    for (const id of m[1].match(/[A-Za-z0-9]{10,16}/g) ?? []) covered.add(id);
  }

  const lower = responseText.toLowerCase();
  const found: Array<{ id: string; at: number }> = [];
  for (const e of catalog.entries) {
    if (covered.has(e.id)) continue;
    const name = shortName(e.name).toLowerCase();
    const byName = name.length >= 8 ? lower.indexOf(name) : -1;
    const byId = responseText.indexOf(e.id);
    const at = [byName, byId].filter((n) => n >= 0).sort((a, b) => a - b)[0];
    if (at !== undefined) found.push({ id: e.id, at });
  }

  return found
    .sort((a, b) => a.at - b.at)
    .slice(0, 4)
    .map((f) => `\n\n\`\`\`product\n${JSON.stringify({ id: f.id })}\n\`\`\``)
    .join("");
}
