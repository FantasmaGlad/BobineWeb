"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { lp } from "@/lib/seo";
import { resourceList, type ResourceItem } from "@/content/resources";
import RouteIcon from "@/components/page/RouteIcon";
import Icon from "@/components/ui/Icon";
import "@/styles/components/resource-index.css";

interface ResourceIndexProps {
  locale: Locale;
  id?: string;
}

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

  // Liste triée par ordre alphabétique du titre localisé
  const sortedItems = useMemo(() => {
    return [...resourceList].sort((a, b) =>
      a.title[locale].localeCompare(b.title[locale], locale, { sensitivity: "base" })
    );
  }, [locale]);

  // Toutes les lettres disponibles
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const item of sortedItems) {
      letters.add(getInitialLetter(item.title[locale]));
    }
    return Array.from(letters).sort();
  }, [sortedItems, locale]);

  // Filtrage ultra-rapide par recherche et lettre
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

  const placeholder = locale === "fr" ? "Rechercher dans les ressources (ex : linux, mise à jour, tor...)" : "Search resources (e.g. linux, updates, tor...)";
  const allLabel = locale === "fr" ? "Toutes" : "All";
  const countLabel = locale === "fr"
    ? `${filteredItems.length} ressource${filteredItems.length > 1 ? "s" : ""}`
    : `${filteredItems.length} resource${filteredItems.length > 1 ? "s" : ""}`;

  return (
    <div className="resource-index" id={id}>
      <div className="resource-search-bar" role="search">
        <label htmlFor={searchInputId} className="resource-search-bar__icon" aria-label={locale === "fr" ? "Rechercher" : "Search"}>
          <Icon name="search" size={20} />
        </label>
        <input
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
            <Icon name="close" size={16} />
          </button>
        ) : null}
      </div>

      <nav className="resource-letters-nav" aria-label={locale === "fr" ? "Index alphabétique" : "Alphabetical index"}>
        <button
          type="button"
          className="resource-letter-pill"
          data-active={!selectedLetter}
          onClick={() => {
            setSelectedLetter(null);
            setQuery("");
          }}
        >
          {allLabel}
        </button>
        {availableLetters.map((letter) => (
          <button
            key={letter}
            type="button"
            className="resource-letter-pill"
            data-active={selectedLetter === letter}
            onClick={() => {
              setSelectedLetter((prev) => (prev === letter ? null : letter));
              setQuery("");
            }}
          >
            {letter}
          </button>
        ))}
      </nav>

      <div className="resource-meta-bar" aria-live="polite">
        <span>{countLabel}</span>
        {query ? (
          <span>
            {locale === "fr" ? `Résultats pour « ${query} »` : `Results for "${query}"`}
          </span>
        ) : selectedLetter ? (
          <span>
            {locale === "fr" ? `Section ${selectedLetter}` : `Section ${selectedLetter}`}
          </span>
        ) : null}
      </div>

      {groupedItems.length === 0 ? (
        <div className="resource-empty-state">
          <p className="resource-empty-state__title">
            {locale === "fr" ? "Aucune ressource trouvée" : "No resource found"}
          </p>
          <p className="resource-empty-state__desc">
            {locale === "fr"
              ? `Aucune ressource ne correspond à votre recherche « ${query} ». Essayez d'autres mots-clés ou parcourez l'index alphabétique.`
              : `No resources match your search "${query}". Try different keywords or browse the alphabetical index.`}
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setQuery("");
              setSelectedLetter(null);
            }}
          >
            {locale === "fr" ? "Réinitialiser les filtres" : "Reset filters"}
          </button>
        </div>
      ) : (
        groupedItems.map(([letter, items]) => (
          <section key={letter} className="resource-letter-section" id={`letter-${letter.toLowerCase()}`}>
            <h2 className="resource-letter-heading">
              <span className="resource-letter-heading__badge">{letter}</span>
              <span>{locale === "fr" ? `Index ${letter}` : `Index ${letter}`}</span>
            </h2>
            <ul className="resource-cards-grid">
              {items.map((item) => {
                const isExternal = item.path.startsWith("http://") || item.path.startsWith("https://");
                const href = isExternal
                  ? (locale === "fr" ? `${item.path}/fr/` : item.path)
                  : lp(locale, item.path);
                const cardContent = (
                  <>
                    <div>
                      <div className="resource-card__header">
                        <span className="resource-card__icon-wrapper" aria-hidden="true">
                          <RouteIcon icon={item.icon} size={20} />
                        </span>
                        <span className="resource-card__category">{item.category[locale]}</span>
                      </div>
                      <h3 className="resource-card__title">{item.title[locale]}</h3>
                      <p className="resource-card__desc">{item.description[locale]}</p>
                    </div>
                    <span className="resource-card__footer">
                      <span>{locale === "fr" ? (isExternal ? "Ouvrir" : "Consulter") : (isExternal ? "Open" : "View")}</span>
                      <Icon name={isExternal ? "external" : "arrow-right"} size={14} />
                    </span>
                  </>
                );

                return (
                  <li key={item.id}>
                    {isExternal ? (
                      <a href={href} className="resource-card" target="_blank" rel="noopener noreferrer">
                        {cardContent}
                      </a>
                    ) : (
                      <Link href={href} className="resource-card">
                        {cardContent}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
