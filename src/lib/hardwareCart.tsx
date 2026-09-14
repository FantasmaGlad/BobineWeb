"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export interface CartItem {
  asin: string;
  name: string;
  imageUrl: string;
  priceAmazon: number;
  amazonUrl: string;
}

// Cle de stockage local : le panier reste prive au navigateur du visiteur,
// jamais transmis a un serveur (coherent avec la politique zero-tracking du
// site) - seul son CONTENU est envoye a l'API de chat pour que Baamix puisse
// conseiller sur des achats deja selectionnes, jamais persiste cote serveur.
const STORAGE_KEY = "bobine-hardware-cart-v1";

// Evenement local diffuse a chaque ecriture, pour que tout composant monte
// n'importe ou sur le site (le widget panier sur /materiel, le chatbot
// Baamix affiche globalement) reste synchronise sans dependre d'un Provider
// React unique - important car Baamix vit dans le layout racine, hors de la
// page /materiel.
const CART_EVENT = "bobine-cart-changed";

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return safeParseCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): CartItem[] {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // stockage plein ou indisponible (navigation privee) : on ignore silencieusement
  }
  window.dispatchEvent(new CustomEvent(CART_EVENT));
  return items;
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

/**
 * Hook reactif utilisable depuis n'importe quel composant client, sans
 * Provider : se resynchronise sur tout changement local (autre composant,
 * Baamix qui ajoute un produit) ou distant (autre onglet, via l'evenement
 * navigateur "storage").
 */
export function useHardwareCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
    const sync = () => setItems(readCart());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isInCart = useCallback((asin: string) => items.some((i) => i.asin === asin), [items]);
  const toggleItem = useCallback((item: CartItem) => setItems(toggleCartItemStorage(item)), []);
  const removeItem = useCallback((asin: string) => setItems(removeFromCartStorage(asin)), []);
  const clear = useCallback(() => setItems(clearCartStorage()), []);
  const total = useMemo(() => items.reduce((acc, i) => acc + i.priceAmazon, 0), [items]);

  return { items, count: items.length, total, isInCart, toggleItem, removeItem, clear };
}
