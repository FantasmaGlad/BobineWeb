"use client";

import { useEffect, useRef, useState } from "react";

const PHRASES_FR = [
  "Baamix réfléchit...",
  "Baamix court dans sa roue...",
  "Baamix fouille dans ses graines de tournesol...",
  "Baamix remplit ses bajoues d'informations...",
  "Baamix consulte le catalogue...",
  "Baamix affûte ses moustaches...",
  "Baamix pèse le pour et le contre...",
  "Baamix relit la documentation...",
  "Baamix range ses notes dans sa cage...",
  "Baamix tourne en rond, mais dans le bon sens...",
  "Baamix grignote une graine pour se concentrer...",
  "Baamix vérifie ses calculs de mini PC...",
];

const PHRASES_EN = [
  "Baamix is thinking...",
  "Baamix is running in its wheel...",
  "Baamix is digging through its sunflower seeds...",
  "Baamix is stuffing its cheeks with facts...",
  "Baamix is checking the catalog...",
  "Baamix is sharpening its whiskers...",
  "Baamix is weighing the pros and cons...",
  "Baamix is rereading the documentation...",
  "Baamix is tidying its notes in the cage...",
  "Baamix is going round in circles, the right way...",
  "Baamix is nibbling a seed to focus...",
  "Baamix is double-checking the mini PC math...",
];

const STORE_FR = ["Baamix examine les produits affichés...", "Baamix compare les fiches de la boutique..."];
const STORE_EN = ["Baamix is examining the products on screen...", "Baamix is comparing the store cards..."];

const SLOW_FR = "Baamix s'accroche à sa roue, encore un instant...";
const SLOW_EN = "Baamix keeps pedaling, one more moment...";

const ROTATE_MS = 2600;
const SLOW_AFTER_S = 15;

/** Roue de hamster filaire qui tourne, avec Baamix qui court dedans (SVG, aucun emoji). */
export function HamsterWheel() {
  return (
    <svg className="baamix-wheel" viewBox="0 0 32 32" width="32" height="32" fill="none" aria-hidden="true">
      <g className="baamix-wheel__rim" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="16" cy="16" r="13.5" />
        <line x1="16" y1="2.5" x2="16" y2="29.5" />
        <line x1="16" y1="2.5" x2="16" y2="29.5" transform="rotate(60 16 16)" />
        <line x1="16" y1="2.5" x2="16" y2="29.5" transform="rotate(120 16 16)" />
      </g>
      <g className="baamix-wheel__hamster" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="14.5" cy="23.6" rx="5" ry="3.3" />
        <circle cx="19.6" cy="22.4" r="2.3" />
        <circle cx="19" cy="19.9" r="0.9" />
        <path d="M11 26.6l-1.4 1.6M15 27l-0.6 1.9" />
        <circle cx="20.4" cy="22" r="0.35" fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * Indicateur d'attente de Baamix, dans l'esprit d'un indicateur de réflexion : une phrase qui change
 * régulièrement (humour de hamster), un compteur de secondes et une phrase dédiée si la réponse tarde.
 * `hasStoreContext` ajoute des phrases sur les produits affichés dans la boutique.
 */
export default function BaamixThinking({ isEn, hasStoreContext }: { isEn: boolean; hasStoreContext: boolean }) {
  const pool = [...(isEn ? PHRASES_EN : PHRASES_FR), ...(hasStoreContext ? (isEn ? STORE_EN : STORE_FR) : [])];
  const [index, setIndex] = useState(() => Math.floor(Math.random() * pool.length));
  const [seconds, setSeconds] = useState(0);
  const lastRef = useRef(index);

  useEffect(() => {
    lastRef.current = index;

    const rotate = window.setInterval(() => {
      let next = Math.floor(Math.random() * pool.length);
      if (next === lastRef.current) next = (next + 1) % pool.length;
      lastRef.current = next;
      setIndex(next);
    }, ROTATE_MS);
    const clock = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      window.clearInterval(rotate);
      window.clearInterval(clock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slow = seconds >= SLOW_AFTER_S;
  const phrase = slow ? (isEn ? SLOW_EN : SLOW_FR) : pool[index % pool.length];

  return (
    <div className="baamix-thinking" role="status" aria-label={isEn ? "Baamix is preparing an answer" : "Baamix prépare une réponse"}>
      <HamsterWheel />
      <span className="baamix-thinking__text" aria-hidden="true">
        <span key={phrase} className="baamix-thinking__phrase">
          {phrase}
        </span>
        {seconds >= 3 && <span className="baamix-thinking__time">{seconds} s</span>}
      </span>
    </div>
  );
}
