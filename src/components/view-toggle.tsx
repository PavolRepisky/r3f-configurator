"use client";

import { Rotate3d } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/store/useConfigurator";

export function ViewToggle() {
  const { currentView, setView } = useConfigurator();
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeView = currentView === "interior" ? "interior" : "exterior";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleSelect = (view: string) => {
    setView(view);
    // Optional: Close on select
    // setIsExpanded(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed left-6 top-1/2 -translate-y-1/2 z-30 select-none"
    >
      <div
        className={cn(
          "flex items-center bg-white border border-zinc-200 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden",
          // Animation: Expand width-wise
          isExpanded ? "rounded-[2rem] pr-2" : "rounded-full pr-0 w-12",
        )}
      >
        {/* --- MAIN ICON (Left Anchor) --- */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-12 h-12 flex items-center justify-center shrink-0 transition-colors duration-300 outline-none",
            // Neutral Gray when expanded, Orange when collapsed (to invite interaction)
            isExpanded
              ? "text-zinc-400 bg-zinc-50"
              : "text-orange-500 bg-white hover:bg-zinc-50",
          )}
          title="Change View"
        >
          <Rotate3d className="w-5 h-5" />
        </button>

        {/* --- TEXT OPTIONS (Horizontal) --- */}
        <div
          className={cn(
            "flex items-center gap-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            // Wider max-width to accommodate larger click targets
            isExpanded
              ? "max-w-[400px] opacity-100 pl-2"
              : "max-w-0 opacity-0 pl-0",
          )}
        >
          {/* Option 1: Overview */}
          <button
            onClick={() => handleSelect("exterior")}
            className={cn(
              // Increased padding (px-5 py-3) for easier clicking
              "text-sm font-medium transition-colors whitespace-nowrap outline-none px-5 py-3 rounded-md hover:bg-zinc-50",
              activeView === "exterior"
                ? "text-orange-500 font-bold"
                : "text-zinc-400 hover:text-zinc-600",
            )}
          >
            Overview
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-4 bg-zinc-200" />

          {/* Option 2: Interior */}
          <button
            onClick={() => handleSelect("interior")}
            className={cn(
              // Increased padding (px-5 py-3) for easier clicking
              "text-sm font-medium transition-colors whitespace-nowrap outline-none px-5 py-3 rounded-md hover:bg-zinc-50",
              activeView === "interior"
                ? "text-orange-500 font-bold"
                : "text-zinc-400 hover:text-zinc-600",
            )}
          >
            Interior
          </button>
        </div>
      </div>
    </div>
  );
}
