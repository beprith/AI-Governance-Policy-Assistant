import React, { useEffect, useRef } from "react";

type Props = {
  logs: { t: string; m: string }[];
};

export default function StatusConsole({ logs }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [logs]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-emerald-400/30 bg-[#0D1117]/90 p-4 font-mono text-[12px] leading-relaxed text-emerald-300 shadow-[0_0_0_1px_rgba(57,255,20,0.06),0_10px_30px_-10px_rgba(0,0,0,0.6)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.06)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      <div ref={ref} className="relative max-h-56 overflow-auto pr-2">
        {logs.map((l, i) => (
          <div key={i} className="animate-fade-in">
            <span className="text-emerald-500">[{l.t}]</span> {l.m}
          </div>
        ))}
      </div>
    </div>
  );
}
