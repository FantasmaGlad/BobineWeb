import type { ReleaseChannelInfo } from "@/lib/releaseTypes";

const REPO = "FantasmaGlad/Bobine";

export interface RepoStatsResponse {
  stars: number;
  forks: number;
  latestRelease: string;
  downloads: {
    windows: string;
    windowsArm64?: string;
    linux: string;
    linuxArm64?: string;
    macos: string;
    android: string;
    androidTv?: string;
    assistant: string;
    assistantArm64?: string;
    installScript?: string;
  };
  stable: ReleaseChannelInfo;
  beta: ReleaseChannelInfo;
  canary: ReleaseChannelInfo;
}

const FALLBACK_STABLE: ReleaseChannelInfo = {
  version: "V5.0.0",
  title: "Bobine V5.0.0 « Orchidée » — Support Natif PC ARM64 (Snapdragon, Windows ARM, Linux ARM), Google Books, Trois Canaux de Mise à Jour & Sous-titres",
  publishedAt: "2026-10-17T09:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/Bobine-Setup-5.0.0.exe",
    windowsArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/Bobine-Setup-5.0.0-arm64.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/bobine_5.0.0_amd64.deb",
    linuxArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/bobine_5.0.0_arm64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/Bobine-5.0.0.dmg",
    android: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/Bobine-5.0.0.apk",
    androidTv: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/Bobine-TV-5.0.0.apk",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/bobine-assistant",
    assistantArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/bobine-assistant-arm64",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/V5.0.0/install.sh",
  },
};

// Canal curé, publié manuellement par lots (cf. .github/workflows/ci.yml,
// job release-beta) — distinct du canal Canary (rolling, ex-"beta").
const FALLBACK_BETA: ReleaseChannelInfo = {
  version: "beta",
  title: "Bobine — Bêta",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta.exe",
    windowsArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-Setup-beta-arm64.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_amd64.deb",
    linuxArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine_beta_arm64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.dmg",
    android: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-beta.apk",
    androidTv: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/Bobine-TV-beta.apk",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-assistant",
    assistantArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/bobine-assistant-arm64",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/beta/install.sh",
  },
};

// Canal rolling, republié à chaque push sur main — ex-"beta" renommé le
// 2026-10-16 (cf. .agents/AGENTS.md §5, migration 2 -> 3 canaux).
const FALLBACK_CANARY: ReleaseChannelInfo = {
  version: "canary",
  title: "Bobine — Canary (build automatique)",
  publishedAt: "2026-10-16T20:00:00Z",
  downloads: {
    windows: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-Setup-canary.exe",
    windowsArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-Setup-canary-arm64.exe",
    linux: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/bobine_canary_amd64.deb",
    linuxArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/bobine_canary_arm64.deb",
    macos: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-canary.dmg",
    android: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-canary.apk",
    androidTv: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/Bobine-TV-canary.apk",
    assistant: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/bobine-assistant",
    assistantArm64: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/bobine-assistant-arm64",
    installScript: "https://github.com/FantasmaGlad/Bobine/releases/download/canary/install.sh",
  },
};

function parseReleaseAssets(
  assets: unknown,
  fallback: ReleaseChannelInfo["downloads"]
): ReleaseChannelInfo["downloads"] {
  const downloads = { ...fallback };
  if (!Array.isArray(assets)) return downloads;
  for (const asset of assets) {
    const name = String(asset?.name || "").toLowerCase();
    const url = typeof asset?.browser_download_url === "string" ? asset.browser_download_url : "";
    if (!url) continue;
    const isArm = name.includes("arm64") || name.includes("aarch64");
    if (name.endsWith(".exe")) {
      if (isArm) {
        downloads.windowsArm64 = url;
      } else {
        downloads.windows = url;
      }
    } else if (name.endsWith(".deb")) {
      if (isArm) {
        downloads.linuxArm64 = url;
      } else {
        downloads.linux = url;
      }
    } else if (name.endsWith(".dmg")) {
      downloads.macos = url;
    } else if (name.includes("-tv") || name.includes("bobine-tv")) {
      downloads.androidTv = url;
    } else if (name.endsWith(".apk")) {
      downloads.android = url;
    } else if (name.includes("assistant")) {
      if (isArm) {
        downloads.assistantArm64 = url;
      } else {
        downloads.assistant = url;
      }
    } else if (name === "install.sh") {
      downloads.installScript = url;
    }
  }
  return downloads;
}

function parseChannelRelease(
  res: PromiseSettledResult<Response>,
  fallback: ReleaseChannelInfo,
  fallbackTitle: string
): Promise<ReleaseChannelInfo> | ReleaseChannelInfo {
  if (res.status !== "fulfilled" || !res.value.ok) return fallback;
  return res.value.json().then((data) => {
    const commitish = typeof data.target_commitish === "string" ? data.target_commitish : "";
    return {
      version: data.tag_name || fallback.version,
      commit: /^[0-9a-f]{7,40}$/i.test(commitish) ? commitish.slice(0, 7) : fallback.commit,
      title: data.name || fallbackTitle,
      publishedAt: data.published_at || fallback.publishedAt,
      downloads: parseReleaseAssets(data.assets, fallback.downloads),
    };
  });
}

/** Statistiques du depot et versions publiees (etoiles, canaux stable, beta et canary), avec repli statique. */
export async function getRepoStats(): Promise<RepoStatsResponse> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, stableRes, betaRes, canaryRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${REPO}`, {
        headers,
        next: { revalidate: 1800 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers,
        next: { revalidate: 1800 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/releases/tags/beta`, {
        headers,
        next: { revalidate: 1800 },
      }),
      fetch(`https://api.github.com/repos/${REPO}/releases/tags/canary`, {
        headers,
        next: { revalidate: 1800 },
      }),
    ]);

    let stars = 0;
    let forks = 0;

    if (repoRes.status === "fulfilled" && repoRes.value.ok) {
      const repoData = await repoRes.value.json();
      stars = repoData.stargazers_count ?? 0;
      forks = repoData.forks_count ?? 0;
    }

    const stableInfo = await parseChannelRelease(stableRes, FALLBACK_STABLE, FALLBACK_STABLE.title);
    const betaInfo = await parseChannelRelease(betaRes, FALLBACK_BETA, "Bobine — Bêta");
    const canaryInfo = await parseChannelRelease(canaryRes, FALLBACK_CANARY, "Bobine — Canary (build automatique)");

    const payload: RepoStatsResponse = {
      stars,
      forks,
      latestRelease: stableInfo.version,
      downloads: {
        windows: stableInfo.downloads.windows,
        windowsArm64: stableInfo.downloads.windowsArm64,
        linux: stableInfo.downloads.linux,
        linuxArm64: stableInfo.downloads.linuxArm64,
        macos: stableInfo.downloads.macos,
        android: stableInfo.downloads.android,
        androidTv: stableInfo.downloads.androidTv,
        assistant: stableInfo.downloads.assistant,
        assistantArm64: stableInfo.downloads.assistantArm64,
        installScript: stableInfo.downloads.installScript,
      },
      stable: stableInfo,
      beta: betaInfo,
      canary: canaryInfo,
    };

    return payload;
  } catch (err) {
    console.error("[GitHub Stats] Error fetching repo stats:", err);
    return {
      stars: 0,
      forks: 0,
      latestRelease: FALLBACK_STABLE.version,
      downloads: FALLBACK_STABLE.downloads,
      stable: FALLBACK_STABLE,
      beta: FALLBACK_BETA,
      canary: FALLBACK_CANARY,
    };
  }
}
