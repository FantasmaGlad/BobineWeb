"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";
import { resourceList, type ResourceItem } from "@/content/resources";
import Icon from "@/components/ui/Icon";
import "@/styles/components/resource-index.css";

interface ResourceIndexProps {
  locale: Locale;
  id?: string;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getInitialLetter(title: string): string {
  const norm = normalize(title.trim());
  const char = norm.charAt(0).toUpperCase();
  return char >= "A" && char <= "Z" ? char : "#";
}

export default function ResourceIndex({ locale, id = "resources" }: ResourceIndexProps) {
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const searchInputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Raccourci clavier `/` pour cibler la barre de recherche comme dans un index de référence
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        const tag = (document.activeElement as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Liste triée par ordre alphabétique du titre localisé
  const sortedItems = useMemo(() => {
    return [...resourceList].sort((a, b) =>
      a.title[locale].localeCompare(b.title[locale], locale, { sensitivity: "base" }),
    );
  }, [locale]);

  // Ensemble des lettres disponibles
  const availableLetterSet = useMemo(() => {
    const letters = new Set<string>();
    for (const item of sortedItems) {
      letters.add(getInitialLetter(item.title[locale]));
    }
    return letters;
  }, [sortedItems, locale]);

  // Filtrage instantané par recherche et lettre
  const filteredItems = useMemo(() => {
    const q = normalize(query.trim());
    return sortedItems.filter((item) => {
      const initial = getInitialLetter(item.title[locale]);
      if (selectedLetter && initial !== selectedLetter) {
        return false;
      }
      if (!q) return true;
      const title = normalize(item.title[locale]);
      const desc = normalize(item.description[locale]);
      const cat = normalize(item.category[locale]);
      const tagMatch = item.tags.some((t) => normalize(t).includes(q));
      return title.includes(q) || desc.includes(q) || cat.includes(q) || tagMatch;
    });
  }, [sortedItems, query, selectedLetter, locale]);

  // Groupement par lettre
  const groupedItems = useMemo(() => {
    const groups = new Map<string, ResourceItem[]>();
    for (const item of filteredItems) {
      const letter = getInitialLetter(item.title[locale]);
      const current = groups.get(letter) ?? [];
      current.push(item);
      groups.set(letter, current);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredItems, locale]);

  const placeholder =
    locale === "fr"
      ? "Filtrer l'index (ex : linux, mise à jour, tor...)"
      : "Filter index (e.g. linux, updates, tor...)";
  const allLabel = locale === "fr" ? "Tout" : "All";
  const countLabel =
    locale === "fr"
      ? `${filteredItems.length} entrée${filteredItems.length > 1 ? "s" : ""}`
      : `${filteredItems.length} entr${filteredItems.length > 1 ? "ies" : "y"}`;

  return (
    <div className="resource-index" id={id}>
      {/* Bandeau d'index unifié sur une ligne : recherche + alphabet complet A–Z + compteur */}
      <div className="resource-toolbar">
        <div className="resource-search-bar" role="search">
          <label
            htmlFor={searchInputId}
            className="resource-search-bar__icon"
            aria-label={locale === "fr" ? "Rechercher" : "Search"}
          >
            <Icon name="search" size={16} />
          </label>
          <input
            ref={inputRef}
            id={searchInputId}
            type="search"
            className="resource-search-bar__input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (selectedLetter) setSelectedLetter(null);
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              className="resource-search-bar__clear"
              onClick={() => setQuery("")}
              aria-label={locale === "fr" ? "Effacer la recherche" : "Clear search"}
            >
              <Icon name="close" size={14} />
            </button>
          ) : (
            <kbd className="resource-search-bar__kbd" aria-hidden="true">
              /
            </kbd>
          )}
        </div>

        <nav
          className="resource-letters-nav"
          aria-label={locale === "fr" ? "Index alphabétique" : "Alphabetical index"}
        >
          <button
            type="button"
            className="resource-letter-pill resource-letter-pill--all"
            data-active={!selectedLetter}
            onClick={() => {
              setSelectedLetter(null);
              setQuery("");
            }}
          >
            {allLabel}
          </button>
          {ALPHABET.map((letter) => {
            const hasEntries = availableLetterSet.has(letter);
            return (
              <button
                key={letter}
                type="button"
                className="resource-letter-pill"
                data-active={selectedLetter === letter}
                disabled={!hasEntries}
                onClick={() => {
                  setSelectedLetter((prev) => (prev === letter ? null : letter));
                  setQuery("");
                }}
              >
                {letter}
              </button>
            );
          })}
        </nav>

        <div className="resource-meta-bar" aria-live="polite">
          <span>{countLabel}</span>
        </div>
      </div>

      {groupedItems.length === 0 ? (
        <div className="resource-empty-state">
          <p className="resource-empty-state__title">
            {locale === "fr" ? "Aucune entrée trouvée" : "No entry found"}
          </p>
          <p className="resource-empty-state__desc">
            {locale === "fr"
              ? `Aucune entrée ne correspond à « ${query} ».`
              : `No entry matches "${query}".`}
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setQuery("");
              setSelectedLetter(null);
            }}
          >
            {locale === "fr" ? "Réinitialiser" : "Reset"}
          </button>
        </div>
      ) : (
        <div className="book-index-columns">
          {groupedItems.map(([letter, items]) => (
            <section
              key={letter}
              className="resource-letter-section"
              id={`letter-${letter.toLowerCase()}`}
            >
              <h2 className="resource-letter-heading">{letter}</h2>
              <ul className="book-index-list">
                {items.map((item) => {
                  const isExternal =
                    item.path.startsWith("http://") || item.path.startsWith("https://");
                  const baseExternal = item.path.replace(/\/+$/, "");
                  const href = isExternal
                    ? locale === "fr"
                      ? `${baseExternal}/fr/`
                      : `${baseExternal}/`
                    : lp(locale, item.path);

                  const entryContent = (
                    <>
                      <span className="book-index-entry__line">
                        <span className="book-index-entry__title">{item.title[locale]}</span>
                        <span className="book-index-entry__dots" aria-hidden="true" />
                        <span className="book-index-entry__cat">
                          {item.category[locale]}
                          {isExternal ? " ↗" : ""}
                        </span>
                      </span>
                      <span className="book-index-entry__desc">{item.description[locale]}</span>
                    </>
                  );

                  return (
                    <li key={item.id} className="book-index-item">
                      {isExternal ? (
                        <a
                          href={href}
                          className="book-index-entry"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entryContent}
                        </a>
                      ) : (
                        <Link href={href} className="book-index-entry">
                          {entryContent}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
