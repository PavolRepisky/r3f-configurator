import type { Feature } from "@/types/configurator";

export const FEATURES: Record<string, Feature> = {
  // --- EXTERIOR STEP ---

  feat_exterior_finish: {
    id: "feat_exterior_finish",
    label: "feature.exterior.finish", // "Exterior Cladding"
    type: "color", // Renders as color swatches
    required: true,
    optionIds: ["opt_ext_white", "opt_ext_wood", "opt_ext_metal"],
  },

  feat_exterior_tech: {
    id: "feat_exterior_tech",
    label: "feature.exterior.tech", // "Smart Add-ons"
    type: "toggle", // Renders as checkboxes
    required: false,
    optionIds: ["opt_solar", "opt_ac", "opt_security"],
  },

  // --- INTERIOR STEP ---

  feat_interior_layout: {
    id: "feat_interior_layout",
    label: "feature.interior.layout", // "Floor Plan"
    type: "select", // Renders as selection cards
    required: true,
    optionIds: ["opt_layout_open", "opt_layout_bedroom"],
  },

  feat_interior_flooring: {
    id: "feat_interior_flooring",
    label: "feature.interior.flooring", // "Flooring Material"
    type: "color",
    required: true,
    optionIds: ["opt_floor_light", "opt_floor_dark", "opt_floor_stone"],
  },

  feat_interior_kitchen: {
    id: "feat_interior_kitchen",
    label: "feature.interior.kitchen", // "Kitchen Module"
    type: "select",
    required: true,
    optionIds: [
      "opt_kitchen_none",
      "opt_kitchen_standard",
      "opt_kitchen_island",
    ],
  },
};
