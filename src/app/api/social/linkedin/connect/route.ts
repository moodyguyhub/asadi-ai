/**
 * GET /api/social/linkedin/connect
 * Redirects the admin to LinkedIn OAuth2 authorization.
 */
import { NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  // Prod-only guard: prevent OAuth connect on preview deployments
  // where redirect URIs won't match the OAuth app configuration.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (siteUrl && !siteUrl.startsWith("https://asadi.ai")) {
    return NextResponse.json(
      { error: "OAuth connect is restricted to production. Set NEXT_PUBLIC_SITE_URL=https://asadi.ai to enable." },
      { status: 403 },
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI; // e.g. https://asadi.ai/api/social/linkedin/callback

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "LinkedIn OAuth not configured" }, { status: 503 });
  }

  const state = Buffer.from(JSON.stringify({ email: admin.email, ts: Date.now() })).toString("base64url");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "openid profile w_member_social",
  });

  return NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`);
}
