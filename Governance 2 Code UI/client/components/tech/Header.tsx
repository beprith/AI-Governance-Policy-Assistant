import React from "react";

export default function Header() {
  return (
    <header className="relative overflow-hidden border-b border-cyan-400/30 bg-[#020711]/90 backdrop-blur supports-[backdrop-filter]:bg-[#020711]/70">
      {/* animated grid */}
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(0,229,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(80%_60%_at_50%_0%,#000_60%,transparent_100%)]" />

      {/* holographic top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-9 w-9">
              <span className="absolute inset-0 rounded-md bg-gradient-to-br from-cyan-400/80 to-blue-500/80 blur-sm" />
              <span className="relative block h-full w-full rounded-md bg-[#0b1f3d] ring-1 ring-cyan-400/40" />
            </div>
            <h1 className="font-orbitron text-lg sm:text-2xl font-extrabold tracking-[0.2em] text-white drop-shadow-[0_0_12px_rgba(0,229,255,0.35)]">
              GOVERNANCE CODE GENERATOR
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgba(57,255,20,0.65)]" />
            </span>
            <span className="font-rajdhani text-xs sm:text-sm uppercase tracking-widest text-emerald-300/90">System Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
