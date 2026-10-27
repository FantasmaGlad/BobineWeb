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
