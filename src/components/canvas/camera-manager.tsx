"use client";

import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, Vector3 } from "three";
import { useConfigurator } from "@/store/useConfigurator";
import { STEPS } from "@/data/steps";
import { CAMERAS } from "@/data/cameras";

const ENABLE_DEBUG = process.env.NODE_ENV === "development";

export function CameraManager() {
  const controlsRef = useRef<CameraControls>(null);
  const currentStepIndex = useConfigurator((state) => state.currentStepIndex);

  // --- 1. SEND DEBUG DATA (60 FPS) ---
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

    // Format for clipboard (Raw array string)
    const rawPos = `[${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`;
    const rawTarget = `[${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`;

    // Dispatch event to UI
    const event = new CustomEvent("camera-debug-update", {
      detail: {
        pos: posStr,
        target: targetStr,
        raw: { pos: rawPos, target: rawTarget }
      }
    });
    window.dispatchEvent(event);
  });

  // --- 2. CAMERA TRANSITIONS ---
  useEffect(() => {
    if (!controlsRef.current) return;
    const step = STEPS[currentStepIndex];
    // @ts-ignore
    const view = CAMERAS[step.cameraView] || CAMERAS.exterior;
    const controls = controlsRef.current;

    const currentAzimuth = controls.azimuthAngle;
    const normalizedAzimuth = currentAzimuth % (2 * Math.PI);
    controls.rotateTo(normalizedAzimuth, controls.polarAngle, false);

    controls.setLookAt(
      view.position[0],
      view.position[1],
      view.position[2],
      view.target[0],
      view.target[1],
      view.target[2],
      true
    );
  }, [currentStepIndex]);

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