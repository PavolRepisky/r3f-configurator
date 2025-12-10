"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { CameraDebugger } from "@/components/camera-debugger"; // <--- Import

const Experience = dynamic(() => import("@/components/canvas/experience"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-neutral-950 flex items-center justify-center text-zinc-500 font-mono text-sm">
      INITIALIZING ENGINE...
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black selection:bg-orange-500/30">
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Experience />
      </div>

      {/* UI Layers */}
      <Sidebar />
      <CameraDebugger /> {/* <--- Added here */}

      {/* Footer */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block pointer-events-none select-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-sm shadow-2xl">
           <Footer variant="desktop" />
        </div>
      </div>

    </main>
  );
}