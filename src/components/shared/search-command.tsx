"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { searchProducts } from "@/mock/products";
import { categories, getCategoryByHandle } from "@/mock/categories";
import { routes } from "@/constants/routes";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types";

const RECENT_SEARCHES_KEY = "zeevara-recent-searches";
const MAX_RECENT_SEARCHES = 5;
const MAX_RESULTS_SHOWN = 6;
const POPULAR_CATEGORY_HANDLES = ["home-decor", "kitchen", "travel", "accessories"];

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debouncedQuery = useDebouncedValue(query, 150);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      setRecentSearches(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setRecentSearches([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      const products = await searchProducts(debouncedQuery);
      if (!cancelled) setResults(products);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  function addRecentSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((t) => t.toLowerCase() !== trimmed.toLowerCase())].slice(
        0,
        MAX_RECENT_SEARCHES,
      );
      try {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable, ignore
      }
      return next;
    });
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    try {
      window.localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // localStorage unavailable, ignore
    }
  }

  function navigateTo(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  function handleSelectProduct(product: Product) {
    addRecentSearch(query);
    navigateTo(routes.product(product.handle));
  }

  function handleViewAll() {
    addRecentSearch(query);
    navigateTo(routes.search(query));
  }

  const hasQuery = query.trim().length > 0;
  const suggestions = categories.slice(0, 3);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search products by name, category, or tag"
    >
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!hasQuery && (
            <>
              {recentSearches.length > 0 && (
                <CommandGroup heading="Recent searches">
                  <div className="flex items-center justify-between px-2 pb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Recent searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((term) => (
                    <CommandItem key={term} value={term} onSelect={() => setQuery(term)}>
                      {term}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandGroup heading="Popular right now">
                {POPULAR_CATEGORY_HANDLES.map((handle) => {
                  const category = getCategoryByHandle(handle);
                  if (!category) return null;
                  return (
                    <CommandItem
                      key={handle}
                      value={category.name}
                      onSelect={() => navigateTo(routes.collection(category.handle))}
                    >
                      {category.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {hasQuery && results.length > 0 && (
            <>
              <CommandGroup heading="Products">
                {results.slice(0, MAX_RESULTS_SHOWN).map((product) => {
                  const image = product.images[0];
                  const category = getCategoryByHandle(product.category);
                  return (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => handleSelectProduct(product)}
                      className="gap-3"
                    >
                      {image && (
                        <Image
                          src={image.url}
                          alt={image.altText}
                          width={40}
                          height={40}
                          className="size-10 shrink-0 rounded-md object-cover"
                        />
                      )}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm text-foreground">{product.title}</span>
                        <span className="text-xs text-muted-foreground">{category?.name}</span>
                      </div>
                      <span className="shrink-0 text-sm text-foreground">
                        {formatMoney(product.priceRange.min)}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandGroup>
                <CommandItem value={`view-all-${query}`} onSelect={handleViewAll}>
                  View all {results.length} results for &ldquo;{query}&rdquo;
                </CommandItem>
              </CommandGroup>
            </>
          )}

          {hasQuery && results.length === 0 && (
            <CommandEmpty>
              <div className="flex flex-col items-center gap-3 py-4">
                <p className="text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((category) => (
                    <button
                      key={category.handle}
                      type="button"
                      onClick={() => navigateTo(routes.collection(category.handle))}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground transition-colors hover:bg-muted"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </CommandEmpty>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
