import { type FieldValues, type FieldPath, type UseFormRegister, type FieldErrors, get } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/** Editable {label, href} pair — `namePrefix` is the path to the object,
 * e.g. "primaryCta" for a field shaped { primaryCta: { label, href } }. */
export function LinkField<T extends FieldValues>({
  namePrefix,
  title,
  register,
  errors,
}: {
  namePrefix: string;
  title: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}) {
  const labelName = `${namePrefix}.label` as FieldPath<T>;
  const hrefName = `${namePrefix}.href` as FieldPath<T>;
  const labelError = get(errors, labelName);
  const hrefError = get(errors, hrefName);

  return (
    <div>
      <p className="mb-2 text-sm font-medium">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={labelName}>Button text</FieldLabel>
          <Input id={labelName} aria-invalid={!!labelError} {...register(labelName)} />
          {labelError && <FieldError>{labelError.message as string}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor={hrefName}>Link</FieldLabel>
          <Input id={hrefName} placeholder="/collections/new-arrivals" aria-invalid={!!hrefError} {...register(hrefName)} />
          {hrefError && <FieldError>{hrefError.message as string}</FieldError>}
        </Field>
      </div>
    </div>
  );
}
