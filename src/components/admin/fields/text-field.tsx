import { type FieldValues, type FieldPath, type UseFormRegister, type FieldErrors, get } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TextField<T extends FieldValues>({
  name,
  label,
  description,
  register,
  errors,
  maxLength,
  type = "text",
  placeholder,
}: {
  name: FieldPath<T>;
  label: string;
  description?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  maxLength?: number;
  type?: string;
  placeholder?: string;
}) {
  const error = get(errors, name);

  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={!!error}
        {...register(name)}
      />
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error.message as string}</FieldError>}
    </Field>
  );
}
