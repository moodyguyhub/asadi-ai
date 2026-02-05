/**
 * POST /api/social/linkedin/disconnect
 * Removes the LinkedIn social account and cleans up tokens.
 */
import { NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/publisher/audit";

export async function POST() {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  const account = await prisma.socialAccount.findFirst({
    where: { platform: "linkedin" },
  });

  if (!account) {
    return NextResponse.json({ error: "No LinkedIn account connected" }, { status: 404 });
  }

  await prisma.socialAccount.delete({ where: { id: account.id } });

  await auditLog({
    action: "disconnect",
    actor: admin.email,
    platform: "linkedin",
    details: { accountId: account.id },
  });

  return NextResponse.json({ ok: true });
}
