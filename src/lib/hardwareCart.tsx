"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { sumPrices } from "@/lib/price";

import type { ProductSource } from "@/lib/productSources";
export type CartPlatform = Exclude<ProductSource, "manufacturer">;

export interface CartItem {
  /** Absent sur les paniers enregistrés avant l'arrivée d'AliExpress : traité comme Amazon. */
  platform?: CartPlatform;
  /** ASIN (Amazon) ou product_id (AliExpress). */
  asin: string;
  name: string;
  imageUrl: string;
  priceAmazon: number | null;
  amazonUrl: string;
}

// Clé de stockage local : le panier reste privé au navigateur du visiteur,
// jamais transmis à un serveur (cohérent avec la politique zéro-tracking du
// site) - seul son CONTENU est envoyé à l'API de chat pour que Baamix puisse
// conseiller sur des achats déjà sélectionnés, jamais persisté côté serveur.
const STORAGE_KEY = "bobine-hardware-cart-v1";

// Évènement local diffusé à chaque écriture, pour que tout composant monté
// n'importe où sur le site (le widget panier sur /materiel, le chatbot
// Baamix affiché globalement) reste synchronisé sans dépendre d'un Provider
// React unique - important car Baamix vit dans le layout racine, hors de la
// page /materiel.
const CART_EVENT = "bobine-cart-changed";

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item: CartItem) => item.platform === "aliexpress" ? item : {...item, priceAmazon:null, imageUrl: item.imageUrl?.includes("/editorial/") ? item.imageUrl : "/images/hardware/editorial/selection.svg"}) : [];
  } catch {
    return [];
  }
}

let cachedRaw: string | null | undefined = undefined;
let cachedItems: CartItem[] = [];

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedItems;
    }
    cachedRaw = raw;
    cachedItems = safeParseCart(raw);
    return cachedItems;
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): CartItem[] {
  try {
    const raw = JSON.stringify(items);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedItems = safeParseCart(raw);
  } catch {
    // stockage plein ou indisponible (navigation privée) : on ignore silencieusement
  }
  window.dispatchEvent(new CustomEvent(CART_EVENT));
  return cachedItems;
}

export function isInCartStorage(asin: string): boolean {
  return readCart().some((i) => i.asin === asin);
}

export function addToCartStorage(item: CartItem): CartItem[] {
  const current = readCart();
  if (current.some((i) => i.asin === item.asin)) return current;
  return writeCart([...current, item]);
}

export function removeFromCartStorage(asin: string): CartItem[] {
  return writeCart(readCart().filter((i) => i.asin !== asin));
}

export function toggleCartItemStorage(item: CartItem): CartItem[] {
  return isInCartStorage(item.asin) ? removeFromCartStorage(item.asin) : addToCartStorage(item);
}

export function clearCartStorage(): CartItem[] {
  return writeCart([]);
}

function subscribeCart(callback: () => void) {
  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const SERVER_CART: CartItem[] = [];

/**
 * Hook réactif utilisable depuis n'importe quel composant client, sans
 * Provider : se resynchronise sur tout changement local (autre composant,
 * Baamix qui ajoute un produit) ou distant (autre onglet, via l'évènement
 * navigateur "storage").
 */
export function useHardwareCart() {
  const items = useSyncExternalStore(
    subscribeCart,
    readCart,
    () => SERVER_CART
  );

  const isInCart = useCallback((asin: string) => items.some((i) => i.asin === asin), [items]);
  const toggleItem = useCallback((item: CartItem) => toggleCartItemStorage(item), []);
  const removeItem = useCallback((asin: string) => removeFromCartStorage(asin), []);
  const clear = useCallback(() => clearCartStorage(), []);
  const total = useMemo(() => sumPrices(items).total, [items]);
  const unknownPrices = useMemo(() => sumPrices(items).unknown, [items]);

  return { items, count: items.length, total, unknownPrices, isInCart, toggleItem, removeItem, clear };
}

export function cartItemPlatform(item: CartItem): CartPlatform {
  return item.platform ?? "amazon";
}
