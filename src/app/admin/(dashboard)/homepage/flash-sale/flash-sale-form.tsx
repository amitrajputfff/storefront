"use client";

import { Controller } from "react-hook-form";
import { useContentForm } from "@/hooks/admin/use-content-form";
import { flashSaleSchema } from "@/lib/content/schemas";
import type { FlashSaleContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WINDOW_OPTIONS = [3, 6, 12, 24];

export function FlashSaleForm({ initialValue }: { initialValue: FlashSaleContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "home.flash_sale",
    formSchema: flashSaleSchema,
    storageSchema: flashSaleSchema,
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
      title="Flash Sale Banner"
      description="The sticky countdown strip shown on the homepage."
      previewPath="/"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Banner">
        <Field orientation="horizontal" className="justify-between">
          <FieldLabel htmlFor="enabled">Show banner</FieldLabel>
          <Controller
            control={control}
            name="enabled"
            render={({ field }) => <Switch id="enabled" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </Field>
        <TextField name="message" label="Message" register={register} errors={errors} maxLength={80} />
        <Field orientation="horizontal" className="justify-between">
          <FieldLabel htmlFor="showCountdown">Show countdown timer</FieldLabel>
          <Controller
            control={control}
            name="showCountdown"
            render={({ field }) => <Switch id="showCountdown" checked={field.value} onCheckedChange={field.onChange} />}
          />
        </Field>
        <Field>
          <FieldLabel>Countdown window</FieldLabel>
          <FieldDescription>The countdown always resets to a fresh window of this length so it never runs out.</FieldDescription>
          <Controller
            control={control}
            name="windowHours"
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WINDOW_OPTIONS.map((hours) => (
                    <SelectItem key={hours} value={String(hours)}>
                      {hours} hours
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </FormSection>
    </EditPageShell>
  );
}
