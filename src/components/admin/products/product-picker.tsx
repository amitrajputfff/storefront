"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { searchProductsForAdmin, type AdminProductSearchResult } from "@/lib/admin/product-overrides-actions";

export function ProductPicker({
  value,
  valueLabel,
  onChange,
}: {
  value: string;
  valueLabel?: string;
  onChange: (product: AdminProductSearchResult) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 200);
  const [results, setResults] = useState<AdminProductSearchResult[]>([]);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    startTransition(async () => {
      const result = await searchProductsForAdmin(debouncedQuery);
      if (result.ok) setResults(result.data);
    });
  }, [open, debouncedQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="border-input flex w-full items-center justify-between gap-2 rounded-lg border bg-transparent px-3 py-2 text-left text-sm">
        <span className={value ? "" : "text-muted-foreground"}>
          {valueLabel || value || "Search for a product…"}
        </span>
        <ChevronDown className="text-muted-foreground size-4 shrink-0" />
      </PopoverTrigger>
      <PopoverContent className="w-[--anchor-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search products…" value={query} onValueChange={setQuery} />
          <CommandList>
            {!loading && results.length === 0 && <CommandEmpty>No products found.</CommandEmpty>}
            {results.map((product) => (
              <CommandItem
                key={product.handle}
                value={product.handle}
                onSelect={() => {
                  onChange(product);
                  setOpen(false);
                }}
              >
                <div className="relative size-8 shrink-0 overflow-hidden rounded bg-muted">
                  {product.thumbnailUrl && (
                    <Image src={product.thumbnailUrl} alt="" fill sizes="32px" className="object-cover" />
                  )}
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{product.title}</span>
                  <span className="text-muted-foreground truncate font-mono text-xs">{product.handle}</span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
