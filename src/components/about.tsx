"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { aboutPillars } from "@/content/about";

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
      
      {/* Two-column: Portrait + Copy */}
      <div className="mt-6 flex flex-col md:flex-row gap-8 items-start">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="shrink-0"
        >
          <div className="relative w-[280px] sm:w-[360px] aspect-[3/4] rounded-xl overflow-hidden ring-1 ring-white/10">
            <Image
              src="/portrait.jpg"
              alt="Mahmood Asadi"
              fill
              className="object-cover object-center"
              quality={70}
              sizes="(max-width: 640px) 280px, 360px"
            />
          </div>
        </motion.div>

        {/* Copy */}
        <div className="flex-1">
          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            I&apos;m an AI-native technical leader with deep fintech background. I orchestrate AI agents to
            ship enterprise products in weeks, not months — without sacrificing governance, security,
            or auditability.
          </p>
          <p className="mt-3 text-base sm:text-lg text-[rgb(var(--accent))] font-medium">
            I ship at startup speed with enterprise-grade auditability.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {aboutPillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="premium-pill rounded-2xl p-4 group cursor-default"
              >
                <div className="flex items-start gap-3">
                  <span className="text-base opacity-60 group-hover:opacity-100 transition-opacity">{p.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-sm text-zinc-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))] animate-pulse" />
            Open to AI engineering, technical leadership, or CTO-track roles.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
