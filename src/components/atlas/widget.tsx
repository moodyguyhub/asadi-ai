"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Msg = { role: "user" | "assistant"; text: string; isTyping?: boolean };

const SUGGESTED_CHIPS = [
  "How did Mahmood ship Ardura and Truvesta in 3 weeks?",
  "What does Truvesta solve for Forex/CFD brokers?",
  "What's Mahmood's tech stack and domain depth?",
  "Is Mahmood available, and what roles is he targeting?",
];

const OPENING_MESSAGE = "I'm Atlas — Mahmood's Chief of AI Staff (Portfolio). I operate strictly from the public knowledge pack (CV, products, stack). Ask about builds, orchestration method, roles, or availability.";

// Typewriter effect component
function TypewriterText({ text, onComplete, speed = 10 }: { text: string; onComplete?: () => void; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse text-emerald-400">▊</span>}
    </>
  );
}

export function AtlasWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: OPENING_MESSAGE },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for external trigger (e.g., from hero "Ask Atlas" button)
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("atlas:open", handleOpen);
    return () => window.removeEventListener("atlas:open", handleOpen);
  }, []);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      trackEvent("atlas_opened", { source: "widget" });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isTyping]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    
    const userMsg: Msg = { role: "user", text: trimmed };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/atlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const responseText = (data?.text || "").toString().trim();

      const atlasMsg: Msg = { 
        role: "assistant", 
        text: responseText || "That's outside my portfolio scope—please book a call for deeper discussion.",
        isTyping: true 
      };
      setMsgs((m) => [...m, atlasMsg]);
    } catch {
      setMsgs((m) => [...m, { 
        role: "assistant", 
        text: "Atlas is temporarily unavailable. Please use the booking link to connect.",
        isTyping: true 
      }]);
    } finally {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTyping]);

  const handleTypingComplete = useCallback((idx: number) => {
    setMsgs((m) => m.map((msg, i) => i === idx ? { ...msg, isTyping: false } : msg));
    setIsTyping(false);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md hover:bg-white/10 transition shadow-lg shadow-black/20"
          aria-label="Open Atlas"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div className="text-left leading-tight">
            <div className="text-sm font-semibold text-white">Ask Atlas</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              Chief of AI Staff
            </div>
          </div>
        </button>
      ) : (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          
          <div className="fixed top-16 left-4 right-4 bottom-4 md:relative md:top-auto md:left-auto md:right-auto md:bottom-auto md:w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-black/40">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10">
                  <span className="text-xs font-bold text-emerald-300">A</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Atlas</div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-white/50">
                    Chief of AI Staff • KB-bound
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-white/60 hover:text-white hover:bg-white/10 transition text-lg"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-auto px-4 py-4 space-y-3 max-h-[70vh] md:max-h-[420px]"
            >
              {msgs.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm",
                    m.role === "assistant"
                      ? "bg-white/5 text-white/90 border border-white/10 mr-4"
                      : "bg-emerald-400/10 text-white border border-emerald-400/20 ml-6"
                  )}
                >
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                    {m.role === "assistant" && m.isTyping ? (
                      <TypewriterText 
                        text={m.text} 
                        speed={8} 
                        onComplete={() => handleTypingComplete(idx)} 
                      />
                    ) : (
                      m.text
                    )}
                  </pre>
                </div>
              ))}

              {/* Chips - only show at start */}
              {msgs.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTED_CHIPS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      disabled={isTyping}
                      className={cn(
                        "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/80 hover:bg-white/10 transition",
                        isTyping && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {isTyping && msgs[msgs.length - 1]?.role === "user" && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-xs text-white/40 ml-2">Atlas processing…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-3 bg-black/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                  placeholder="Ask about products, stack, roles, availability…"
                  className={cn(
                    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-400/40 transition",
                    isTyping && "opacity-50"
                  )}
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className={cn(
                    "rounded-xl bg-emerald-400/20 px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/30 transition",
                    isTyping && "opacity-50 cursor-not-allowed"
                  )}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
