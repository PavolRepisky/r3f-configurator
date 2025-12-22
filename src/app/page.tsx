"use client";

import dynamic from "next/dynamic";
import { CameraDebugger } from "@/components/camera-debugger";
import { Footer } from "@/components/footer";
import { LoadingScreen } from "@/components/loading-screen";
import { ModelLandingPage } from "@/components/model-landing-page";
import Sidebar from "@/components/sidebar";
import { ViewToggle } from "@/components/view-toggle"; // <--- Import
import { useConfigurator } from "@/store/useConfigurator";

const Experience = dynamic(() => import("@/components/canvas/experience"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  const isConfiguring = useConfigurator((state) => state.isConfiguring);

  if (!isConfiguring) {
    return <ModelLandingPage />;
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 selection:bg-orange-500/20">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Experience />
      </div>
      {/* UI Layers */}
      <Sidebar />
      {/* Overlays */}
      <CameraDebugger />
      <ViewToggle /> {/* <--- Added here */}
      {/* Footer */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:block pointer-events-none select-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-gray-200/80 p-4 rounded-lg shadow-xl">
          <Footer variant="desktop" />
        </div>
      </div>
    </main>
  );
}
