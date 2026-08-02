import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in | ZEEVARA Admin" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold tracking-tight">ZEEVARA Admin</h1>
        <p className="text-muted-foreground mb-6 text-sm">Sign in to manage site content.</p>
        <LoginForm next={safeNext} />
      </div>
    </main>
  );
}
