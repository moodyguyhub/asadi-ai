/**
 * GET /api/social/linkedin/callback
 * Handles the OAuth2 callback from LinkedIn.
 * Exchanges code for tokens, stores encrypted, creates audit entry.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { encryptTokens } from "@/lib/publisher/crypto";
import { auditLog } from "@/lib/publisher/audit";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error || !code || !state) {
    return NextResponse.redirect(new URL("/publisher?error=oauth_denied", req.url));
  }

  let stateData: { email: string };
  try {
    stateData = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
  } catch {
    return NextResponse.redirect(new URL("/publisher?error=invalid_state", req.url));
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID!;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI!;

  // Exchange code for tokens
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) {
    console.error("LinkedIn token exchange failed:", await tokenRes.text());
    return NextResponse.redirect(new URL("/publisher?error=token_exchange", req.url));
  }

  const tokens = await tokenRes.json();
  const accessToken = tokens.access_token;

  // Get user profile via /v2/me (works without openid scope)
  const profileRes = await fetch("https://api.linkedin.com/v2/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!profileRes.ok) {
    console.error("LinkedIn profile fetch failed:", await profileRes.text());
    return NextResponse.redirect(new URL("/publisher?error=profile_fetch", req.url));
  }

  const profile = await profileRes.json();
  const externalId = profile.id;
  const displayName = `${profile.localizedFirstName || ""} ${profile.localizedLastName || ""}`.trim() || profile.id;

  // Upsert social account with encrypted tokens
  const tokenExpiry = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : null;

  await prisma.socialAccount.upsert({
    where: {
      platform_externalAccountId: {
        platform: "linkedin",
        externalAccountId: externalId,
      },
    },
    update: {
      encryptedTokens: encryptTokens(tokens),
      tokenExpiry,
      displayName,
      scopes: ["profile", "w_member_social"],
    },
    create: {
      platform: "linkedin",
      externalAccountId: externalId,
      displayName,
      profileUrl: `https://www.linkedin.com/in/${profile.vanityName || externalId}`,
      encryptedTokens: encryptTokens(tokens),
      tokenExpiry,
      scopes: ["profile", "w_member_social"],
    },
  });

  await auditLog({
    action: "connect",
    actor: stateData.email,
    platform: "linkedin",
    details: { externalId, displayName },
  });

  return NextResponse.redirect(new URL("/publisher?connected=linkedin", req.url));
}
