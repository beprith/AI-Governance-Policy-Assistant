import React from "react";

export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* radial glows */}
      <div className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-[-200px] left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      {/* hex/matrix overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.25] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,229,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* animated data streams */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-px w-1/3 -translate-x-full animate-stream bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"
            style={{
              top: `${(i + 1) * 7}%`,
              left: `${(i % 3) * 40}%`,
              animationDuration: "6s",
              animationTimingFunction: "linear",
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
