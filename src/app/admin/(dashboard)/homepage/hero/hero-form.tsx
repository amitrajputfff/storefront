"use client";

import { useContentForm } from "@/hooks/admin/use-content-form";
import { heroSchema } from "@/lib/content/schemas";
import type { HeroContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { TextareaField } from "@/components/admin/fields/textarea-field";
import { LinkField } from "@/components/admin/fields/link-field";
import { ImagePickerField } from "@/components/admin/fields/image-picker-field";
import { RepeatableListField } from "@/components/admin/fields/repeatable-list-field";

export function HeroForm({ initialValue }: { initialValue: HeroContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "home.hero",
    formSchema: heroSchema,
    storageSchema: heroSchema,
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
      title="Hero"
      description="The full-bleed banner at the top of the homepage."
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Copy">
        <TextField name="headline" label="Headline" register={register} errors={errors} maxLength={90} />
        <TextareaField name="subtext" label="Subtext" register={register} errors={errors} maxLength={160} rows={2} />
      </FormSection>

      <FormSection title="Buttons">
        <LinkField namePrefix="primaryCta" title="Primary button" register={register} errors={errors} />
        <LinkField namePrefix="secondaryCta" title="Secondary link" register={register} errors={errors} />
      </FormSection>

      <FormSection title="Images" description="Cross-fade every 6 seconds.">
        <RepeatableListField
          control={control}
          name="images"
          min={1}
          max={6}
          addLabel="Add image"
          newItem={() => ({ url: "", altText: "", mediaId: null })}
          itemLabel={(item, i) => item.altText || `Image ${i + 1}`}
          renderItem={({ index }) => (
            <ImagePickerField control={control} name={`images.${index}`} label={`Image ${index + 1}`} aspect="video" />
          )}
        />
      </FormSection>
    </EditPageShell>
  );
}
