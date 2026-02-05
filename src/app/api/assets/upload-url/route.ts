/**
 * POST /api/assets/upload-url
 * Returns a presigned S3/R2 URL for direct client upload.
 * Body: { filename, mime, bytes }
 */
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";
import { randomUUID } from "node:crypto";

const ALLOWED_MIMES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
  });
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  let body: { filename?: string; mime?: string; bytes?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const mime = (body.mime || "").toLowerCase();
  const bytes = body.bytes || 0;
  const filename = body.filename || "upload";

  if (!ALLOWED_MIMES.includes(mime)) {
    return NextResponse.json({ error: `Unsupported mime type. Allowed: ${ALLOWED_MIMES.join(", ")}` }, { status: 400 });
  }

  if (bytes > MAX_BYTES) {
    return NextResponse.json({ error: `File too large. Max ${MAX_BYTES / 1024 / 1024} MB` }, { status: 400 });
  }

  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
  const storageKey = `publisher/${randomUUID()}.${ext}`;
  const bucket = process.env.S3_BUCKET || "";

  if (!bucket) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const s3 = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: storageKey,
    ContentType: mime,
    ContentLength: bytes,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return NextResponse.json({
    uploadUrl,
    storageKey,
    mime,
    expiresIn: 300,
  });
}
