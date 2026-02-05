/**
 * POST /api/social/x/disconnect
 * Removes the X social account and cleans up tokens.
 */
import { NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/publisher/audit";

export async function POST() {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  const account = await prisma.socialAccount.findFirst({
    where: { platform: "x" },
  });

  if (!account) {
    return NextResponse.json({ error: "No X account connected" }, { status: 404 });
  }

  await prisma.socialAccount.delete({ where: { id: account.id } });

  await auditLog({
    action: "disconnect",
    actor: admin.email,
    platform: "x",
    details: { accountId: account.id },
  });

  return NextResponse.json({ ok: true });
}
