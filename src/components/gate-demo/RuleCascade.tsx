"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PolicyEvaluation } from "@/lib/gate/types";

/**
 * Animated rule cascade — the hero animation of the Gate demo.
 * Each rule lights up sequentially, stopping at the triggered rule.
 * Respects prefers-reduced-motion.
 */
export function RuleCascade({
  evaluation,
  visibleCount,
}: {
  evaluation: PolicyEvaluation;
  /** How many rules to show (animated count advances via the orchestrator) */
  visibleCount: number;
}) {
  const reducedMotion = useReducedMotion();
  const rules = evaluation.rules_evaluated;

  return (
    <div className="space-y-2" role="list" aria-label="Policy rule evaluation">
      {rules.map((rule, index) => {
        const isVisible = index < visibleCount;
        const isTriggered = rule.matched;
        const isLast = index === rules.length - 1 && rule.matched;

        if (!isVisible) {
          return (
            <div
              key={rule.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-white/[0.04] bg-white/[0.02]"
              role="listitem"
              aria-hidden="true"
            >
              <div className="w-5 h-5 rounded-full bg-white/[0.06]" />
              <span className="text-xs text-zinc-600">{rule.name}</span>
            </div>
          );
        }

        return (
          <motion.div
            key={rule.id}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors duration-300 ${
              isTriggered
                ? isLast && evaluation.verdict === "AUTHORIZED"
                  ? "border-green-500/20 bg-green-500/[0.06]"
                  : evaluation.verdict === "REQUIRES_HUMAN_APPROVAL"
                    ? "border-amber-500/20 bg-amber-500/[0.06]"
                    : "border-red-500/20 bg-red-500/[0.06]"
                : "border-white/[0.06] bg-white/[0.03]"
            }`}
            role="listitem"
            aria-label={`${rule.name}: ${rule.matched ? "triggered" : "passed"}`}
          >
            {/* Status indicator */}
            <motion.div
              initial={reducedMotion ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: reducedMotion ? 0 : 0.1,
              }}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                !isTriggered
                  ? "bg-green-500/20 text-green-400"
                  : evaluation.verdict === "AUTHORIZED"
                    ? "bg-green-500/20 text-green-400"
                    : evaluation.verdict === "REQUIRES_HUMAN_APPROVAL"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
              }`}
              aria-hidden="true"
            >
              {!isTriggered ? "✓" : evaluation.verdict === "AUTHORIZED" ? "✓" : "✕"}
            </motion.div>

            {/* Rule info */}
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-white/80 block truncate">
                {rule.name}
              </span>
              {isTriggered && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-[10px] text-zinc-400 block truncate"
                >
                  {evaluation.triggered_rule.reason}
                </motion.span>
              )}
            </div>

            {/* Priority badge */}
            <span className="text-[10px] font-mono text-zinc-600 shrink-0">
              P{rules.indexOf(rule) + 1}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
