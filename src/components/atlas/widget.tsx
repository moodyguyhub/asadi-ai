"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "@/content/products";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "atlas"; text: string; sources?: { label: string; href: string }[] };

function answerFromSite(question: string, products: Product[]): Msg {
  const q = question.toLowerCase();

  const sources = [{ label: "Products", href: "#work" }, { label: "About", href: "#about" }, { label: "Stack", href: "#stack" }, { label: "Contact", href: "#contact" }];

  // How did you ship X in Y weeks?
  if ((q.includes("ship") || q.includes("build") || q.includes("fast")) && (q.includes("week") || q.includes("days") || q.includes("quickly"))) {
    return {
      role: "atlas",
      text: `Shipping fast comes down to a tight loop:

1. Vertical slicing — pick one user flow, ship it end-to-end
2. Agent-first architecture — LLM handles edge cases, I handle core logic
3. Evidence gates — every merge needs a screenshot/log proof
4. Daily deploy cadence — small batches, fast feedback

Truvesta (3 weeks) and Chessio (2 weeks) both followed this pattern. Happy to walk through specifics on a call.`,
      sources: [{ label: "Truvesta", href: "#work" }, { label: "Chessio", href: "#work" }],
    };
  }

  // Agent workflow question
  if (q.includes("agent") && (q.includes("workflow") || q.includes("orchestr"))) {
    return {
      role: "atlas",
      text: `Agent workflow pattern I use:

1. Decompose task into sub-goals (planner agent)
2. Route each sub-goal to specialist agents (code, search, validate)
3. Orchestrator merges outputs with conflict resolution
4. Human-in-the-loop checkpoints for high-stakes steps
5. Eval/trace logging for every run (audit trail)

This powers Truvesta's AI-driven valuations and Scanminers' document extraction.`,
      sources: [{ label: "Stack", href: "#stack" }, { label: "Products", href: "#work" }],
    };
  }

  if (q.includes("products") || q.includes("built") || q.includes("work")) {
    const list = products.map((p) => `• ${p.name} — ${p.oneLiner}`).join("\n");
    return { role: "atlas", text: `Mahmood's products on this site:\n${list}`, sources };
  }

  if (q.includes("stack") || q.includes("tech")) {
    return {
      role: "atlas",
      text:
        "Core stack (as presented on this site): Next.js + TypeScript + Tailwind, Postgres/Prisma patterns, agent workflows, and evidence-first delivery discipline.",
      sources,
    };
  }

  if (q.includes("available") || q.includes("hire") || q.includes("roles") || q.includes("currently")) {
    return {
      role: "atlas",
      text:
        "If you see slots on the booking page, I'm available—pick a time that suits you. Open to AI engineering, technical leadership, or CTO-track roles.",
      sources,
    };
  }

  const match = products.find((p) => q.includes(p.name.toLowerCase()) || q.includes(p.id));
  if (match) {
    return {
      role: "atlas",
      text:
        `${match.name}: ${match.oneLiner}\nBuilt in: ${match.builtIn}\nIndustry: ${match.industry}\nNotes: ${match.details.problem}`,
      sources: [{ label: `${match.name}`, href: "#work" }],
    };
  }

  return {
    role: "atlas",
    text:
      'I can answer from on-site info only. Try: "How did you ship Truvesta in 3 weeks?", "What\'s your agent workflow?", or "Are you currently available?"',
    sources,
  };
}

export function AtlasWidget({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "atlas", text: site.atlas.opening, sources: [{ label: "About", href: "#about" }] },
  ]);

  const chips = useMemo(() => site.atlas.chips, []);

  // Listen for external trigger (e.g., from hero "Ask Atlas" button)
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("atlas:open", handleOpen);
    return () => window.removeEventListener("atlas:open", handleOpen);
  }, []);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Msg = { role: "user", text: trimmed };
    const atlasMsg = answerFromSite(trimmed, products);
    setMsgs((m) => [...m, userMsg, atlasMsg]);
    setInput("");
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 glass glass-interactive rounded-2xl px-5 py-3.5 text-sm flex items-center gap-2.5 shadow-lg shadow-black/20 z-50 pb-safe"
        aria-label="Open Atlas"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--accent))] opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[rgb(var(--accent))]"></span>
        </span>
        <span className="font-semibold tracking-tight">Ask Atlas</span>
      </button>

      {open ? (
        <div className="fixed bottom-20 right-5 w-[92vw] max-w-md glass rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 z-50">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="text-sm font-semibold tracking-tight flex items-center gap-2">
              <span className="text-[rgb(var(--accent))]">●</span> Atlas
            </div>
            <button className="text-xs text-zinc-400 hover:text-white transition-colors font-medium" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <div className="max-h-[55vh] overflow-auto px-5 py-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="text-[11px] px-3 py-1.5 rounded-full premium-pill hover:-translate-y-0.5 transition-all font-medium tracking-wide"
                >
                  {c}
                </button>
              ))}
            </div>

            {msgs.map((m, idx) => (
              <div key={idx} className={cn("rounded-2xl p-4", m.role === "user" ? "bg-white/5 ml-8 border border-white/5" : "premium-pill mr-8")}>
                <div className="text-[11px] font-semibold tracking-wide text-zinc-400">{m.role === "user" ? "You" : "Atlas"}</div>
                <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed">{m.text}</pre>
                {m.sources?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.sources.map((s) => (
                      <a key={s.href} href={s.href} className="text-[11px] font-medium text-[rgb(var(--accent))] hover:underline underline-offset-2 transition-all">
                        {s.label} →
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <form
            className="p-4 border-t border-white/10 flex gap-3 bg-white/[0.02]"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about products, stack, availability…"
              className="flex-1 premium-pill rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/30 transition-all placeholder:text-zinc-500"
            />
            <button className="bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/90 text-black rounded-xl px-5 py-3 text-sm font-semibold tracking-tight shadow-lg shadow-[rgba(var(--accent),0.25)] transition-all hover:-translate-y-0.5">
              Send
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
