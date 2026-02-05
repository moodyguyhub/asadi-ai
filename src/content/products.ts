export type Product = {
  id: string;
  name: string;
  oneLiner: string;
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
    industry: "Fintech",
    builtIn: "3 weeks",
    featured: true,
    stack: ["Next.js", "PostgreSQL", "Prisma", "Realtime UI", "Audit Trail"],
    proofPoints: [
      "Decisioning + audit trail emphasis",
      "Dealer-centric dashboards",
      "Evidence-first delivery",
    ],
    screenshot: { src: "/products/truvesta.png", alt: "Truvesta UI screenshot" },
    details: {
      problem:
        "Brokers need fast, explainable risk signals and defensible decision trails without slowing dealer operations.",
      approach: [
        "Dealer-first UX: alerts, decisions, drilldowns",
        "Audit-ready events and evaluation traces",
        "Safe demo modes + staged proof checkpoints",
      ],
      outcomes: [
        "End-to-end story demo flow: signal → decision → audit trail",
        "High-signal dashboards aligned to dealing desk workflows",
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
    industry: "Fintech",
    builtIn: "2 weeks",
    stack: ["Next.js", "Prisma", "PostgreSQL", "Segmentation", "Automation"],
    proofPoints: ["Retention workflows", "Predictive signals (planned/iterative)"],
    screenshot: { src: "/products/ardura.png", alt: "Ardura UI screenshot" },
    details: {
      problem:
        "Broker CRMs often fail to drive retention because insights and actions are disconnected.",
      approach: [
        "Signal → segment → action loops",
        "Automation rules + evaluation traces (governable)",
      ],
      outcomes: ["Operational visibility and actionability designed into the UI"],
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
