import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const session = await verifyAdminSession(req.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (isLogin) {
    if (session) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname); // path only — open-redirect-safe
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // /api/admin/* does NOT match /admin/* — needs its own entry, or the
  // preview-enable endpoint would be unauthenticated.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
