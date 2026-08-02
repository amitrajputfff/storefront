import { Controller, type Control, type FieldValues, type FieldArrayPath, type FieldPath } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RepeatableListField } from "./repeatable-list-field";

/**
 * useFieldArray can't operate on an array of primitives, so the form's
 * internal shape is `{ value: string }[]` — the caller's zod schema
 * serializes/deserializes this to a plain string[] at the getContent/
 * saveContentDraft boundary (see src/lib/admin/field-array.ts).
 */
export function StringListField<T extends FieldValues, TName extends FieldArrayPath<T>>({
  control,
  name,
  addLabel,
  emptyLabel,
  placeholder,
  maxLength,
  min,
  max,
}: {
  control: Control<T>;
  name: TName;
  addLabel?: string;
  emptyLabel?: string;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
}) {
  return (
    <RepeatableListField
      control={control}
      name={name}
      addLabel={addLabel}
      emptyLabel={emptyLabel}
      min={min}
      max={max}
      newItem={() => ({ value: "" }) as never}
      itemLabel={(item) => (item as unknown as { value: string }).value || "Untitled"}
      renderItem={({ namePrefix }) => (
        <Controller
          control={control}
          name={`${namePrefix}.value` as FieldPath<T>}
          render={({ field }) => (
            <Input placeholder={placeholder} maxLength={maxLength} value={field.value ?? ""} onChange={field.onChange} onBlur={field.onBlur} />
          )}
        />
      )}
    />
  );
}
