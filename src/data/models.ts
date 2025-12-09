import type { Model } from "@/types/configurator";

const COMMON_FEATURES = [
  "feat_exterior_design",
  "feat_exterior_tech",
  "feat_interior_layout",
  "feat_interior_kitchen",
];

export const MODELS: Record<string, Model> = {
  e3: {
    id: "e3",
    label: "model.e3.label",
    description: "model.e3.desc",
    basePrice: 14000,
    file: "/models/cube.glb",
    dimensions: [4, 2.5, 3],
    featureIds: COMMON_FEATURES,
  },
  e7: {
    id: "e7",
    label: "model.e7.label",
    description: "model.e7.desc",
    basePrice: 24900,
    file: "/models/cube.glb",
    dimensions: [7, 3, 3],
    featureIds: COMMON_FEATURES,
  },
};
