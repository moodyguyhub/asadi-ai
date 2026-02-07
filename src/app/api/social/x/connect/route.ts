/**
 * GET /api/social/x/connect
 * Redirects the admin to X (Twitter) OAuth2 authorization (PKCE flow).
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  // Prod-only guard: prevent OAuth connect on preview deployments where redirect
  // URIs won't match the OAuth app configuration.
  // Local/dev should be allowed so you can test end-to-end.
  if (process.env.NODE_ENV === "production") {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    if (siteUrl && !siteUrl.startsWith("https://asadi.ai")) {
      return NextResponse.json(
        { error: "OAuth connect is restricted to production. Set NEXT_PUBLIC_SITE_URL=https://asadi.ai to enable." },
        { status: 403 },
      );
    }
  }

  const clientId = process.env.X_CLIENT_ID;
  const redirectUri = process.env.X_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "X OAuth not configured" }, { status: 503 });
  }

  // PKCE: generate code verifier + challenge
  const codeVerifier = randomBytes(32).toString("base64url");
  const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");

  const state = Buffer.from(JSON.stringify({ email: admin.email, ts: Date.now() })).toString("base64url");

  // Store code verifier in a cookie for the callback
  const cookieStore = await cookies();
  cookieStore.set("x-pkce-verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "tweet.read tweet.write users.read offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return NextResponse.redirect(`https://x.com/i/oauth2/authorize?${params.toString()}`);
}
