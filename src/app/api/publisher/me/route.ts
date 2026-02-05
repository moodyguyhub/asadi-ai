/**
 * GET /api/publisher/me
 * Returns the admin identity and connected social accounts.
 */
import { NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  const accounts = await prisma.socialAccount.findMany({
    select: {
      id: true,
      platform: true,
      displayName: true,
      profileUrl: true,
      scopes: true,
      tokenExpiry: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    email: admin.email,
    accounts,
  });
}
