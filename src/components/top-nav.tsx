"use client";

import Link from "next/link";
import { site } from "@/content/site";

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Evidence", href: "#evidence" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export function TopNav() {
  return (
    <nav className="sticky top-0 z-50 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 bg-[rgba(var(--background),0.95)] backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between h-14 sm:h-16 max-w-6xl mx-auto">
        <Link 
          href="/" 
          className="font-semibold text-white text-sm tracking-wide hover:text-[rgb(var(--accent))] transition-colors duration-200 shrink-0"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-4 sm:gap-8" role="navigation" aria-label="Page sections">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors duration-200 relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[rgb(var(--accent))] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
