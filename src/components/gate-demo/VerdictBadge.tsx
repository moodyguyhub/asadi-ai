"use client";

import { motion } from "framer-motion";
import type { GateVerdict } from "@/lib/gate/types";

const VERDICT_CONFIG: Record<
  GateVerdict,
  { label: string; icon: string; colorClass: string; glowClass: string; bgClass: string }
> = {
  AUTHORIZED: {
    label: "Authorized",
    icon: "✓",
    colorClass: "text-green-400",
    glowClass: "shadow-green-500/30",
    bgClass: "bg-green-500/10 border-green-500/20",
  },
  REQUIRES_HUMAN_APPROVAL: {
    label: "Requires Human Approval",
    icon: "⏸",
    colorClass: "text-amber-400",
    glowClass: "shadow-amber-500/30",
    bgClass: "bg-amber-500/10 border-amber-500/20",
  },
  BLOCKED: {
    label: "Blocked",
    icon: "✕",
    colorClass: "text-red-400",
    glowClass: "shadow-red-500/30",
    bgClass: "bg-red-500/10 border-red-500/20",
  },
};

export function VerdictBadge({
  verdict,
  compact = false,
}: {
  verdict: GateVerdict;
  compact?: boolean;
}) {
  const config = VERDICT_CONFIG[verdict];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-semibold shadow-lg ${config.bgClass} ${config.glowClass} ${config.colorClass} ${compact ? "text-xs" : "text-sm"}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-base" aria-hidden="true">
        {config.icon}
      </span>
      <span>{config.label}</span>
    </motion.div>
  );
}
