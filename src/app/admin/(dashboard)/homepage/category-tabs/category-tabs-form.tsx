"use client";

import { Controller } from "react-hook-form";
import { useContentForm } from "@/hooks/admin/use-content-form";
import { categoryTabsSchema } from "@/lib/content/schemas";
import type { CategoryTabsContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { RepeatableListField } from "@/components/admin/fields/repeatable-list-field";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CategoryTabsForm({
  initialValue,
  categoryOptions,
}: {
  initialValue: CategoryTabsContent;
  categoryOptions: { handle: string; name: string }[];
}) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "home.category_tabs",
    formSchema: categoryTabsSchema,
    storageSchema: categoryTabsSchema,
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
      title="Category Tabs"
      description={'The "Shop by Category" tab section on the homepage.'}
      previewPath="/"
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
      </FormSection>

      <FormSection title="Featured categories" description="Order here is the tab order shown on the homepage.">
        <RepeatableListField
          control={control}
          name="featured"
          min={1}
          max={10}
          addLabel="Add category"
          newItem={() => ({ handle: categoryOptions[0]?.handle ?? "", description: "" })}
          itemLabel={(item) => categoryOptions.find((c) => c.handle === item.handle)?.name ?? "Choose a category"}
          renderItem={({ index }) => (
            <>
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Controller
                  control={control}
                  name={`featured.${index}.handle`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((c) => (
                          <SelectItem key={c.handle} value={c.handle}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input maxLength={120} {...register(`featured.${index}.description`)} />
              </Field>
            </>
          )}
        />
      </FormSection>
    </EditPageShell>
  );
}
