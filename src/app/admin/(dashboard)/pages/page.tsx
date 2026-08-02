import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin-client";
import { PAGES_REGISTRY, PAGE_SLUGS } from "@/lib/content/pages-registry";

interface Row {
  title: string;
  href: string;
  updatedAt: string | null;
  published: boolean;
}

export default async function AdminPagesIndex() {
  const rows: Row[] = [];

  if (isSupabaseAdminConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data } = await supabase.from("pages").select("slug, updated_at, published_at");
    const bySlug = new Map((data ?? []).map((r) => [r.slug, r]));

    for (const slug of PAGE_SLUGS) {
      const row = bySlug.get(slug);
      rows.push({
        title: PAGES_REGISTRY[slug].title,
        href: `/admin/pages/${slug}`,
        updatedAt: row?.updated_at ?? null,
        published: !!row?.published_at,
      });
    }

    const { data: contactRow } = await supabase.from("site_content").select("updated_at, published_at").eq("key", "contact.intro").maybeSingle();
    rows.push({
      title: "Contact",
      href: "/admin/pages/contact",
      updatedAt: contactRow?.updated_at ?? null,
      published: !!contactRow?.published_at,
    });
  } else {
    for (const slug of PAGE_SLUGS) {
      rows.push({ title: PAGES_REGISTRY[slug].title, href: `/admin/pages/${slug}`, updatedAt: null, published: false });
    }
    rows.push({ title: "Contact", href: "/admin/pages/contact", updatedAt: null, published: false });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Pages</h1>
        <p className="text-muted-foreground mt-1 text-sm">About, Contact, and policy pages.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last updated</TableHead>
            <TableHead className="text-right">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.href}>
              <TableCell className="font-medium">{row.title}</TableCell>
              <TableCell>
                <Badge variant={row.published ? "secondary" : "outline"} className="text-xs font-normal">
                  {row.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell className="text-right">
                <Link href={row.href} className="text-sm font-medium underline underline-offset-4">
                  Edit
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
