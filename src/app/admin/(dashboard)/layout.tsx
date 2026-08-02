import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/nav/admin-sidebar";
import { AdminTopBar } from "@/components/admin/nav/admin-topbar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopBar />
        <div className="mx-auto w-full max-w-4xl px-6 py-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
