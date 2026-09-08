import { useSyncExternalStore } from "react";

export type DetectedPlatform = "windows" | "macos" | "linux" | "android" | "ios" | null;

/**
 * Détection cliente légère de la plateforme du visiteur, pour mettre en
 * avant sa méthode d'installation en priorité (surtout utile sur mobile,
 * où l'espace est limité et où faire défiler jusqu'à la bonne carte est
 * pénible). Ne doit être appelée que côté client :
 * retourne toujours null pendant le rendu serveur pour éviter tout
 * décalage d'hydratation.
 */
export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/Android/i.test(ua)) return "android";
  // iPadOS 13+ se présente comme "Macintosh" mais garde le support tactile.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && maxTouchPoints > 1)) {
    return "ios";
  }
  if (/Windows/i.test(ua)) return "windows";
  if (/Macintosh|Mac OS X/i.test(ua)) return "macos";
  if (/Linux/i.test(ua)) return "linux";

  return null;
}

const emptySubscribe = () => () => {};
let cachedPlatform: DetectedPlatform | undefined;

function getClientSnapshot(): DetectedPlatform {
  if (cachedPlatform === undefined) {
    cachedPlatform = detectPlatform();
  }
  return cachedPlatform;
}

function getServerSnapshot(): DetectedPlatform {
  return null;
}

/**
 * Hook React retournant la plateforme détectée côté client sans provoquer
 * de décalage d'hydratation ni nécessiter de setState synchrone dans un useEffect.
 */
export function useDetectedPlatform(): DetectedPlatform {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

/**
 * Réordonne un tableau pour placer en tête l'élément dont l'id correspond
 * à la plateforme détectée, en conservant l'ordre relatif du reste.
 */
export function reorderForPlatform<T extends { id: string }>(
  items: T[],
  detected: DetectedPlatform
): T[] {
  if (!detected) return items;
  const idx = items.findIndex((item) => item.id === detected);
  if (idx <= 0) return items;
  const reordered = [...items];
  const [match] = reordered.splice(idx, 1);
  reordered.unshift(match);
  return reordered;
}
