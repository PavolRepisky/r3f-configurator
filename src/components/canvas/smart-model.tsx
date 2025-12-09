"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Mesh } from "three";
import { applyRules } from "@/core/rule-engine";
import { indexScene } from "@/core/scene-indexer";
import { getModelDetails } from "@/lib/repository";
import { useConfigurator } from "@/store/useConfigurator";

export default function SmartModel() {
  const currentModelId = useConfigurator((state) => state.currentModelId);
  const activeRules = useConfigurator((state) => state.activeRules);

  const modelDef = getModelDetails(currentModelId);

  // Load the GLB (automatically caches)
  const { scene } = useGLTF(modelDef?.file || "/models/placeholder.glb");

  // Index the scene once when the model loads
  const index = useMemo(() => indexScene(scene), [scene]);

  // Apply rules whenever selections change
  useEffect(() => {
    if (!index) return;

    // 1. Reset Visibility (Optional safety net)
    scene.traverse((obj) => {
      if (obj instanceof Mesh) obj.visible = true;
    });

    // 2. Apply the active rules from the store
    applyRules(index, activeRules);
  }, [index, activeRules, scene]);

  return <primitive object={scene} />;
}
