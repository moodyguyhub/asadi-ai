import type { Metadata } from "next";
import { GateDemoLazy } from "@/components/gate-demo/GateDemoLazy";
import { HowItWorks } from "@/components/gate-demo/HowItWorks";
import { FailClosedDoctrine } from "@/components/gate-demo/FailClosedDoctrine";
import { BuiltOnSection } from "@/components/gate-demo/BuiltOnSection";
import { TopNav } from "@/components/top-nav";

export const metadata: Metadata = {
  title: "Asadi Gate Demo | asadi.ai",
  description:
    "Interactive demo of a fail-closed governance layer for agentic commerce — deterministic policy cascade, SHA-256 evidence packs, and human-in-the-loop approval.",
  openGraph: {
    title: "Asadi Gate Demo | asadi.ai",
    description:
      "See how a 7-rule policy cascade evaluates AI payment requests in real time. Every decision is cryptographically receipted.",
  },
};

export default function GateDemoRoute() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <TopNav />

        {/* JS-disabled fallback — server-rendered, visible only when JS is off */}
        <noscript>
          <div className="my-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Asadi Gate
            </h1>
            <p className="mt-3 text-lg text-[#00d4aa] font-medium">
              Fail-closed governance for agentic commerce
            </p>
            <p className="mt-4 text-base text-zinc-400 leading-relaxed max-w-2xl">
              This interactive demo requires JavaScript to run the policy engine
              and display the animated rule cascade. Below is a summary of how it
              works.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white">How It Works</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  AI agent submits a payment request → 7 policy rules evaluate in
                  priority order → first matching rule decides the verdict →
                  SHA-256 evidence pack seals the decision.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white">Fail-Closed Doctrine</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Default verdict is BLOCKED. Errors fail safe. Escalated
                  transactions require human approval — no auto-approve. Every
                  decision produces a cryptographic receipt.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white">Three Scenarios</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  A) $45 office supplies → Authorized. B) $500 exceeds agent
                  limit → Human approval required. C) $5,000 prompt injection
                  attempt → Blocked.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white">Try It</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Enable JavaScript to run the interactive demo, or{" "}
                  <a
                    href="https://cal.com/ctoalpha/deep-dive"
                    className="text-[#00d4aa] underline"
                  >
                    book a deep-dive
                  </a>{" "}
                  for a live walkthrough.
                </p>
              </div>
            </div>
          </div>
        </noscript>

        <div className="py-12 sm:py-20 space-y-20 sm:space-y-28">
          <GateDemoLazy />
          <HowItWorks />
          <FailClosedDoctrine />
          <BuiltOnSection />
        </div>
      </div>
    </main>
  );
}
