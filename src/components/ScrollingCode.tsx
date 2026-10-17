"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Commande sur une seule ligne : si elle dépasse la largeur disponible, elle défile lentement
 * d'un bord à l'autre et revient, sans barre de défilement. Une commande assez courte reste
 * immobile. La vitesse est fixe (environ 25 px/s), donc la durée suit la longueur à parcourir.
 */
export default function ScrollingCode({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const innerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const measure = () => {
      const shift = inner.scrollWidth - wrap.clientWidth;
      if (shift > 2) {
        wrap.style.setProperty("--cli-shift", `${-shift}px`);
        wrap.style.setProperty("--cli-duration", `${Math.max(6, shift / 25)}s`);
        wrap.dataset.scroll = "true";
      } else {
        delete wrap.dataset.scroll;
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [children]);

  return (
    <span ref={wrapRef} className="cli-scroll">
      <code ref={innerRef} className="cli-scroll__inner">
        {children}
      </code>
    </span>
  );
}
