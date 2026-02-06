import { ATLAS_BOOKING_URL_30, ATLAS_KB, ATLAS_KB_SOURCES } from "@/content/atlas-kb";

export type Topic =
  | "products.truvesta"
  | "products.ardura"
  | "products.equira"
  | "products.scanminers"
  | "products.finura"
  | "products.chessio"
  | "stack"
  | "shipping"
  | "orchestration"
  | "governance"
  | "availability"
  | "capabilities"
  | "general";

export type SourceLabel = (typeof ATLAS_KB_SOURCES)[number];

export function isCapabilitiesQuery(message: string): boolean {
  return /(what can you answer|what can you do|capabilit(y|ies)|help|scope|sources?)/i.test(message);
}

export function isHardOutOfScopeQuery(message: string): boolean {
  const m = (message || "").toLowerCase();
  // Explicitly out-of-pack / private / sensitive / unrelated requests
  if (/\bsalary\b|\bcompensation\b|\bexpected pay\b|\brate\b|\bday rate\b|\bhourly\b|\bpackage\b/.test(m)) return true;
  if (/private metrics|client names|customers?|revenue|arr|mrr|profit|profitability|nda|confidential|internal/.test(m)) return true;
  if (/write a full trading strategy|trading strategy|signals? generator|guaranteed returns|insider|front run/.test(m)) return true;
  return false;
}

export function capabilitiesMenuText(): string {
  return [
    "I can answer from Mahmood’s public portfolio pack:",
    "- Products: Truvesta, Ardura, Equira, Scanminers, Finura, Chessio",
    "- Tech stack: Next.js/TypeScript/Tailwind, Node/PostgreSQL/Prisma, Vercel, etc",
    "- Shipping method: vertical slicing, evidence gates, daily deploy cadence",
    "- Availability & roles: what Mahmood is open to + booking links",
    `If you need anything beyond the public pack, book a call: ${ATLAS_BOOKING_URL_30}`,
    "Sources: Products (public), Tech Stack (public), CV (public), Availability & Contact (public)",
  ].join("\n");
}

export function pickTopics(message: string): Topic[] {
  const m = (message || "").toLowerCase();
  const topics: Topic[] = [];

  if (isCapabilitiesQuery(message)) topics.push("capabilities");

  // Availability/booking (avoid false-positive 'chatbot')
  if (/\bquick chat\b|\bbook\b|\bbooking\b|\bintro\b|deep-?dive|cal\.com|available|availability|open to|roles?|relocat|contact|email|linkedin/.test(m)) {
    topics.push("availability");
  }

  // Products (with synonyms)
  if (/\btruvesta\b|dealing desk|dealer|exposure|heatmap|trading platform|forex|cfd|risk signals?/.test(m)) topics.push("products.truvesta");
  if (/\bardura\b|\bcrm\b|broker crm|churn|retention|segment/.test(m)) topics.push("products.ardura");
  if (/\bequira\b|sovereign ai|workspace|multi-tenant agent|phase gates/.test(m)) topics.push("products.equira");
  if (/\bscanminers\b|mineral|geotech|exploration|targeting/.test(m)) topics.push("products.scanminers");

  // "academy" is ambiguous; only route if context matches.
  if (/\bfinura\b|trading education|education marketplace|multi-tenant.*education/.test(m) || (/\bacademy\b/.test(m) && /(trading|education|course|marketplace)/.test(m))) {
    topics.push("products.finura");
  }
  if (/\bchessio\b|\bchess\b|chess academy|curriculum/.test(m)) topics.push("products.chessio");

  // Core topics
  if (/stack|tech|typescript|next\.?js|tailwind|framer|node\.?js|postgres|prisma|vercel|docker|github actions|neon/.test(m)) topics.push("stack");
  if (/ship|shipped|weeks|velocity|cadence|evidence gates|vertical slicing|daily deploy/.test(m)) topics.push("shipping");
  if (/agent|multi-agent|orchestrat|workflow|planner|specialist|eval|trace|audit trail/.test(m)) topics.push("orchestration");

  // Governance / senior reviewer questions
  if (/governance|audit|immutab|tamper|hash.?chain|invariant|production.?grade|tenant.?leak|cross.?tenant|isolation|fail.?closed|refus(e|ed|al)|human.?in.?the.?loop|unsafe ai|prevent.*action/.test(m)) {
    topics.push("governance");
  }

  // Mixed/compare queries: include stack context by default when comparing products.
  if (/compare|vs\.?/.test(m) && topics.some((t) => t.startsWith("products."))) topics.push("stack");

  if (topics.length === 0) topics.push("general");
  return Array.from(new Set(topics)).slice(0, 3);
}

type KBSection = { level: 2 | 3; title: string; content: string };

