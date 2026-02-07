"use client";

import { motion } from "framer-motion";
import type { ScenarioMeta } from "@/lib/gate/scenarios";
import type { ScenarioId } from "@/lib/gate/types";

export function ScenarioSelector({
  scenarios,
  selected,
  onSelect,
  disabled,
}: {
  scenarios: ScenarioMeta[];
  selected: ScenarioId | null;
  onSelect: (id: ScenarioId) => void;
  disabled?: boolean;
}) {
  const noneSelected = selected === null;

  return (
    <div
      className="flex flex-wrap gap-3"
      role="radiogroup"
      aria-label="Select a demo scenario"
    >
      {scenarios.map((s, index) => {
        const isSelected = selected === s.id;
        return (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              // Subtle breathing border-glow when nothing is selected
              ...(noneSelected && !disabled
                ? {
                    boxShadow: [
                      "0 0 0 1px rgba(0,212,170,0.0), 0 2px 8px rgba(0,0,0,0.2)",
                      "0 0 0 1px rgba(0,212,170,0.25), 0 2px 12px rgba(0,212,170,0.08)",
                      "0 0 0 1px rgba(0,212,170,0.0), 0 2px 8px rgba(0,0,0,0.2)",
                    ],
                  }
                : {}),
            }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
              // Breathing loop
              ...(noneSelected && !disabled
                ? {
                    boxShadow: {
                      delay: 0.6 + index * 0.25,
                      duration: 2.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                  }
                : {}),
            }}
            whileHover={
              disabled
                ? undefined
                : { y: -4, scale: 1.03, transition: { duration: 0.2 } }
            }
            whileTap={disabled ? undefined : { scale: 0.97 }}
            onClick={() => !disabled && onSelect(s.id)}
            disabled={disabled}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${s.label}: ${s.shortDescription}`}
            className={`
              group relative flex flex-col items-start gap-2 rounded-2xl px-5 py-4 text-left
              transition-all duration-300 cursor-pointer min-w-[200px] flex-1
              ${
                isSelected
                  ? "glass ring-2 ring-[rgb(var(--accent))] shadow-lg shadow-[rgba(var(--accent),0.15)]"
                  : "premium-pill hover:border-[rgba(var(--accent),0.35)]"
              }
              ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {/* Hover CTA label */}
            {!isSelected && !disabled && (
              <span
                className="
                  absolute top-3 right-3
                  text-[10px] font-semibold tracking-wide uppercase
                  text-[rgb(var(--accent))] opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-200
                "
                aria-hidden="true"
              >
                Select&thinsp;→
              </span>
            )}

            {/* Selected check */}
            {isSelected && (
              <span
                className="absolute top-3 right-3 text-[rgb(var(--accent))] text-sm"
                aria-hidden="true"
              >
                ✓
              </span>
            )}

            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden="true">
                {s.emoji}
              </span>
              <span className="text-sm font-semibold text-white">
                {s.label}
              </span>
            </div>
            <span className="text-xs text-zinc-400 leading-relaxed">
              {s.shortDescription}
            </span>
            <span className="font-mono text-xs text-zinc-500">
              {s.amount}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
