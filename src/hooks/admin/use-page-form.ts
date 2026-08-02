"use client";

import { useRef, useState, useTransition } from "react";
import { useForm, type FieldValues, type DefaultValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { savePageDraft, publishPage } from "@/lib/admin/page-actions";
import type { PageSlug } from "@/lib/content/pages-registry";

/** Same Save Draft / Publish contract as useContentForm, but for the `pages`
 * table — title/bodyHtml are split out of the form's `meta` at the server
 * action boundary (see savePageDraft). `bodyJson` comes from the Tiptap
 * editor's own onChange, tracked outside RHF since it's not a form field. */
export function usePageForm<TForm extends FieldValues & { title: string; bodyHtml: string }>({
  slug,
  schema,
  defaultValues,
}: {
  slug: PageSlug;
  schema: z.ZodType<TForm>;
  defaultValues: TForm;
}) {
  const form = useForm<TForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see use-content-form.ts
    resolver: zodResolver(schema as any) as unknown as Resolver<TForm>,
    defaultValues: defaultValues as DefaultValues<TForm>,
  });
  const bodyJsonRef = useRef<unknown>({ type: "doc", content: [] });
  const [isSaving, startSaving] = useTransition();
  const [isPublishing, startPublishing] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function setBodyJson(json: unknown) {
    bodyJsonRef.current = json;
  }

  function toDraftInput(values: TForm) {
    const { title, bodyHtml, ...meta } = values;
    return { title, bodyHtml, bodyJson: bodyJsonRef.current, meta };
  }

  function saveDraft() {
    startSaving(async () => {
      const result = await savePageDraft(slug, toDraftInput(form.getValues()));
      if (result.ok) {
        setSavedAt(new Date());
        form.reset(form.getValues());
        toast.success("Draft saved");
      } else {
        toast.error(result.error);
      }
    });
  }

  function publish() {
    startPublishing(async () => {
      const valid = await form.trigger();
      if (!valid) {
        toast.error("Fix the highlighted fields before publishing.");
        return;
      }
      const saveResult = await savePageDraft(slug, toDraftInput(form.getValues()));
      if (!saveResult.ok) {
        toast.error(saveResult.error);
        return;
      }
      const result = await publishPage(slug);
      if (result.ok) {
        setSavedAt(new Date());
        form.reset(form.getValues());
        toast.success("Published");
      } else {
        toast.error(result.error);
      }
    });
  }

  return { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty: form.formState.isDirty, setBodyJson };
}
