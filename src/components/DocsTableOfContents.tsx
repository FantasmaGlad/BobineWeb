"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function DocsTableOfContents({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Récupère les titres H2 et H3 dans la zone de contenu de la doc
    const article = document.querySelector(".docs-content");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3"));
    const items: TocItem[] = elements.map((elem, idx) => {
      if (!elem.id) {
        elem.id = `section-${idx}-${elem.textContent?.toLowerCase().replace(/[^\w\d]+/g, "-") || "title"}`;
      }
      return {
        id: elem.id,
        text: elem.textContent || "",
        level: elem.tagName.toLowerCase() === "h2" ? 2 : 3,
      };
    });

    const frameId = requestAnimationFrame(() => {
      setHeadings(items);
    });

    // Observer pour le scrollspy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);


  if (headings.length === 0) return null;

  return (
    <aside className="docs-toc" aria-label="Table des matières">
      <div className="docs-toc__header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span>{isEn ? "On this page" : "Sur cette page"}</span>
      </div>
      <nav className="docs-toc__nav">
        {headings.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`docs-toc__link docs-toc__link--lvl${item.level} ${
              activeId === item.id ? "is-active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById(item.id);
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveId(item.id);
                window.history.pushState(null, "", `#${item.id}`);
              }
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
