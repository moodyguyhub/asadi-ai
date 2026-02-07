"use client";

import dynamic from "next/dynamic";

const GateDemoPage = dynamic(
  () =>
    import("@/components/gate-demo/GateDemoPage").then(
      (mod) => mod.GateDemoPage,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="glass rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div
          className="w-8 h-8 border-2 border-white/20 border-t-[rgb(var(--accent))] rounded-full animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-zinc-500">Loading Gate demo…</p>
      </div>
    ),
  },
);

export function GateDemoLazy() {
  return <GateDemoPage />;
}
