"use client";

import { z } from "zod";
import { aboutPageSchema } from "@/lib/content/schemas";
import type { AboutPageContent } from "@/lib/content/types";
import { usePageForm } from "@/hooks/admin/use-page-form";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { TextareaField } from "@/components/admin/fields/textarea-field";
import { ImagePickerField } from "@/components/admin/fields/image-picker-field";
import { RichTextField } from "@/components/admin/fields/rich-text-field";
import { RepeatableListField } from "@/components/admin/fields/repeatable-list-field";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

export function AboutPageForm({ initialValue }: { initialValue: AboutPageContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty, setBodyJson } = usePageForm({
    slug: "about",
    schema: aboutPageSchema as unknown as z.ZodType<AboutPageContent & { title: string; bodyHtml: string }>,
    defaultValues: initialValue as AboutPageContent & { title: string; bodyHtml: string },
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <EditPageShell
      title="About"
      previewPath="/about"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <Tabs defaultValue="header">
        <TabsList>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="principles">Principles</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="closing">Closing</TabsTrigger>
        </TabsList>

        <TabsContent value="header">
          <FormSection title="Header">
            <TextField name="eyebrow" label="Eyebrow" register={register} errors={errors} maxLength={40} />
            <TextField name="title" label="Title" register={register} errors={errors} maxLength={90} />
            <ImagePickerField control={control} name="heroImage" label="Hero image" aspect="video" />
          </FormSection>
        </TabsContent>

        <TabsContent value="body">
          <FormSection title="Body">
            <RichTextField control={control} name="bodyHtml" onJsonChange={setBodyJson} />
          </FormSection>
        </TabsContent>

        <TabsContent value="principles">
          <FormSection title="Principles">
            <RepeatableListField
              control={control}
              name="principles"
              min={2}
              max={6}
              addLabel="Add principle"
              newItem={() => ({ title: "", body: "" })}
              itemLabel={(item) => item.title || "Untitled"}
              renderItem={({ index }) => (
                <>
                  <TextField name={`principles.${index}.title`} label="Title" register={register} errors={errors} maxLength={60} />
                  <TextareaField name={`principles.${index}.body`} label="Body" register={register} errors={errors} maxLength={320} rows={3} />
                </>
              )}
            />
          </FormSection>
        </TabsContent>

        <TabsContent value="stats">
          <FormSection title="Stats">
            <RepeatableListField
              control={control}
              name="stats"
              min={2}
              max={6}
              addLabel="Add stat"
              newItem={() => ({ value: 0, suffix: "", label: "" })}
              itemLabel={(item) => item.label || "Untitled"}
              renderItem={({ index }) => (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field>
                      <FieldLabel>Value</FieldLabel>
                      <Input type="number" step="any" {...register(`stats.${index}.value`, { valueAsNumber: true })} />
                    </Field>
                    <Field>
                      <FieldLabel>Suffix</FieldLabel>
                      <Input placeholder="+" maxLength={8} {...register(`stats.${index}.suffix`)} />
                    </Field>
                    <Field>
                      <FieldLabel>Decimals</FieldLabel>
                      <Input type="number" min={0} max={2} {...register(`stats.${index}.decimals`, { valueAsNumber: true })} />
                    </Field>
                  </div>
                  <TextField name={`stats.${index}.label`} label="Label" register={register} errors={errors} maxLength={60} />
                </>
              )}
            />
          </FormSection>
        </TabsContent>

        <TabsContent value="closing">
          <FormSection title="Closing">
            <TextField name="closing.heading" label="Heading" register={register} errors={errors} maxLength={60} />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField name="closing.ctaLabel" label="Button text" register={register} errors={errors} maxLength={24} />
              <TextField name="closing.ctaHref" label="Button link" register={register} errors={errors} placeholder="/collections" />
            </div>
          </FormSection>
        </TabsContent>
      </Tabs>
    </EditPageShell>
  );
}
