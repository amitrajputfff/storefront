import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZEEVARA Admin",
  robots: { index: false, follow: false },
};

// Every admin page is behind auth and reads live draft/published state —
// never worth statically caching.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
