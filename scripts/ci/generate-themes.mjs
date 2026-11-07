#!/usr/bin/env node
// Écrit src/styles/base/00-themes-generes.css à partir des palettes de src/lib/themePalettes.ts (copie de celle de
// l'application Bobine : scripts/ci/check-theme-parity.mjs vérifie qu'elles sont identiques) :
//   node scripts/ci/generate-themes.mjs          écrit le fichier
//   node scripts/ci/generate-themes.mjs --check  échoue si le fichier n'est pas à jour
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DEFAULT_THEME, SEMANTIC_COLORS, THEMES, contrast, deriveTokens, mix, paletteOf } from "../../src/lib/themePalettes.ts";

const target = fileURLToPath(new URL("../../src/styles/base/00-themes-generes.css", import.meta.url));

/** Jetons du site pour une palette : les couleurs de la palette et ce qui s'en déduit (noms propres au site). */
export function siteTokens(palette, mode) {
  const t = deriveTokens(palette, mode);
  // Survol d'un bouton plein : s'éloigne de la couleur de son texte, donc le contraste ne baisse jamais.
  const fgIsDark = contrast(t["accent-primary-fg"], "#000000") < contrast(t["accent-primary-fg"], "#ffffff");
  return {
    "bg-canvas": t["bg-main"],
    "bg-main": t["bg-main"],
    "bg-card": t["bg-surface"],
    "bg-card-hover": t["bg-surface-hover"],
    "bg-surface": t["bg-surface"],
    "bg-surface-elevated": t["bg-surface-elevated"],
    "bg-surface-hover": t["bg-surface-hover"],
    "bg-inset": mix(t["bg-main"], t["text-main"], 0.06),
    "text-heading": t["text-main"],
    "text-main": t["text-main"],
    "text-body": t["text-main"],
    "text-base": t["text-main"],
    "text-muted": t["text-muted"],
    "text-dim": t["text-dim"],
    "accent-primary": t["accent-primary"],
    "accent-primary-fg": t["accent-primary-fg"],
    "accent-text": t["accent-text"],
    "accent-hover": fgIsDark ? mix(t["accent-primary"], "#ffffff", 0.14) : mix(t["accent-primary"], "#000000", 0.14),
    "accent-success": t["accent-success-text"],
    "accent-warning": t["accent-warning-text"],
    "accent-error-text": t["accent-error-text"],
    "accent-info-text": t["accent-info-text"],
    "border-subtle": t["border-color"],
    "border-color": t["border-color"],
    "border-hover": mix(t["border-color"], t["text-main"], 0.18),
    "border-vibrant": t["accent-text"],
    "border-focus": t["accent-text"],
  };
}

export function render() {
  const fallback = Object.entries(siteTokens(paletteOf(DEFAULT_THEME, "dark"), "dark")).map(([n, v]) => `  --${n}: ${v};`).join("\n");
  const semantic = Object.entries(SEMANTIC_COLORS).map(([n, v]) => `  --accent-${n}-base: ${v};`).join("\n");
  const blocks = [];
  for (const theme of THEMES) {
    for (const mode of ["light", "dark"]) {
      const body = Object.entries(siteTokens(paletteOf(theme.id, mode), mode)).map(([n, v]) => `  --${n}: ${v};`).join("\n");
      blocks.push(`:root[data-theme="${theme.id}"][data-mode="${mode}"] {\n  color-scheme: ${mode};\n${body}\n}`);
    }
  }
  return `/* GÉNÉRÉ par scripts/ci/generate-themes.mjs depuis src/lib/themePalettes.ts : ne pas modifier à la main.\n   Neuf thèmes, chacun en clair et en sombre : les quatre couleurs de la palette et les jetons qui en sont déduits. */\n:root {\n${fallback}\n${semantic}\n}\n\n${blocks.join("\n\n")}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const css = render();
  if (process.argv.includes("--check")) {
    if (readFileSync(target, "utf8") !== css) {
      console.error("src/styles/base/00-themes-generes.css n'est pas à jour : lancer « node scripts/ci/generate-themes.mjs ».");
      process.exit(1);
    }
  } else {
    writeFileSync(target, css);
    console.log(`00-themes-generes.css : ${THEMES.length * 2} palettes écrites.`);
  }
}
