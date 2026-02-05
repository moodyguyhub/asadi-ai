/**
 * Admin-only access gate for the Publisher.
 *
 * P0: Simple allowlist via env var PUBLISHER_ADMIN_EMAILS (comma-separated).
 * The caller must pass the current user's email (from session/cookie/header).
 *
 * In production, this would sit behind a real auth provider (NextAuth, Clerk, etc.).
 * For P0 we use a simple shared secret cookie: `x-publisher-token`.
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_EMAILS = (process.env.PUBLISHER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const PUBLISHER_SECRET = process.env.PUBLISHER_SECRET || "";

export interface AdminIdentity {
  email: string;
}

/**
 * Validate the admin session from the request.
 * Returns the admin identity or null if unauthorized.
 *
 * P0 auth flow:
 *   1. Client sends `x-publisher-token` cookie (set via /api/publisher/login).
 *   2. Token = base64(email:secret). We verify secret matches PUBLISHER_SECRET.
 */
export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  if (!PUBLISHER_SECRET) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get("x-publisher-token")?.value;
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [email, secret] = decoded.split(":");
    if (!email || secret !== PUBLISHER_SECRET) return null;
    if (!ADMIN_EMAILS.includes(email.toLowerCase())) return null;
    return { email: email.toLowerCase() };
  } catch {
    return null;
  }
}

/**
 * Guard helper — returns 401 response or the identity.
 */
export async function requireAdmin(): Promise<AdminIdentity | NextResponse> {
  const identity = await getAdminIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return identity;
}

/**
 * Check if the result is an error response (NextResponse).
 */
export function isErrorResponse(result: AdminIdentity | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
