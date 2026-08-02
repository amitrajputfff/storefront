"use client";

import { useContentForm } from "@/hooks/admin/use-content-form";
import { faqSchema } from "@/lib/content/schemas";
import type { FaqContent } from "@/lib/content/types";
import { EditPageShell } from "@/components/admin/shell/edit-page-shell";
import { FormSection } from "@/components/admin/fields/form-section";
import { TextField } from "@/components/admin/fields/text-field";
import { TextareaField } from "@/components/admin/fields/textarea-field";
import { RepeatableListField } from "@/components/admin/fields/repeatable-list-field";

export function FaqForm({ initialValue }: { initialValue: FaqContent }) {
  const { form, saveDraft, publish, isSaving, isPublishing, savedAt, isDirty } = useContentForm({
    contentKey: "faq",
    formSchema: faqSchema,
    storageSchema: faqSchema,
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
      title="FAQ"
      description="Frequently asked questions, grouped by category."
      previewPath="/faq"
      isDirty={isDirty}
      isSaving={isSaving}
      isPublishing={isPublishing}
      savedAt={savedAt}
      onSaveDraft={saveDraft}
      onPublish={publish}
    >
      <FormSection title="Heading">
        <TextField name="eyebrow" label="Eyebrow" register={register} errors={errors} maxLength={40} />
        <TextField name="title" label="Title" register={register} errors={errors} maxLength={80} />
        <TextareaField name="description" label="Description" register={register} errors={errors} maxLength={200} rows={2} />
      </FormSection>

      <FormSection title="Categories">
        <RepeatableListField
          control={control}
          name="categories"
          min={1}
          collapsible
          addLabel="Add category"
          newItem={() => ({
            id: crypto.randomUUID(),
            heading: "",
            items: [{ id: crypto.randomUUID(), question: "", answer: "" }],
          })}
          itemLabel={(category) => `${category.heading || "Untitled category"} (${category.items.length})`}
          renderItem={({ index: categoryIndex }) => (
            <>
              <TextField
                name={`categories.${categoryIndex}.heading`}
                label="Category heading"
                register={register}
                errors={errors}
                maxLength={60}
              />
              <div>
                <p className="mb-2 text-sm font-medium">Questions</p>
                <RepeatableListField
                  control={control}
                  name={`categories.${categoryIndex}.items`}
                  min={1}
                  collapsible
                  addLabel="Add question"
                  newItem={() => ({ id: crypto.randomUUID(), question: "", answer: "" })}
                  itemLabel={(item) => item.question || "Untitled question"}
                  renderItem={({ index: itemIndex }) => (
                    <>
                      <TextField
                        name={`categories.${categoryIndex}.items.${itemIndex}.question`}
                        label="Question"
                        register={register}
                        errors={errors}
                        maxLength={160}
                      />
                      <TextareaField
                        name={`categories.${categoryIndex}.items.${itemIndex}.answer`}
                        label="Answer"
                        register={register}
                        errors={errors}
                        maxLength={800}
                        rows={4}
                      />
                    </>
                  )}
                />
              </div>
            </>
          )}
        />
      </FormSection>
    </EditPageShell>
  );
}
