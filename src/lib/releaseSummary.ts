/** Extrait les points éditoriaux des notes, sans inventer de fonctions à partir du numéro de version. */
export function releaseSummary(body: string): string[] {
  const clean = (line: string) => line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`_]/g, "").replace(/\p{Extended_Pictographic}|\uFE0F/gu, "").trim();
  const editorial = (line: string) => line && !/^(#|https?:|---|<)/.test(line.trim());
  const bullets = body.split("\n").filter((line) => /^\s*[-*]\s+/.test(line) && !/https?:|<|\.(apk|deb|rpm|dmg|exe)\b/i.test(line)).map((line) => clean(line.replace(/^\s*[-*]\s+/, "")));
  if (bullets.length) return bullets.slice(0, 3);
  return body.split("\n").map(clean).filter(editorial).slice(0, 2).map((line) => line.length > 260 ? `${line.slice(0, 257)}…` : line);
}
