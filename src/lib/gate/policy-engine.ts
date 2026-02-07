/**
 * Asadi Gate — Policy Evaluation Engine
 *
 * Pure-function engine that evaluates a GateRequest against a priority-ordered
 * rule set. First matching rule wins. No match = BLOCKED (fail-closed).
 *
 * INV-FAIL-CLOSED: Default return is always BLOCKED.
 * INV-NO-EXECUTE: No external API calls, no side effects.
 *
 * Truth Table (8 rules, priority-ordered):
 * ┌──────────┬───────────┬──────────────────────────────────────────┬──────────────────────────┬──────────┐
 * │ Priority │ Rule ID   │ Condition                                │ Verdict                  │ Risk     │
 * ├──────────┼───────────┼──────────────────────────────────────────┼──────────────────────────┼──────────┤
 * │ 1        │ RULE-001  │ Prompt injection heuristic               │ BLOCKED                  │ CRITICAL │
 * │ 2        │ RULE-002  │ Unknown agent type                       │ BLOCKED                  │ HIGH     │
 * │ 3        │ RULE-003  │ Unverified recipient + amount > $100     │ BLOCKED                  │ HIGH     │
 * │ 4        │ RULE-004  │ Amount > agent limit ($200 PURCHASING)   │ REQUIRES_HUMAN_APPROVAL  │ MEDIUM   │
 * │ 5        │ RULE-005  │ Recipient not in known vendor list       │ REQUIRES_HUMAN_APPROVAL  │ MEDIUM   │
 * │ 6        │ RULE-006  │ Within limits, verified recipient        │ AUTHORIZED               │ LOW      │
 * │ 7        │ RULE-007  │ Zero-amount (no-op)                      │ AUTHORIZED               │ LOW      │
 * │ 8        │ DEFAULT   │ No rule matched                          │ BLOCKED                  │ HIGH     │
 * └──────────┴───────────┴──────────────────────────────────────────┴──────────────────────────┴──────────┘
 */

import type {
  GateRequest,
  GateVerdict,
  PolicyEvaluation,
  PolicyRule,
  PolicyRuleDisplay,
  RiskLevel,
} from "./types";

// ─── Constants ───────────────────────────────────────────

/** Per-agent-type spending limits in USD */
const AGENT_LIMITS: Record<string, number> = {
  PURCHASING: 200,
  TREASURY: 10_000,
  OPERATIONS: 500,
};

/** Known/approved vendor names for demo purposes */
const KNOWN_RECIPIENTS = [
  "Office Supplies Co",
  "TechVendor Inc",
  "Cloud Services Ltd",
  "Marketing Agency Co",
];

/** Patterns that indicate prompt injection in agent reasoning */
const SUSPICIOUS_PATTERNS = [
  "ignore previous",
  "override",
  "bypass",
  "new instructions",
  "wallet",
  "urgent transfer",
];

// ─── Helpers ─────────────────────────────────────────────

function hasSuspiciousReasoning(reasoning?: string): boolean {
  if (!reasoning) return false;
  const lower = reasoning.toLowerCase();
  return SUSPICIOUS_PATTERNS.some((pattern) => lower.includes(pattern));
}

// ─── Policy Rules (priority-ordered) ─────────────────────

