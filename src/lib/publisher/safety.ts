/**
 * Content safety scanner — P0 regex rules.
 * Rejects posts containing likely secrets, API keys, internal hostnames, tokens.
 */

const SECRET_PATTERNS = [
  // API keys / tokens
  /\b(sk|pk|api|secret|token|key)[-_]?[a-z0-9]{20,}\b/i,
  // AWS keys
  /\bAKIA[0-9A-Z]{16}\b/,
  // Bearer tokens
  /Bearer\s+[a-zA-Z0-9._\-]{20,}/,
  // Private hostnames / IPs
  /\b(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)\b/,
  // Internal domains
  /\b[a-z0-9-]+\.(internal|local|corp|private)\b/i,
  // Common secret env var patterns
  /\b(DATABASE_URL|OPENAI_API_KEY|PUBLISHER_SECRET|ENCRYPTION_KEY)\s*=\s*\S+/i,
  // JWT-like tokens
  /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/,
  // GitHub tokens
  /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}\b/,
];

export interface ScanResult {
  safe: boolean;
  violations: string[];
}

/**
 * Scan text content for potential secrets or unsafe patterns.
 */
export function scanContent(text: string): ScanResult {
  const violations: string[] = [];

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(`Matched pattern: ${pattern.source.slice(0, 60)}…`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}
