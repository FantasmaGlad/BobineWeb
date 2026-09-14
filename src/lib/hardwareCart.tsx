"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  asin: string;
  name: string;
  imageUrl: string;
  priceAmazon: number;
  amazonUrl: string;
}

interface HardwareCartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isInCart: (asin: string) => boolean;
  toggleItem: (item: CartItem) => void;
  removeItem: (asin: string) => void;
  clear: () => void;
}

const HardwareCartContext = createContext<HardwareCartContextValue | null>(null);

// Cle de stockage local : le panier reste prive au navigateur du visiteur,
// jamais transmis a un serveur (coherent avec la politique zero-tracking du site).
const STORAGE_KEY = "bobine-hardware-cart-v1";

export function HardwareCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // stockage indisponible (navigation privee) : le panier reste en memoire pour la session
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // stockage plein ou indisponible : on ignore silencieusement
    }
  }, [items, hydrated]);

  const isInCart = useCallback((asin: string) => items.some((i) => i.asin === asin), [items]);

  const toggleItem = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.asin === item.asin) ? prev.filter((i) => i.asin !== item.asin) : [...prev, item]));
  }, []);

  const removeItem = useCallback((asin: string) => {
    setItems((prev) => prev.filter((i) => i.asin !== asin));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((acc, i) => acc + i.priceAmazon, 0), [items]);

  const value = useMemo<HardwareCartContextValue>(
    () => ({ items, count: items.length, total, isInCart, toggleItem, removeItem, clear }),
    [items, total, isInCart, toggleItem, removeItem, clear]
  );

  return <HardwareCartContext.Provider value={value}>{children}</HardwareCartContext.Provider>;
}

export function useHardwareCart() {
  const ctx = useContext(HardwareCartContext);
  if (!ctx) throw new Error("useHardwareCart doit etre utilise a l'interieur de HardwareCartProvider");
  return ctx;
}
