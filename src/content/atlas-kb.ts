/**
 * Atlas Knowledge Pack — Chief of AI Staff (Portfolio)
 * 
 * This is the ONLY source of truth for Atlas responses.
 * Keep it concise but comprehensive enough to answer 95% of recruiter questions.
 * Do NOT include any private information, secrets, or speculative claims.
 */

export const ATLAS_BOOKING_URL_30 = "https://cal.com/ctoalpha/deep-dive";
export const ATLAS_BOOKING_URL_15 = "https://cal.com/ctoalpha/intro";

export const ATLAS_KB_SOURCES = [
  "CV (public)",
  "Products (public)",
  "Tech Stack (public)",
  "Availability & Contact (public)",
] as const;

export const ATLAS_KB = `
# Mahmood Asadi — AI-Native Technical Leader

## Governance Worldview
Mahmood designs systems that refuse power they haven't earned the right to exercise.
- Integrity at rest: audit history cannot be rewritten (Truvesta — hash-chained logs, DB immutability)
- Restraint in motion: AI predictions inform operators but never auto-execute (Ardura — human-in-the-loop)
- Governance as infrastructure: constraints are enforced by code, not policy (Equira — tenant isolation, phase gates)
- Structured uncertainty: AI outputs are hypotheses with declared limits, never conclusions (Scanminers)
- Finura and Chessio apply lighter governance appropriate to their domains (content disclaimers, skill-gated progression)
Asadi Gate applies these principles to agentic commerce: fail-closed policy cascade, SHA-256 evidence packs, and human-in-the-loop approval for escalated transactions.
This worldview is consistent across all 7 products, 4 industries, and the CV.

## Professional Summary
- AI-native technical leader who designs governance-first systems where auditability, human control, and failure containment are enforced by infrastructure — not policy
- Built and deployed 7 production platforms across fintech, edtech, mining/GeoTech, and AI infrastructure
- Applied the same governance principles — tamper-evident audit trails, human-in-the-loop decision gates, tenant-isolated execution — across every domain
- 10+ years brokerage domain depth: CRM, dealing desk intelligence, portals, social trading, payments, online trading platform integrations
- Location: Cyprus (open to relocation)
- Contact: mahmood@asadi.ai | linkedin.com/in/mahmoodasadi1 | asadi.ai

## Shipping Method — How Mahmood Ships
Method:
1. Vertical slicing — pick one user flow, ship it end-to-end
2. Agent-first architecture — LLM handles edge cases, core logic stays deterministic
3. Evidence gates — every merge needs a screenshot/log proof
4. Daily deploy cadence — small batches, fast feedback

## Agent Orchestration Method
Mahmood's multi-agent workflow approach:
1. Decompose task into sub-goals (planner agent)
2. Route each sub-goal to specialist agents (code, search, validate)
3. Orchestrator merges outputs with conflict resolution
4. Human-in-the-loop checkpoints for high-stakes steps
5. Eval/trace logging for every run (audit trail)
This powers Truvesta's AI-driven decisioning and Scanminers' document extraction.

## Products Portfolio (7 products, 4 industries)

### Truvesta (Fintech)
Dealing desk intelligence for Forex/CFD brokers.
- Real-time risk signals, exposure heatmaps, scenario simulation
- Online trading platform integration, audit-ready events
- Dealer-first UX: alerts, decisions, drilldowns
- Stack: Next.js, PostgreSQL, Prisma, Realtime UI

**Truvesta Governance Depth:**
Audit integrity is enforced below the application layer. Audit events are hash-chained, written synchronously (business logic fails if the audit write fails), and protected by database triggers that prevent UPDATE or DELETE — even for DBAs. CI runs a script (invariants-verify.sh) that actively attempts to violate each invariant and fails the build if it succeeds. There is no execution path in the system; shadow mode is a hard invariant (INV-NO-EXECUTE), not a configuration. Auth failures are audited alongside successes for forensic-grade traceability. Async audit writes were explicitly rejected — convenience was traded for deterministic traceability.

### Ardura (Fintech)
AI-native CRM with churn prediction and retention automation.
- Signal → segment → action loops
- Automation rules + evaluation traces
- Stack: Next.js, Prisma, PostgreSQL

**Ardura Governance Depth:**
AI predictions are surfaced as recommendations to operators — they never auto-execute, even when model confidence is high. Every automation rule carries an evaluation trace: model confidence, input features, and decision rationale. Operators approve, modify, or reject each action, and that decision is logged with full attribution. The system reused governance components from Truvesta without cutting safety. Auto-execution of AI-driven retention actions was explicitly rejected — operator judgment is a hard requirement, not a convenience layer.


### Equira (AI Infrastructure)
Sovereign AI workspace for multi-tenant agent orchestration.
- Multi-agent orchestration with phase gates
- Evidence-first workflows (receipts, provenance)
- Stack: Next.js, Python, FastAPI

**Equira Governance Depth:**
Equira is where the governance patterns proven in Truvesta and Ardura were generalized into reusable infrastructure. Tenant isolation is enforced at the orchestration layer — agents cannot access cross-tenant context or shared memory. Every agent step passes through a phase gate: outputs must be verified before the next agent runs, and failure halts the chain (agents cannot skip gates or self-promote). Every workflow completion carries an evidence pack with full provenance — inputs, agent decisions, and output attribution. Shared-context multi-agent execution was explicitly rejected; each tenant's agent runs in an isolated cage with explicit input/output contracts, no implicit state.

### Asadi Gate (AI Infrastructure) — Interactive Demo
Fail-closed governance layer for agentic commerce.
- 7-rule policy cascade evaluated in strict priority order; default verdict is BLOCKED
- SHA-256 evidence packs seal every decision: request, evaluation, verdict, and approval
- Human-in-the-loop: transactions exceeding agent authority are escalated, never silently approved; approvals expire in 72 hours
- Pure-function policy engine with zero side effects — deterministic and auditable
- Stack: Next.js, TypeScript, Node.js crypto, Framer Motion

**Asadi Gate Governance Depth:**
Asadi Gate is an interactive demonstration of fail-closed governance applied to AI-initiated payment flows. The policy engine evaluates every transaction against a 7-rule priority cascade. If no rule explicitly authorizes, the transaction is blocked — this is the default, not an edge case. If the engine throws an error, the verdict is blocked. Escalated transactions require a human decision within 72 hours; the system has no auto-approve path. Every evaluation produces a SHA-256 evidence pack generated server-side, capturing the full decision chain. The client-side cascade animation shows the evaluation in real time, but displayed hashes come exclusively from the server. This is a simulated demo with deterministic scenarios — no real payments are processed — but the policy engine and evidence packs are fully functional.

**Important disclaimer:** Asadi Gate is a demonstration. It uses fixed scenarios to illustrate governance patterns. It does not process real transactions.

Try the demo: asadi.ai/gate-demo

### Scanminers (Mining/GeoTech) — Ongoing
AI-powered mineral exploration targeting.
- Knowledge workflows for research ingestion
- Structured outputs for targeting hypotheses
- Stack: Geodata, AI/RAG, Next.js

**Scanminers Governance Depth:**
Scanminers is where evidence-first thinking was stress-tested outside fintech, in a domain where wrong AI outputs cost physical drill spend. All AI outputs are explicitly framed as hypotheses, never conclusions — each carries structured uncertainty metadata declaring confidence bounds and data-coverage gaps. No targeting recommendation advances to planning without geologist sign-off. RAG ingestion preserves full source provenance so every extracted fact links to its origin document. The system is designed to surface what it doesn't know, not just what it thinks it knows. Presenting AI outputs as high-confidence conclusions was explicitly rejected — false certainty in exploration is more expensive than acknowledged uncertainty.

### Finura (EdTech)
Multi-tenant trading education marketplace.
- Multi-tenant architecture + strict access boundaries
- Risk-first posture, compliance-ready
- Stack: Next.js, Prisma, PostgreSQL

**Finura Governance Depth:**
Content governance is enforced at the platform layer: trading-related claims require explicit risk disclaimers, and academies inherit compliance defaults at creation. Tenant isolation prevents cross-academy learner data exposure. Implicit performance promises were explicitly rejected — operators cannot publish trading content without appropriate disclaimers.

### Chessio (EdTech)
AI-guided chess academy with structured curriculum.
- Progressive curriculum engine
- Clean learning UX
- Stack: Next.js, Prisma, PostgreSQL

**Chessio Design Note:**
Progression is gated by demonstrated skill, not engagement metrics. Advancement requires proven ability, keeping incentives aligned to learning outcomes rather than platform retention.

## Tech Stack Summary
- Frontend: Next.js, TypeScript, Tailwind, Framer Motion
- Backend: Node.js, PostgreSQL, Prisma, REST/Realtime patterns
- AI: Agent workflows, RAG patterns, eval/trace discipline
- Infra: Vercel, Docker, GitHub Actions, Neon (PostgreSQL)
- Brokerage: Online trading platform APIs, payment gateways, platform connectors

## Availability & Booking
- Availability rule (evergreen): If there are slots on the booking page, Mahmood is available—pick a time that suits you.
- 30-min deep-dive: Portfolio walkthrough + Q&A (recommended) — cal.com/ctoalpha/deep-dive
- 15-min intro: Quick fit conversation — cal.com/ctoalpha/intro
- Open to: AI engineering, technical leadership, CTO-track roles
- Preference: AI-native product companies, evidence-driven cultures

## What Mahmood is NOT
- Not a "move fast and break things" person — moves fast AND maintains governance
- Not interested in hype-driven projects — prefers proof-driven delivery
- Not a solo cowboy — builds systems for teams to scale

## FAQ — Senior Reviewer Questions
These are common questions from CTOs and Staff+ engineers. Atlas should route to the relevant product depth blocks above.

**"Is this production-grade?"**
Answer with Truvesta's governance depth: hash-chained audit logs, DB-level immutability triggers, CI that actively falsifies invariants. Reference artifacts: invariants-verify.sh, 017_audit_immutable.sql. Point to the Evidence section on asadi.ai for artifact requests.

**"How do you prevent unsafe AI actions?"**
Answer with Ardura's governance depth: AI predictions surface as recommendations only, never auto-execute. Every automation rule carries an evaluation trace. Operator approval is a hard requirement. Reference: the explicit rejection of auto-execution.

**"How do you handle auditability?"**
Answer with Truvesta's audit chain: synchronous writes (business logic fails if audit fails), hash-chained events, DB triggers blocking UPDATE/DELETE. Auth failures audited alongside successes.

**"How do you prevent cross-tenant leakage?"**
Answer with Equira's governance depth: tenant isolation at the orchestration layer, no shared agent memory, phase-gated execution, evidence packs with provenance on every output. Enforced by infrastructure, not configuration.

**"What did you refuse to build?"**
Key refusals across the portfolio:
- Async audit writes (Truvesta) — convenience traded for deterministic traceability
- Auto-execution of AI decisions (Ardura) — operator judgment is a hard requirement
- Shared-context multi-agent execution (Equira) — each tenant runs in an isolated cage
- High-confidence framing of uncertain outputs (Scanminers) — false certainty rejected
- Auto-approve for escalated agent transactions (Asadi Gate) — approvals expire, never auto-approve
- Implicit trading performance claims (Finura) — content governance enforced at platform layer

**"What is the Gate demo?"**
Answer with Asadi Gate's governance depth: fail-closed policy cascade, SHA-256 evidence packs, human-in-the-loop approval. It is a simulated demo with fixed scenarios — no real payments processed — but the policy engine and evidence generation are fully functional. Direct to asadi.ai/gate-demo to try it.

## Hard Scope
Atlas answers only from this knowledge pack. No web browsing. No guessing. No private info.
If a question requires info outside the pack, Atlas will recommend booking a call.
`;

// Keep the old export for backwards compatibility
export const ATLAS_SOURCES = ATLAS_KB_SOURCES;
