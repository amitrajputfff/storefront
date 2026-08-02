"use server";

import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin-client";
import { verifyPassword } from "./password";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions, signAdminSession } from "./session";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const GENERIC_ERROR = "Incorrect email or password.";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Same generic message for unknown-email and wrong-password, and a fixed
 * timing floor on the failure path, so the endpoint isn't an account-
 * existence oracle. */
export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const started = Date.now();

  if (!isSupabaseAdminConfigured()) {
    return { error: "Admin login is not configured yet." };
  }
  if (!email || !password) {
    return { error: GENERIC_ERROR };
  }

  const supabase = getSupabaseAdminClient();
  const { data: user } = await supabase
    .from("admin_users")
    .select("id, email, password_hash, failed_attempts, locked_until")
    .eq("email", email)
    .maybeSingle();

  async function fail(): Promise<{ error: string }> {
    const elapsed = Date.now() - started;
    if (elapsed < 250) await sleep(250 - elapsed);
    return { error: GENERIC_ERROR };
  }

  if (!user) return fail();

  if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    return fail();
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    const attempts = user.failed_attempts + 1;
    const lockedUntil =
      attempts >= MAX_FAILED_ATTEMPTS ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString() : null;
    await supabase
      .from("admin_users")
      .update({ failed_attempts: attempts, locked_until: lockedUntil })
      .eq("id", user.id);
    return fail();
  }

  await supabase
    .from("admin_users")
    .update({ failed_attempts: 0, locked_until: null, last_login_at: new Date().toISOString() })
    .eq("id", user.id);

  const token = await signAdminSession({ sub: user.id, email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());

  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  const draft = await draftMode();
  draft.disable();
  redirect("/admin/login");
}
