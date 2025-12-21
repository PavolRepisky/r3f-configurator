"use client";

import { Armchair, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/store/useConfigurator";

export function ViewToggle() {
  const { currentView, setView } = useConfigurator();

  // Helper to determine active state
  // We treat "exterior" and "exterior_far" as the generic Exterior group
  const isInterior = currentView === "interior";

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl animate-in slide-in-from-bottom-4 duration-700 delay-200">
      {/* Exterior Button */}
      <button
        type="button"
        onClick={() => setView("exterior")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
          !isInterior
            ? "bg-white text-black shadow-lg scale-105"
            : "text-zinc-400 hover:text-white hover:bg-white/10",
        )}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Exterior</span>
      </button>

      {/* Interior Button */}
      <button
        type="button"
        onClick={() => setView("interior")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
          isInterior
            ? "bg-white text-black shadow-lg scale-105"
            : "text-zinc-400 hover:text-white hover:bg-white/10",
        )}
      >
        <Armchair className="w-3.5 h-3.5" />
        <span>Interior</span>
      </button>
    </div>
  );
}
