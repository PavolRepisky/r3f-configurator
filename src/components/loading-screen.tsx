"use client";

import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="w-full h-screen bg-[#030303] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Spinner Container with Glow */}
        <div className="relative">
          {/* Orange Glow Behind */}
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full scale-150 animate-pulse" />

          {/* The Spinner */}
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin relative z-10" />
        </div>

        {/* Text Block */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-white font-conthrax tracking-widest text-xl drop-shadow-md">
            TERRABOX
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-px w-8 bg-zinc-800" />
            <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
              Initializing Engine...
            </span>
            <span className="h-px w-8 bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
