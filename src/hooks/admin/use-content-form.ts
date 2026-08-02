"use client";

import { useState, useTransition } from "react";
import { useForm, type FieldValues, type DefaultValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { saveContentDraft, publishContent } from "@/lib/admin/content-actions";
import type { ContentKey } from "@/lib/content/registry";

/**
 * Save Draft skips validation (you can leave a half-finished testimonial
 * overnight); Publish enforces the full schema via form.trigger() first,
 * then a defensive storageSchema.safeParse as a final check that toStorage
 * actually produced something the schema accepts.
 *
 * `formSchema` validates the form's own shape (used for live field errors);
 * `storageSchema` validates what actually gets saved. For most screens the
 * form shape equals the storage shape, so both are the same schema. Only
 * screens using StringListField (plain string[] fields) need a distinct
 * formSchema, since useFieldArray can't operate on primitives — see
 * src/lib/admin/field-array.ts.
 */
export function useContentForm<TForm extends FieldValues, TStorage>({
  contentKey,
  formSchema,
  storageSchema,
  defaultValues,
  toStorage,
}: {
  contentKey: ContentKey;
  formSchema: z.ZodType<TForm>;
  storageSchema: z.ZodType<TStorage>;
  defaultValues: TForm;
  toStorage: (form: TForm) => TStorage;
}) {
  // zodResolver's generics don't bridge cleanly with an abstract `TForm extends
  // FieldValues`; the schema/form shapes are still enforced at every call site
  // via the typed `formSchema`/`defaultValues` params above.
  const form = useForm<TForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any) as unknown as Resolver<TForm>,
    defaultValues: defaultValues as DefaultValues<TForm>,
  });
  const [isSaving, startSaving] = useTransition();
  const [isPublishing, startPublishing] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function saveDraft() {
    startSaving(async () => {
      const result = await saveContentDraft(contentKey, toStorage(form.getValues()));
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

      const storageValue = toStorage(form.getValues());
      const parsed = storageSchema.safeParse(storageValue);
      if (!parsed.success) {
        toast.error("Fix the highlighted fields before publishing.");
        return;
      }

      const saveResult = await saveContentDraft(contentKey, storageValue);
      if (!saveResult.ok) {
        toast.error(saveResult.error);
        return;
      }

      const result = await publishContent(contentKey);
      if (result.ok) {
        setSavedAt(new Date());
        form.reset(form.getValues());
        toast.success("Published");
      } else {
        toast.error(result.error);
      }
    });
  }

  return { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty: form.formState.isDirty };
}
