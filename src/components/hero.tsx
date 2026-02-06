"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import { Button } from "@/components/catalyst/button";
import { trackEvent } from "@/lib/analytics";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

export function Hero() {
  return (
    <section className="pt-10 sm:pt-14">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
      >
        {/* Subtle inner glow */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-gradient-to-b from-[rgba(var(--accent),0.08)] to-transparent blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col gap-6">
          <div>
            {/* Name with letter-spacing for premium feel */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white"
            >
              MAHMOOD ASADI
            </motion.div>

            {/* Title with accent glow */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-3 text-lg sm:text-xl font-medium accent-glow"
            >
              {site.title}
            </motion.div>

            {/* Hook with refined typography */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl"
            >
              <span className="text-white font-semibold tracking-wide">
                {site.hookLine1} {site.hookLine2}
              </span>
              <span className="muted">
                {" "}Proof-driven systems. Governance enforced by infrastructure, not policy.
              </span>
            </motion.p>
          </div>

          {/* CTAs with refined spacing */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center items-stretch gap-3">
              <Button
                href={site.ctaPrimary.href}
                target="_blank"
                rel="noopener noreferrer"
                color="accent"
                className="w-full sm:w-auto px-5 py-3 !rounded-xl !items-center tracking-tight shadow-lg shadow-[rgba(var(--accent),0.22)] hover:shadow-[rgba(var(--accent),0.34)] transition-all hover:-translate-y-0.5"
                onClick={() => trackEvent("cta_book_call_30min", { source: "hero" })}
              >
                <span>
                  Book a Strategy Consult
                  <span className="ml-1 text-xs opacity-70">(30 min)</span>
                </span>
                <ArrowRightIcon data-slot="icon" className="!size-4" />
                <span className="ml-0.5 text-xs opacity-70 hidden sm:inline">(Recommended)</span>
              </Button>

              <Button
                href={site.ctaQuickChat.href}
                target="_blank"
                rel="noopener noreferrer"
                outline
                className="w-full sm:w-auto px-5 py-3 !rounded-xl !items-center"
                onClick={() => trackEvent("cta_quick_chat_15min", { source: "hero" })}
              >
                {site.ctaQuickChat.label}
              </Button>

              <button
                type="button"
                onClick={() => {
                  trackEvent("atlas_opened", { source: "hero" });
                  window.dispatchEvent(new CustomEvent("atlas:open"));
                }}
                className="premium-link text-sm font-medium self-start sm:self-center"
              >
                Ask Atlas — Chief of AI Staff (Portfolio)
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
              <span>{site.ctaPrimary.hint}</span>
              <span>{site.ctaQuickChat.hint}</span>
            </div>
          </motion.div>

          {/* Trust pills with premium styling */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-4 flex flex-wrap gap-3"
          >
              {["Audit‑ready", "Governance‑first", "Multi‑tenant", "Evidence‑first"].map((x) => (
              <div
                key={x}
                className="inline-flex items-center justify-center bg-white/10 border border-white/10 rounded-full px-4 py-2.5 text-xs font-medium text-white/90 text-center tracking-wide whitespace-nowrap"
              >
                {x}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
