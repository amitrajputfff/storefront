"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { searchAddress, AddressSuggestion } from "@/lib/address-autocomplete";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AddressSearchInput({
  id,
  value,
  onChange,
  onSelectSuggestion,
  placeholder,
  ariaInvalid,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  ariaInvalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const debouncedValue = useDebouncedValue(value, 400);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debouncedValue.trim().length < 4) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchAddress(debouncedValue).then((results) => {
      if (cancelled) return;
      setSuggestions(results);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedValue]);

  useEffect(() => {
    return () => {
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };
  }, []);

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        autoComplete="off"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => setOpen(false), 150);
        }}
      />
      {loading && (
        <Loader2 className="absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}

      {open && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border bg-popover shadow-md">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.label}-${index}`}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelectSuggestion(suggestion);
                setOpen(false);
                setSuggestions([]);
              }}
              className={cn(
                "flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-accent",
                index > 0 && "border-t border-border",
              )}
            >
              <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2">{suggestion.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
