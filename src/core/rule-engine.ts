import type { MeshStandardMaterial } from "three";
import type { Rule } from "@/types/configurator";
import type { SceneIndex } from "./scene-indexer";

export function applyRules(index: SceneIndex, rules: Rule[]) {
  rules.forEach((rule) => {
    if (rule.show) {
      rule.show.forEach((tag) => {
        setVisibility(index, tag, true);
      });
    }
    if (rule.hide) {
      rule.hide.forEach((tag) => {
        setVisibility(index, tag, false);
      });
    }

    if (rule.setMaterialColor) {
      Object.entries(rule.setMaterialColor).forEach(([matName, color]) => {
        console.log(matName);
        console.log(index.materials);
        const mat = index.materials[matName];
        if (mat && "color" in mat) {
          (mat as MeshStandardMaterial).color.set(color);
        }
      });
    }

    if (rule.transform) {
      const nodes = index.tags[rule.transform.node];
      if (nodes) {
        nodes.forEach((node) => {
          if (rule.transform?.position)
            node.position.fromArray(rule.transform.position);
          if (rule.transform?.rotation)
            node.rotation.fromArray(rule.transform.rotation);
          if (rule.transform?.scale) node.scale.fromArray(rule.transform.scale);
        });
      }
    }
  });
}

function setVisibility(index: SceneIndex, tag: string, visible: boolean) {
  const nodes = index.tags[tag];
  if (!nodes) return;
  nodes.forEach((node) => {
    node.visible = visible;
  });
}
