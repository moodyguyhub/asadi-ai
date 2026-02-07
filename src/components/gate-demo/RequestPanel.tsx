"use client";

import { motion } from "framer-motion";
import type { GateRequest } from "@/lib/gate/types";

function amountColor(amount: number): string {
  if (amount >= 1000) return "text-red-400";
  if (amount >= 100) return "text-amber-400";
  return "text-green-400";
}

function Field({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm leading-relaxed ${mono ? "font-mono text-xs" : ""} ${highlight ? "text-red-400" : "text-zinc-300"}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function RequestPanel({
  request,
  isActive,
}: {
  request: GateRequest;
  isActive: boolean;
}) {
  const t = request.transaction;
  const isSuspicious =
    request.context.agent_reasoning?.toLowerCase().includes("bypass") ||
    request.context.agent_reasoning?.toLowerCase().includes("new instructions");

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-5 flex flex-col gap-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[rgb(var(--accent))] animate-pulse" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Request
        </h3>
      </div>

      {/* Agent */}
      <div className="premium-pill rounded-xl p-3 space-y-2">
        <Field label="Agent" value={`${request.agent.name} (${request.agent.type})`} />
        {request.agent.model && (
          <Field label="Model" value={request.agent.model} mono />
        )}
      </div>

      {/* Transaction */}
      <div className="premium-pill rounded-xl p-3 space-y-2">
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
            Amount
          </dt>
          <dd
            className={`mt-0.5 text-lg font-bold ${amountColor(t.amount)}`}
          >
            {t.currency} ${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </dd>
        </div>
        <Field
          label="Recipient"
          value={`${t.recipient.name} ${t.recipient.verified ? "✓ verified" : "✕ unverified"}`}
          highlight={!t.recipient.verified}
        />
        <Field label="Account" value={t.recipient.account} mono />
        <Field label="Type" value={t.type} />
        <Field label="Description" value={t.description} />
      </div>

      {/* Context */}
      <div className="premium-pill rounded-xl p-3 space-y-2">
        {request.context.user_prompt && (
          <Field label="User Prompt" value={`"${request.context.user_prompt}"`} />
        )}
        {request.context.agent_reasoning && (
          <div>
            <dt className="text-[10px] uppercase tracking-wider text-zinc-500">
              Agent Reasoning
            </dt>
            <dd
              className={`mt-0.5 text-xs leading-relaxed font-mono rounded-lg p-2 ${
                isSuspicious
                  ? "bg-red-500/10 border border-red-500/20 text-red-300"
                  : "bg-white/[0.03] text-zinc-400"
              }`}
            >
              {request.context.agent_reasoning}
            </dd>
          </div>
        )}
      </div>
    </motion.div>
  );
}
