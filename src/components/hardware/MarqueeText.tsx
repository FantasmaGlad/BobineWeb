"use client";

import { useEffect, useRef, useState } from "react";

interface MarqueeTextProps {
  text: string;
  className?: string;
}

/**
 * Ligne de texte de hauteur fixe : si le texte tient, il reste statique ; s'il dépasse, il défile
 * en boucle (pause au survol). Sans animation (prefers-reduced-motion), il est simplement tronqué
 * par une ellipse. Le texte complet reste disponible en infobulle.
 */
export default function MarqueeText({ text, className = "" }: MarqueeTextProps) {
  const boxRef = useRef<HTMLSpanElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    const measure = measureRef.current;
    if (!box || !measure) return;
    const check = () => setOverflowing(measure.scrollWidth > box.clientWidth + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text]);

  // ~0,18 s par caractère (vitesse ralentie de 50% pour un confort de lecture optimal).
  const duration = Math.max(20, Math.round(text.length * 0.18));

  return (
    <span ref={boxRef} className={`marquee ${overflowing ? "is-scrolling" : ""} ${className}`} title={text}>
      {/* Copie invisible qui sert uniquement à mesurer la largeur naturelle du texte. */}
      <span ref={measureRef} className="marquee__measure" aria-hidden="true">
        {text}
      </span>
      {overflowing ? (
        <span className="marquee__track" style={{ animationDuration: `${duration}s` }}>
          <span className="marquee__item">{text}</span>
          <span className="marquee__item" aria-hidden="true">
            {text}
          </span>
        </span>
      ) : (
        <span className="marquee__static">{text}</span>
      )}
    </span>
  );
}
