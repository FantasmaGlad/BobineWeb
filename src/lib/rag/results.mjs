import { parseFragment } from "parse5";

export const MANAGED_BY = "bobine-sync-v2";
export const ACTIVE_FILTER = `managed_by: ANY("${MANAGED_BY}") AND active: ANY("true")`;
export const FRAMEWORKS = ["tauri", "nextjs", "ffmpeg", "pydantic", "fastapi", "linux", "systemd"];

export function frameworkFilter(framework = "all", version) {
  if (framework !== "all" && !FRAMEWORKS.includes(framework)) throw new Error("Framework inconnu");
  if (version && (framework === "all" || !/^[a-zA-Z0-9._+-]{1,64}$/.test(version))) throw new Error("Version invalide ou framework absent");
  return [ACTIVE_FILTER, framework !== "all" && `framework: ANY("${framework}")`,
    version && `version: ANY("${version}")`].filter(Boolean).join(" AND ");
}

const STOPWORDS = new Set(("le la les un une des du de d l et ou à a au aux en dans sur pour par avec sans ce ces cet cette qui que quoi dont où est sont être comment quel quelle " +
  "quels quelles peut peuvent faire fait il elle ils elles on nous vous je tu mon ma mes ton ta tes son sa ses notre votre leur leurs ne pas plus " +
  "the an and or not of to in on for with is are be how what which who can do does it its this that my your you we they at by from as").split(" "));

/**
 * Reformule une question en recherche à mots alternatifs. Le moteur exige sinon tous les mots : « Comment fonctionne
 * l'assistant Baamix ? » ne renvoyait rien alors que six documents en parlent. Seuls des mots alphanumériques sont
 * conservés, en minuscules, donc aucun opérateur (AND, OR, NOT, guillemets, deux-points) ne peut être injecté.
 * Un mot rare isolé (« Baamix ») ne renvoie rien seul : `anchor` (« bobine » pour le corpus du projet) l'accompagne.
 * @param {string} text
 * @param {string} [anchor]
 */
export function relaxQuery(text, anchor) {
  const words = String(text).toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}.+#-]*/gu) ?? [];
  const kept = [];
  for (const word of words) if (word.length > 1 && !STOPWORDS.has(word) && !kept.includes(word)) kept.push(word);
  if (kept.length > 1) return kept.slice(0, 8).join(" OR ");
  if (kept.length === 1 && anchor && kept[0] !== anchor) return `${kept[0]} OR ${anchor}`;
  // Un seul mot utile, ou aucun : recherche ordinaire sur les mots alphanumériques, jamais le texte brut.
  return (kept.length ? kept : words).slice(0, 8).join(" ");
}

/** Le SDK gRPC renvoie google.protobuf.Struct ; REST renvoie directement les objets JSON. */
export function decodeStruct(struct) {
  if (!struct || typeof struct !== "object") return {};
  if (!struct.fields) return struct;
  function value(v) {
    if (v.stringValue !== undefined) return v.stringValue;
    if (v.numberValue !== undefined) return v.numberValue;
    if (v.boolValue !== undefined) return v.boolValue;
    if (v.listValue) return (v.listValue.values ?? []).map(value);
    if (v.structValue) return decodeStruct(v.structValue);
    return null;
  }
  return Object.fromEntries(Object.entries(struct.fields).map(([key, v]) => [key, value(v)]));
}

export function plainSnippet(text) {
  function visit(node) {
    if (["script", "style", "noscript", "template"].includes(node.nodeName)) return "";
    if (node.nodeName === "#text") return node.value;
    const content = (node.childNodes ?? []).map(visit).join("");
    return ["p", "div", "li", "h1", "h2", "h3", "br", "tr"].includes(node.nodeName) ? ` ${content} ` : content;
  }
  return visit(parseFragment(String(text))).replace(/\s+/g, " ").trim();
}

export function normalizeResult(result) {
  const doc = result.document;
  if (!doc) return null;
  const meta = decodeStruct(doc.structData);
  const derived = decodeStruct(doc.derivedStructData);
  const snippets = (derived.snippets ?? []).map(s => s.snippet).filter(Boolean);
  const answers = (derived.extractive_answers ?? []).map(s => s.content).filter(Boolean);
  const text = plainSnippet(snippets.join("\n") || answers.join("\n") || derived.content || "").trim();
  if (!text) return null;
  return {
    id: doc.id ?? "", title: String(meta.title || derived.title || doc.id || "Document"),
    snippet: text, url: String(meta.source_url || derived.link || doc.content?.uri || ""),
    platform: ["amazon", "aliexpress", "doc", "spec"].includes(meta.platform) ? meta.platform : "doc",
    framework: meta.framework, version: meta.version, locale: meta.locale, generation: meta.generation,
  };
}

/**
 * Question de recherche d'une conversation : la dernière question de l'utilisateur, complétée par la précédente quand elle
 * est courte (« et sur Mac ? » ne dit rien seule). `relaxQuery` garde les mots dans l'ordre : la dernière question prime.
 * @param {{ role: string, content: unknown }[]} messages
 */
export function buildSearchQuery(messages) {
  const users = messages.filter(m => m.role === "user").map(m => String(m.content ?? "").trim()).filter(Boolean);
  const last = users.at(-1) ?? "";
  const previous = users.at(-2);
  // Seuls les trois premiers mots utiles de la question précédente suivent : assez pour garder le sujet, pas assez pour le
  // laisser couvrir un changement de plateforme (« et sur Mac ? » après une question sur Fedora).
  return previous && last.split(/\s+/).length <= 6 ? `${last} ${relaxQuery(previous).split(" OR ").slice(0, 3).join(" ")}` : last;
}
