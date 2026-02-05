/**
 * Idempotency key generator for publisher targets.
 * hash = sha256(platform + accountId + normalized_body + link + ordered_asset_sha256s)
 */
import { createHash } from "node:crypto";

export function generateIdempotencyKey(params: {
  platform: string;
  accountId: string;
  body: string;
  linkUrl?: string;
  assetHashes: string[];
}): string {
  const normalized = [
    params.platform,
    params.accountId,
    params.body.trim().replace(/\s+/g, " "),
    params.linkUrl || "",
    ...params.assetHashes.sort(),
  ].join("|");

  return createHash("sha256").update(normalized).digest("hex");
}
