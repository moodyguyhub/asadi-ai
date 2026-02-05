/**
 * LinkedIn posting client.
 * Personal profile posting using w_member_social permission.
 *
 * Flow for images:
 *   1. Register image upload with LinkedIn
 *   2. Upload binary to LinkedIn's upload URL
 *   3. Create post referencing the image asset
 *
 * For text-only posts: just create the post directly.
 */
import { decryptTokens } from "@/lib/publisher/crypto";

interface LinkedInTokens {
  access_token: string;
  id_token?: string;
}

interface PostResult {
  success: boolean;
  platformPostId?: string;
  platformPostUrl?: string;
  error?: string;
}

/**
 * Register an image upload with LinkedIn and upload the binary.
 * Returns the LinkedIn image URN for use in the post.
 */
async function uploadImageToLinkedIn(
  accessToken: string,
  personUrn: string,
  imageUrl: string,
  mime: string
): Promise<string | null> {
  // Step 1: Register upload
  const registerRes = await fetch("https://api.linkedin.com/v2/images?action=initializeUpload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initializeUploadRequest: {
        owner: personUrn,
      },
    }),
  });

  if (!registerRes.ok) {
    console.error("LinkedIn image register failed:", await registerRes.text());
    return null;
  }

  const registerData = await registerRes.json();
  const uploadUrl = registerData.value?.uploadUrl;
  const imageUrn = registerData.value?.image;

  if (!uploadUrl || !imageUrn) return null;

  // Step 2: Fetch image from our S3 and upload to LinkedIn
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) return null;
  const imageBlob = await imageRes.blob();

  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": mime },
    body: imageBlob,
  });

  if (!uploadRes.ok) {
    console.error("LinkedIn image upload failed:", uploadRes.status);
    return null;
  }

  return imageUrn;
}

/**
 * Post to LinkedIn personal profile.
 */
export async function postToLinkedIn(params: {
  encryptedTokens: string;
  externalAccountId: string;
  body: string;
  linkUrl?: string;
  imageUrls?: { url: string; mime: string }[];
}): Promise<PostResult> {
  let tokens: LinkedInTokens;
  try {
    tokens = decryptTokens<LinkedInTokens>(params.encryptedTokens);
  } catch (err) {
    return { success: false, error: `Token decryption failed: ${err}` };
  }

  const personUrn = `urn:li:person:${params.externalAccountId}`;
  const accessToken = tokens.access_token;

  // Upload images if any
  const imageUrns: string[] = [];
  if (params.imageUrls?.length) {
    for (const img of params.imageUrls.slice(0, 4)) {
      const urn = await uploadImageToLinkedIn(accessToken, personUrn, img.url, img.mime);
      if (urn) imageUrns.push(urn);
    }
  }

  // Build post payload
  const content: Record<string, unknown> = {};

  if (imageUrns.length > 0) {
    content.multiImage = {
      images: imageUrns.map((urn) => ({ id: urn })),
    };
  }

  if (params.linkUrl) {
    content.article = {
      source: params.linkUrl,
      title: params.body.slice(0, 100),
    };
  }

  const postPayload: Record<string, unknown> = {
    author: personUrn,
    lifecycleState: "PUBLISHED",
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    commentary: params.body,
    distribution: {
      feedDistribution: "MAIN_FEED",
    },
  };

  if (Object.keys(content).length > 0) {
    postPayload.content = content;
  }

  const postRes = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(postPayload),
  });

  if (!postRes.ok) {
    const errText = await postRes.text();
    console.error("LinkedIn post failed:", postRes.status, errText);
    return { success: false, error: `LinkedIn API ${postRes.status}: ${errText.slice(0, 200)}` };
  }

  // LinkedIn returns the post URN in the x-restli-id header
  const postUrn = postRes.headers.get("x-restli-id") || "";

  return {
    success: true,
    platformPostId: postUrn,
    platformPostUrl: postUrn
      ? `https://www.linkedin.com/feed/update/${postUrn}`
      : undefined,
  };
}
