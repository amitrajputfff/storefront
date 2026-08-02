"use client";

import { z } from "zod";
import { richTextPageSchema } from "@/lib/content/schemas";
import type { RichTextPageContent } from "@/lib/content/types";
import type { PageSlug } from "@/lib/content/pages-registry";
import { usePageForm } from "@/hooks/admin/use-page-form";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { RichTextField } from "@/components/admin/fields/rich-text-field";

export function RichTextPageForm({
  slug,
  title,
  previewPath,
  initialValue,
}: {
  slug: PageSlug;
  title: string;
  previewPath: string;
  initialValue: RichTextPageContent;
}) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty, setBodyJson } = usePageForm({
    slug,
    schema: richTextPageSchema as z.ZodType<RichTextPageContent>,
    defaultValues: initialValue,
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <EditPageShell
      title={title}
      previewPath={previewPath}
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Page header">
        <TextField name="title" label="Title" register={register} errors={errors} maxLength={90} />
        <TextField name="lastUpdatedLabel" label="Last updated label" register={register} errors={errors} maxLength={40} placeholder="Last updated: July 2026" />
      </FormSection>

      <FormSection title="Body">
        <RichTextField control={control} name="bodyHtml" onJsonChange={setBodyJson} />
      </FormSection>
    </EditPageShell>
  );
}
