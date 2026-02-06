"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type Msg = { role: "user" | "assistant"; text: string; isTyping?: boolean };

const SUGGESTED_CHIPS = [
  "How would you de-risk an AI rollout?",
  "Show auditability receipts",
  "What can Mahmood ship in 3 weeks?",
  "Availability?",
];

const CTA_CONSULT = "\n\nIf you want to apply this to your environment, book a 30-min strategy consult.";
const CTA_OUT_OF_SCOPE = "\n\nThat's outside my portfolio scope—book a consult if you want to discuss it in context.";

/**
 * Determines if user intent warrants routing to a call CTA.
 * Returns: 'consult' | 'out-of-scope' | null
 */
function shouldRouteToCall(userText: string): 'consult' | 'out-of-scope' | null {
  const lower = userText.toLowerCase();
  
  // Intent patterns: hire/fit/availability/pricing/timeline
  const consultPatterns = [
    /\b(hire|hiring|employ|contract|freelance|engage)\b/,
    /\b(available|availability|free|open to)\b/,
    /\b(rate|pricing|cost|budget|fee|charge)\b/,
    /\b(timeline|deadline|when can|how soon|start date)\b/,
    /\b(fit|good fit|right fit|match)\b/,
    /\b(work with|work together|collaborate|partner)\b/,
    /\b(build .* for (us|me|our)|can you build|would you build)\b/,
    /\b(how would you .* for (us|me|our))\b/,
    /\b(apply this|implement this|do this for)\b/,
    /\b(next steps?|move forward|proceed|get started)\b/,
    /\b(proposal|quote|estimate|scope)\b/,
  ];
  
  // Out-of-scope patterns
  const outOfScopePatterns = [
    /\b(personal|private|family|hobby)\b/,
    /\b(opinion on|what do you think about|views on)\b(?!.*(ai|agent|orchestration|fintech))/,
    /\b(politics|religion|controversial)\b/,
  ];
  
  for (const pattern of consultPatterns) {
    if (pattern.test(lower)) return 'consult';
  }
  
  for (const pattern of outOfScopePatterns) {
    if (pattern.test(lower)) return 'out-of-scope';
  }
  
  return null;
}

const OPENING_MESSAGE = "I'm Atlas — Mahmood's Chief of AI Staff (Portfolio). I operate strictly from the public knowledge pack (CV, products, stack). Ask about builds, orchestration method, roles, or availability.";

// Check if speech APIs are available
const isSpeechSupported = () => {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
};

// We now use server-side OpenAI TTS instead of browser speechSynthesis.
// No isSynthesisSupported check needed.

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

