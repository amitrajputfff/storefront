"use client";

import { useState } from "react";
import Image from "next/image";
import { Controller, type Control, type FieldValues, type FieldPath } from "react-hook-form";
import { ImagePlus, X } from "lucide-react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaLibraryDialog } from "@/components/admin/media/media-library-dialog";
import type { MediaItem } from "@/lib/admin/media-actions";

interface ImageValue {
  mediaId?: string | null;
  url: string;
  altText: string;
  width?: number;
  height?: number;
}

export function ImagePickerField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  aspect = "video",
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  aspect?: "square" | "video" | "portrait";
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const aspectClass = aspect === "square" ? "aspect-square" : aspect === "portrait" ? "aspect-[4/5]" : "aspect-video";

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = (field.value ?? { url: "", altText: "" }) as ImageValue;

        function handleSelect(item: MediaItem) {
          field.onChange({
            mediaId: item.id,
            url: item.url,
            altText: value.altText || item.altText,
            width: item.width ?? undefined,
            height: item.height ?? undefined,
          } satisfies ImageValue);
        }

        return (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {value.url ? (
              <div className="flex flex-col gap-2">
                <div className={`relative w-full max-w-xs overflow-hidden rounded-lg border ${aspectClass}`}>
                  <Image src={value.url} alt={value.altText} fill sizes="320px" className="object-cover" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute top-1.5 right-1.5"
                    onClick={() => field.onChange({ url: "", altText: "", mediaId: null } satisfies ImageValue)}
                    aria-label="Remove image"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
                <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => setDialogOpen(true)}>
                  Replace
                </Button>
                <Input
                  placeholder="Alt text"
                  value={value.altText}
                  onChange={(e) => field.onChange({ ...value, altText: e.target.value } satisfies ImageValue)}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="border-border hover:bg-muted/50 flex aspect-video w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed"
              >
                <ImagePlus className="text-muted-foreground size-6" />
                <span className="text-muted-foreground text-sm">Choose image</span>
              </button>
            )}

            <MediaLibraryDialog open={dialogOpen} onOpenChange={setDialogOpen} onSelect={handleSelect} />
          </Field>
        );
      }}
    />
  );
}
