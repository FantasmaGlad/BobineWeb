"use client";

import { useEffect } from "react";

/**
 * Replie les groupes du pied de page sous 768 px (accordéons) et les garde ouverts au-dessus. Le HTML rendu côté serveur
 * les a tous ouverts : sans JavaScript (miroir Tor), tous les liens restent visibles.
 */
export default function FooterDetails() {
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      document.querySelectorAll<HTMLDetailsElement>(".site-footer__group").forEach((el) => {
        el.open = media.matches;
      });
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return null;
}
