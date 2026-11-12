"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RepoStatsResponse } from "@/lib/releaseChannels";

const ReleaseContext = createContext<RepoStatsResponse | null>(null);

export function ReleaseProvider({ value, children }: { value: RepoStatsResponse; children: ReactNode }) {
  return <ReleaseContext.Provider value={value}>{children}</ReleaseContext.Provider>;
}

export function useReleaseData(): RepoStatsResponse | null {
  return useContext(ReleaseContext);
}
