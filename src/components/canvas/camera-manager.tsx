"use client";

import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, Vector3 } from "three";
import { CAMERAS } from "@/data/cameras";
import { useConfigurator } from "@/store/useConfigurator";

const ENABLE_DEBUG = process.env.NODE_ENV === "development";

export function CameraManager() {
  const controlsRef = useRef<CameraControls>(null);

  // 👇 LISTENER CHANGED: Watch currentView instead of currentStepIndex
  const currentView = useConfigurator((state) => state.currentView);

  // --- 1. DEBUG LOGIC (Sends data to UI) ---
  useFrame(() => {
    if (!ENABLE_DEBUG || !controlsRef.current) return;

    const controls = controlsRef.current;
    const pos = new Vector3();
    const target = new Vector3();

    controls.getPosition(pos);
    controls.getTarget(target);

    // Format for display
    const fmt = (n: number) => n.toFixed(2).padStart(6, " ");
    const posStr = `[${fmt(pos.x)}, ${fmt(pos.y)}, ${fmt(pos.z)}]`;
    const targetStr = `[${fmt(target.x)}, ${fmt(target.y)}, ${fmt(target.z)}]`;

    // Format for clipboard
    const rawPos = `[${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`;
    const rawTarget = `[${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`;

    const event = new CustomEvent("camera-debug-update", {
      detail: {
        pos: posStr,
        target: targetStr,
        raw: { pos: rawPos, target: rawTarget },
      },
    });
    window.dispatchEvent(event);
  });

  // --- 2. TRANSITION LOGIC ---
  useEffect(() => {
    if (!controlsRef.current) return;

    // Look up config directly by View ID
    const viewConfig = CAMERAS[currentView] || CAMERAS.exterior;
    const controls = controlsRef.current;

    // Normalize rotation to prevent spinning (Shortest path logic)
    const currentAzimuth = controls.azimuthAngle;
    const normalizedAzimuth = currentAzimuth % (2 * Math.PI);
    controls.rotateTo(normalizedAzimuth, controls.polarAngle, false);

    // Execute Move
    controls.setLookAt(
      viewConfig.position[0],
      viewConfig.position[1],
      viewConfig.position[2],
      viewConfig.target[0],
      viewConfig.target[1],
      viewConfig.target[2],
      true, // Smooth transition
    );
  }, [currentView]); // Triggers when Store updates currentView

  return (
    <CameraControls
      ref={controlsRef}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 1.9}
      minDistance={2}
      maxDistance={25}
      truckSpeed={0}
      makeDefault
    />
  );
}
