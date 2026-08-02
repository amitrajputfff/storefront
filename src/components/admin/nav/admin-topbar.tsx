"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ADMIN_NAV_ITEMS } from "@/lib/admin/nav";
import { logoutAction } from "@/lib/admin/auth";

export function AdminTopBar() {
  const pathname = usePathname();
  const current = ADMIN_NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-3 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-5" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/admin" />}>Admin</BreadcrumbLink>
          </BreadcrumbItem>
          {current && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{current.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="sm" render={<Link href="/" target="_blank" />} nativeButton={false}>
          <ExternalLink className="size-4" />
          <span>View site</span>
        </Button>
        <ThemeToggle />
        <form action={logoutAction}>
          <Button variant="ghost" size="icon" type="submit" aria-label="Log out">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
