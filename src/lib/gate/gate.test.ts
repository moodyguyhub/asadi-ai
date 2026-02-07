import { describe, expect, it } from "vitest";
import { evaluatePolicy, POLICY_RULES_DISPLAY } from "./policy-engine";
import { getScenario, isValidScenarioId, getScenarioMeta } from "./scenarios";
import { sha256, deterministicStringify, hashObject } from "./hash";
import type { GateRequest } from "./types";

// ─── Policy Engine Tests ─────────────────────────────────

describe("gate policy engine", () => {
  describe("scenario verdicts", () => {
    it("Scenario A (normal purchase) → AUTHORIZED", () => {
      const request = getScenario("normal-purchase");
      const result = evaluatePolicy(request);
      expect(result.verdict).toBe("AUTHORIZED");
      expect(result.risk_level).toBe("LOW");
      expect(result.triggered_rule.id).toBe("RULE-006");
    });

    it("Scenario B (over limit) → REQUIRES_HUMAN_APPROVAL", () => {
      const request = getScenario("over-limit");
      const result = evaluatePolicy(request);
      expect(result.verdict).toBe("REQUIRES_HUMAN_APPROVAL");
      expect(result.risk_level).toBe("MEDIUM");
      expect(result.triggered_rule.id).toBe("RULE-004");
    });

    it("Scenario C (prompt injection) → BLOCKED", () => {
      const request = getScenario("prompt-injection");
      const result = evaluatePolicy(request);
      expect(result.verdict).toBe("BLOCKED");
      expect(result.risk_level).toBe("CRITICAL");
      expect(result.triggered_rule.id).toBe("RULE-001");
    });
  });

  describe("fail-closed doctrine", () => {
    it("unknown agent type → BLOCKED", () => {
      const request = getScenario("normal-purchase");
      request.agent.type = "UNKNOWN";
      const result = evaluatePolicy(request);
      expect(result.verdict).toBe("BLOCKED");
      expect(result.triggered_rule.id).toBe("RULE-002");
    });

    it("no matching rule → BLOCKED (default)", () => {
      // Construct a request that bypasses all rules:
      // - verified recipient (skip RULE-001, RULE-003)
      // - known agent type (skip RULE-002)
      // - amount = -1 (negative — no rule handles this explicitly)
      // - known recipient
      const request = getScenario("normal-purchase");
      request.transaction.amount = -1;
      const result = evaluatePolicy(request);
      expect(result.verdict).toBe("BLOCKED");
      expect(result.triggered_rule.id).toBe("DEFAULT");
    });

    it("garbage input does not produce AUTHORIZED", () => {
      const garbage = {
        id: "garbage",
        timestamp: "not-a-date",
        agent: { id: "", type: "UNKNOWN" as const, name: "" },
        transaction: {
          type: "PURCHASE" as const,
          amount: NaN,
          currency: "",
          recipient: { name: "", account: "", verified: false },
          description: "",
        },
        context: { session_id: "", ip_address: "" },
      } satisfies GateRequest;

      const result = evaluatePolicy(garbage);
      expect(result.verdict).not.toBe("AUTHORIZED");
    });
  });

  describe("rule evaluation trace", () => {
    it("returns evaluated rules up to the triggered rule", () => {
      const request = getScenario("normal-purchase");
      const result = evaluatePolicy(request);
      // RULE-006 is priority 6, so rules 1-6 should be evaluated
      expect(result.rules_evaluated.length).toBe(6);
      // Only the last one (RULE-006) should be matched
      const matched = result.rules_evaluated.filter((r) => r.matched);
      expect(matched.length).toBe(1);
      expect(matched[0].id).toBe("RULE-006");
    });

    it("stops evaluation at first match", () => {
      const request = getScenario("prompt-injection");
      const result = evaluatePolicy(request);
      // RULE-001 is priority 1 — should stop immediately
      expect(result.rules_evaluated.length).toBe(1);
      expect(result.rules_evaluated[0].id).toBe("RULE-001");
      expect(result.rules_evaluated[0].matched).toBe(true);
    });

    it("records evaluation time", () => {
      const request = getScenario("normal-purchase");
      const result = evaluatePolicy(request);
      expect(typeof result.evaluation_time_ms).toBe("number");
      expect(result.evaluation_time_ms).toBeGreaterThanOrEqual(0);
    });
  });

  describe("POLICY_RULES_DISPLAY", () => {
    it("has 7 rules (excluding DEFAULT)", () => {
      expect(POLICY_RULES_DISPLAY.length).toBe(7);
    });

    it("does not contain condition functions (safe for serialization)", () => {
      for (const rule of POLICY_RULES_DISPLAY) {
        expect(rule).not.toHaveProperty("condition");
      }
    });

    it("rules are ordered by priority", () => {
      for (let i = 1; i < POLICY_RULES_DISPLAY.length; i++) {
        expect(POLICY_RULES_DISPLAY[i].priority).toBeGreaterThan(
          POLICY_RULES_DISPLAY[i - 1].priority,
        );
      }
    });
  });
});

