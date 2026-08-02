import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  const safePath = path.startsWith("/") && !path.startsWith("//") ? path : "/";

  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(safePath, request.url));
}
