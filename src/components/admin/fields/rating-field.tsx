import { Controller, type Control, type FieldValues, type FieldPath } from "react-hook-form";
import { Star } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function RatingField<T extends FieldValues>({
  control,
  name,
  label = "Rating",
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} type="button" aria-label={`${value} star`} onClick={() => field.onChange(value)}>
                <Star
                  className={cn(
                    "size-5",
                    value <= (field.value as number)
                      ? "fill-foreground text-foreground"
                      : "fill-transparent text-muted-foreground/40",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      />
    </Field>
  );
}
