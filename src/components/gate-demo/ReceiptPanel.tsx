"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { EvidencePack } from "@/lib/gate/types";
import { VerdictBadge } from "./VerdictBadge";
import { HashDisplay } from "./HashDisplay";
import { ApprovalSummary } from "./ApprovalQueue";

export function ReceiptPanel({
  evidencePack,
  error,
}: {
  evidencePack: EvidencePack | null;
  error: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  // Error state: receipt API failed but client evaluation is still valid
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-5 flex flex-col gap-4 h-full"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            📄
          </span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Receipt Unavailable
          </h3>
        </div>
        <div className="rounded-xl bg-red-500/[0.06] border border-red-500/20 px-4 py-3">
          <p className="text-xs text-red-300 leading-relaxed">
            <span className="font-semibold">Server receipt could not be generated.</span>{" "}
            The policy evaluation above is real and ran client-side. No hashes
            are displayed because the server — the only source of
            cryptographic receipts — did not respond.
          </p>
          <p className="mt-2 text-[10px] text-zinc-500">{error}</p>
        </div>
      </motion.div>
    );
  }

  // Loading state
  if (!evidencePack) {
    return (
      <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-4 h-full min-h-[320px]">
        {reducedMotion ? (
          <div
            className="w-6 h-6 border-2 border-[rgb(var(--accent))] rounded-full"
            aria-hidden="true"
          />
        ) : (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-white/20 border-t-[rgb(var(--accent))] rounded-full"
            aria-hidden="true"
          />
        )}
        <p className="text-xs text-zinc-500">Generating cryptographic receipt…</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-5 flex flex-col gap-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            📄
          </span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Evidence Pack
          </h3>
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">
          v{evidencePack.version}
        </span>
      </div>

      {/* Verdict */}
      <div className="flex justify-center">
        <VerdictBadge verdict={evidencePack.evaluation.verdict} compact />
      </div>

      {/* Hashes */}
      <div className="space-y-2">
        <HashDisplay label="Request Hash" hash={evidencePack.request_hash} />
        <HashDisplay
          label="Evaluation Hash"
          hash={evidencePack.evaluation_hash}
        />
        <HashDisplay label="Receipt Hash" hash={evidencePack.receipt_hash} />
      </div>

      {/* Gate metadata */}
      <div className="premium-pill rounded-xl p-3 space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-500">Gate ID</span>
          <span className="text-zinc-400 font-mono truncate ml-2 max-w-[60%]">
            {evidencePack.gate_id}
          </span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-zinc-500">Generated</span>
          <span className="text-zinc-400 font-mono">
            {new Date(evidencePack.generated_at).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Approval record (Scenario B) */}
      {evidencePack.approval && (
        <ApprovalSummary approval={evidencePack.approval} />
      )}

      {/* Expand to full JSON */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-[10px] text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))] transition-colors self-center"
      >
        {expanded ? "Hide Full Evidence Pack ↑" : "View Full Evidence Pack ↓"}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-auto"
        >
          <pre className="text-[10px] text-zinc-500 font-mono bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 overflow-x-auto max-h-[400px]">
            {JSON.stringify(evidencePack, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Verification note */}
      <p className="text-[10px] text-zinc-600 leading-relaxed text-center">
        Hashes are SHA-256, computed server-side from actual request and
        evaluation data.
      </p>
    </motion.div>
  );
}
