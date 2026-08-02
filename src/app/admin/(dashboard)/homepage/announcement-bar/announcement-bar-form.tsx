"use client";

import { z } from "zod";
import { useContentForm } from "@/hooks/admin/use-content-form";
import { announcementSchema } from "@/lib/content/schemas";
import type { AnnouncementContent } from "@/lib/content/types";
import { toRows, fromRows } from "@/lib/admin/field-array";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { StringListField } from "@/components/admin/fields/string-list-field";

const formSchema = z.object({
  messages: z.array(z.object({ value: z.string().trim().min(1).max(70) })).min(1).max(8),
});

type FormValues = z.infer<typeof formSchema>;

export function AnnouncementBarForm({ initialValue }: { initialValue: AnnouncementContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm<
    FormValues,
    AnnouncementContent
  >({
    contentKey: "home.announcement",
    formSchema,
    storageSchema: announcementSchema,
    defaultValues: { messages: toRows(initialValue.messages) },
    toStorage: (v) => ({ messages: fromRows(v.messages) }),
  });
  const { control } = form;

  return (
    <EditPageShell
      title="Announcement Bar"
      description="The scrolling strip above the header. Active Shopify promo codes are prepended automatically."
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Messages">
        <StringListField
          control={control}
          name="messages"
          min={1}
          max={8}
          maxLength={70}
          addLabel="Add message"
          placeholder="e.g. Free shipping across India on every order"
        />
      </FormSection>
    </EditPageShell>
  );
}
