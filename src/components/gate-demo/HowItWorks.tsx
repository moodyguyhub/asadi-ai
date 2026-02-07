"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Agent submits a request",
    desc: "A purchasing agent asks to pay a vendor. The request includes amount, recipient, agent type, and reasoning.",
  },
  {
    num: "02",
    title: "Policy cascade evaluates",
    desc: "Seven rules run in strict priority order. The first matching rule decides the outcome. If nothing matches, the default is blocked.",
  },
  {
    num: "03",
    title: "Human reviews (when required)",
    desc: "Transactions that exceed agent authority are escalated — never silently approved. Approvals expire; there is no auto-approve.",
  },
  {
    num: "04",
    title: "Evidence pack is sealed",
    desc: "A SHA-256 receipt captures the request, evaluation, and decision. The hash is generated server-side and cannot be altered by the client.",
  },
];

export function HowItWorks() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-8 sm:p-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        How It Works
      </h2>
      <p className="mt-4 text-base text-zinc-400 max-w-2xl leading-relaxed">
        Four steps from request to receipt. No step can be skipped.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="premium-pill rounded-2xl p-5 group cursor-default"
          >
            <div className="flex items-start gap-3">
              <span className="text-sm font-semibold text-[rgb(var(--accent))] opacity-70 group-hover:opacity-100 transition-opacity tabular-nums">
                {step.num}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
