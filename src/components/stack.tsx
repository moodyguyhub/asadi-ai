"use client";

import { Badge } from "@/components/catalyst/badge";
import { motion } from "framer-motion";
import { stackGroups } from "@/content/stack";

export function Stack() {

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-3xl p-8 sm:p-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Stack</h2>
      <p className="mt-3 text-zinc-400 max-w-3xl leading-relaxed">
        Kept intentionally tight. Depth over sprawl.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stackGroups.map((g, index) => (
          <motion.div 
            key={g.title} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="premium-pill rounded-2xl p-5 group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{g.icon}</span>
              <h3 className="text-sm font-semibold text-white tracking-tight">{g.title}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.items.map((x) => (
                <Badge key={x} color="zinc">{x}</Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
