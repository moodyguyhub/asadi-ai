"use client";

import { useState, useCallback } from "react";

/**
 * Displays a truncated SHA-256 hash with a copy-to-clipboard button.
 * Uses monospace font matching asadi-ai's --font-mono (JetBrains Mono).
 */
export function HashDisplay({
  label,
  hash,
}: {
  label: string;
  hash: string;
}) {
  const [copied, setCopied] = useState(false);

  const truncated = hash.length > 16
    ? `${hash.slice(0, 8)}…${hash.slice(-8)}`
    : hash;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — prompt
      window.prompt("Copy hash:", hash);
    }
  }, [hash]);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2">
      <div className="min-w-0">
        <span className="block text-[10px] uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <span
          className="block font-mono text-xs text-zinc-300 truncate"
          title={hash}
        >
          {truncated}
        </span>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-[10px] text-zinc-500 hover:text-white transition-colors duration-150"
        aria-label={`Copy ${label} hash`}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