const POLICY_RULES: PolicyRule[] = [
  {
    id: "RULE-001",
    name: "Prompt Injection Detection",
    description:
      "Blocks transactions with unverified recipients, high amounts, and suspicious agent reasoning patterns",
    priority: 1,
    condition: (req) =>
      !req.transaction.recipient.verified &&
      req.transaction.amount > 1000 &&
      hasSuspiciousReasoning(req.context.agent_reasoning),
    verdict: "BLOCKED",
    risk_level: "CRITICAL",
    reason:
      "Potential prompt injection detected: unverified recipient, high amount, and suspicious reasoning pattern",
  },
  {
    id: "RULE-002",
    name: "Unknown Agent Type",
    description: "Blocks transactions from unrecognized agent types",
    priority: 2,
    condition: (req) => req.agent.type === "UNKNOWN",
    verdict: "BLOCKED",
    risk_level: "HIGH",
    reason: "Transaction from unknown agent type — not authorized to transact",
  },
  {
    id: "RULE-003",
    name: "Unverified High-Value Recipient",
    description:
      "Blocks transactions over $100 to recipients not on the verified vendor list",
    priority: 3,
    condition: (req) =>
      !req.transaction.recipient.verified && req.transaction.amount > 100,
    verdict: "BLOCKED",
    risk_level: "HIGH",
    reason:
      "Unverified recipient with transaction amount exceeding $100 threshold",
  },
  {
    id: "RULE-004",
    name: "Agent Spending Limit",
    description:
      "Escalates transactions that exceed the agent type's per-transaction spending ceiling",
    priority: 4,
    condition: (req) => {
      const limit = AGENT_LIMITS[req.agent.type] ?? 0;
      return req.transaction.amount > limit;
    },
    verdict: "REQUIRES_HUMAN_APPROVAL",
    risk_level: "MEDIUM",
    reason:
      "Transaction amount exceeds agent's authorized spending limit — human approval required",
  },
  {
    id: "RULE-005",
    name: "New Recipient Review",
    description:
      "Escalates transactions to recipients not yet in the approved vendor list",
    priority: 5,
    condition: (req) =>
      !KNOWN_RECIPIENTS.includes(req.transaction.recipient.name),
    verdict: "REQUIRES_HUMAN_APPROVAL",
    risk_level: "MEDIUM",
    reason:
      "Recipient not found in approved vendor list — human review required",
  },
  {
    id: "RULE-006",
    name: "Standard Authorization",
    description:
      "Authorizes transactions within the agent's spending limit to verified recipients",
    priority: 6,
    condition: (req) =>
      req.transaction.amount > 0 &&
      req.transaction.amount <= (AGENT_LIMITS[req.agent.type] ?? 0) &&
      req.transaction.recipient.verified,
    verdict: "AUTHORIZED",
    risk_level: "LOW",
    reason:
      "Transaction within agent limits to verified recipient — authorized",
  },
  {
    id: "RULE-007",
    name: "No-Op Transaction",
    description: "Authorizes zero-amount transactions (no financial risk)",
    priority: 7,
    condition: (req) => req.transaction.amount === 0,
    verdict: "AUTHORIZED",
    risk_level: "LOW",
    reason: "Zero-amount transaction — no financial risk",
  },
];

// ─── Fail-Closed Default ─────────────────────────────────

const DEFAULT_VERDICT: GateVerdict = "BLOCKED";
const DEFAULT_RISK_LEVEL: RiskLevel = "HIGH";

const DEFAULT_RULE = {
  id: "DEFAULT",
  name: "Fail-Closed Default",
  reason:
    "No policy rule matched — transaction blocked by fail-closed default",
};

// ─── Engine ──────────────────────────────────────────────

/**
 * Evaluate a GateRequest against the policy rule set.
 *
 * Pure function — no side effects, no external calls, no state mutation.
 * Rules are evaluated in priority order (1 = highest). First match wins.
 * If no rule matches, the default verdict is BLOCKED (fail-closed).
 * If any rule's condition throws, that rule is treated as non-matching.
 * If the entire engine throws, the verdict is BLOCKED.
 */
export function evaluatePolicy(request: GateRequest): PolicyEvaluation {
  const start = performance.now();

  try {
    const rulesEvaluated: PolicyEvaluation["rules_evaluated"] = [];

    for (const rule of POLICY_RULES) {
      let matched = false;
      try {
        matched = rule.condition(request);
      } catch {
        // Rule condition threw — treat as non-match, continue cascade.
        // Fail-closed is enforced by the DEFAULT at the end, not here.
        matched = false;
      }

      rulesEvaluated.push({
        id: rule.id,
        name: rule.name,
        matched,
      });

      if (matched) {
        return {
          request_id: request.id,
          verdict: rule.verdict,
          risk_level: rule.risk_level,
          triggered_rule: {
            id: rule.id,
            name: rule.name,
            reason: rule.reason,
          },
          rules_evaluated: rulesEvaluated,
          evaluation_time_ms: elapsed(start),
          timestamp: new Date().toISOString(),
        };
      }
    }

    // No rule matched → fail-closed
    return {
      request_id: request.id,
      verdict: DEFAULT_VERDICT,
      risk_level: DEFAULT_RISK_LEVEL,
      triggered_rule: DEFAULT_RULE,
      rules_evaluated: rulesEvaluated,
      evaluation_time_ms: elapsed(start),
      timestamp: new Date().toISOString(),
    };
  } catch {
    // Catastrophic failure → fail-closed
    return {
      request_id: request.id,
      verdict: DEFAULT_VERDICT,
      risk_level: DEFAULT_RISK_LEVEL,
      triggered_rule: {
        id: "SYSTEM-ERROR",
        name: "System Error",
        reason:
          "Policy evaluation failed — transaction blocked by fail-closed doctrine",
      },
      rules_evaluated: [],
      evaluation_time_ms: elapsed(start),
      timestamp: new Date().toISOString(),
    };
  }
}

function elapsed(start: number): number {
  return Math.round((performance.now() - start) * 100) / 100;
}

// ─── Display Export (condition functions stripped for serialization) ──

/** Policy rules without condition functions — safe for client-side display */
export const POLICY_RULES_DISPLAY: PolicyRuleDisplay[] = POLICY_RULES.map(
  ({ condition: _condition, ...rest }) => rest,
);
