"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/types";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { getCategoryByHandle } from "@/mock/categories";

function collectFacets(products: Product[]) {
  const categories = new Set<string>();
  let maxPrice = 0;

  for (const product of products) {
    for (const category of product.categories) categories.add(category);
    maxPrice = Math.max(maxPrice, product.priceRange.max.amount);
  }

  return {
    categories: Array.from(categories),
    maxPrice: Math.ceil(maxPrice / 500) * 500 || 5000,
  };
}

function FiltersBody({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories, maxPrice } = collectFacets(products);

  const activeCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const activeRating = searchParams.get("rating") ?? "";
  const priceMin = Number(searchParams.get("priceMin") ?? 0);
  const priceMax = Number(searchParams.get("priceMax") ?? maxPrice);

  const [priceRange, setPriceRange] = useState([priceMin, priceMax]);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleListParam(key: string, current: string[], value: string) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(key, next.length ? next.join(",") : null);
  }

  const hasActiveFilters =
    activeCategories.length > 0 || activeRating || searchParams.get("priceMin") || searchParams.get("priceMax");

  return (
    <div className="flex flex-col gap-8">
      {hasActiveFilters && (
        <button
          className="text-muted-foreground self-start text-xs underline underline-offset-4 hover:text-foreground"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          Clear all
        </button>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium">Price</p>
        <Slider
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as number[])}
          onValueCommitted={(v) => {
            const [min, max] = v as number[];
            updateParam("priceMin", min > 0 ? String(min) : null);
            updateParam("priceMax", max < maxPrice ? String(max) : null);
          }}
        />
        <p className="text-muted-foreground text-xs">
          {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
        </p>
      </div>

      {categories.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Category</p>
          <div className="flex flex-col gap-2">
            {categories.map((handle) => (
              <Label key={handle} className="font-normal">
                <Checkbox
                  checked={activeCategories.includes(handle)}
                  onCheckedChange={() => toggleListParam("category", activeCategories, handle)}
                />
                {getCategoryByHandle(handle)?.name ?? handle}
              </Label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium">Rating</p>
        <RadioGroup
          value={activeRating}
          onValueChange={(v) => updateParam("rating", (v as string) || null)}
        >
          {["4", "3"].map((r) => (
            <Label key={r} className="font-normal">
              <RadioGroupItem value={r} />
              {r}★ &amp; up
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export function Filters({ products }: { products: Product[] }) {
  return (
    <>
      <aside className="hidden w-56 shrink-0 lg:block">
        <FiltersBody products={products} />
      </aside>
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" size="sm" className="lg:hidden">
              <SlidersHorizontal className="size-3.5" />
              <span>Filters</span>
            </Button>
          }
        />
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="px-6 pb-6">
            <FiltersBody products={products} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