// Voice mode component
function VoiceMode({ onClose, onMessage }: { onClose: () => void; onMessage: (text: string, role: "user" | "assistant") => void }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introSpokenRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHeardTextRef = useRef<string>("");
  const hasPendingSendRef = useRef(false);
  const shouldAutoRestartRef = useRef(false);
  const statusRef = useRef<typeof status>("idle");

  const setStatusSafe = (next: typeof status) => {
    statusRef.current = next;
    setStatus(next);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (!isSpeechSupported()) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    const clearSilenceTimer = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    const scheduleEndpoint = () => {
      clearSilenceTimer();
      silenceTimerRef.current = setTimeout(() => {
        // If we've heard anything, treat this as end-of-turn.
        const textToSend = lastHeardTextRef.current.trim();
        if (!textToSend) return;
        if (hasPendingSendRef.current) return;
        hasPendingSendRef.current = true;
        try {
          recognition.stop();
        } catch {
          // ignore
        }
        handleUserSpeech(textToSend);
      }, 900);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setStatusSafe("listening");
    };

    recognition.onresult = (event) => {
      // Aggregate results across the session so we don't send partial mid-utterance.
      let interimText = "";
      let finalText = "";

      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        const t = (res?.[0]?.transcript || "").toString();
        if (res.isFinal) finalText += t;
        else interimText += t;
      }

      const combined = `${finalText} ${interimText}`.trim();
      lastHeardTextRef.current = combined;
      setTranscript(combined);

      // Debounce send until user stops speaking (silence).
      scheduleEndpoint();
    };

    recognition.onend = () => {
      setIsListening(false);
      // If we are still in "listening" mode, Chrome sometimes ends the session abruptly.
      if (shouldAutoRestartRef.current && statusRef.current === "listening" && !hasPendingSendRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          // fall through
        }
      }
      if (statusRef.current === "listening") setStatusSafe("idle");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setStatusSafe("idle");
    };

    recognitionRef.current = recognition;

    // Speak intro via OpenAI TTS (server-side, fixed "nova" voice).
    if (!introSpokenRef.current) {
      introSpokenRef.current = true;
      (async () => {
        try {
          const res = await fetch("/api/atlas/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: "I'm Atlas, Mahmood's Chief of AI Staff. Portfolio scope only. How can I help?" }),
          });
          if (!res.ok) return;
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          setIsSpeaking(true);
          setStatusSafe("speaking");
          audio.onended = () => {
            setIsSpeaking(false);
            setStatusSafe("idle");
            URL.revokeObjectURL(url);
            audioRef.current = null;
          };
          await audio.play();
        } catch {
          // TTS unavailable — continue silently.
        }
      })();
    }

    return () => {
      clearSilenceTimer();
      recognition.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speakText = useCallback(async (text: string) => {
    // Stop recognition while speaking to prevent self-echo.
    try {
      shouldAutoRestartRef.current = false;
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }

    // Cancel any current playback.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      setIsSpeaking(true);
      setStatusSafe("speaking");

      const res = await fetch("/api/atlas/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setIsSpeaking(false);
        setStatusSafe("idle");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        setStatusSafe("idle");
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      await audio.play();
    } catch {
      setIsSpeaking(false);
      setStatusSafe("idle");
    }
  }, []);

  const handleUserSpeech = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setStatusSafe("processing");
    setTranscript("");
    lastHeardTextRef.current = "";
    onMessage(trimmed, "user");
    trackEvent("atlas_voice_query", { query: trimmed.slice(0, 50) });

    // Determine if we should append a CTA based on user intent
    const routeIntent = shouldRouteToCall(trimmed);

    try {
      const response = await fetch("/api/atlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const rawText = (data?.text || "").toString().trim();
      
      // Build response: only append CTA if intent warrants it
      let responseText: string;
      if (!rawText) {
        responseText = "I can't confirm that from the public portfolio pack. Ask about products, tech stack, shipping method, or availability.";
      } else if (routeIntent === 'consult') {
        responseText = rawText + " If you want to apply this to your environment, book a 30-min strategy consult.";
      } else if (routeIntent === 'out-of-scope') {
        responseText = rawText + " That's outside my portfolio scope. Book a consult if you want to discuss it in context.";
      } else {
        // Normal factual answer — no CTA
        responseText = rawText;
      }

      onMessage(responseText, "assistant");
      speakText(responseText);
    } catch {
      const errorMsg = "Atlas is temporarily unavailable. Please use the booking link.";
      onMessage(errorMsg, "assistant");
      speakText(errorMsg);
    } finally {
      hasPendingSendRef.current = false;
    }
  }, [onMessage, speakText]);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      setTranscript("");
      lastHeardTextRef.current = "";
      hasPendingSendRef.current = false;
      shouldAutoRestartRef.current = true;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      shouldAutoRestartRef.current = false;
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {/* Status indicator */}
      <div className={cn(
        "w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300",
        status === "idle" && "bg-white/5 border-2 border-white/20",
        status === "listening" && "bg-emerald-400/20 border-2 border-emerald-400 animate-pulse",
        status === "processing" && "bg-amber-400/20 border-2 border-amber-400",
        status === "speaking" && "bg-cyan-400/20 border-2 border-cyan-400 animate-pulse"
      )}>
        {status === "idle" && (
          <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
        {status === "listening" && (
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-1.5 bg-emerald-400 rounded-full animate-bounce"
                style={{ 
                  height: `${16 + Math.random() * 16}px`,
                  animationDelay: `${i * 100}ms` 
                }}
              />
            ))}
          </div>
        )}
        {status === "processing" && (
          <svg className="w-8 h-8 text-amber-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {status === "speaking" && (
          <svg className="w-10 h-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </div>

      {/* Status text */}
      <div className="text-sm text-white/60 mb-2">
        {status === "idle" && "Tap microphone to speak"}
        {status === "listening" && "Listening..."}
        {status === "processing" && "Processing..."}
        {status === "speaking" && "Atlas speaking..."}
      </div>

      {/* Transcript preview */}
      {transcript && (
        <div className="text-xs text-white/40 mb-4 max-w-[200px] truncate">
          &ldquo;{transcript}&rdquo;
        </div>
      )}

      {/* Mic button */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isSpeaking || status === "processing"}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all",
          isListening 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-emerald-500 hover:bg-emerald-600",
          (isSpeaking || status === "processing") && "opacity-50 cursor-not-allowed"
        )}
      >
        {isListening ? (
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Close voice mode */}
      <button
        onClick={onClose}
        className="mt-6 text-xs text-white/40 hover:text-white/60 transition"
      >
        Switch to text chat
      </button>

      <div className="mt-4 text-[10px] text-white/30 uppercase tracking-wider">
        Portfolio scope only
      </div>
    </div>
  );
}

