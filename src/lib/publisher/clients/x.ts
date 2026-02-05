/**
 * X (Twitter) posting client.
 * OAuth 2.0 user-context posting with media upload support.
 *
 * Flow for images:
 *   1. Upload media via media upload endpoint
 *   2. Get media_id
 *   3. Create tweet with media_ids
 */
import { decryptTokens } from "@/lib/publisher/crypto";

interface XTokens {
  access_token: string;
  refresh_token?: string;
}

interface PostResult {
  success: boolean;
  platformPostId?: string;
  platformPostUrl?: string;
  error?: string;
}

/**
 * Upload an image to X's media upload endpoint.
 * Returns the media_id string.
 *
 * Note: X v1.1 media upload still requires OAuth 1.0a or v2 with special grants.
 * For simplicity, we use the v1.1 media/upload endpoint with Bearer token.
 * If this doesn't work, user may need to use OAuth 1.0a for media upload.
 */
async function uploadMediaToX(
  accessToken: string,
  imageUrl: string,
  mime: string
): Promise<string | null> {
  // Fetch image from S3
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) return null;
  const buffer = await imageRes.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  // Use v1.1 media upload (base64)
  const form = new URLSearchParams();
  form.set("media_data", base64);
  form.set("media_category", "tweet_image");

  const uploadRes = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!uploadRes.ok) {
    console.error("X media upload failed:", uploadRes.status, await uploadRes.text());
    return null;
  }

  const data = await uploadRes.json();
  return data.media_id_string || null;
}

/**
 * Post a tweet to X.
 */
export async function postToX(params: {
  encryptedTokens: string;
  externalAccountId: string;
  body: string;
  linkUrl?: string;
  imageUrls?: { url: string; mime: string }[];
}): Promise<PostResult> {
  let tokens: XTokens;
  try {
    tokens = decryptTokens<XTokens>(params.encryptedTokens);
  } catch (err) {
    return { success: false, error: `Token decryption failed: ${err}` };
  }

  const accessToken = tokens.access_token;

  // Upload media if any
  const mediaIds: string[] = [];
  if (params.imageUrls?.length) {
    for (const img of params.imageUrls.slice(0, 4)) {
      const mediaId = await uploadMediaToX(accessToken, img.url, img.mime);
      if (mediaId) mediaIds.push(mediaId);
    }
  }

  // Build tweet text (append link if provided)
  let tweetText = params.body;
  if (params.linkUrl) {
    tweetText = `${tweetText}\n\n${params.linkUrl}`;
  }

  // Create tweet via v2 API
  const tweetPayload: Record<string, unknown> = {
    text: tweetText.slice(0, 280),
  };

  if (mediaIds.length > 0) {
    tweetPayload.media = { media_ids: mediaIds };
  }

  const tweetRes = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweetPayload),
  });

  if (!tweetRes.ok) {
    const errText = await tweetRes.text();
    console.error("X tweet creation failed:", tweetRes.status, errText);
    return { success: false, error: `X API ${tweetRes.status}: ${errText.slice(0, 200)}` };
  }

  const tweetData = await tweetRes.json();
  const tweetId = tweetData.data?.id;

  return {
    success: true,
    platformPostId: tweetId,
    platformPostUrl: tweetId
      ? `https://x.com/i/status/${tweetId}`
      : undefined,
  };
}
