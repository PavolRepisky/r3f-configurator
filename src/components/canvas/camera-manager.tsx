"use client";

import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { CAMERAS } from "@/data/cameras";
import { STEPS } from "@/data/steps";
import { useConfigurator } from "@/store/useConfigurator";

export function CameraManager() {
  const controlsRef = useRef<CameraControls>(null);
  const currentStepIndex = useConfigurator((state) => state.currentStepIndex);

  useEffect(() => {
    if (!controlsRef.current) return;

    const step = STEPS[currentStepIndex];
    const view = CAMERAS[step.cameraView] || CAMERAS.exterior;

    controlsRef.current.setLookAt(
      view.position[0],
      view.position[1],
      view.position[2],
      view.target[0],
      view.target[1],
      view.target[2],
      true, // Enable smooth transition
    );
  }, [currentStepIndex]);

  return (
    <CameraControls
      ref={controlsRef}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 1.9} // Prevent going under the floor
      minDistance={2}
      maxDistance={25}
      truckSpeed={0} // Disable panning to keep focus on product
      makeDefault
    />
  );
}
