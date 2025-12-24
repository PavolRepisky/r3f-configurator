"use client";

import { Copy, Crosshair, MapPin, Scan, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ENABLE_DEBUG = process.env.NODE_ENV === "development";

export function CameraDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Data Refs
  const posRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const [data, setData] = useState<{ pos: string; target: string } | null>(
    null,
  );

  // --- 1. KEYBOARD LISTENER (Shift + D) ---
  useEffect(() => {
    if (!ENABLE_DEBUG) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        setIsVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- 2. DATA LISTENER ---
  useEffect(() => {
    if (!ENABLE_DEBUG) return;

    const handleUpdate = (e: Event) => {
      // Only update DOM if visible to save resources
      if (!isVisible) return;

      const customEvent = e as CustomEvent;
      if (posRef.current) posRef.current.innerText = customEvent.detail.pos;
      if (targetRef.current)
        targetRef.current.innerText = customEvent.detail.target;
      setData(customEvent.detail.raw);
    };

    window.addEventListener("camera-debug-update", handleUpdate);
    return () =>
      window.removeEventListener("camera-debug-update", handleUpdate);
  }, [isVisible]);

  const copyConfig = () => {
    if (!data) return;
    const configString = `    position: ${data.pos}, 
    target: ${data.target},`;

    navigator.clipboard.writeText(configString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ENABLE_DEBUG) return null;

  return (
    <>
      {/* --- TOGGLE TRIGGER BUTTON (Matches ViewToggle style) --- */}
      <button
        onClick={() => setIsVisible(true)}
        className={cn(
          "fixed top-4 left-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-zinc-200 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isVisible
            ? "opacity-0 scale-75 pointer-events-none"
            : "opacity-100 scale-100 hover:scale-110 hover:border-orange-500 hover:text-orange-600 text-zinc-600",
        )}
        title="Camera Debugger (Shift+D)"
      >
        <Scan className="w-5 h-5" />
      </button>

      {/* --- DEBUG PANEL --- */}
      <div
        className={cn(
          "fixed top-4 left-4 z-50 font-sans transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top-left",
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 -translate-y-4 pointer-events-none",
        )}
      >
        <div className="w-64 bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden text-xs">
          {/* Header */}
          <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-600">
              <Scan className="w-4 h-4" />
              <span className="font-bold tracking-wider uppercase text-zinc-900">
                Cam<span className="text-orange-500">Dev</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[9px] text-zinc-400 font-mono font-medium">
                DEBUG
              </div>
              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors p-1 hover:bg-zinc-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Data Grid */}
          <div className="p-4 space-y-4 font-mono text-[10px]">
            {/* Position */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <MapPin className="w-3 h-3" />
                <span className="font-bold tracking-wider uppercase">
                  Position
                </span>
              </div>
              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/60 text-zinc-700 whitespace-pre shadow-sm">
                <span ref={posRef}>Waiting...</span>
              </div>
            </div>

            {/* Target */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <Crosshair className="w-3 h-3" />
                <span className="font-bold tracking-wider uppercase">
                  Target
                </span>
              </div>
              <div className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200/60 text-zinc-700 whitespace-pre shadow-sm">
                <span ref={targetRef}>Waiting...</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={copyConfig}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 text-[10px] uppercase font-bold tracking-widest transition-all duration-200 border-t",
              copied
                ? "bg-orange-50 text-orange-600 border-orange-100"
                : "bg-white text-zinc-500 border-zinc-100 hover:bg-zinc-50 hover:text-zinc-900",
            )}
          >
            <Copy className="w-3 h-3" />
            {copied ? "COPIED TO CLIPBOARD" : "COPY CONFIG"}
          </button>
        </div>
      </div>
    </>
  );
}
