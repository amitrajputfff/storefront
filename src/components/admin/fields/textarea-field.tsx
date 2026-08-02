import { type FieldValues, type FieldPath, type UseFormRegister, type FieldErrors, get } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField<T extends FieldValues>({
  name,
  label,
  description,
  register,
  errors,
  maxLength,
  rows = 3,
}: {
  name: FieldPath<T>;
  label: string;
  description?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  maxLength?: number;
  rows?: number;
}) {
  const error = get(errors, name);

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Textarea id={name} rows={rows} maxLength={maxLength} aria-invalid={!!error} {...register(name)} />
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error.message as string}</FieldError>}
    </Field>
  );
}
