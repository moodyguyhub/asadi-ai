export type Product = {
  id: string;
  name: string;
  oneLiner: string;
  businessImpact: string; // Business outcome line for conversion
  industry: string;
  builtIn: string; // e.g., "3 weeks"
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
    builtIn: "3 weeks",
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
    builtIn: "2 weeks",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Segmentation", "Automation"],
    proofPoints: [
      "AI predictions surfaced, never auto-executed",
      "Every automation rule carries an evaluation trace",
      "Component reuse from Truvesta — 2-week build",
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
        "Component reuse from Truvesta governance stack — shipped in 2 weeks without cutting safety",
      ],
      outcomes: [
        "Zero autonomous actions — every retention intervention is operator-approved",
        "Auditable decision chain from churn signal to customer action",
        "2-week delivery via disciplined reuse, not scope cuts",
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
    businessImpact: "Governed multi-tenant execution for AI workflows (auditability by default).",
    industry: "AI Infrastructure",
    builtIn: "4 weeks",
    stack: ["Next.js", "Python", "FastAPI", "Orchestration", "Evidence Packs"],
    proofPoints: ["Structured handoffs", "Receipts + provenance mindset"],
    screenshot: { src: "/products/equira.png", alt: "Equira UI screenshot" },
    details: {
      problem:
        "Teams struggle to scale AI usage safely without governance, traceability, and consistent workflows.",
      approach: [
        "Multi-agent orchestration with clear phase gates",
        "Evidence-first workflows (receipts, provenance)",
      ],
      outcomes: ["A repeatable system to ship faster without losing control"],
      role: ["Architecture", "Orchestration design", "Platform build"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
  {
    id: "scanminers",
    name: "Scanminers",
    oneLiner: "AI-powered mineral exploration targeting.",
    businessImpact: "Faster hypothesis generation from fragmented geodata (accelerates exploration cycles).",
    industry: "Mining / GeoTech",
    builtIn: "Ongoing",
    stack: ["Geodata", "AI/RAG", "Workflows", "Next.js"],
    proofPoints: ["Range proof: applied AI outside fintech"],
    screenshot: {
      src: "/products/scanminers.png",
      alt: "Scanminers UI screenshot",
    },
    details: {
      problem:
        "Exploration work is research-heavy and fragmented across datasets and expert judgment.",
      approach: [
        "Knowledge workflows for research ingestion",
        "Structured outputs for targeting hypotheses",
      ],
      outcomes: ["A faster path from data → hypothesis → review"],
      role: ["System design", "AI workflow engineering"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
  {
    id: "finura",
    name: "Finura",
    oneLiner: "Multi-tenant trading education marketplace.",
    businessImpact: "Scalable academy creation with compliance-ready governance (reduces platform risk).",
    industry: "EdTech",
    builtIn: "3 weeks",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Multi-tenant"],
    proofPoints: ["Governance-first approach", "Factory-like academy creation"],
    screenshot: { src: "/products/finura.png", alt: "Finura UI screenshot" },
    details: {
      problem:
        "Education platforms often lack governance and safety boundaries, especially in trading contexts.",
      approach: [
        "Multi-tenant architecture + strict access boundaries",
        "Risk-first posture (no hype, no execution claims)",
      ],
      outcomes: ["An academy factory designed for trust and compliance posture"],
      role: ["Architecture", "Platform implementation", "Governance"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
  {
    id: "chessio",
    name: "Chessio",
    oneLiner: "AI-guided chess academy with structured curriculum.",
    businessImpact: "Engagement through structured progression (reduces learner drop-off).",
    industry: "EdTech",
    builtIn: "2 weeks",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Curriculum Engine"],
    proofPoints: ["Product taste + learning design", "Fast MVP shipping"],
    screenshot: { src: "/products/chessio.png", alt: "Chessio UI screenshot" },
    details: {
      problem:
        "Most chess learning is unstructured; learners need a clear progression with feedback.",
      approach: ["Structured curriculum + guided practice loops"],
      outcomes: ["A gamified learning experience built around progression"],
      role: ["Product build", "Full-stack"],
      links: [{ label: "Request Demo", href: "https://cal.com/ctoalpha/deep-dive" }],
    },
  },
];
