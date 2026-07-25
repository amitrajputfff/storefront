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

function collectFacets(products: Product[]) {
  const colors = new Set<string>();
  const sizes = new Set<string>();
  let maxPrice = 0;

  for (const product of products) {
    for (const option of product.options) {
      const target = option.name.toLowerCase() === "color" ? colors : option.name.toLowerCase() === "size" ? sizes : null;
      if (target) option.values.forEach((v) => target.add(v));
    }
    maxPrice = Math.max(maxPrice, product.priceRange.max.amount);
  }

  return {
    colors: Array.from(colors),
    sizes: Array.from(sizes),
    maxPrice: Math.ceil(maxPrice / 500) * 500 || 5000,
  };
}

function FiltersBody({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { colors, sizes, maxPrice } = collectFacets(products);

  const activeColors = searchParams.get("color")?.split(",").filter(Boolean) ?? [];
  const activeSizes = searchParams.get("size")?.split(",").filter(Boolean) ?? [];
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
    activeColors.length > 0 || activeSizes.length > 0 || activeRating || searchParams.get("priceMin") || searchParams.get("priceMax");

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

      {colors.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Color</p>
          <div className="flex flex-col gap-2">
            {colors.map((color) => (
              <Label key={color} className="font-normal">
                <Checkbox
                  checked={activeColors.includes(color)}
                  onCheckedChange={() => toggleListParam("color", activeColors, color)}
                />
                {color}
              </Label>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Size</p>
          <div className="flex flex-col gap-2">
            {sizes.map((size) => (
              <Label key={size} className="font-normal">
                <Checkbox
                  checked={activeSizes.includes(size)}
                  onCheckedChange={() => toggleListParam("size", activeSizes, size)}
                />
                {size}
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
