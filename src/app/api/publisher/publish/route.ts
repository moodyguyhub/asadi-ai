/**
 * POST /api/publisher/publish
 * Publish a post to selected platforms (LinkedIn, X, or both).
 *
 * Body: {
 *   body: string,
 *   linkUrl?: string,
 *   assetIds?: string[],          // ordered asset IDs
 *   platforms: ("linkedin" | "x")[]
 * }
 *
 * Flow:
 *   1. Validate admin + content safety
 *   2. Create PublisherPost
 *   3. For each platform: generate idempotency key, check for dupes, post
 *   4. Write audit log
 */
import { NextResponse } from "next/server";
import { requireAdmin, isErrorResponse } from "@/lib/publisher/auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/publisher/audit";
import { scanContent } from "@/lib/publisher/safety";
import { generateIdempotencyKey } from "@/lib/publisher/idempotency";
import { postToLinkedIn } from "@/lib/publisher/clients/linkedin";
import { postToX } from "@/lib/publisher/clients/x";

export const runtime = "nodejs";

type Platform = "linkedin" | "x";

interface PublishBody {
  body: string;
  linkUrl?: string;
  assetIds?: string[];
  platforms: Platform[];
}

// Helper to get a public URL for an S3 asset
function getAssetPublicUrl(storageKey: string): string {
  const endpoint = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || "";
  const bucket = process.env.S3_BUCKET || "";
  return `${endpoint}/${bucket}/${storageKey}`;
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (isErrorResponse(admin)) return admin;

  let body: PublishBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const postBody = (body.body || "").trim();
  const linkUrl = (body.linkUrl || "").trim() || undefined;
  const assetIds = body.assetIds || [];
  const platforms = (body.platforms || []).filter((p): p is Platform => ["linkedin", "x"].includes(p));

  if (!postBody) {
    return NextResponse.json({ error: "Post body is required" }, { status: 400 });
  }

  if (platforms.length === 0) {
    return NextResponse.json({ error: "At least one platform is required" }, { status: 400 });
  }

  // Content safety scan
  const fullText = [postBody, linkUrl].filter(Boolean).join(" ");
  const scan = scanContent(fullText);
  if (!scan.safe) {
    return NextResponse.json({
      error: "Content safety violation",
      violations: scan.violations,
    }, { status: 422 });
  }

  // Fetch assets
  const assets = assetIds.length > 0
    ? await prisma.asset.findMany({ where: { id: { in: assetIds } } })
    : [];

  const assetHashes = assets.map((a) => a.sha256).sort();
  const imageUrls = assets.map((a) => ({ url: getAssetPublicUrl(a.storageKey), mime: a.mime }));

  // Create the post record
  const post = await prisma.publisherPost.create({
    data: {
      body: postBody,
      linkUrl,
      createdBy: admin.email,
      status: "draft",
      assets: assetIds.length > 0
        ? {
            create: assetIds.map((id, i) => ({
              assetId: id,
              order: i,
            })),
          }
        : undefined,
    },
  });

  await auditLog({
    action: "publish_requested",
    actor: admin.email,
    details: { postId: post.id, platforms, assetCount: assets.length },
  });

  // Publish to each platform
  const results: Record<string, { success: boolean; postUrl?: string; error?: string }> = {};

  for (const platform of platforms) {
    const account = await prisma.socialAccount.findFirst({ where: { platform } });
    if (!account) {
      results[platform] = { success: false, error: "No account connected" };
      continue;
    }

    // Idempotency check
    const idempotencyKey = generateIdempotencyKey({
      platform,
      accountId: account.id,
      body: postBody,
      linkUrl,
      assetHashes,
    });

    const existing = await prisma.publisherTarget.findUnique({
      where: { idempotencyKey },
    });

    if (existing && existing.status === "success") {
      results[platform] = {
        success: true,
        postUrl: existing.platformPostUrl || undefined,
        error: "Already published (idempotent)",
      };
      continue;
    }

    // Create target record
    const target = await prisma.publisherTarget.create({
      data: {
        postId: post.id,
        accountId: account.id,
        platform,
        idempotencyKey,
        status: "pending",
      },
    });

    // Execute platform posting
    let postResult: { success: boolean; platformPostId?: string; platformPostUrl?: string; error?: string };

    if (platform === "linkedin") {
      postResult = await postToLinkedIn({
        encryptedTokens: account.encryptedTokens,
        externalAccountId: account.externalAccountId,
        body: postBody,
        linkUrl,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });
    } else {
      postResult = await postToX({
        encryptedTokens: account.encryptedTokens,
        externalAccountId: account.externalAccountId,
        body: postBody,
        linkUrl,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });
    }

    // Update target
    await prisma.publisherTarget.update({
      where: { id: target.id },
      data: {
        status: postResult.success ? "success" : "failed",
        platformPostId: postResult.platformPostId,
        platformPostUrl: postResult.platformPostUrl,
        error: postResult.error,
        payloadJson: JSON.stringify({ body: postBody, linkUrl, assetCount: assets.length }),
      },
    });

    await auditLog({
      action: postResult.success ? "publish_succeeded" : "publish_failed",
      actor: admin.email,
      platform,
      details: {
        postId: post.id,
        targetId: target.id,
        platformPostId: postResult.platformPostId,
        error: postResult.error,
      },
    });

    results[platform] = {
      success: postResult.success,
      postUrl: postResult.platformPostUrl,
      error: postResult.error,
    };
  }

  // Update post status
  const allSuccess = Object.values(results).every((r) => r.success);
  const anySuccess = Object.values(results).some((r) => r.success);

  await prisma.publisherPost.update({
    where: { id: post.id },
    data: { status: allSuccess ? "published" : anySuccess ? "published" : "failed" },
  });

  return NextResponse.json({
    postId: post.id,
    results,
  });
}
