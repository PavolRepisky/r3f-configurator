"use client";

import { ContactShadows, Environment, Stage } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect } from "react";
import { CameraManager } from "./camera-manager";
import SmartModel from "./smart-model";

export default function Experience() {
  return (
    <div className="w-full h-screen bg-neutral-950">
      <Canvas
        shadows
        dpr={[1, 2]}
        // CRITICAL: Allows taking the screenshot for PDF
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 0], fov: 45 }}
      >
        {/* Logic Components */}
        <ScreenshotHandler />
        <CameraManager />

        {/* 3D Content */}
        <Stage
          intensity={0.5}
          environment="city"
          adjustCamera={false} // We handle camera manually
          shadows={{ type: "accumulative", bias: -0.001, intensity: Math.PI }}
        >
          <SmartModel />
        </Stage>

        {/* Ambience */}
        <Environment preset="city" background={false} blur={1} />

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.6}
          scale={20}
          blur={2.5}
          far={4}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}

// --- SUB-COMPONENT: Screenshot Logic ---
function ScreenshotHandler() {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const handleRequest = () => {
      try {
        gl.render(scene, camera);
        const dataUrl = gl.domElement.toDataURL("image/png", 0.9);
        window.dispatchEvent(
          new CustomEvent("screenshot-captured", { detail: dataUrl }),
        );
      } catch (e) {
        console.error("Screenshot failed", e);
        window.dispatchEvent(
          new CustomEvent("screenshot-captured", { detail: null }),
        );
      }
    };

    window.addEventListener("request-screenshot", handleRequest);
    return () =>
      window.removeEventListener("request-screenshot", handleRequest);
  }, [gl, scene, camera]);

  return null;
}
