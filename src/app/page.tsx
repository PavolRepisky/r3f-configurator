"use client";

import dynamic from "next/dynamic";
import { CameraDebugger } from "@/components/camera-debugger";
import { Footer } from "@/components/footer";
import { LoadingScreen } from "@/components/loading-screen";
import Sidebar from "@/components/sidebar";

const Experience = dynamic(() => import("@/components/canvas/experience"), {
  ssr: false,
  // Use the new component here
  loading: () => <LoadingScreen />,
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
      <CameraDebugger />

      {/* Footer */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block pointer-events-none select-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-sm shadow-2xl">
          <Footer variant="desktop" />
        </div>
      </div>
    </main>
  );
}
