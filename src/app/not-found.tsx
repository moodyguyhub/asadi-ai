import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-white/10 tracking-tighter select-none">
          404
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          This page doesn&apos;t exist. Head back to the portfolio or ask Atlas
          anything.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition"
          >
            Back to Home
          </Link>
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
