/**
 * GET /api/social/x/callback
 * Handles the OAuth2 PKCE callback from X (Twitter).
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("x-pkce-verifier")?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(new URL("/publisher?error=missing_verifier", req.url));
  }

  // Clear the verifier cookie
  cookieStore.delete("x-pkce-verifier");

  const clientId = process.env.X_CLIENT_ID!;
  const clientSecret = process.env.X_CLIENT_SECRET!;
  const redirectUri = process.env.X_REDIRECT_URI!;

  // Exchange code for tokens
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const tokenRes = await fetch("https://api.x.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenRes.ok) {
    console.error("X token exchange failed:", await tokenRes.text());
    return NextResponse.redirect(new URL("/publisher?error=token_exchange", req.url));
  }

  const tokens = await tokenRes.json();
  const accessToken = tokens.access_token;

  // Get user profile
  const userRes = await fetch("https://api.x.com/2/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userRes.ok) {
    console.error("X user fetch failed:", await userRes.text());
    return NextResponse.redirect(new URL("/publisher?error=profile_fetch", req.url));
  }

  const userData = await userRes.json();
  const user = userData.data;
  const externalId = user.id;
  const displayName = user.name || user.username;

  const tokenExpiry = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : null;

  await prisma.socialAccount.upsert({
    where: {
      platform_externalAccountId: {
        platform: "x",
        externalAccountId: externalId,
      },
    },
    update: {
      encryptedTokens: encryptTokens(tokens),
      tokenExpiry,
      displayName,
      scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    },
    create: {
      platform: "x",
      externalAccountId: externalId,
      displayName,
      profileUrl: `https://x.com/${user.username}`,
      encryptedTokens: encryptTokens(tokens),
      tokenExpiry,
      scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    },
  });

  await auditLog({
    action: "connect",
    actor: stateData.email,
    platform: "x",
    details: { externalId, displayName, username: user.username },
  });

  return NextResponse.redirect(new URL("/publisher?connected=x", req.url));
}
