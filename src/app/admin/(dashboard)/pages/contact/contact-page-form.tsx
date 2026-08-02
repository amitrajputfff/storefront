"use client";

import { useContentForm } from "@/hooks/admin/use-content-form";
import { contactIntroSchema } from "@/lib/content/schemas";
import type { ContactIntroContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { TextareaField } from "@/components/admin/fields/textarea-field";

export function ContactPageForm({ initialValue }: { initialValue: ContactIntroContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "contact.intro",
    formSchema: contactIntroSchema,
    storageSchema: contactIntroSchema,
    defaultValues: initialValue,
    toStorage: (v) => v,
  });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <EditPageShell
      title="Contact"
      description="Six short labels in a two-column layout with a live form — not a document, so there's no rich-text editor here."
      previewPath="/contact"
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
        <TextareaField name="description" label="Description" register={register} errors={errors} maxLength={200} rows={2} />
      </FormSection>

      <FormSection title="Contact details">
        <TextField name="contactEmail" label="Email" type="email" register={register} errors={errors} />
        <TextField name="contactHours" label="Support hours" register={register} errors={errors} maxLength={80} />
      </FormSection>

      <FormSection title="FAQ prompt">
        <TextField name="faqPrompt.label" label="Link text" register={register} errors={errors} maxLength={40} />
        <TextField name="faqPrompt.href" label="Link" register={register} errors={errors} placeholder="/faq" />
      </FormSection>
    </EditPageShell>
  );
}
