// Couleurs réelles des 18 palettes (9 thèmes × clair et sombre) : lit les jetons du CSS (pas de copie), les résout (var, color-mix, dégradés) et
// mesure les contrastes WCAG. Partagé par glass-check.mjs (matériaux de verre) et check-assets.mjs (icônes).
export function loadThemeColors(noComments) {
  const rules = [...noComments.matchAll(/(^|\n)(:root[^{}]*)\{([^{}]*)\}/g)].map((m) => {
    const vars = {};
    for (const d of m[3].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim().replace(/\s+/g, " ");
    return { selectors: m[2].split(",").map((s) => s.trim()), vars };
  });
  // Un « thème » est un couple couleur/mode : « ardoise/light », « ardoise/dark », … (blocs du fichier de thèmes générés).
  const themes = [...new Set(rules.flatMap((r) => r.selectors).map((s) => /^:root\[data-theme="([\w-]+)"\]\[data-mode="(light|dark)"\]$/.exec(s)).filter(Boolean).map((m) => `${m[1]}/${m[2]}`))];
  const resolve = (combo) => {
    const [theme, mode] = combo.split("/");
    const vars = {};
    const wanted = [":root", `:root[data-mode="${mode}"]`, `:root[data-theme="${theme}"][data-mode="${mode}"]`];
    for (const selector of wanted) for (const r of rules) if (r.selectors.includes(selector)) Object.assign(vars, r.vars);
    return vars;
  };
  const split = (text) => {
    const parts = []; let depth = 0, cur = "";
    for (const ch of text) { if (ch === "(") depth++; if (ch === ")") depth--; if (ch === "," && depth === 0) { parts.push(cur.trim()); cur = ""; } else cur += ch; }
    parts.push(cur.trim()); return parts;
  };
  function evaluate(expr, vars) {
    const e = expr.trim();
    if (e === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
    const hex = /^#([0-9a-f]{6})$/i.exec(e);
    if (hex) return { r: parseInt(hex[1].slice(0, 2), 16), g: parseInt(hex[1].slice(2, 4), 16), b: parseInt(hex[1].slice(4, 6), 16), a: 1 };
    const rgb = /^rgba?\(([^)]+)\)$/.exec(e);
    if (rgb) { const [r, g, b, a = "1"] = rgb[1].split(",").map((x) => x.trim()); return { r: +r, g: +g, b: +b, a: +a }; }
    const v = /^var\(--([\w-]+)\)$/.exec(e);
    if (v) { if (vars[v[1]] === undefined) throw new Error(`--${v[1]} introuvable`); return evaluate(vars[v[1]], vars); }
    const mix = /^color-mix\(([\s\S]*)\)$/.exec(e);
    if (mix) {
      const [, c1, c2] = split(mix[1]);
      const pct = (s) => { const m = /^(.*?)\s+([\d.]+)%$/.exec(s); return m ? { c: m[1], p: +m[2] / 100 } : { c: s, p: undefined }; };
      let { c: ca, p: pa } = pct(c1); let { c: cb, p: pb } = pct(c2);
      if (pa === undefined && pb === undefined) pa = pb = 0.5; else if (pa === undefined) pa = 1 - pb; else if (pb === undefined) pb = 1 - pa;
      const A = evaluate(ca, vars), B = evaluate(cb, vars), wa = pa * A.a, wb = pb * B.a, a = wa + wb;
      return a === 0 ? { r: 0, g: 0, b: 0, a: 0 } : { r: (A.r * wa + B.r * wb) / a, g: (A.g * wa + B.g * wb) / a, b: (A.b * wa + B.b * wb) / a, a };
    }
    throw new Error(`expression non prise en charge : ${e}`);
  }
  /** Couleurs d'un matériau : une couleur, ou les arrêts d'un dégradé (le pire cas est testé). */
  const materialColors = (expr, vars) => {
    const g = /^linear-gradient\(([\s\S]*)\)$/.exec(expr.trim());
    if (!g) return [evaluate(expr, vars)];
    return split(g[1]).slice(1).map((stop) => evaluate(stop.replace(/\s+[\d.]+%$/, ""), vars));
  };
  const over = (top, below) => { const a = top.a + below.a * (1 - top.a); const m = (t, b) => (t * top.a + b * below.a * (1 - top.a)) / a; return { r: m(top.r, below.r), g: m(top.g, below.g), b: m(top.b, below.b), a }; };
  const lum = (c) => { const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  return { themes, resolve, evaluate, materialColors, over, ratio };
}
