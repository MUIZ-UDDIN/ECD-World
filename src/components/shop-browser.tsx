"use client";

import { useMemo, useState } from "react";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, featuredRank, type Product } from "@/lib/catalog";
import { categoryCopy } from "@/lib/site";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "name" | "price-asc" | "price-desc";

const sortLabels: Record<SortKey, string> = {
  featured: "Featured",
  name: "Name A–Z",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

type ShopBrowserProps = {
  items: Product[];
  fixedCategory?: string;
  initialQuery?: string;
};

export function ShopBrowser({ items, fixedCategory, initialQuery = "" }: ShopBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [pricedOnly, setPricedOnly] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    const filtered = items.filter((product) => {
      if (activeCategory !== "all" && !product.categories.some((c) => c.slug === activeCategory)) {
        return false;
      }
      if (pricedOnly && product.price === null) return false;
      if (term) {
        const haystack = [product.name, product.sku ?? "", ...product.categories.map((c) => c.name)]
          .join(" ")
          .toLowerCase();
        if (!term.split(/\s+/).every((word) => haystack.includes(word))) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        });
        break;
      case "price-desc":
        sorted.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        });
        break;
      default:
        sorted.sort(
          (a, b) => featuredRank(a.slug) - featuredRank(b.slug) || a.name.localeCompare(b.name),
        );
    }
    return sorted;
  }, [items, activeCategory, pricedOnly, query, sort]);

  const hasFilters = activeCategory !== "all" || pricedOnly || query.trim().length > 0;

  const reset = () => {
    setActiveCategory("all");
    setPricedOnly(false);
    setQuery("");
  };

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-1 border-b border-line bg-cream/92 backdrop-blur-xl md:top-20">
        <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-3">
          {!fixedCategory && (
            <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5 sm:flex-1">
              <FilterPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
                All
              </FilterPill>
              {categories
                .filter((category) => category.slug !== "ecd-materials")
                .map((category) => (
                <FilterPill
                  key={category.slug}
                  active={activeCategory === category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  {categoryCopy[category.slug]?.title ?? category.name}
                  <span className="ml-1.5 text-[0.62rem] opacity-60">{category.count}</span>
                </FilterPill>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 sm:shrink-0">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border px-4 py-2 text-[0.78rem] font-medium transition-colors sm:justify-start",
              pricedOnly
                ? "border-forest bg-forest text-cream"
                : "border-line bg-white/60 text-forest hover:border-forest/30",
            )}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="size-3.5" aria-hidden />
            <span>Filters</span>
            {hasFilters && <span className="size-1.5 rounded-full bg-clay" aria-hidden />}
          </button>

          <label className="relative flex-1 sm:flex-none">
            <span className="sr-only">Sort products</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="w-full appearance-none rounded-full border border-line bg-white/60 py-2 pr-8 pl-4 text-[0.78rem] font-medium text-forest transition-colors hover:border-forest/30 focus:outline-none"
            >
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[0.6rem] text-muted"
              aria-hidden
            >
              ▾
            </span>
          </label>
          </div>
        </div>

        {filtersOpen && (
          <div className="flex flex-wrap items-center gap-3 border-t border-line/70 py-3">
            <label className="flex cursor-pointer items-center gap-2 text-[0.8rem] text-forest">
              <input
                type="checkbox"
                checked={pricedOnly}
                onChange={(event) => setPricedOnly(event.target.checked)}
                className="size-4 accent-forest"
              />
              Priced items only
            </label>

            <label className="relative flex min-w-48 flex-1 items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-1.5">
              <span className="sr-only">Search this collection</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this collection…"
                className="w-full bg-transparent py-1 text-[0.8rem] text-ink placeholder:text-muted/60 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-muted hover:text-clay"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              )}
            </label>

            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 text-[0.78rem] text-clay hover:underline"
              >
                <Check className="size-3.5" aria-hidden />
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <p className="text-[0.75rem] tracking-[0.12em] text-muted uppercase">
          {visible.length} {visible.length === 1 ? "material" : "materials"}
          {hasFilters ? ` of ${items.length}` : ""}
        </p>
        <p className="hidden text-[0.72rem] text-muted/80 sm:block">
          Prices in PKR · Made-to-order items quoted per set
        </p>
      </div>

      {visible.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-line bg-shell/40 px-6 py-16 text-center">
          <p className="font-display text-2xl text-forest">No materials match that</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Try a broader filter — or message us, we may be able to make it.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-pine"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-[0.78rem] font-medium whitespace-nowrap transition-colors",
        active
          ? "border-forest bg-forest text-cream"
          : "border-line bg-white/60 text-forest hover:border-forest/30",
      )}
    >
      {children}
    </button>
  );
}
