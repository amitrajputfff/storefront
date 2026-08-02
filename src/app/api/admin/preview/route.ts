import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";

/** Turns on Next's draftMode so the requested path renders with unpublished
 * drafts instead of published content. Re-verifies the admin session here
 * too (defence in depth behind middleware) and validates `path` is a
 * same-site relative path — the open-redirect guard. */
export async function GET(request: NextRequest) {
  const session = await verifyAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path") ?? "/";
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\") || path.startsWith("/api") || path.startsWith("/admin")) {
    return NextResponse.json({ error: "Invalid preview path" }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(path, request.url));
}
