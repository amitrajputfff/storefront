"use client";

import { useState } from "react";
import { useFieldArray, type Control, type FieldValues, type FieldArrayPath } from "react-hook-form";
import { ChevronDown, ChevronUp, Trash2, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// react-hook-form's own `FieldArray<T, TName>` type is shadowed at the
// package's root by a same-named component export, so TS resolves it as a
// value there — derive the item type from useFieldArray's actual return
// instead of importing that (unusable) type name.
type ArrayItem<T extends FieldValues, TName extends FieldArrayPath<T>> = ReturnType<
  typeof useFieldArray<T, TName>
>["fields"][number];

export function RepeatableListField<T extends FieldValues, TName extends FieldArrayPath<T>>({
  control,
  name,
  itemLabel,
  addLabel = "Add",
  emptyLabel = "Nothing here yet.",
  newItem,
  min = 0,
  max,
  collapsible = false,
  renderItem,
}: {
  control: Control<T>;
  name: TName;
  itemLabel: (item: ArrayItem<T, TName>, index: number) => string;
  addLabel?: string;
  emptyLabel?: string;
  // `append()` fills in `id` itself — callers shouldn't need to invent one.
  newItem: () => Omit<ArrayItem<T, TName>, "id">;
  min?: number;
  max?: number;
  collapsible?: boolean;
  renderItem: (args: { index: number; namePrefix: string }) => React.ReactNode;
}) {
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function toggle(index: number) {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.length === 0 && <p className="text-muted-foreground text-sm">{emptyLabel}</p>}

      {fields.map((field, index) => {
        const isOpen = !collapsible || expanded[index];
        return (
          <div key={field.id} className="rounded-lg border">
            <div className="flex items-center gap-2 px-3 py-2">
              {collapsible && (
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <ChevronRight className={cn("text-muted-foreground size-4 shrink-0 transition-transform", isOpen && "rotate-90")} />
                  <span className="truncate text-sm font-medium">
                    {itemLabel(field as unknown as ArrayItem<T, TName>, index)}
                  </span>
                </button>
              )}
              {!collapsible && (
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {itemLabel(field as unknown as ArrayItem<T, TName>, index)}
                </span>
              )}
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  aria-label="Move up"
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                  aria-label="Move down"
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={fields.length <= min}
                  onClick={() => setConfirmDelete(index)}
                  aria-label="Remove"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            {isOpen && (
              <div className="flex flex-col gap-3 border-t px-3 py-3">
                {renderItem({ index, namePrefix: `${name}.${index}` })}
              </div>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start"
        disabled={max !== undefined && fields.length >= max}
        onClick={() => append(newItem() as Parameters<typeof append>[0])}
      >
        <Plus className="size-4" />
        <span>{addLabel}</span>
      </Button>

      <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone once you publish.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDelete !== null) remove(confirmDelete);
                setConfirmDelete(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
