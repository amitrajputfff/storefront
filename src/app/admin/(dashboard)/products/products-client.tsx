"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditProductSheet } from "@/components/admin/products/edit-product-sheet";
import {
  getProductForEdit,
  type AdminProductListItem,
  type ProductOverrideFields,
} from "@/lib/admin/product-overrides-actions";
import type { Product } from "@/types";

type EditTarget = AdminProductListItem & { product: Product; override: ProductOverrideFields };

export function ProductsClient({ initialItems }: { initialItems: AdminProductListItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [loadingHandle, setLoadingHandle] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.title.toLowerCase().includes(q) || i.handle.toLowerCase().includes(q));
  }, [items, search]);

  async function openEditor(item: AdminProductListItem) {
    setLoadingHandle(item.handle);
    const result = await getProductForEdit(item.handle);
    setLoadingHandle(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setEditTarget({ ...item, product: result.data.product, override: result.data.override });
  }

  function handleSaved(handle: string, hasOverride: boolean) {
    setItems((prev) => prev.map((i) => (i.handle === handle ? { ...i, hasOverride } : i)));
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
                  No products match.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((item) => (
              <TableRow
                key={item.handle}
                className="cursor-pointer"
                onClick={() => openEditor(item)}
                aria-busy={loadingHandle === item.handle}
              >
                <TableCell>
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.thumbnailUrl && (
                      <Image src={item.thumbnailUrl} alt="" fill sizes="40px" className="object-cover" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium whitespace-normal">{item.title}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">{item.handle}</TableCell>
                <TableCell>
                  {item.hasOverride ? <Badge>Customized</Badge> : <Badge variant="outline">Default</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditProductSheet item={editTarget} onOpenChange={(open) => !open && setEditTarget(null)} onSaved={handleSaved} />
    </div>
  );
}