// ─── Scenario Tests ──────────────────────────────────────

describe("gate scenarios", () => {
  it("getScenario returns a fresh object each time", () => {
    const a1 = getScenario("normal-purchase");
    const a2 = getScenario("normal-purchase");
    expect(a1.id).not.toBe(a2.id);
    // Timestamps may be identical within the same millisecond — IDs are the uniqueness guarantee
    expect(a1).not.toBe(a2); // Different object references
  });

  it("getScenario returns correct scenario data", () => {
    const normal = getScenario("normal-purchase");
    expect(normal.transaction.amount).toBe(45);
    expect(normal.agent.name).toBe("ProcureBot");

    const overLimit = getScenario("over-limit");
    expect(overLimit.transaction.amount).toBe(500);

    const injection = getScenario("prompt-injection");
    expect(injection.transaction.amount).toBe(5000);
    expect(injection.transaction.recipient.verified).toBe(false);
  });

  it("isValidScenarioId accepts valid IDs", () => {
    expect(isValidScenarioId("normal-purchase")).toBe(true);
    expect(isValidScenarioId("over-limit")).toBe(true);
    expect(isValidScenarioId("prompt-injection")).toBe(true);
  });

  it("isValidScenarioId rejects invalid IDs", () => {
    expect(isValidScenarioId("invalid")).toBe(false);
    expect(isValidScenarioId("")).toBe(false);
    expect(isValidScenarioId("NORMAL-PURCHASE")).toBe(false);
  });

  it("getScenarioMeta returns metadata for all 3 scenarios", () => {
    const meta = getScenarioMeta();
    expect(meta.length).toBe(3);
    expect(meta.map((m) => m.id)).toEqual([
      "normal-purchase",
      "over-limit",
      "prompt-injection",
    ]);
  });
});

// ─── Hash Tests ──────────────────────────────────────────

describe("gate hashing", () => {
  it("sha256 produces consistent hashes", () => {
    const hash1 = sha256("hello world");
    const hash2 = sha256("hello world");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex = 64 chars
  });

  it("sha256 produces different hashes for different inputs", () => {
    const hash1 = sha256("hello");
    const hash2 = sha256("world");
    expect(hash1).not.toBe(hash2);
  });

  it("deterministicStringify sorts keys consistently", () => {
    const obj1 = { b: 2, a: 1 };
    const obj2 = { a: 1, b: 2 };
    expect(deterministicStringify(obj1)).toBe(deterministicStringify(obj2));
  });

  it("deterministicStringify handles nested objects", () => {
    const obj1 = { z: { b: 2, a: 1 }, a: 0 };
    const obj2 = { a: 0, z: { a: 1, b: 2 } };
    expect(deterministicStringify(obj1)).toBe(deterministicStringify(obj2));
  });

  it("hashObject is deterministic for same structure", () => {
    const obj1 = { name: "test", value: 42 };
    const obj2 = { value: 42, name: "test" };
    expect(hashObject(obj1)).toBe(hashObject(obj2));
  });

  it("hashObject produces valid SHA-256 hex", () => {
    const hash = hashObject({ test: true });
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("evidence pack hashes are deterministic", () => {
    // Simulate the receipt API flow with fixed data
    const request = getScenario("normal-purchase");
    // Fix the dynamic fields for determinism testing
    request.id = "fixed-id";
    request.timestamp = "2026-02-07T00:00:00.000Z";

    const eval1 = evaluatePolicy(request);
    const eval2 = evaluatePolicy(request);

    // Normalize dynamic fields for determinism testing
    eval1.timestamp = "2026-02-07T00:00:00.001Z";
    eval2.timestamp = "2026-02-07T00:00:00.001Z";
    eval1.evaluation_time_ms = 0;
    eval2.evaluation_time_ms = 0;

    const hash1 = hashObject(eval1);
    const hash2 = hashObject(eval2);
    expect(hash1).toBe(hash2);
  });
});
