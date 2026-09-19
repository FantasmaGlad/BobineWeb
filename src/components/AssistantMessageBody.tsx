"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Locale } from "@/lib/i18n";
import { parseCatalogBlocks } from "@/lib/chatBlocks";
import ChatProductCard from "@/components/ChatProductCard";
import ChatCompareCard from "@/components/ChatCompareCard";

const MarkdownRenderer = dynamic(() => import("./MarkdownRenderer"), {
  loading: () => <span className="markdown-loading" />,
});

const TICK_MS = 25;

/**
 * Le texte arrive par paquets : au lieu de l'afficher tel quel, on le révèle lettre par lettre (effet
 * machine à écrire). La vitesse s'adapte au retard accumulé : régulière pendant que la réponse arrive,
 * plus rapide une fois qu'elle est complète, pour que l'affichage ne traîne jamais bien après la fin.
 */
function pace(backlog: number, streaming: boolean): number {
  return streaming ? Math.max(3, Math.ceil(backlog / 45)) : Math.max(4, Math.ceil(backlog / 32));
}

/** Ferme provisoirement le gras et le code en cours de frappe, pour ne pas afficher des ** ou ` isolés. */
function balanceMarkdown(text: string): string {
  let out = text;
  if ((out.match(/\*\*/g) ?? []).length % 2 === 1) out += "**";
  if ((out.match(/`/g) ?? []).length % 2 === 1) out += "`";
  return out;
}

export default function AssistantMessageBody({
  raw,
  streaming,
  animate,
  locale,
  onGrow,
  onDone,
}: {
  raw: string;
  streaming: boolean;
  animate: boolean;
  locale: Locale;
  onGrow?: () => void;
  /** Appele une fois la frappe terminee (ex. pour afficher Baamix qui court en bas du chat). */
  onDone?: () => void;
}) {
  const parsed = useMemo(() => parseCatalogBlocks(raw), [raw]);
  const target = parsed.displayText;

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Le rendu Markdown est charge a la demande. Sur un reseau lent (Tor), la frappe finissait avant son arrivee
  // et le texte apparaissait d'un bloc : on attend que le module soit la avant de demarrer la machine a ecrire.
  const [markdownReady, setMarkdownReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("./MarkdownRenderer").then(() => {
      if (!cancelled) setMarkdownReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const instant = !animate || reduced;
  const [shown, setShown] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;
  const streamingRef = useRef(streaming);
  streamingRef.current = streaming;

  useEffect(() => {
    if (instant || !markdownReady) return;
    const timer = window.setInterval(() => {
      setShown((prev) => {
        const length = targetRef.current.length;
        if (prev >= length) return length;
        return Math.min(length, prev + pace(length - prev, streamingRef.current));
      });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [instant, markdownReady]);

  const visibleCount = instant ? target.length : Math.min(shown, target.length);
  const typingDone = visibleCount >= target.length && !streaming;
  const visible = visibleCount >= target.length ? target : balanceMarkdown(target.slice(0, visibleCount));

  useEffect(() => {
    if (typingDone) onDone?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingDone]);

  useEffect(() => {
    onGrow?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount, typingDone]);

  return (
    <>
      <MarkdownRenderer content={visible} />
      {typingDone &&
        parsed.compares.map((ids) => <ChatCompareCard key={ids.join(",")} ids={ids} locale={locale} />)}
      {typingDone && parsed.productIds.length > 0 && (
        <div className="chatbot-product-cards">
          {parsed.productIds.map((id) => (
            <ChatProductCard key={id} id={id} locale={locale} />
          ))}
        </div>
      )}
    </>
  );
}
