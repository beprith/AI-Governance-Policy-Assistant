import React from "react";
import BackgroundFX from "../tech/BackgroundFX";
import Header from "../tech/Header";
import Logo from "../tech/Logo";

type Props = {
  children: React.ReactNode;
  onLogoClick?: () => void;
};

export default function AppLayout({ children, onLogoClick }: Props) {
  return (
    <div className="relative min-h-screen bg-[#0a0f1c] text-white overflow-x-hidden">
      <BackgroundFX />
      
      {/* Main Header */}
      <header className="relative z-50 border-b border-cyan-400/20 bg-[#0a0f1c]/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="md" className="drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]" onClick={onLogoClick} />
              <div>
                <h1 className="font-orbitron text-lg font-bold text-white">GOVERNANCE CODE GENERATOR</h1>
                <p className="font-rajdhani text-xs uppercase tracking-widest text-cyan-300/70">Policy Generation Engine</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="font-rajdhani text-sm uppercase tracking-wider text-emerald-300">SYSTEM READY</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
