import { Controller, type Control, type FieldValues, type FieldPath } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { RichTextEditor } from "@/components/admin/editor/rich-text-editor";

export function RichTextField<T extends FieldValues>({
  control,
  name,
  label,
  onJsonChange,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  onJsonChange?: (json: unknown) => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {label && <FieldLabel>{label}</FieldLabel>}
          <RichTextEditor
            defaultValue={field.value as string}
            invalid={!!fieldState.error}
            onChange={(html, json) => {
              field.onChange(html);
              onJsonChange?.(json);
            }}
          />
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}
    />
  );
}
