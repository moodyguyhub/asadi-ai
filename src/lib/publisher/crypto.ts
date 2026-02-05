/**
 * AES-256-GCM envelope encryption for social account tokens.
 *
 * Env: PUBLISHER_ENCRYPTION_KEY — hex-encoded 32-byte key.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const hex = process.env.PUBLISHER_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("PUBLISHER_ENCRYPTION_KEY must be a 64-char hex string (32 bytes).");
  }
  return Buffer.from(hex, "hex");
}

/**
 * Encrypt a plaintext string → base64(iv + ciphertext + tag).
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, encrypted, tag]).toString("base64");
}

/**
 * Decrypt base64(iv + ciphertext + tag) → plaintext string.
 */
export function decrypt(encoded: string): string {
  const key = getKey();
  const buf = Buffer.from(encoded, "base64");
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(buf.length - TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN, buf.length - TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext) + decipher.final("utf8");
}

/**
 * Encrypt a token object (access_token, refresh_token, etc.).
 */
export function encryptTokens(tokens: Record<string, unknown>): string {
  return encrypt(JSON.stringify(tokens));
}

/**
 * Decrypt token object.
 */
export function decryptTokens<T = Record<string, unknown>>(encoded: string): T {
  return JSON.parse(decrypt(encoded)) as T;
}
