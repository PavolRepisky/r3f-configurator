import { type Material, Mesh, type Object3D } from "three";

export interface SceneIndex {
  tags: Record<string, Object3D[]>; // Map "Tag" -> [Mesh1, Mesh2]
  materials: Record<string, Material>; // Map "MatName" -> Material
}

export function indexScene(scene: Object3D): SceneIndex {
  const tags: Record<string, Object3D[]> = {};
  const materials: Record<string, Material> = {};

  scene.traverse((obj) => {
    // 1. Index Materials
    if (obj instanceof Mesh) {
      const mat = obj.material as Material;
      if (mat?.name) {
        materials[mat.name] = mat;
      }
    }

    // 2. Index Tags (from userData or name)
    // We look for userData.tag (Blender Custom Property) OR obj.name
    const userData = obj.userData as any;

    // Strategy: Check userData.tag first, fallback to parsing the name
    const tagList: string[] = [];

    if (userData?.tag) {
      if (Array.isArray(userData.tag)) tagList.push(...userData.tag);
      else tagList.push(userData.tag);
    } else {
      // Fallback: If node is named "Tag_Wall_Bedroom", treat "Wall_Bedroom" as tag
      if (obj.name.startsWith("Tag_")) {
        tagList.push(obj.name.replace("Tag_", ""));
      }
      // Or just map the exact name
      tagList.push(obj.name);
    }

    tagList.forEach((tag) => {
      if (!tags[tag]) tags[tag] = [];
      tags[tag].push(obj);
    });
  });

  return { tags, materials };
}
