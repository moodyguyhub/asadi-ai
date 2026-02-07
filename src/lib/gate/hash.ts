/**
 * Asadi Gate — SHA-256 Hashing Utilities
 *
 * Server-side hashing using Node.js crypto module.
 * Used by the receipt API to generate real, verifiable evidence packs.
 *
 * INV-REAL-RECEIPTS: All hashes are computed from actual input data, never hardcoded.
 */

import { createHash } from "crypto";

/**
 * Compute SHA-256 hash of a UTF-8 string.
 */
export function sha256(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

/**
 * Deterministic JSON serialization with recursively sorted keys.
 * Ensures the same object always produces the same string representation
 * regardless of property insertion order.
 */
export function deterministicStringify(obj: unknown): string {
  return JSON.stringify(obj, (_key: string, value: unknown) => {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((sorted, k) => {
          sorted[k] = (value as Record<string, unknown>)[k];
          return sorted;
        }, {});
    }
    return value;
  });
}

/**
 * Compute SHA-256 hash of any object using deterministic serialization.
 * Same object structure → same hash, regardless of key order.
 */
export function hashObject(obj: unknown): string {
  return sha256(deterministicStringify(obj));
}
