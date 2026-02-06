"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { Button } from "@/components/catalyst/button";
import { EnvelopeIcon, CheckIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { trackEvent } from "@/lib/analytics";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.links.email);
      setCopied(true);
      trackEvent("cta_copy_email");
    } catch {
      // Fallback: prompt user to copy manually
      window.prompt("Copy this email:", site.links.email);
    }
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
    >
      {/* Decorative accent glow */}
      <div className="absolute bottom-0 right-0 w-64 h-32 bg-gradient-to-tl from-[rgba(var(--accent),0.1)] to-transparent blur-3xl pointer-events-none" />
      
      <div className="relative">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Let&apos;s Connect</h2>
        <p className="mt-4 text-zinc-400 max-w-2xl leading-relaxed">
          For roles, consulting, or product discussions — use the channel below.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            <Button 
              href={site.ctaPrimary.href} 
              target="_blank"
              rel="noopener noreferrer"
              color="accent" 
              className="px-6 py-3 !rounded-xl !items-center tracking-tight shadow-lg shadow-[rgba(var(--accent),0.22)] hover:shadow-[rgba(var(--accent),0.34)] transition-all hover:-translate-y-0.5"
              onClick={() => trackEvent("cta_book_call_30min", { source: "contact" })}
            >
              <span>
                Book a Strategy Consult
                <span className="ml-1 text-xs opacity-70">(30 min)</span>
              </span>
              <ArrowRightIcon data-slot="icon" className="!size-4" />
            </Button>

            <Button 
              href={site.ctaQuickChat.href} 
              target="_blank"
              rel="noopener noreferrer"
              outline
              className="px-5 py-3"
              onClick={() => trackEvent("cta_quick_chat_15min", { source: "contact" })}
            >
              {site.ctaQuickChat.label}
            </Button>

            <Button 
              type="button" 
              onClick={copyEmail} 
              color="dark/zinc"
              className="px-5 py-3"
            >
              {copied ? <CheckIcon className="size-4" /> : <EnvelopeIcon className="size-4" />}
              {copied ? "Copied!" : "Copy Email"}
            </Button>

            <Button href={site.links.linkedin} target="_blank" color="dark/zinc" className="px-5 py-3" onClick={() => trackEvent("cta_linkedin")}>
              LinkedIn
            </Button>

            <Button href={site.links.cv} target="_blank" rel="noopener noreferrer" color="dark/zinc" className="px-5 py-3" onClick={() => trackEvent("cta_download_cv")}>
              Download CV
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
            <span>{site.ctaPrimary.hint}</span>
            <span>{site.ctaQuickChat.hint}</span>
          </div>
        </div>

        {copied && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-[rgb(var(--accent))] flex items-center gap-2"
          >
            <CheckIcon className="size-4" />
            {site.links.email}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
