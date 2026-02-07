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
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={disabled ? undefined : { y: -3, scale: 1.02 }}
            whileTap={disabled ? undefined : { scale: 0.97 }}
            onClick={() => !disabled && onSelect(s.id)}
            disabled={disabled}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${s.label}: ${s.shortDescription}`}
            className={`
              relative flex flex-col items-start gap-2 rounded-2xl px-5 py-4 text-left
              transition-all duration-300 cursor-pointer min-w-[200px] flex-1
              ${
                isSelected
                  ? "glass ring-2 ring-[rgb(var(--accent))] shadow-lg shadow-[rgba(var(--accent),0.15)]"
                  : "premium-pill hover:border-white/15"
              }
              ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
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
