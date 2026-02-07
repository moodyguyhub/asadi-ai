"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PolicyEvaluation } from "@/lib/gate/types";
import type { DemoPhase } from "./GateDemoPage";
import { RuleCascade } from "./RuleCascade";
import { VerdictBadge } from "./VerdictBadge";

export function GatePanel({
  evaluation,
  phase,
  visibleRuleCount,
  onSkipCascade,
}: {
  evaluation: PolicyEvaluation | null;
  phase: DemoPhase;
  visibleRuleCount: number;
  onSkipCascade: () => void;
}) {
  const reducedMotion = useReducedMotion();

  // Idle state
  if (phase === "idle" || !evaluation) {
    return (
      <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-4 h-full min-h-[320px]">
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.4, 0.7, 0.4],
                }
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-2xl opacity-50">🛡</span>
        </motion.div>
        <p className="text-sm text-zinc-500 text-center">
          Select a scenario and run the Gate
        </p>
      </div>
    );
  }

  const isEvaluating = phase === "evaluating";
  const showVerdict =
    phase === "needsApproval" ||
    phase === "generatingReceipt" ||
    phase === "done" ||
    phase === "error";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl p-5 flex flex-col gap-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            🛡
          </span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Gate Evaluation
          </h3>
        </div>
        {isEvaluating && (
          <button
            type="button"
            onClick={onSkipCascade}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip →
          </button>
        )}
      </div>

      {/* Rule Cascade */}
      <RuleCascade evaluation={evaluation} visibleCount={visibleRuleCount} />

      {/* Verdict */}
      {showVerdict && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mt-auto pt-3 border-t border-white/[0.06] flex flex-col items-center gap-2"
        >
          <VerdictBadge verdict={evaluation.verdict} />
          <p className="text-[10px] text-zinc-500 font-mono">
            Evaluated in {evaluation.evaluation_time_ms}ms
          </p>
        </motion.div>
      )}

      {/* Evaluating indicator */}
      {isEvaluating && (
        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-center gap-2">
          {reducedMotion ? (
            <div
              className="w-4 h-4 border-2 border-[rgb(var(--accent))] rounded-full"
              aria-hidden="true"
            />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/20 border-t-[rgb(var(--accent))] rounded-full"
              aria-hidden="true"
            />
          )}
          <span className="text-xs text-zinc-500">Evaluating rules…</span>
        </div>
      )}
    </motion.div>
  );
}
