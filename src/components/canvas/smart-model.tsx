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
  const { scene } = useGLTF(modelDef?.asset.file || "/models/placeholder.glb");

  // Index the scene once when the model loads
  const index = useMemo(() => indexScene(scene), [scene]);

  useEffect(() => {
    if (!index) return;

    if (modelDef.asset.hiddenNodes) {
      modelDef.asset.hiddenNodes.forEach((tag) => {
        const nodes = index.tags[tag];
        if (nodes) {
          nodes.forEach((node) => {
            node.visible = false;
          });
        }
      });
    }

    applyRules(index, activeRules);
  }, [index, activeRules, modelDef]);

  return <primitive object={scene} />;
}
