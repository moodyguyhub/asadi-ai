"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/catalyst/button";
import { site } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

const evidenceItems = [
  {
    type: "Deployment Receipts",
    description: "Live product demos with audit trails and governance flows",
    available: true,
  },
  {
    type: "Architecture Docs",
    description: "System design documentation and decision logs",
    available: true,
  },
  {
    type: "Code Samples",
    description: "Selected implementation patterns and orchestration code",
    available: true,
  },
  {
    type: "Shipping Timeline",
    description: "Commit history and delivery milestones",
    available: true,
  },
];

// Pre-composed email for artifact requests
const ARTIFACT_EMAIL_SUBJECT = "Artifact Request — Mahmood Asadi Portfolio";
const ARTIFACT_EMAIL_BODY = `Hi Mahmood,

I'd like to request access to the following artifacts:

☐ Deployment Receipts (live demos, audit trails)
☐ Architecture Docs (system design, decision logs)
☐ Code Samples (orchestration patterns)
☐ Shipping Timeline (commit history, milestones)

Context for my request:
[Please describe your use case or interest]

NDA: ( ) Not required  ( ) Happy to sign  ( ) Please send yours

Best regards`;

const artifactMailtoHref = `mailto:${site.links.email}?subject=${encodeURIComponent(ARTIFACT_EMAIL_SUBJECT)}&body=${encodeURIComponent(ARTIFACT_EMAIL_BODY)}`;

export function Evidence() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-8 sm:p-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
        Evidence & Proof
      </h2>
      <p className="mt-4 text-base text-zinc-400 max-w-2xl leading-relaxed">
        Receipts matter. Selected artifacts available on request — demos, docs, and delivery logs.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {evidenceItems.map((item, i) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="premium-pill rounded-2xl p-5 group cursor-default"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                {item.available ? "✓" : "○"}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{item.type}</h3>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button
          href={artifactMailtoHref}
          color="accent"
          className="px-5 py-2.5"
          onClick={() => trackEvent("cta_request_artifacts", { source: "evidence" })}
        >
          Request Artifacts
        </Button>
        <a
          href={site.ctaPrimary.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("cta_book_call_30min", { source: "evidence" })}
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Or book a Strategy Consult →
        </a>
      </div>
    </motion.div>
  );
}
