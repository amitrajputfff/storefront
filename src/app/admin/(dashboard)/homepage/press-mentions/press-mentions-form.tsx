"use client";

import { z } from "zod";
import { useContentForm } from "@/hooks/admin/use-content-form";
import { pressSchema } from "@/lib/content/schemas";
import type { PressContent } from "@/lib/content/types";
import { toRows, fromRows } from "@/lib/admin/field-array";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { StringListField } from "@/components/admin/fields/string-list-field";

const formSchema = z.object({
  eyebrow: z.string().trim().max(40),
  items: z.array(z.object({ value: z.string().trim().min(1).max(40) })).min(3).max(16),
});

type FormValues = z.infer<typeof formSchema>;

export function PressMentionsForm({ initialValue }: { initialValue: PressContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm<FormValues, PressContent>({
    contentKey: "home.press",
    formSchema,
    storageSchema: pressSchema,
    defaultValues: { eyebrow: initialValue.eyebrow, items: toRows(initialValue.items) },
    toStorage: (v) => ({ eyebrow: v.eyebrow, items: fromRows(v.items) }),
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <EditPageShell
      title="Press Mentions"
      description={'The "As Featured In" logo strip on the homepage.'}
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Section">
        <TextField name="eyebrow" label="Eyebrow" register={register} errors={errors} maxLength={40} description="Displayed uppercase." />
      </FormSection>
      <FormSection title="Mentions">
        <StringListField control={control} name="items" min={3} max={16} maxLength={40} addLabel="Add mention" placeholder="e.g. THE MODERN HOME" />
      </FormSection>
    </EditPageShell>
  );
}
