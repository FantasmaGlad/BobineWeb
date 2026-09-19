"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { RepoStatsResponse } from "@/lib/releaseChannels";

/**
 * Versions et statistiques GitHub lues cote serveur (au build, puis rafraichies) et transmises aux
 * composants clients : elles servent de valeur initiale, sans attendre un appel /api. Sur le miroir
 * Tor (export statique, aucune route serveur) c'est la seule source de la version affichee.
 */
const ReleaseContext = createContext<RepoStatsResponse | null>(null);

export function ReleaseProvider({ value, children }: { value: RepoStatsResponse; children: ReactNode }) {
  return <ReleaseContext.Provider value={value}>{children}</ReleaseContext.Provider>;
}

export function useReleaseData(): RepoStatsResponse | null {
  return useContext(ReleaseContext);
}
