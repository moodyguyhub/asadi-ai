"use client";

import { motion } from "framer-motion";

const pillars = [
  { title: "Speed", desc: "6 products shipped across 4 industries.", icon: "⚡" },
  { title: "Method", desc: "Multi-agent orchestration with structured handoffs.", icon: "🔗" },
  { title: "Domain", desc: "Brokerage systems, CRMs, dealing desks, MT4/MT5 ecosystems.", icon: "📊" },
  { title: "Approach", desc: "Evidence-first, audit-ready delivery.", icon: "✓" },
];

export function About() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-8 sm:p-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">About</h2>
      <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed max-w-3xl">
        I&apos;m an AI-native technical leader with deep fintech background. I orchestrate AI agents to
        ship enterprise products in weeks, not months — without sacrificing governance, security,
        or auditability.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="premium-pill rounded-2xl p-5 group cursor-default"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">{p.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-sm text-zinc-500 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))] animate-pulse" />
        Open to AI engineering, technical leadership, or CTO-track roles.
      </p>
    </motion.div>
  );
}
