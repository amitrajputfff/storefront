import "server-only";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSession, type AdminSession } from "./session";

/** Defense in depth behind middleware — every admin server action re-checks
 * the session itself rather than trusting that it was only ever reachable
 * through a protected route. */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await verifyAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}
