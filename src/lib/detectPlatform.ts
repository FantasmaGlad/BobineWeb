import { useSyncExternalStore } from "react";

export type DetectedPlatform = "windows" | "macos" | "linux" | "android" | "android-tv" | "ios" | null;

export function detectPlatform(): DetectedPlatform {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/Android/i.test(ua)) {
    if (
      /AndroidTV|GoogleTV|Large Screen|SmartTV|HbbTV|BRAVIA|SHIELD|MIBOX|AFT/i.test(ua) ||
      /\bTV\b/i.test(ua)
    ) {
      return "android-tv";
    }
    return "android";
  }
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
    if (typeof document !== "undefined") {
      const attr = document.documentElement.getAttribute("data-platform") as DetectedPlatform;
      if (attr) {
        cachedPlatform = attr;
        return cachedPlatform;
      }
    }
    cachedPlatform = detectPlatform();
  }
  return cachedPlatform;
}

function getServerSnapshot(): DetectedPlatform {
  return null;
}

export function useDetectedPlatform(): DetectedPlatform {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

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
