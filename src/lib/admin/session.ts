import { SignJWT, jwtVerify } from "jose";

// Deliberately no "server-only" import here — this module is loaded by
// middleware.ts, which runs under the Edge runtime with a different bundler
// condition than the rest of the server. Keep it neutral (no node:crypto).

export const ADMIN_SESSION_COOKIE = "zv_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days, absolute — no sliding renewal
const ISSUER = "zeevara-admin";
const AUDIENCE = "zeevara-admin";

export interface AdminSessionPayload {
  sub: string;
  email: string;
}

export interface AdminSession extends AdminSessionPayload {
  exp: number;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

/** Returns null on any failure — expired, malformed, wrong signature, wrong
 * algorithm. Never throws, so callers never need a try/catch. */
export async function verifyAdminSession(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    return { sub: payload.sub, email: payload.email, exp: payload.exp };
  } catch {
    return null;
  }
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
