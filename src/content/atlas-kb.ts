/**
 * Atlas Knowledge Pack
 * 
 * This is the ONLY source of truth for Atlas responses.
 * Keep it concise but comprehensive enough to answer 95% of recruiter questions.
 * Do NOT include any private information, secrets, or speculative claims.
 */

export const ATLAS_KB = `
# Mahmood Asadi — Portfolio Knowledge Pack

## Professional Summary
- Role: AI-Native Technical Leader / CTO-track engineer
- Focus: Building AI-powered products with enterprise-grade delivery
- Style: Proof-driven, evidence-first, no hype
- Location: Cyprus (open to relocation)
- Contact: mahmood@asadi.ai | linkedin.com/in/mahmoodasadi1 | asadi.ai

## Core Competencies
- Full-stack product engineering (Next.js, TypeScript, PostgreSQL, Prisma)
- AI/Agent architecture (RAG patterns, agent orchestration, eval/trace discipline)
- Rapid shipping (weeks, not months) with governance built-in
- Fintech depth (trading platforms, broker tools, compliance patterns)

## Shipping Velocity Philosophy
How I ship fast (3-week builds):
1. Vertical slicing — pick one user flow, ship it end-to-end
2. Agent-first architecture — LLM handles edge cases, I handle core logic
3. Evidence gates — every merge needs a screenshot/log proof
4. Daily deploy cadence — small batches, fast feedback
This is how Truvesta shipped in 3 weeks and Chessio in 2 weeks.

## Agent Workflow Pattern
My agent orchestration approach:
1. Decompose task into sub-goals (planner agent)
2. Route each sub-goal to specialist agents (code, search, validate)
3. Orchestrator merges outputs with conflict resolution
4. Human-in-the-loop checkpoints for high-stakes steps
5. Eval/trace logging for every run (audit trail)
This powers Truvesta's AI-driven decisioning and Scanminers' document extraction.

## Products Portfolio (6 products, 4 industries)

### Truvesta (Fintech) — Built in 3 weeks
Real-time dealing desk intelligence for Forex/CFD brokers.
- Dealer-first UX: alerts, decisions, drilldowns
- Audit-ready events and evaluation traces
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
- Infra: CI gates, audit trails, security-first defaults

## Availability & Booking
- Availability: Check cal.com/ctoalpha for open slots. If slots are available, I'm open to conversations.
- 30-min deep-dive: Portfolio walkthrough + Q&A (recommended) — cal.com/ctoalpha/deep-dive
- 15-min intro: Quick fit conversation — cal.com/ctoalpha/intro
- Open to: AI engineering, technical leadership, CTO-track roles
- Preference: AI-native product companies, evidence-driven cultures

## What I'm NOT
- Not a "move fast and break things" person — I move fast AND maintain governance
- Not interested in hype-driven projects — I prefer proof-driven delivery
- Not a solo cowboy — I build systems for teams to scale

## FAQs

Q: How did you build Truvesta in 3 weeks?
A: Vertical slicing + agent-first architecture + evidence gates + daily deploys. Picked one dealer flow, shipped end-to-end, iterated daily.

Q: What's your availability?
A: If you see slots on cal.com/ctoalpha, I'm available. Book whichever format suits you.

Q: Are you open to relocation?
A: Yes, currently in Cyprus but open to relocation for the right role.

Q: What industries have you worked in?
A: Fintech (trading platforms, broker tools), AI Infrastructure, EdTech, and Mining/GeoTech. Range demonstrates I can apply AI to any domain.

Q: What's your ideal role?
A: CTO-track or senior AI engineering at a company that values proof-driven delivery and has real problems to solve.
`;

export const ATLAS_SOURCES = [
  "CV",
  "Products: Truvesta",
  "Products: Ardura", 
  "Products: Equira",
  "Products: Scanminers",
  "Products: Finura",
  "Products: Chessio",
  "Stack",
  "Availability",
  "FAQs",
];
