import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function MetricCard({ title, children }: Props) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-400/30 bg-[#050a16]/70 p-4 shadow-[0_0_0_1px_rgba(0,229,255,0.06),0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--x,50%)_var(--y,50%),rgba(0,229,255,0.08),transparent_60%)]" />
      <div className="flex items-center justify-between">
        <h3 className="font-rajdhani text-sm uppercase tracking-[0.25em] text-cyan-200/80">
          {title}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent ml-3" />
      </div>
      <div className="mt-3 text-3xl font-orbitron text-cyan-100 drop-shadow-[0_0_12px_rgba(0,229,255,0.35)]">
        {children}
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded bg-[#0b1f3d]">
        <div className="h-full w-full origin-left animate-scan bg-[linear-gradient(90deg,transparent,rgba(0,229,255,0.45),transparent)]" />
      </div>
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/20" />
    </div>
  );
}
