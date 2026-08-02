"use client";

import { useContentForm } from "@/hooks/admin/use-content-form";
import { lifestyleBannerSchema } from "@/lib/content/schemas";
import type { LifestyleBannerContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextareaField } from "@/components/admin/fields/textarea-field";
import { ImagePickerField } from "@/components/admin/fields/image-picker-field";

export function LifestyleBannerForm({ initialValue }: { initialValue: LifestyleBannerContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "home.lifestyle_banner",
    formSchema: lifestyleBannerSchema,
    storageSchema: lifestyleBannerSchema,
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
      title="Lifestyle Banner"
      description="The full-bleed quote banner with parallax scrolling."
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Content">
        <ImagePickerField control={control} name="image" label="Background image" aspect="video" />
        <TextareaField
          name="quote"
          label="Quote"
          register={register}
          errors={errors}
          maxLength={200}
          rows={3}
          description="Sits on top of a dark overlay — keep it short and legible."
        />
      </FormSection>
    </EditPageShell>
  );
}
