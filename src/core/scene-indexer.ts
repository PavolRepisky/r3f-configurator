import { type Material, Mesh, type Object3D } from "three";
import type { Model } from "@/types/configurator";

export interface SceneIndex {
  tags: Record<string, Object3D[]>;
  materials: Record<string, Material>;
}

export function indexScene(scene: Object3D, blueprint?: Model): SceneIndex {
  const tags: Record<string, Object3D[]> = {};
  const materials: Record<string, Material> = {};

  // 1. Prepare Reverse Lookup Maps for O(1) access
  // Map "MeshName" -> ["Tag1", "Tag2"]
  const nodeToTags: Record<string, string[]> = {};

  if (blueprint?.asset.nodes) {
    Object.entries(blueprint.asset.nodes).forEach(([tag, nodeNames]) => {
      nodeNames.forEach((nodeName) => {
        if (!nodeToTags[nodeName]) nodeToTags[nodeName] = [];
        nodeToTags[nodeName].push(tag);
      });
    });
  }

  // 2. Traverse the Scene
  scene.traverse((obj) => {
    // --- Index Materials ---
    if (obj instanceof Mesh) {
      const mat = obj.material as Material;
      // Index by actual name
      if (mat.name) materials[mat.name] = mat;

      // Index by Logical Blueprint Name (e.g. "Mat_Exterior")
      if (blueprint?.asset.materials) {
        Object.entries(blueprint.asset.materials).forEach(
          ([logicalName, actualName]) => {
            if (mat.name === actualName) {
              materials[logicalName] = mat; // Allow lookup by "Mat_Exterior"
            }
          },
        );
      }
    }

    // --- Index Nodes (Tags) ---
    const tagList: string[] = [];

    // A. Check Blueprint Mapping (Priority)
    if (nodeToTags[obj.name]) {
      tagList.push(...nodeToTags[obj.name]);
    }

    // B. Check Blender Custom Properties (Fallback)
    const userData = obj.userData as any;
    if (userData?.tag) {
      if (Array.isArray(userData.tag)) tagList.push(...userData.tag);
      else tagList.push(userData.tag);
    }

    // C. Add to Index
    tagList.forEach((tag) => {
      if (!tags[tag]) tags[tag] = [];
      tags[tag].push(obj);
    });
  });

  return { tags, materials };
}
