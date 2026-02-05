"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 mb-6">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          An unexpected error occurred. Please try again or use the booking link
          to connect directly.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Try again
          </button>
          <a
            href="https://cal.com/ctoalpha/deep-dive"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-emerald-400/20 px-5 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/30 transition"
          >
            Book a Call
          </a>
        </div>
      </div>
    </main>
  );
}
