export type Product = {
  id: string;
  name: string;
  oneLiner: string;
  businessImpact: string; // Business outcome line for conversion
  industry: string;
  featured?: boolean;
  stack: string[];
  proofPoints: string[];
  screenshot: { src: string; alt: string };
  details: {
    problem: string;
    approach: string[];
    outcomes: string[];
    role: string[];
    links: { label: string; href: string }[];
  };
};

export const products: Product[] = [
  {
    id: "truvesta",
    name: "Truvesta",
    oneLiner: "Real-time dealing desk intelligence for Forex/CFD brokers.",
    businessImpact: "Tamper-evident governance — hash-chained audit logs, DB-level immutability, CI that attacks its own invariants.",
    industry: "Fintech",
    featured: true,
    stack: ["Next.js", "PostgreSQL", "Prisma", "Realtime UI", "Audit Trail"],
    proofPoints: [
      "Hash-chained, synchronous audit events",
      "DB triggers block UPDATE/DELETE — even for DBAs",
      "Shadow-mode-only: no execution path exists",
    ],
    screenshot: { src: "/products/truvesta.png", alt: "Truvesta UI screenshot" },
    details: {
      problem:
        "Brokers need fast, explainable risk signals and defensible decision trails — but most systems enforce governance only at the application layer, leaving gaps a DBA or async failure can exploit.",
      approach: [
        "Hash-chained audit events written synchronously — business logic fails if the audit write fails",
        "DB-level immutability via UPDATE/DELETE triggers (017_audit_immutable.sql)",
        "Shadow mode as a hard invariant (INV-NO-EXECUTE) — no trade execution path exists",
        "CI runs invariants-verify.sh: actively attempts to violate each guarantee, fails the build if it succeeds",
        "Auth failures are audited, not just successes — forensic-grade event log",
      ],
      outcomes: [
        "Tamper-evident audit chain verifiable by any third party",
        "Zero shortcut paths — async audit writes were explicitly rejected",
        "Dealer-first dashboards: signal → decision → immutable trail",
      ],
      role: ["Architecture", "Frontend", "Backend", "Data model", "Governance"],
      links: [
        { label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" },
      ],
    },
  },
  {
    id: "ardura",
    name: "Ardura",
    oneLiner: "AI-native CRM with churn prediction and retention automation.",
    businessImpact: "AI recommends, humans decide — churn signals route to operators, never auto-execute, with full evaluation traces.",
    industry: "Fintech",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Segmentation", "Automation"],
    proofPoints: [
      "AI predictions surfaced, never auto-executed",
      "Every automation rule carries an evaluation trace",
      "Component reuse from Truvesta governance stack",
    ],
    screenshot: { src: "/products/ardura.png", alt: "Ardura UI screenshot" },
    details: {
      problem:
        "Broker CRMs fail at retention because AI signals go straight to automation without operator judgment — creating liability and silent churn when models drift.",
      approach: [
        "Churn predictions surface as recommendations, never trigger actions directly",
        "Human-in-the-loop: operators approve, modify, or reject every automation rule",
        "Evaluation traces attached to every prediction — model confidence, input features, decision rationale",
        "Segment → action loops are auditable: who approved what, when, and why",
        "Component reuse from Truvesta governance stack — safety invariants preserved",
      ],
      outcomes: [
        "Zero autonomous actions — every retention intervention is operator-approved",
        "Auditable decision chain from churn signal to customer action",
        "Disciplined reuse without cutting governance",
      ],
      role: ["Product engineering", "Full-stack implementation"],
      links: [
        { label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" },
      ],
    },
  },
  {
    id: "equira",
    name: "Equira",
    oneLiner: "Sovereign AI workspace for multi-tenant agent orchestration.",
    businessImpact: "Every agent runs in a tenant-isolated cage with phase gates — no shared context, no silent failures, provenance on every output.",
    industry: "AI Infrastructure",
    stack: ["Next.js", "Python", "FastAPI", "Orchestration", "Evidence Packs"],
    proofPoints: [
      "Hard tenant isolation — no cross-tenant data leakage path",
      "Phase gates: agents cannot advance without verification",
      "Evidence packs attached to every workflow output",
    ],
    screenshot: { src: "/products/equira.png", alt: "Equira UI screenshot" },
    details: {
      problem:
        "Multi-tenant AI platforms routinely share context across boundaries and let agents chain unchecked — creating data leakage risk and unattributable failures.",
      approach: [
        "Tenant isolation enforced at the orchestration layer — no shared agent memory or cross-tenant context",
        "Phase gates between agent steps: output must pass verification before the next agent runs",
        "Evidence packs (receipts + provenance) attached to every workflow completion",
        "Structured handoffs with explicit input/output contracts — no implicit state passing",
        "Failure stops the chain — agents cannot skip gates or self-promote to the next phase",
      ],
      outcomes: [
        "Zero cross-tenant data exposure by design, not configuration",
        "Every workflow output is traceable to its inputs and agent decisions",
        "Governance patterns from Truvesta/Ardura generalized into reusable infrastructure",
      ],
      role: ["Architecture", "Orchestration design", "Platform build"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
  {
    id: "scanminers",
    name: "Scanminers",
    oneLiner: "AI-powered mineral exploration targeting.",
    businessImpact: "AI generates hypotheses, never conclusions — every targeting output carries structured uncertainty and requires geologist sign-off.",
    industry: "Mining / GeoTech",
    stack: ["Geodata", "AI/RAG", "Workflows", "Next.js"],
    proofPoints: [
      "AI outputs framed as hypotheses, never conclusions",
      "Structured uncertainty on every targeting recommendation",
      "Range proof: governance thinking applied outside fintech",
    ],
    screenshot: {
      src: "/products/scanminers.png",
      alt: "Scanminers UI screenshot",
    },
    details: {
      problem:
        "Mineral exploration depends on fragmentary geodata interpreted by domain experts — AI that presents high-confidence conclusions from incomplete data creates false certainty and misallocated drill spend.",
      approach: [
        "AI outputs are labeled as hypotheses with explicit confidence bounds and data-coverage gaps",
        "No targeting recommendation ships without structured uncertainty metadata",
        "Geologist review gate: expert sign-off required before any hypothesis advances to planning",
        "RAG ingestion preserves source provenance — every extracted fact links back to its origin document",
        "System designed to surface what it doesn't know, not just what it thinks it knows",
      ],
      outcomes: [
        "Zero false-certainty outputs — every recommendation visibly declares its limits",
        "Governance patterns proven transferable outside fintech into high-stakes physical domains",
        "Faster hypothesis generation without faster wrong decisions",
      ],
      role: ["System design", "AI workflow engineering"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
  {
    id: "finura",
    name: "Finura",
    oneLiner: "Multi-tenant trading education marketplace.",
    businessImpact: "Tenant-isolated academies with content governance — no performance claims without disclaimers, progress auditable by design.",
    industry: "EdTech",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Multi-tenant"],
    proofPoints: [
      "Content governance: no trading performance claims without disclaimers",
      "Tenant isolation: academies cannot access each other's learner data",
      "Factory-pattern academy creation with compliance defaults",
    ],
    screenshot: { src: "/products/finura.png", alt: "Finura UI screenshot" },
    details: {
      problem:
        "Trading education platforms routinely make implicit performance promises and lack content boundaries — creating regulatory and reputational risk for operators.",
      approach: [
        "Content governance layer: trading-related claims require explicit risk disclaimers",
        "Strict tenant isolation — academies share infrastructure but never learner data or content",
        "Compliance-ready defaults baked into academy creation, not bolted on after launch",
      ],
      outcomes: [
        "Academy operators inherit governance posture without manual configuration",
        "Zero cross-tenant learner data exposure",
      ],
      role: ["Architecture", "Platform implementation", "Governance"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
  {
    id: "chessio",
    name: "Chessio",
    oneLiner: "AI-guided chess academy with structured curriculum.",
    businessImpact: "Progression earned through demonstrated skill, not engagement metrics — incentives aligned to learning, not retention.",
    industry: "EdTech",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Curriculum Engine"],
    proofPoints: [
      "Progression gated by skill demonstration, not time-on-platform",
      "Product taste + fast MVP shipping",
    ],
    screenshot: { src: "/products/chessio.png", alt: "Chessio UI screenshot" },
    details: {
      problem:
        "Most learning platforms optimize for engagement metrics, creating incentive misalignment where learners advance without demonstrating competence.",
      approach: [
        "Structured curriculum with skill-gated progression — advancement requires demonstrated ability",
        "Guided practice loops designed around learning outcomes, not session duration",
      ],
      outcomes: ["Learner progression reflects actual skill, not platform stickiness"],
      role: ["Product build", "Full-stack"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
];