function parseKbSections(kb: string): KBSection[] {
  const lines = kb.split("\n");
  const sections: KBSection[] = [];
  let current: { level: 2 | 3; title: string; buf: string[] } | null = null;

  const push = () => {
    if (!current) return;
    sections.push({ level: current.level, title: current.title, content: current.buf.join("\n").trim() });
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)\s*$/);
    const h3 = line.match(/^###\s+(.+)\s*$/);
    if (h2) {
      push();
      current = { level: 2, title: h2[1].trim(), buf: [line] };
      continue;
    }
    if (h3) {
      push();
      current = { level: 3, title: h3[1].trim(), buf: [line] };
      continue;
    }
    if (!current) continue;
    current.buf.push(line);
  }
  push();
  return sections;
}

function findSection(sections: KBSection[], matcher: (s: KBSection) => boolean): string | null {
  const s = sections.find(matcher);
  return s?.content || null;
}

export function buildKbForTopics(topics: Topic[]): { kb: string; sources: SourceLabel[] } {
  const sections = parseKbSections(ATLAS_KB);

  const always: string[] = [];
  const chosen: string[] = [];
  const sources = new Set<SourceLabel>();

  const professionalSummary = findSection(sections, (s) => s.level === 2 && s.title.startsWith("Professional Summary"));
  if (professionalSummary) {
    always.push(professionalSummary);
    sources.add("CV (public)");
  }

  const shipping = findSection(sections, (s) => s.level === 2 && s.title.startsWith("Shipping Velocity"));
  const orchestration = findSection(sections, (s) => s.level === 2 && s.title.startsWith("Agent Orchestration Method"));
  const techStack = findSection(sections, (s) => s.level === 2 && s.title.startsWith("Tech Stack Summary"));
  const availability = findSection(sections, (s) => s.level === 2 && s.title.startsWith("Availability & Booking"));

  const product = (titleStartsWith: string) =>
    findSection(sections, (s) => s.level === 3 && s.title.toLowerCase().startsWith(titleStartsWith.toLowerCase()));

  const addProduct = (t: string) => {
    const sec = product(t);
    if (sec) chosen.push(sec);
    sources.add("Products (public)");
  };

  for (const topic of topics) {
    if (topic === "shipping" && shipping) {
      chosen.push(shipping);
      sources.add("CV (public)");
    }
    if (topic === "orchestration" && orchestration) {
      chosen.push(orchestration);
      sources.add("CV (public)");
    }
    if (topic === "stack" && techStack) {
      chosen.push(techStack);
      sources.add("Tech Stack (public)");
    }
    if (topic === "availability" && availability) {
      chosen.push(availability);
      sources.add("Availability & Contact (public)");
    }

    if (topic === "governance") {
      // Include governance worldview, FAQ, and all governance-heavy products
      const worldview = findSection(sections, (s) => s.level === 2 && s.title.startsWith("Governance Worldview"));
      const faq = findSection(sections, (s) => s.level === 2 && s.title.startsWith("FAQ"));
      if (worldview) chosen.push(worldview);
      if (faq) chosen.push(faq);
      // Include Truvesta + Ardura + Equira as primary governance products
      const truvestaSection = product("Truvesta");
      const arduraSection = product("Ardura");
      const equiraSection = product("Equira");
      if (truvestaSection) chosen.push(truvestaSection);
      if (arduraSection) chosen.push(arduraSection);
      if (equiraSection) chosen.push(equiraSection);
      sources.add("Products (public)");
      sources.add("CV (public)");
    }

    if (topic === "products.truvesta") addProduct("Truvesta");
    if (topic === "products.ardura") addProduct("Ardura");
    if (topic === "products.equira") addProduct("Equira");
    if (topic === "products.scanminers") addProduct("Scanminers");
    if (topic === "products.finura") addProduct("Finura");
    if (topic === "products.chessio") addProduct("Chessio");
  }

  // If this is a product query and stack wasn't explicitly requested, include it anyway.
  if (topics.some((t) => t.startsWith("products.")) && !topics.includes("stack") && techStack) {
    chosen.push(techStack);
    sources.add("Tech Stack (public)");
  }

  // Broad/general: include stack + shipping, plus keep Products label available.
  if (topics.includes("general")) {
    if (techStack) {
      chosen.push(techStack);
      sources.add("Tech Stack (public)");
    }
    if (shipping) {
      chosen.push(shipping);
      sources.add("CV (public)");
    }
    sources.add("Products (public)");
  }

  const kb = [...always, ...Array.from(new Set(chosen)).filter(Boolean)].filter(Boolean).join("\n\n");
  const sourceList = Array.from(sources);

  return {
    kb,
    sources: sourceList.length ? sourceList : ["CV (public)"],
  };
}

export function ensureSourcesSuffix(text: string, sources: SourceLabel[]): string {
  const t = (text || "").toString().trim();
  if (!t) return t;
  if (/\nSources:\s*/i.test(t)) return t;
  return `${t}\nSources: ${sources.join(", ")}`;
}
