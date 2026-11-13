"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import Icon from "@/components/ui/Icon";
import type { SearchEntry } from "@/lib/searchIndex";

const MAX_RESULTS = 8;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function highlightSegments(text: string, terms: string[]): Array<{ value: string; match: boolean }> {
  const normalizedText = normalize(text);
  const ranges: Array<[number, number]> = [];
  for (const term of terms) {
    if (!term) continue;
    let from = 0;
    for (;;) {
      const idx = normalizedText.indexOf(term, from);
      if (idx === -1) break;
      ranges.push([idx, idx + term.length]);
      from = idx + term.length;
    }
  }
  if (ranges.length === 0) return [{ value: text, match: false }];

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const segments: Array<{ value: string; match: boolean }> = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (start > cursor) segments.push({ value: text.slice(cursor, start), match: false });
    segments.push({ value: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) segments.push({ value: text.slice(cursor), match: false });
  return segments;
}

function Highlighted({ text, terms }: { text: string; terms: string[] }): ReactNode {
  const segments = highlightSegments(text, terms);
  return (
    <>
      {segments.map((seg, i) =>
        seg.match ? <mark key={i}>{seg.value}</mark> : <span key={i}>{seg.value}</span>
      )}
    </>
  );
}

export default function DocsSearch({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const [query, setQuery] = useState("");
  const router = useRouter();

  const [entries, setEntries] = useState<SearchEntry[]>([]);

  useEffect(() => {
    if (!query.trim() || entries.length > 0) return;
    let cancelled = false;
    import("@/lib/searchIndex").then(({ SEARCH_INDEX }) => {
      if (!cancelled) setEntries(SEARCH_INDEX[locale] || SEARCH_INDEX.fr);
    });
    return () => {
      cancelled = true;
    };
  }, [query, entries.length, locale]);

  const terms = useMemo(
    () =>
      normalize(query.trim())
        .split(/\s+/)
        .filter(Boolean),
    [query]
  );

  const results = useMemo(() => {
    if (terms.length === 0) return [];

    const scored = entries
      .map((item) => {
        const title = normalize(item.title);
        const category = normalize(item.category);
        const excerpt = normalize(item.excerpt);
        const tags = item.tags.map(normalize);

        let score = 0;
        for (const term of terms) {
          if (title === term) score += 12;
          else if (title.startsWith(term)) score += 8;
          else if (title.includes(term)) score += 5;
          else if (tags.some((tag) => tag === term)) score += 4;
          else if (tags.some((tag) => tag.includes(term))) score += 3;
          else if (category.includes(term)) score += 2;
          else if (excerpt.includes(term)) score += 1;
          else return null;
        }
        return { item, score };
      })
      .filter((r): r is { item: SearchEntry; score: number } => r !== null)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);

    return scored;
  }, [terms, entries]);

  const visibleResults = results.slice(0, MAX_RESULTS);

  return (
    <div className="docs-search-container">
      <div className="docs-search-input-wrapper">
        <Icon name="search" size={16} className="docs-search-icon" />

        <input
          type="text"
          className="docs-search-input"
          placeholder={isEn ? "Search docs..." : "Rechercher..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQuery("");
              (e.target as HTMLInputElement).blur();
            } else if (e.key === "Enter" && visibleResults[0]) {
              router.push(visibleResults[0].href);
              setQuery("");
            }
          }}
          aria-label={isEn ? "Search documentation" : "Rechercher dans la documentation"}
        />

        {query && (
          <button
            type="button"
            className="docs-search-clear-btn"
            onClick={() => setQuery("")}
            aria-label={isEn ? "Clear search" : "Effacer la recherche"}
          >
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      {query.trim().length > 0 && (
        <div className="docs-search-results">
          {visibleResults.length > 0 ? (
            <div className="docs-search-results__list">
              <div className="docs-search-results__header">
                {results.length > MAX_RESULTS
                  ? isEn
                    ? `${MAX_RESULTS} of ${results.length} results`
                    : `${MAX_RESULTS} sur ${results.length} résultats`
                  : `${results.length} ${isEn ? (results.length > 1 ? "results found" : "result found") : results.length > 1 ? "résultats trouvés" : "résultat trouvé"}`}
              </div>
              {visibleResults.map((res, idx) => (
                <Link
                  key={idx}
                  href={res.href}
                  className="docs-search-item"
                  onClick={() => setQuery("")}
                >
                  <div className="docs-search-item__top">
                    <span className="docs-search-item__title">
                      <Highlighted text={res.title} terms={terms} />
                    </span>
                    <span className="docs-search-item__cat">{res.category}</span>
                  </div>
                  <p className="docs-search-item__excerpt">
                    <Highlighted text={res.excerpt} terms={terms} />
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="docs-search-empty">
              {isEn
                ? "No matching topics found in documentation."
                : "Aucun résultat trouvé pour cette recherche."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
