"use client";

import { useContentForm } from "@/hooks/admin/use-content-form";
import { featuredCollectionSchema } from "@/lib/content/schemas";
import type { FeaturedCollectionContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { ImagePickerField } from "@/components/admin/fields/image-picker-field";
import { FieldDescription } from "@/components/ui/field";

export function FeaturedCollectionForm({ initialValue }: { initialValue: FeaturedCollectionContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "home.featured_collection",
    formSchema: featuredCollectionSchema,
    storageSchema: featuredCollectionSchema,
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
      title="Featured Collection"
      description="The split-image collection callout on the homepage."
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Labels">
        <TextField name="eyebrow" label="Eyebrow" register={register} errors={errors} maxLength={32} />
        <TextField name="ctaLabel" label="Button text" register={register} errors={errors} maxLength={24} />
        <FieldDescription>
          The collection title, description, and products shown here come from your catalog and aren&apos;t editable here.
        </FieldDescription>
      </FormSection>
      <FormSection title="Image">
        <ImagePickerField control={control} name="image" label="Collection image" aspect="portrait" />
      </FormSection>
    </EditPageShell>
  );
}
