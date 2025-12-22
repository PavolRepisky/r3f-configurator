"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Crosshair, MapPin, Scan, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ENABLE_DEBUG = process.env.NODE_ENV === "development";

export function CameraDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Data Refs
  const posRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const [data, setData] = useState<{ pos: string; target: string } | null>(null);

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
      if (targetRef.current) targetRef.current.innerText = customEvent.detail.target;
      setData(customEvent.detail.raw);
    };

    window.addEventListener("camera-debug-update", handleUpdate);
    return () => window.removeEventListener("camera-debug-update", handleUpdate);
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
      {/* --- TOGGLE TRIGGER BUTTON --- */}
      <button
        onClick={() => setIsVisible(true)}
        className={cn(
          "fixed top-4 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-md border backdrop-blur-md transition-all duration-300 font-mono text-[9px] uppercase tracking-wider shadow-xl group",
          isVisible
            ? "opacity-0 pointer-events-none scale-90"
            : "opacity-100 bg-white/90 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-white hover:border-gray-300"
        )}
        title="Toggle Camera Debugger (Shift+D)"
      >
        <Scan className="w-3.5 h-3.5 group-hover:text-orange-500 transition-colors" />
        <span className="hidden sm:inline">Cam Dev</span>
      </button>

      {/* --- DEBUG PANEL --- */}
      <div 
        className={cn(
          "fixed top-4 left-4 z-50 font-sans transition-all duration-200 origin-top-left",
          isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="w-64 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-lg overflow-hidden text-xs">
          
          {/* Header */}
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-500">
              <Scan className="w-3.5 h-3.5" />
              <span className="font-conthrax text-[10px] tracking-widest uppercase text-gray-900">
                Cam<span className="text-orange-500">Dev</span>
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-[9px] text-gray-500 font-mono">DEBUG</div>
              {/* Close Button */}
              <button 
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Data Grid */}
          <div className="p-3 space-y-3 font-mono text-[10px]">
            {/* Position */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin className="w-3 h-3 text-gray-500" />
                <span className="font-bold tracking-wider">POS</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-md border border-gray-200 text-orange-600 whitespace-pre shadow-inner">
                <span ref={posRef}>Waiting...</span>
              </div>
            </div>

            {/* Target */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Crosshair className="w-3 h-3 text-gray-500" />
                <span className="font-bold tracking-wider">LOOK</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-md border border-gray-200 text-gray-700 whitespace-pre shadow-inner">
                <span ref={targetRef}>Waiting...</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={copyConfig}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase font-bold tracking-widest transition-all duration-300 border-t",
              copied
                ? "bg-orange-50 text-orange-600 border-orange-200"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Copy className="w-3 h-3" />
            {copied ? "COPIED!" : "COPY CONFIG"}
          </button>
        </div>
      </div>
    </>
  );
}