"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { evaluatePolicy } from "@/lib/gate/policy-engine";
import { getScenario, getScenarioMeta } from "@/lib/gate/scenarios";
import type {
  ScenarioId,
  GateRequest,
  PolicyEvaluation,
  EvidencePack,
} from "@/lib/gate/types";
import { ScenarioSelector } from "./ScenarioSelector";
import { RequestPanel } from "./RequestPanel";
import { GatePanel } from "./GatePanel";
import { ApprovalQueue } from "./ApprovalQueue";
import { ReceiptPanel } from "./ReceiptPanel";

// ─── State Machine ───────────────────────────────────────

export type DemoPhase =
  | "idle"
  | "evaluating"
  | "needsApproval"
  | "generatingReceipt"
  | "done"
  | "error";

const scenarios = getScenarioMeta();

// ─── Constants ───────────────────────────────────────────

/** ms between each rule appearing in the cascade */
const RULE_STEP_MS = 100;
/** ms before we treat the receipt API as timed-out */
const RECEIPT_TIMEOUT_MS = 5000;

// ─── Component ───────────────────────────────────────────

export function GateDemoPage() {
  // State machine
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [scenarioId, setScenarioId] = useState<ScenarioId | null>(null);
  const [request, setRequest] = useState<GateRequest | null>(null);
  const [evaluation, setEvaluation] = useState<PolicyEvaluation | null>(null);
  const [receipt, setReceipt] = useState<EvidencePack | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [approvalDecision, setApprovalDecision] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);

  // Rule cascade animation
  const [visibleRuleCount, setVisibleRuleCount] = useState(0);
  const cascadeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const gatePanelRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  // ─── Cleanup cascade timers ────────────────────────────

  const clearCascade = useCallback(() => {
    cascadeTimers.current.forEach(clearTimeout);
    cascadeTimers.current = [];
  }, []);

  useEffect(() => {
    return () => clearCascade();
  }, [clearCascade]);

  // ─── Select Scenario ───────────────────────────────────

  const selectScenario = useCallback(
    (id: ScenarioId) => {
      // Reset all state
      clearCascade();
      setPhase("idle");
      setScenarioId(id);
      setRequest(getScenario(id));
      setEvaluation(null);
      setReceipt(null);
      setReceiptError(null);
      setApprovalDecision(null);
      setVisibleRuleCount(0);
    },
    [clearCascade],
  );

  // ─── Finish cascade → advance phase ────────────────────

  const finishCascade = useCallback(
    (eval_: PolicyEvaluation) => {
      clearCascade();
      setVisibleRuleCount(eval_.rules_evaluated.length);

      if (eval_.verdict === "REQUIRES_HUMAN_APPROVAL") {
        setPhase("needsApproval");
      } else {
        // AUTHORIZED or BLOCKED → go straight to receipt
        setPhase("generatingReceipt");
      }
    },
    [clearCascade],
  );

  // ─── Run Gate ──────────────────────────────────────────

  const runGate = useCallback(() => {
    if (!request || !scenarioId) return;

    // Run client-side policy evaluation (pure function, instant)
    const eval_ = evaluatePolicy(request);
    setEvaluation(eval_);
    setPhase("evaluating");
    setVisibleRuleCount(0);
    setReceipt(null);
    setReceiptError(null);
    setApprovalDecision(null);

    // Move focus to the gate panel for screen readers
    setTimeout(() => {
      gatePanelRef.current?.focus();
    }, 100);

    if (reducedMotion) {
      // Skip animation entirely
      finishCascade(eval_);
      return;
    }

    // Animate rule cascade
    const totalRules = eval_.rules_evaluated.length;
    for (let i = 0; i < totalRules; i++) {
      const timer = setTimeout(() => {
        setVisibleRuleCount(i + 1);
        // After last rule, advance phase
        if (i === totalRules - 1) {
          setTimeout(() => finishCascade(eval_), 200);
        }
      }, (i + 1) * RULE_STEP_MS);
      cascadeTimers.current.push(timer);
    }
  }, [request, scenarioId, reducedMotion, finishCascade]);

  // ─── Skip cascade ──────────────────────────────────────

  const skipCascade = useCallback(() => {
    if (evaluation) {
      finishCascade(evaluation);
    }
  }, [evaluation, finishCascade]);

  // ─── Generate Receipt (API call) ───────────────────────

  const generateReceipt = useCallback(
    async (decision?: "APPROVED" | "REJECTED") => {
      if (!scenarioId) return;

      setPhase("generatingReceipt");

      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        RECEIPT_TIMEOUT_MS,
      );

      try {
        const body: Record<string, string> = { scenario_id: scenarioId };
        if (decision) {
          body.approval_decision = decision;
        }

        const res = await fetch("/api/gate/receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.error || `Receipt API returned ${res.status}`,
          );
        }

        const data = await res.json();
        setReceipt(data.evidence_pack);
        setPhase("done");
      } catch (e) {
        const isTimeout =
          e instanceof DOMException && e.name === "AbortError";
        const message = isTimeout
          ? "Receipt server timed out — evaluation verdict above is valid (computed client-side)"
          : e instanceof Error
            ? e.message
            : "Unknown error";
        setReceiptError(message);
        setPhase("error");
      } finally {
        clearTimeout(timeout);
      }
    },
    [scenarioId],
  );

  // Auto-generate receipt when phase transitions to generatingReceipt
  useEffect(() => {
    if (phase === "generatingReceipt" && !receipt && !receiptError) {
      generateReceipt(approvalDecision ?? undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ─── Approval Decision ─────────────────────────────────

  const handleApproval = useCallback(
    (decision: "APPROVED" | "REJECTED") => {
      setApprovalDecision(decision);
      setPhase("generatingReceipt");
    },
    [],
  );

  // ─── Derived state ─────────────────────────────────────

  const canRun = scenarioId !== null && phase === "idle";
  const showRequest = request !== null;
  const showGate = evaluation !== null || phase !== "idle";
  const showApproval = phase === "needsApproval" && evaluation !== null && request !== null;
  const showReceipt =
    phase === "generatingReceipt" || phase === "done" || phase === "error";

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-gradient-to-b from-[rgba(var(--accent),0.08)] to-transparent blur-3xl pointer-events-none" />
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-white"
          >
            Asadi Gate
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-lg sm:text-xl font-medium accent-glow"
          >
            Fail-closed governance for agentic commerce
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-base text-zinc-400 leading-relaxed max-w-2xl"
          >
            Select a scenario below to see the Gate evaluate a payment request in
            real time. Every decision is backed by a SHA-256 evidence pack
            generated server-side.
          </motion.p>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-5 flex flex-wrap gap-2"
          >
            {[
              "8 Policy Rules",
              "SHA-256 Receipts",
              "Fail-Closed",
              "Human-in-the-Loop",
            ].map((label) => (
              <div
                key={label}
                className="premium-pill rounded-full px-3 py-1.5 text-[10px] font-medium text-white/70 tracking-wide"
              >
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scenario Selector */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          Select Scenario
        </h2>
        <p className="text-xs text-zinc-500 mb-4">
          Pick one of the scenarios below to begin
        </p>
        <ScenarioSelector
          scenarios={scenarios}
          selected={scenarioId}
          onSelect={selectScenario}
          disabled={
            phase === "evaluating" || phase === "generatingReceipt"
          }
        />
      </div>

      {/* Run Gate button */}
      {scenarioId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <button
            type="button"
            onClick={runGate}
            disabled={!canRun}
            className={`
              px-8 py-3 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200
              ${
                canRun
                  ? "bg-[rgb(var(--accent))] text-black shadow-lg shadow-[rgba(var(--accent),0.3)] hover:shadow-[rgba(var(--accent),0.45)] hover:-translate-y-0.5 cursor-pointer"
                  : "bg-white/10 text-zinc-500 cursor-not-allowed"
              }
            `}
          >
            {phase === "evaluating"
              ? "Evaluating…"
              : phase === "generatingReceipt"
                ? "Generating Receipt…"
                : "Run Gate →"}
          </button>
        </motion.div>
      )}

      {/* Three-Panel Flow */}
      {(showRequest || showGate || showReceipt) && (
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          role="region"
          aria-label="Gate evaluation flow"
        >
          {/* Panel 1: Request */}
          <div className="md:col-span-1">
            {request && (
              <RequestPanel
                request={request}
                isActive={phase !== "idle"}
              />
            )}
          </div>

          {/* Panel 2: Gate */}
          <div
            className="md:col-span-1"
            ref={gatePanelRef}
            tabIndex={-1}
          >
            <GatePanel
              evaluation={evaluation}
              phase={phase}
              visibleRuleCount={visibleRuleCount}
              onSkipCascade={skipCascade}
            />
          </div>

          {/* Panel 3: Receipt (or Approval Queue) */}
          <div className="md:col-span-1">
            {showApproval && (
              <ApprovalQueue
                request={request!}
                evaluation={evaluation!}
                onDecision={handleApproval}
              />
            )}
            {showReceipt && (
              <ReceiptPanel
                evidencePack={receipt}
                error={receiptError}
              />
            )}
            {!showApproval && !showReceipt && (
              <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-4 h-full min-h-[320px]">
                <span className="text-2xl opacity-30" aria-hidden="true">
                  📄
                </span>
                <p className="text-sm text-zinc-500 text-center">
                  Receipt will appear here after evaluation
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flow direction indicators (mobile) */}
      {(showRequest || showGate || showReceipt) && (
        <div className="flex md:hidden justify-center text-zinc-600 text-xs gap-1">
          Request → Gate → Receipt
        </div>
      )}

      {/* Screen-reader verdict announcer */}
      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        role="status"
      >
        {evaluation && (phase === "needsApproval" || phase === "generatingReceipt" || phase === "done" || phase === "error")
          ? `Verdict: ${evaluation.verdict.replace(/_/g, " ").toLowerCase()}`
          : ""}
        {phase === "error" && receiptError
          ? ". Receipt unavailable — evaluation is valid."
          : ""}
      </div>
    </div>
  );
}
