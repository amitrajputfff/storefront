"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RichTextEditor } from "@/components/admin/editor/rich-text-editor";
import { MediaLibraryDialog } from "@/components/admin/media/media-library-dialog";
import { formatMoney } from "@/lib/format";
import {
  saveProductOverride,
  resetProductOverride,
  type ProductOverrideFields,
  type AdminProductListItem,
} from "@/lib/admin/product-overrides-actions";
import type { Product, ProductImage } from "@/types";

export function EditProductSheet({
  item,
  onOpenChange,
  onSaved,
}: {
  item: (AdminProductListItem & { product: Product; override: ProductOverrideFields }) | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (handle: string, hasOverride: boolean) => void;
}) {
  return (
    <Sheet open={!!item} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        {item && (
          <EditProductForm
            key={item.handle}
            handle={item.handle}
            product={item.product}
            override={item.override}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function EditProductForm({
  handle,
  product,
  override,
  onOpenChange,
  onSaved,
}: {
  handle: string;
  product: Product;
  override: ProductOverrideFields;
  onOpenChange: (open: boolean) => void;
  onSaved: (handle: string, hasOverride: boolean) => void;
}) {
  const [fields, setFields] = useState<ProductOverrideFields>(override);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const images = fields.images ?? product.images;
  const isOverridden =
    fields.title !== null ||
    fields.description !== null ||
    fields.descriptionHtml !== null ||
    fields.images !== null ||
    fields.compareAtPrice !== null ||
    fields.materialsLine !== null ||
    fields.careInstructions !== null ||
    fields.shippingReturnsNote !== null;

  function update<K extends keyof ProductOverrideFields>(key: K, value: ProductOverrideFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function addImage(image: ProductImage) {
    update("images", [...images, image]);
  }

  function removeImage(id: string) {
    update(
      "images",
      images.filter((img) => img.id !== id),
    );
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveProductOverride(handle, fields);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Product updated");
    onSaved(handle, isOverridden);
    onOpenChange(false);
  }

  async function handleReset() {
    const result = await resetProductOverride(handle);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Reverted to the live default");
    onSaved(handle, false);
    onOpenChange(false);
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{product.title}</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-4 overflow-y-auto px-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-title">Title</Label>
          <Input
            id="product-title"
            placeholder={product.title}
            value={fields.title ?? ""}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-description">Description (plain text — used for search &amp; meta tags)</Label>
          <Textarea
            id="product-description"
            rows={3}
            placeholder={product.description}
            value={fields.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Description (rich text — shown on the product page)</Label>
          <RichTextEditor
            defaultValue={fields.descriptionHtml ?? product.descriptionHtml ?? ""}
            onChange={(html) => update("descriptionHtml", html)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Images</Label>
          <div className="flex flex-wrap gap-2">
            {images.map((image) => (
              <div key={image.id} className="relative size-20 shrink-0">
                <Image
                  src={image.url}
                  alt={image.altText}
                  fill
                  sizes="80px"
                  className="rounded-lg border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  aria-label="Remove image"
                  className="bg-foreground text-background absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="text-muted-foreground hover:border-foreground flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-compare-at-price">Compare-at price (₹, optional)</Label>
          <Input
            id="product-compare-at-price"
            type="number"
            min={0}
            inputMode="decimal"
            placeholder="e.g. 1499"
            value={fields.compareAtPrice ?? ""}
            onChange={(e) => update("compareAtPrice", e.target.value === "" ? null : Number(e.target.value))}
          />
          <p className="text-muted-foreground text-xs">
            The struck-through &quot;was&quot; price shown for a perceived discount — current selling price is{" "}
            {formatMoney(product.priceRange.min)} and is set in Shopify, not here.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-materials">Materials line</Label>
          <Input
            id="product-materials"
            placeholder={product.materialsLine}
            value={fields.materialsLine ?? ""}
            onChange={(e) => update("materialsLine", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-care">Care instructions</Label>
          <Textarea
            id="product-care"
            rows={2}
            placeholder={product.careInstructions}
            value={fields.careInstructions ?? ""}
            onChange={(e) => update("careInstructions", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-shipping">Shipping &amp; returns note</Label>
          <Textarea
            id="product-shipping"
            rows={2}
            placeholder={product.shippingReturnsNote}
            value={fields.shippingReturnsNote ?? ""}
            onChange={(e) => update("shippingReturnsNote", e.target.value)}
          />
        </div>

        <p className="text-muted-foreground text-xs">
          Selling price, variants, and inventory always come from Shopify and can&apos;t be overridden here — edit
          those in Shopify Admin. Only the compare-at (&quot;was&quot;) price above is independent, since it&apos;s
          just display copy, not what&apos;s actually charged.
        </p>
      </div>
      <SheetFooter className="flex-row justify-between">
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button type="button" variant="outline" disabled={!isOverridden}>
                Reset to default
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revert to the live default?</AlertDialogTitle>
              <AlertDialogDescription>
                Removes every customization for this product — it&apos;ll show whatever Shopify (or the mock
                catalog) says again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Revert</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </SheetFooter>

      <MediaLibraryDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(media) =>
          addImage({
            id: media.id,
            url: media.url,
            altText: media.altText,
            width: media.width ?? 800,
            height: media.height ?? 800,
          })
        }
      />
    </>
  );
}
