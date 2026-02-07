/**
 * Asadi Gate — Barrel Export
 *
 * Re-exports all gate modules for convenient imports:
 *   import { evaluatePolicy, getScenario, sha256 } from "@/lib/gate";
 */

// Types
export type {
  GateVerdict,
  RiskLevel,
  AgentType,
  ScenarioId,
  GateRequest,
  PolicyRule,
  PolicyRuleDisplay,
  PolicyEvaluation,
  EvidencePack,
  ApprovalRecord,
} from "./types";

// Policy engine
export { evaluatePolicy, POLICY_RULES_DISPLAY } from "./policy-engine";

// Scenarios
export {
  getScenario,
  getScenarioMeta,
  isValidScenarioId,
} from "./scenarios";
export type { ScenarioMeta } from "./scenarios";

// Hashing
export { sha256, deterministicStringify, hashObject } from "./hash";
