"use client";

import { Product } from "@/types";
import { cn } from "@/lib/utils";

const COLOR_SWATCH_MAP: Record<string, string> = {
  black: "#111111",
  white: "#ffffff",
  ivory: "#f4f1ea",
  cream: "#f5efdf",
  beige: "#e8dcc8",
  tan: "#d2b48c",
  brown: "#6b4a2f",
  charcoal: "#36393d",
  grey: "#9a9a9a",
  gray: "#9a9a9a",
  navy: "#1f2a44",
  blue: "#3457a6",
  teal: "#2f6f6a",
  green: "#3f6b3f",
  olive: "#6b6b3a",
  sage: "#9caf88",
  red: "#a13d3d",
  maroon: "#6f2b34",
  rust: "#a75c3a",
  pink: "#e3b6bd",
  blush: "#e9c7c4",
  mustard: "#d4a72c",
  gold: "#c9a24b",
  silver: "#c4c4c4",
  copper: "#b46a4a",
  terracotta: "#c1653d",
};

function swatchColor(value: string): string {
  return COLOR_SWATCH_MAP[value.trim().toLowerCase()] ?? "#bbbbbb";
}

function isValueAvailable(
  product: Product,
  optionName: string,
  value: string,
  selectedOptions: Record<string, string>,
): { exists: boolean; availableForSale: boolean } {
  const candidate = { ...selectedOptions, [optionName]: value };
  const match = product.variants.find((variant) =>
    variant.selectedOptions.every((so) => candidate[so.name] === so.value),
  );
  if (!match) return { exists: false, availableForSale: false };
  return { exists: true, availableForSale: match.availableForSale };
}

export function VariantSelector({
  product,
  selectedOptions,
  onChange,
}: {
  product: Product;
  selectedOptions: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {product.options.map((option) => {
        const isColor = option.name.toLowerCase() === "color";
        const selectedValue = selectedOptions[option.name];

        return (
          <div key={option.name} className="flex flex-col gap-2">
            <p className="text-sm">
              <span className="font-medium">{option.name}</span>
              {selectedValue && (
                <span className="text-muted-foreground">: {selectedValue}</span>
              )}
            </p>

            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const { exists, availableForSale } = isValueAvailable(
                  product,
                  option.name,
                  value,
                  selectedOptions,
                );
                const disabled = !exists || !availableForSale;
                const selected = selectedValue === value;

                if (isColor) {
                  return (
                    <button
                      key={value}
                      type="button"
                      title={value}
                      disabled={disabled}
                      onClick={() => onChange(option.name, value)}
                      className={cn(
                        "relative size-8 shrink-0 rounded-full border-2 transition-colors",
                        selected ? "border-foreground" : "border-transparent",
                        disabled && "opacity-40",
                      )}
                    >
                      <span
                        className="absolute inset-1 rounded-full border border-border"
                        style={{ backgroundColor: swatchColor(value) }}
                      />
                      {disabled && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-px w-full rotate-45 bg-foreground/50" />
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(option.name, value)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm transition-colors",
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground",
                      disabled && "text-muted-foreground line-through opacity-50 hover:border-border",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
