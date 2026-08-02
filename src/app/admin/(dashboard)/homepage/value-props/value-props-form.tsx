"use client";

import { useContentForm } from "@/hooks/admin/use-content-form";
import { valuePropsSchema } from "@/lib/content/schemas";
import type { ValuePropsContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { TextareaField } from "@/components/admin/fields/textarea-field";
import { IconPickerField } from "@/components/admin/fields/icon-picker-field";
import { RepeatableListField } from "@/components/admin/fields/repeatable-list-field";

export function ValuePropsForm({ initialValue }: { initialValue: ValuePropsContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "home.value_props",
    formSchema: valuePropsSchema,
    storageSchema: valuePropsSchema,
    defaultValues: initialValue,
    toStorage: (v) => v,
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <EditPageShell
      title="Value Props"
      description={'The "Why Choose Us" bento grid on the homepage. Reads best with 4 items.'}
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Heading">
        <TextField name="eyebrow" label="Eyebrow" register={register} errors={errors} maxLength={40} />
        <TextField name="title" label="Title" register={register} errors={errors} maxLength={60} />
      </FormSection>

      <FormSection title="Items">
        <RepeatableListField
          control={control}
          name="items"
          min={2}
          max={8}
          addLabel="Add item"
          newItem={() => ({ icon: "sparkles" as const, title: "", description: "" })}
          itemLabel={(item) => item.title || "Untitled"}
          renderItem={({ index }) => (
            <>
              <IconPickerField control={control} name={`items.${index}.icon`} />
              <TextField name={`items.${index}.title`} label="Title" register={register} errors={errors} maxLength={48} />
              <TextareaField name={`items.${index}.description`} label="Description" register={register} errors={errors} maxLength={180} rows={2} />
            </>
          )}
        />
      </FormSection>
    </EditPageShell>
  );
}
