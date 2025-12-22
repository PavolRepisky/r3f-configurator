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
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-1 bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-full shadow-xl animate-in slide-in-from-bottom-4 duration-700 delay-200">
      {/* Exterior Button */}
      <button
        type="button"
        onClick={() => setView("exterior")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
          !isInterior
            ? "bg-gray-900 text-white shadow-lg scale-105"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
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
            ? "bg-gray-900 text-white shadow-lg scale-105"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        )}
      >
        <Armchair className="w-3.5 h-3.5" />
        <span>Interior</span>
      </button>
    </div>
  );
}
