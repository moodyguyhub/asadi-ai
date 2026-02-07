"use client";

import { motion } from "framer-motion";

const principles = [
  {
    icon: "🛑",
    title: "Default is blocked",
    desc: "If no rule explicitly authorizes a transaction, it is denied. There is no implicit allow.",
  },
  {
    icon: "🔒",
    title: "Errors fail safe",
    desc: "If the policy engine throws an exception, the verdict is blocked — not a retry, not a pass-through.",
  },
  {
    icon: "👤",
    title: "Humans approve, never agents",
    desc: "Escalated transactions require a human decision. Approvals expire after 72 hours; the system never auto-approves.",
  },
  {
    icon: "📄",
    title: "Every decision has a receipt",
    desc: "SHA-256 evidence packs capture the full decision chain — request, rules evaluated, verdict, and approval (if any).",
  },
];

export function FailClosedDoctrine() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-8 sm:p-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Fail-Closed Doctrine
      </h2>
      <p className="mt-4 text-base text-zinc-400 max-w-2xl leading-relaxed">
        The Gate refuses power it hasn&apos;t earned the right to exercise. Four
        principles govern every evaluation.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {principles.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="premium-pill rounded-2xl p-5 group cursor-default"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                {p.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
