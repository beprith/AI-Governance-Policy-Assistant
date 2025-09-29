import React from "react";

type Props = {
  loading: boolean;
  progress: number;
  onClick: () => void;
};

export default function ExecuteButton({ loading, progress, onClick }: Props) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* floating indicators */}
      <div className="pointer-events-none absolute -inset-10 -z-10">
        <div className="absolute left-4 top-0 h-16 w-16 animate-float-slow rounded-full bg-cyan-400/10 blur-xl" />
        <div className="absolute right-6 top-8 h-14 w-14 animate-float delay-300 rounded-full bg-blue-500/10 blur-xl" />
        <div className="absolute bottom-4 left-10 h-12 w-12 animate-float delay-500 rounded-full bg-cyan-300/10 blur-lg" />
      </div>

      <button
        onClick={onClick}
        disabled={loading}
        className="group relative w-full overflow-hidden rounded-xl border border-cyan-400/40 bg-gradient-to-r from-[#001B3D] to-[#023e5c] p-px shadow-neon transition-transform active:scale-[0.99] disabled:cursor-wait"
      >
        <span className="absolute inset-0 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,229,255,0.2),transparent_30%,rgba(0,229,255,0.2),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="block rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent),linear-gradient(90deg,#001B3D,#023e5c)] px-8 py-6 text-center">
          <span className="font-orbitron text-lg sm:text-2xl font-bold uppercase tracking-[0.25em] text-cyan-200 drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
            {loading ? "Processing..." : "Execute Code Generation"}
          </span>
          <span className="mt-3 block text-xs uppercase tracking-[0.35em] text-cyan-400/70">
            Secure • Deterministic • Compliant
          </span>
        </span>

        {/* glow border */}
        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-cyan-400/50" />
        <span className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_40px_rgba(0,229,255,0.15)]" />
      </button>

      {/* progress bar / ring */}
      {loading && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <div className="relative h-12 w-12">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 42 42">
              <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#0A84FF" />
                </linearGradient>
              </defs>
              <circle cx="21" cy="21" r="18" stroke="#0b2a4a" strokeWidth="4" fill="none" />
              <circle
                cx="21"
                cy="21"
                r="18"
                stroke="url(#g)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={Math.PI * 2 * 18}
                strokeDashoffset={((100 - progress) / 100) * Math.PI * 2 * 18}
                className="drop-shadow-[0_0_10px_rgba(0,229,255,0.6)] transition-all duration-300"
                fill="none"
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 animate-pulse text-center font-rajdhani text-[10px] leading-[48px] tracking-widest text-cyan-200/80">
              {Math.min(100, Math.max(0, Math.round(progress)))}%
            </div>
          </div>
          <div className="relative h-2 flex-1 overflow-hidden rounded-full border border-cyan-400/40 bg-[#0b1f3d]">
            <div
              className="h-full w-0 animate-none rounded-full bg-[linear-gradient(90deg,#001B3D,#00E5FF)] shadow-[0_0_12px_1px_rgba(0,229,255,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
