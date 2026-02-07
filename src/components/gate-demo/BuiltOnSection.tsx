"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/catalyst/badge";
import { Button } from "@/components/catalyst/button";

const layers = [
  {
    icon: "⚙️",
    title: "Pure-function policy engine",
    items: ["TypeScript", "Deterministic", "Zero side-effects"],
  },
  {
    icon: "🔐",
    title: "Server-side evidence generation",
    items: ["SHA-256 hashing", "Node.js crypto", "Tamper-evident"],
  },
  {
    icon: "🖥️",
    title: "Client-side cascade animation",
    items: ["React 19", "Framer Motion", "Reduced-motion aware"],
  },
  {
    icon: "📡",
    title: "Stateless receipt API",
    items: ["Next.js API routes", "Rate-limited", "Fail-closed"],
  },
];

export function BuiltOnSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-8 sm:p-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Built On
      </h2>
      <p className="mt-4 text-base text-zinc-400 max-w-2xl leading-relaxed">
        Same stack and governance patterns used across Truvesta, Ardura, and
        Equira — applied to a single, auditable flow you can test yourself.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="premium-pill rounded-2xl p-5 group cursor-default"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                {layer.icon}
              </span>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                {layer.title}
              </h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {layer.items.map((item) => (
                <Badge key={item} color="zinc">
                  {item}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer + CTA */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-xs text-zinc-500 leading-relaxed max-w-lg">
          This is a simulated demo with deterministic scenarios. No real payments
          are processed. The policy engine and evidence packs are fully
          functional.
        </p>
        <Button
          href="https://cal.com/ctoalpha/deep-dive"
          color="dark/zinc"
          className="shrink-0"
        >
          Book a Deep-Dive →
        </Button>
      </div>
    </motion.section>
  );
}
