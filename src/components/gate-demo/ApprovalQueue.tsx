"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { GateRequest, PolicyEvaluation, ApprovalRecord } from "@/lib/gate/types";

export function ApprovalQueue({
  request,
  evaluation,
  onDecision,
}: {
  request: GateRequest;
  evaluation: PolicyEvaluation;
  onDecision: (decision: "APPROVED" | "REJECTED") => void;
}) {
  const [deciding, setDeciding] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"APPROVED" | "REJECTED" | null>(null);

  const handleDecision = (decision: "APPROVED" | "REJECTED") => {
    setDeciding(true);
    setSelectedAction(decision);
    // Small delay for visual feedback
    setTimeout(() => onDecision(decision), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">
          ⏸
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
          Human Approval Required
        </h3>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl bg-amber-500/[0.06] border border-amber-500/20 px-3 py-2">
        <p className="text-[10px] text-amber-300/70 leading-relaxed">
          This is a simulation of human-in-the-loop approval.
          In production, this routes to an authorized reviewer.
        </p>
      </div>

      {/* Transaction summary */}
      <div className="premium-pill rounded-xl p-3 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Amount</span>
          <span className="text-amber-400 font-semibold">
            ${request.transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Recipient</span>
          <span className="text-zinc-300">{request.transaction.recipient.name}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Rule Triggered</span>
          <span className="text-zinc-300">{evaluation.triggered_rule.name}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Reason</span>
          <span className="text-zinc-400 text-right max-w-[60%]">
            {evaluation.triggered_rule.reason}
          </span>
        </div>
      </div>

      {/* Expiry policy */}
      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 animate-pulse" />
        72-hour expiry window · Auto-action: EXPIRE (never auto-approve)
      </div>

      {/* Decision buttons */}
      <div className="flex gap-3 mt-auto">
        <button
          type="button"
          onClick={() => handleDecision("APPROVED")}
          disabled={deciding}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200
            ${
              selectedAction === "APPROVED"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-green-500/10 text-green-400/80 border border-green-500/15 hover:bg-green-500/15 hover:border-green-500/25"
            }
            ${deciding ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {selectedAction === "APPROVED" ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => handleDecision("REJECTED")}
          disabled={deciding}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200
            ${
              selectedAction === "REJECTED"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-red-500/10 text-red-400/80 border border-red-500/15 hover:bg-red-500/15 hover:border-red-500/25"
            }
            ${deciding ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {selectedAction === "REJECTED" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </motion.div>
  );
}

/** Display a completed approval record (inside the receipt). */
export function ApprovalSummary({ approval }: { approval: ApprovalRecord }) {
  const statusColor: Record<string, string> = {
    APPROVED: "text-green-400 bg-green-500/10 border-green-500/20",
    REJECTED: "text-red-400 bg-red-500/10 border-red-500/20",
    EXPIRED: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
    PENDING: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="premium-pill rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          Human Decision
        </span>
        <span
          className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${statusColor[approval.status] || statusColor.PENDING}`}
        >
          {approval.status}
        </span>
      </div>
      {approval.decided_by && (
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">Reviewer</span>
          <span className="text-zinc-300 font-mono">{approval.decided_by}</span>
        </div>
      )}
      {approval.notes && (
        <p className="text-xs text-zinc-400 leading-relaxed">{approval.notes}</p>
      )}
      <div className="flex justify-between text-[10px] text-zinc-600">
        <span>Auto-action on expiry: {approval.auto_action}</span>
      </div>
    </div>
  );
}
