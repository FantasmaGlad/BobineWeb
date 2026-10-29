import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { docChapters } from "../../src/content/docs/chapters";
import * as faq from "../../src/content/docs/faq-data";

export interface SourceDocument {
  key: string; title: string; text: string; source_url: string;
  platform: string; locale: string; framework?: string; version?: string; source_revision?: string;
}
const CHUNK_LIMIT = 8000;
/**
 * Découpe un long texte sans perte (la concaténation redonne l'original) : aux titres Markdown, sinon aux lignes vides, en
 * paquets d'environ 8 000 caractères. Un document de 100 Ko indexé d'un bloc rend ses sections profondes introuvables.
 */
export function splitText(text: string, limit = CHUNK_LIMIT): string[] {
  if (text.length <= limit * 1.5) return [text];
  const pieces = text.split(/(?=^#{1,3} )/m);
  const parts = pieces.length > 1 ? pieces : text.split(/(?<=\n\n)/);
  const chunks: string[] = []; let current = "";
  for (const part of parts) {
    if (current && current.length + part.length > limit) { chunks.push(current); current = ""; }
    if (part.length > limit * 1.5) { // section unique trop longue : coupe aux lignes vides
      for (const piece of part.split(/(?<=\n\n)/)) { if (current && current.length + piece.length > limit) { chunks.push(current); current = ""; } current += piece; }
    } else current += part;
  }
  if (current) chunks.push(current);
  return chunks;
}
function heading(chunk: string): string { return /^#{1,3} +(.+)$/m.exec(chunk)?.[1]?.slice(0, 80) ?? ""; }
function chunked(doc: SourceDocument): SourceDocument[] {
  const parts = splitText(doc.text);
  if (parts.length === 1) return [doc];
  return parts.map((text, i) => ({ ...doc, key: `${doc.key}#${String(i + 1).padStart(2, "0")}`,
    title: `${doc.title} — ${heading(text) || `partie ${i + 1}`}`, text }));
}

export function exportWeb(root: string, bobineRoot: string): SourceDocument[] {
  const output: SourceDocument[] = [];
  for (const locale of ["fr", "en"] as const) {
    for (const ch of docChapters[locale]) {
      const url = `https://bobine.fit/${locale}/documentation#${ch.id}`;
      // Le chapitre reste un document court de navigation ; chaque sous-section est un document : une recherche tombe sur la
      // bonne section au lieu d'un chapitre entier de plusieurs dizaines de Ko.
      output.push({ key: `docs/${locale}/${ch.id}`, title: ch.title, locale, platform: "doc", source_url: url,
        text: [`# ${ch.title}`, ch.summary, ...ch.subsections.map(s => `- ${s.subtitle}`)].join("\n\n") });
      ch.subsections.forEach((s, i) => output.push({
        key: `docs/${locale}/${ch.id}/${i + 1}`, title: `${ch.title} — ${s.subtitle}`, locale, platform: "doc", source_url: url,
        text: [`# ${ch.title}`, `## ${s.subtitle}`, ...s.paragraphs].join("\n\n"),
      }));
    }
    const labels = faq.FAQ_CATEGORY_LABELS[locale] as Record<string, string>;
    faq.FAQ_ITEMS[locale].forEach((item, i) => output.push({
      key: `docs/faq/${locale}/${i + 1}`, title: `FAQ — ${item.q}`, locale, platform: "doc",
      source_url: `https://bobine.fit/${locale}/documentation/faq`,
      text: `# ${item.q}\n\nCatégorie : ${labels[item.category] ?? item.category}\n\n${item.a}`,
    }));
    faq.TROUBLESHOOTING_ROWS[locale].forEach((row, i) => output.push({
      key: `docs/faq/depannage/${locale}/${i + 1}`, title: `Dépannage — ${row.issue}`, locale, platform: "doc",
      source_url: `https://bobine.fit/${locale}/documentation/faq`,
      text: `# ${row.issue}\n\nCause : ${row.cause}\n\nSolution : ${row.solution}`,
    }));
  }
  const products = JSON.parse(readFileSync(join(root, "src/content/products.json"), "utf8"));
  for (const [id, p] of Object.entries(products) as [string, Record<string, unknown>][]) {
    // La fiche conserve les données canoniques, sans déduire une caractéristique absente.
    output.push({ key: `catalog/amazon/${id}`, title: `Amazon — ${(p.name as { fr: string }).fr}`,
      locale: "multi", platform: "amazon", source_url: String(p.listing || `https://www.amazon.fr/dp/${id}`),
      text: JSON.stringify(p, null, 2) });
  }
  const ali = JSON.parse(readFileSync(join(root, "src/content/aliexpress-snapshot.json"), "utf8"));
  for (const [id, raw] of Object.entries(ali) as [string, Record<string, unknown>][]) {
    const { price: _price, link: _link, ...p } = raw;
    void _price; void _link;
    output.push({ key: `catalog/aliexpress/${id}`, title: `AliExpress — ${p.title || id}`, locale: "multi",
      platform: "aliexpress", source_url: `https://fr.aliexpress.com/item/${id}.html`,
      text: `Prix à consulter dans le catalogue courant ou sur l'annonce ; les informations du snapshot sont datées et ne prouvent pas la disponibilité.\n${JSON.stringify(p, null, 2)}` });
  }
  const revision = execFileSync("git", ["-C", bobineRoot, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  for (const file of ["docs/ARCHITECTURE.md", "docs/ARCHITECTURE.en.md", "assistant/README.md", "media/README.md", "media/PROTOCOL.md"]) {
    const path = join(bobineRoot, file);
    if (!existsSync(path)) throw new Error(`Source canonique absente : ${file}`);
    output.push(...chunked({ key: `specs/${file}`, title: `Bobine — ${file}`, locale: file.includes(".en.") ? "en" : "multi",
      platform: "spec", source_revision: revision,
      source_url: `https://github.com/FantasmaGlad/Bobine/blob/${revision}/${file}`,
      text: readFileSync(path, "utf8") }));
  }
  for (const file of ["src/content/README-hardware.md", "src/content/compare.ts"]) output.push(...chunked({
    key: `specs/web/${file}`, title: `BobineWeb — ${file}`, locale: "multi", platform: "spec",
    source_url: `https://github.com/FantasmaGlad/BobineWeb/blob/main/${file}`, text: readFileSync(join(root, file), "utf8"),
  }));
  return output;
}
