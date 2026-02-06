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

## Professional Summary
- AI-native technical leader shipping enterprise products fast without sacrificing governance
- Built and deployed 6 production platforms across fintech, edtech, mining/GeoTech, and AI infrastructure
- Uses vendor-neutral, LLM-assisted multi-agent workflows (structured handoffs, shared state, verification gates)
- 10+ years brokerage domain depth: CRM, dealing desk intelligence, portals, social trading, payments, online trading platform integrations
- Location: Cyprus (open to relocation)
- Contact: mahmood@asadi.ai | linkedin.com/in/mahmoodasadi1 | asadi.ai

## Shipping Velocity — How Mahmood Ships Fast
Ardura built in 2 weeks (component reuse from Truvesta). Truvesta built in 3 weeks (intensive cadence). Method:
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

## Products Portfolio (6 products, 4 industries)

### Truvesta (Fintech) — Built in 3 weeks
Dealing desk intelligence for Forex/CFD brokers.
- Real-time risk signals, exposure heatmaps, scenario simulation
- Online trading platform integration, audit-ready events
- Dealer-first UX: alerts, decisions, drilldowns
- Stack: Next.js, PostgreSQL, Prisma, Realtime UI

### Ardura (Fintech) — Built in 2 weeks
AI-native CRM with churn prediction and retention automation.
- Signal → segment → action loops
- Automation rules + evaluation traces
- Stack: Next.js, Prisma, PostgreSQL

### Equira (AI Infrastructure) — Built in 4 weeks
Sovereign AI workspace for multi-tenant agent orchestration.
- Multi-agent orchestration with phase gates
- Evidence-first workflows (receipts, provenance)
- Stack: Next.js, Python, FastAPI

### Scanminers (Mining/GeoTech) — Ongoing
AI-powered mineral exploration targeting.
- Knowledge workflows for research ingestion
- Structured outputs for targeting hypotheses
- Stack: Geodata, AI/RAG, Next.js

### Finura (EdTech) — Built in 3 weeks
Multi-tenant trading education marketplace.
- Multi-tenant architecture + strict access boundaries
- Risk-first posture, compliance-ready
- Stack: Next.js, Prisma, PostgreSQL

### Chessio (EdTech) — Built in 2 weeks
AI-guided chess academy with structured curriculum.
- Progressive curriculum engine
- Clean learning UX
- Stack: Next.js, Prisma, PostgreSQL

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

## Hard Scope
Atlas answers only from this knowledge pack. No web browsing. No guessing. No private info.
If a question requires info outside the pack, Atlas will recommend booking a call.
`;

// Keep the old export for backwards compatibility
export const ATLAS_SOURCES = ATLAS_KB_SOURCES;
