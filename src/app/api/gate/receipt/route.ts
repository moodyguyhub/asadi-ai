/**
 * Asadi Gate — Receipt API Route
 *
 * POST /api/gate/receipt
 *
 * Generates a cryptographic evidence pack for a given demo scenario.
 * Hashes are real SHA-256 computed from actual request and evaluation data.
 *
 * INV-REAL-RECEIPTS: SHA-256 hashes computed at runtime, never hardcoded.
 * INV-NO-EXECUTE:    No external API calls. No database writes. Stateless.
 * INV-NO-SECRETS:    No environment variables required.
 * INV-FAIL-CLOSED:   All error paths return BLOCKED-equivalent responses.
 */

import { NextResponse } from "next/server";
import { evaluatePolicy } from "@/lib/gate/policy-engine";
import { getScenario, isValidScenarioId } from "@/lib/gate/scenarios";
import { hashObject, sha256 } from "@/lib/gate/hash";
import type {
  EvidencePack,
  ApprovalRecord,
  ScenarioId,
} from "@/lib/gate/types";

export const runtime = "nodejs";

// ─── Rate Limiting (same pattern as src/app/api/atlas/route.ts) ───

const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

// ─── Input Validation ────────────────────────────────────

type ApprovalDecision = "APPROVED" | "REJECTED";

interface ReceiptRequestBody {
  scenario_id: ScenarioId;
  approval_decision?: ApprovalDecision;
}

function validateBody(
  body: unknown,
): { valid: true; data: ReceiptRequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object" };
  }

  const b = body as Record<string, unknown>;

  if (
    typeof b.scenario_id !== "string" ||
    !isValidScenarioId(b.scenario_id)
  ) {
    return {
      valid: false,
      error:
        "Invalid scenario_id. Must be one of: normal-purchase, over-limit, prompt-injection",
    };
  }

  if (b.approval_decision !== undefined) {
    if (
      b.approval_decision !== "APPROVED" &&
      b.approval_decision !== "REJECTED"
    ) {
      return {
        valid: false,
        error: "Invalid approval_decision. Must be APPROVED or REJECTED",
      };
    }
    if (b.scenario_id !== "over-limit") {
      return {
        valid: false,
        error:
          "approval_decision is only valid for the over-limit scenario",
      };
    }
  }

  return {
    valid: true,
    data: {
      scenario_id: b.scenario_id as ScenarioId,
      approval_decision: b.approval_decision as
        | ApprovalDecision
        | undefined,
    },
  };
}

// ─── Route Handler ───────────────────────────────────────

export async function POST(req: Request) {
  // Rate limiting
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "Too many requests. Please wait before generating another receipt.",
        code: "RATE_LIMITED",
      },
      { status: 429 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  // Validate
  const validation = validateBody(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error, code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const { scenario_id, approval_decision } = validation.data;

  try {
    // 1. Get scenario fixture → fresh GateRequest
    const request = getScenario(scenario_id);

    // 2. Run policy engine → PolicyEvaluation
    const evaluation = evaluatePolicy(request);

    // 3. Compute SHA-256 hashes (INV-REAL-RECEIPTS)
    const requestHash = hashObject(request);
    const evaluationHash = hashObject(evaluation);
    const receiptHash = sha256(requestHash + evaluationHash);

    // 4. Build approval record (only for REQUIRES_HUMAN_APPROVAL)
    let approval: ApprovalRecord | undefined;

    if (evaluation.verdict === "REQUIRES_HUMAN_APPROVAL") {
      const requestedAt = new Date();
      const expiresAt = new Date(
        requestedAt.getTime() + 72 * 60 * 60 * 1000,
      ); // 72 hours

      if (approval_decision) {
        approval = {
          decision_id: `approval-${Date.now()}`,
          status: approval_decision,
          requested_at: requestedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          decided_at: new Date().toISOString(),
          decided_by: "demo-reviewer",
          notes:
            approval_decision === "APPROVED"
              ? "Reviewed and approved — valid business need confirmed"
              : "Rejected — alternative procurement path required",
          auto_action: "EXPIRE", // Never auto-approve
        };
      } else {
        approval = {
          decision_id: `approval-${Date.now()}`,
          status: "PENDING",
          requested_at: requestedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
          auto_action: "EXPIRE", // Never auto-approve
        };
      }
    }

    // 5. Assemble evidence pack
    const evidencePack: EvidencePack = {
      version: "1.0.0",
      gate_id: `gate-${Date.now()}`,
      request_hash: requestHash,
      evaluation_hash: evaluationHash,
      receipt_hash: receiptHash,
      request,
      evaluation,
      ...(approval ? { approval } : {}),
      generated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      evidence_pack: evidencePack,
      download_url: null,
    });
  } catch (error) {
    // INV-FAIL-CLOSED: Even API errors result in a BLOCKED-equivalent response
    console.error("Gate receipt generation failed:", error);
    return NextResponse.json(
      {
        error:
          "Receipt generation failed — gate evaluation defaulted to BLOCKED",
        code: "SYSTEM_ERROR",
        verdict: "BLOCKED",
      },
      { status: 500 },
    );
  }
}
