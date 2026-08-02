"use client";

import { useContentForm } from "@/hooks/admin/use-content-form";
import { testimonialsSchema } from "@/lib/content/schemas";
import type { TestimonialsContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { TextareaField } from "@/components/admin/fields/textarea-field";
import { RatingField } from "@/components/admin/fields/rating-field";
import { RepeatableListField } from "@/components/admin/fields/repeatable-list-field";

export function TestimonialsForm({ initialValue }: { initialValue: TestimonialsContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "home.testimonials",
    formSchema: testimonialsSchema,
    storageSchema: testimonialsSchema,
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
      title="Testimonials"
      description="The scrolling customer quote strip on the homepage."
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Heading">
        <TextField name="title" label="Title" register={register} errors={errors} maxLength={80} />
      </FormSection>

      <FormSection title="Testimonials">
        <RepeatableListField
          control={control}
          name="items"
          min={1}
          max={24}
          collapsible
          addLabel="Add testimonial"
          newItem={() => ({ id: crypto.randomUUID(), author: "", location: "", rating: 5, quote: "" })}
          itemLabel={(item) => `${item.author || "Untitled"}${item.location ? ` — ${item.location}` : ""} ★${item.rating}`}
          renderItem={({ index }) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField name={`items.${index}.author`} label="Author" register={register} errors={errors} maxLength={60} />
                <TextField name={`items.${index}.location`} label="Location" register={register} errors={errors} maxLength={60} />
              </div>
              <RatingField control={control} name={`items.${index}.rating`} />
              <TextareaField name={`items.${index}.quote`} label="Quote" register={register} errors={errors} maxLength={320} rows={3} />
            </>
          )}
        />
      </FormSection>
    </EditPageShell>
  );
}
