"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "atlas"; text: string; isTyping?: boolean };

// Typewriter effect component
function TypewriterText({ text, onComplete, speed = 12 }: { text: string; onComplete?: () => void; speed?: number }) {
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
      {currentIndex < text.length && <span className="animate-pulse text-[rgb(var(--accent))]">▊</span>}
    </>
  );
}

export function AtlasWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "atlas", text: site.atlas.opening },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chips = useMemo(() => site.atlas.chips, []);

  // Listen for external trigger (e.g., from hero "Ask Atlas" button)
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("atlas:open", handleOpen);
    return () => window.removeEventListener("atlas:open", handleOpen);
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isTyping]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    
    setError(null);
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

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const atlasMsg: Msg = { 
        role: "atlas", 
        text: data.text,
        isTyping: true 
      };
      setMsgs((m) => [...m, atlasMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Atlas is temporarily unavailable");
      setIsTyping(false);
    }
  }, [isTyping]);

  const handleTypingComplete = useCallback((idx: number) => {
    setMsgs((m) => m.map((msg, i) => i === idx ? { ...msg, isTyping: false } : msg));
    setIsTyping(false);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 glass glass-interactive rounded-2xl px-5 py-3.5 text-sm flex items-center gap-2.5 shadow-lg shadow-black/20 z-50 pb-safe"
        aria-label="Open Atlas"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--accent))] opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[rgb(var(--accent))]"></span>
        </span>
        <span className="font-semibold tracking-tight">Ask Atlas</span>
      </button>

      {open ? (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          
          <div className="fixed top-16 left-4 right-4 bottom-4 md:inset-auto md:top-auto md:left-auto md:bottom-20 md:right-5 md:w-[400px] glass rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 z-50 flex flex-col">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="text-sm font-semibold tracking-tight flex items-center gap-2">
                <span className="text-[rgb(var(--accent))]">●</span> Atlas
              </div>
              <button className="text-xs text-zinc-400 hover:text-white transition-colors font-medium" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-auto px-5 py-4 space-y-4 max-h-[70vh] md:max-h-[55vh]">
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    disabled={isTyping}
                    className={cn(
                      "text-[11px] px-3 py-1.5 rounded-full premium-pill hover:-translate-y-0.5 transition-all font-medium tracking-wide",
                      isTyping && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {msgs.map((m, idx) => (
                <div key={idx} className={cn("rounded-2xl p-4", m.role === "user" ? "bg-white/5 ml-4 md:ml-8 border border-white/5" : "premium-pill mr-4 md:mr-8")}>
                  <div className="text-[11px] font-semibold tracking-wide text-zinc-400">{m.role === "user" ? "You" : "Atlas"}</div>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed font-sans">
                    {m.role === "atlas" && m.isTyping ? (
                      <TypewriterText 
                        text={m.text} 
                        speed={10} 
                        onComplete={() => handleTypingComplete(idx)} 
                      />
                    ) : (
                      m.text
                    )}
                  </pre>
                </div>
              ))}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mr-4 md:mr-8">
                  <div className="text-[11px] font-semibold tracking-wide text-red-400">Error</div>
                  <p className="mt-2 text-sm text-red-300">{error}</p>
                </div>
              )}

              {isTyping && msgs[msgs.length - 1]?.role === "user" && (
                <div className="premium-pill mr-4 md:mr-8 rounded-2xl p-4">
                  <div className="text-[11px] font-semibold tracking-wide text-zinc-400">Atlas</div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-[rgb(var(--accent))] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            <form
              className="p-4 border-t border-white/10 flex gap-3 bg-white/[0.02]"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder={isTyping ? "Atlas is typing…" : "Ask about products, stack, availability…"}
                className={cn(
                  "flex-1 premium-pill rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/30 transition-all placeholder:text-zinc-500",
                  isTyping && "opacity-50 cursor-not-allowed"
                )}
              />
              <button 
                disabled={isTyping}
                className={cn(
                  "bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/90 text-black rounded-xl px-5 py-3 text-sm font-semibold tracking-tight shadow-lg shadow-[rgba(var(--accent),0.25)] transition-all hover:-translate-y-0.5",
                  isTyping && "opacity-50 cursor-not-allowed"
                )}
              >
                Send
              </button>
            </form>
          </div>
        </>
      ) : null}
    </>
  );
}
