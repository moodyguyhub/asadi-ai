/**
 * POST /api/assets/ingest
 * After client upload to S3, call this to register the asset in DB.
 * Body: { storageKey, mime, bytes, sha256, width?, height? }
 */
import { NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/publisher/audit";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  let body: {
    storageKey?: string;
    mime?: string;
    bytes?: number;
    sha256?: string;
    width?: number;
    height?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { storageKey, mime, bytes, sha256, width, height } = body;

  if (!storageKey || !mime || !bytes || !sha256) {
    return NextResponse.json({ error: "storageKey, mime, bytes, sha256 are required" }, { status: 400 });
  }

  // Check for duplicate (same sha256)
  const existing = await prisma.asset.findFirst({ where: { sha256 } });
  if (existing) {
    return NextResponse.json({ asset: existing });
  }

  const asset = await prisma.asset.create({
    data: { storageKey, mime, bytes, sha256, width, height },
  });

  await auditLog({
    action: "upload",
    actor: admin.email,
    details: { assetId: asset.id, storageKey, mime, bytes, sha256 },
  });

  return NextResponse.json({ asset });
}
