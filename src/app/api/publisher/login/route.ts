/**
 * POST /api/publisher/login
 * Sets the admin cookie. Body: { email, secret }
 */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auditLog } from "@/lib/publisher/audit";

const ADMIN_EMAILS = (process.env.PUBLISHER_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const PUBLISHER_SECRET = process.env.PUBLISHER_SECRET || "";

export async function POST(req: Request) {
  if (!PUBLISHER_SECRET) {
    return NextResponse.json({ error: "Publisher not configured" }, { status: 503 });
  }

  let body: { email?: string; secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const secret = (body.secret || "").trim();

  if (!email || !secret) {
    return NextResponse.json({ error: "Email and secret required" }, { status: 400 });
  }

  if (secret !== PUBLISHER_SECRET || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = Buffer.from(`${email}:${secret}`).toString("base64");

  const cookieStore = await cookies();
  cookieStore.set("x-publisher-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  await auditLog({ action: "login", actor: email });

  return NextResponse.json({ ok: true, email });
}
