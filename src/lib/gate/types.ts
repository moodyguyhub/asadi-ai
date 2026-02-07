/**
 * Asadi Gate — Core Type Definitions
 *
 * Fail-closed governance layer for agentic commerce.
 * These types define the contract for the policy engine, evidence packs,
 * and the human approval queue.
 *
 * INV-NO-EXECUTE: This is a portfolio demo. No real money, no real APIs.
 */

// ─── Enums ───────────────────────────────────────────────

export type GateVerdict = "AUTHORIZED" | "REQUIRES_HUMAN_APPROVAL" | "BLOCKED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AgentType = "PURCHASING" | "TREASURY" | "OPERATIONS" | "UNKNOWN";

export type ScenarioId = "normal-purchase" | "over-limit" | "prompt-injection";

// ─── Gate Request ────────────────────────────────────────

export interface GateRequest {
  id: string;
  timestamp: string; // ISO 8601
  agent: {
    id: string;
    type: AgentType;
    name: string;
    model?: string;
  };
  transaction: {
    type: "PURCHASE" | "TRANSFER" | "REFUND";
    amount: number;
    currency: string;
    recipient: {
      name: string;
      account: string; // masked or partial
      verified: boolean;
    };
    description: string;
  };
  context: {
    session_id: string;
    ip_address: string;
    user_prompt?: string;
    agent_reasoning?: string;
  };
}

// ─── Policy Rule ─────────────────────────────────────────

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  priority: number; // Lower = higher priority (1 is highest)
  condition: (req: GateRequest) => boolean;
  verdict: GateVerdict;
  risk_level: RiskLevel;
  reason: string;
}

/** PolicyRule without the condition function — safe for serialization and UI display */
export type PolicyRuleDisplay = Omit<PolicyRule, "condition">;

// ─── Policy Evaluation ──────────────────────────────────

export interface PolicyEvaluation {
  request_id: string;
  verdict: GateVerdict;
  risk_level: RiskLevel;
  triggered_rule: {
    id: string;
    name: string;
    reason: string;
  };
  rules_evaluated: {
    id: string;
    name: string;
    matched: boolean;
  }[];
  evaluation_time_ms: number;
  timestamp: string;
}

// ─── Evidence Pack ───────────────────────────────────────

export interface EvidencePack {
  version: "1.0.0";
  gate_id: string;
  request_hash: string; // SHA-256 of GateRequest JSON
  evaluation_hash: string; // SHA-256 of PolicyEvaluation JSON
  receipt_hash: string; // SHA-256 of (request_hash + evaluation_hash)
  request: GateRequest;
  evaluation: PolicyEvaluation;
  approval?: ApprovalRecord;
  generated_at: string;
}

// ─── Human Approval Queue ────────────────────────────────

export interface ApprovalRecord {
  decision_id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  requested_at: string;
  expires_at: string; // 72 hours from requested_at
  decided_at?: string;
  decided_by?: string;
  notes?: string;
  auto_action: "EXPIRE"; // Never auto-approve (INV-FAIL-CLOSED)
}
