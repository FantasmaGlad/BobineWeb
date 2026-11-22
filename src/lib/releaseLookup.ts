export interface SluggedRelease {
  slug: string;
  isPrerelease?: boolean;
}

const ROLLING: readonly string[] = ["beta", "canary"];

export function findRelease<T extends SluggedRelease>(live: T[], fallback: T[], slug: string): T | null {
  const wanted = slug.toLowerCase();
  const found = live.find((release) => release.slug.toLowerCase() === wanted);
  if (found) return found;
  if (!ROLLING.includes(wanted)) return null;
  return (
    live.find((release) => release.isPrerelease && release.slug.toLowerCase().includes(wanted)) ??
    fallback.find((release) => release.slug === wanted) ??
    null
  );
}