export function AtlasWidget() {
  const [open, setOpen] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
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
      if (e.key === "Escape") {
        if (voiceMode) setVoiceMode(false);
        else setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [voiceMode]);

  // Track when opened (no auto-focus - let user choose type or voice)
  useEffect(() => {
    if (open) {
      trackEvent("atlas_opened", { source: "widget" });
    }
  }, [open]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isTyping]);

  // Handle voice mode messages
  const handleVoiceMessage = useCallback((text: string, role: "user" | "assistant") => {
    setMsgs((m) => [...m, { role, text }]);
  }, []);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    
    const userMsg: Msg = { role: "user", text: trimmed };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    // Determine if we should append a CTA based on user intent
    const routeIntent = shouldRouteToCall(trimmed);

    try {
      const response = await fetch("/api/atlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const rawText = (data?.text || "").toString().trim();
      
      // Build response: only append CTA if intent warrants it
      let responseText: string;
      if (!rawText) {
        // No response from API = likely out of scope
        responseText = "I can't confirm that from the public portfolio pack. Ask about products, stack, shipping method, or availability." + CTA_OUT_OF_SCOPE;
      } else if (routeIntent === 'consult') {
        responseText = rawText + CTA_CONSULT;
      } else if (routeIntent === 'out-of-scope') {
        responseText = rawText + CTA_OUT_OF_SCOPE;
      } else {
        // Normal factual answer — no CTA, keep it crisp
        responseText = rawText;
      }

      const atlasMsg: Msg = { 
        role: "assistant", 
        text: responseText,
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
      if (!voiceMode) setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isTyping, voiceMode]);

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
            aria-hidden="true"
          />
          
          <div role="dialog" aria-label="Atlas AI Assistant" aria-modal="true" className="fixed top-16 left-4 right-4 bottom-4 md:relative md:top-auto md:left-auto md:right-auto md:bottom-auto md:w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-black/40">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border",
                  voiceMode 
                    ? "border-cyan-400/25 bg-cyan-400/10" 
                    : "border-emerald-400/25 bg-emerald-400/10"
                )}>
                  <span className={cn(
                    "text-xs font-bold",
                    voiceMode ? "text-cyan-300" : "text-emerald-300"
                  )}>A</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Atlas</div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-white/50">
                    {voiceMode ? "Voice Mode • KB-bound" : "Chief of AI Staff • KB-bound"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice toggle button */}
                {isSpeechSupported() && (
                  <button
                    onClick={() => {
                      setVoiceMode(!voiceMode);
                      trackEvent("atlas_voice_toggle", { enabled: !voiceMode });
                    }}
                    className={cn(
                      "rounded-lg p-2 transition",
                      voiceMode 
                        ? "bg-cyan-400/20 text-cyan-300" 
                        : "text-white/40 hover:text-white hover:bg-white/10"
                    )}
                    aria-label={voiceMode ? "Switch to text" : "Switch to voice"}
                    title={voiceMode ? "Switch to text" : "Call Atlas"}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1 text-white/60 hover:text-white hover:bg-white/10 transition text-lg"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Voice Mode or Chat Mode */}
            {voiceMode ? (
              <VoiceMode 
                onClose={() => setVoiceMode(false)} 
                onMessage={handleVoiceMessage} 
              />
            ) : (
              <>
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
                    <>
                      {/* Mode selection buttons */}
                      {isSpeechSupported() && (
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => inputRef.current?.focus()}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Type
                          </button>
                          <button
                            onClick={() => {
                              setVoiceMode(true);
                              trackEvent("atlas_voice_toggle", { enabled: true });
                            }}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300 hover:bg-cyan-400/20 transition"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Call
                          </button>
                        </div>
                      )}
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
                    </>
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
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isTyping}
                    placeholder="Ask about products, stack, roles, availability…"
                    className={cn(
                      "w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-emerald-400/40 transition",
                      isTyping && "opacity-50"
                    )}
                  />
                  {/* Mic button inside input */}
                  {isSpeechSupported() && (
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceMode(true);
                        trackEvent("atlas_voice_toggle", { enabled: true });
                      }}
                      disabled={isTyping}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition",
                        isTyping && "opacity-50 cursor-not-allowed"
                      )}
                      aria-label="Voice input"
                      title="Voice input"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  )}
                </div>
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
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
