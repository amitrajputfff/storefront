import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ADMIN_NAV } from "@/lib/admin/nav";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Site Content</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Edit text and images across the site. Changes save as a draft until you publish.
        </p>
      </div>

      {ADMIN_NAV.map((group) => (
        <div key={group.label}>
          <h2 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
            {group.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="hover:border-foreground/30 transition-colors">
                  <CardContent className="flex items-center gap-3 py-4">
                    <item.icon className="text-muted-foreground size-5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-muted-foreground truncate text-xs">{item.description}</p>
                    </div>
                    <ChevronRight className="text-muted-foreground size-4 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
