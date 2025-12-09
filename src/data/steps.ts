// src/data/steps.ts
import type { Step } from "@/types/configurator";

export const STEPS: Step[] = [
  // --- STEP 1: MODEL SELECTION ---
  {
    id: "step_model",
    label: "step.model", // "Model Selection"
    featureIds: [], // Model selection is handled explicitly in the UI
    cameraView: "exterior_far", // Wide shot
  },

  // --- STEP 2: EXTERIOR CUSTOMIZATION ---
  {
    id: "step_exterior",
    label: "step.exterior", // "Exterior Design"
    featureIds: [
      "feat_exterior_finish", // Cladding Color
      "feat_exterior_tech", // Solar, AC, Security
    ],
    cameraView: "exterior", // Closer look at the building
  },

  // --- STEP 3: INTERIOR CUSTOMIZATION ---
  {
    id: "step_interior",
    label: "step.interior", // "Interior Layout"
    featureIds: [
      "feat_interior_layout", // Open vs Bedroom
      "feat_interior_flooring", // Floor materials
      "feat_interior_kitchen", // Kitchen modules
    ],
    cameraView: "interior", // Camera moves inside via window/door
  },

  // --- STEP 4: SUMMARY & QUOTE ---
  {
    id: "step_summary",
    label: "step.summary", // "Price Quote"
    featureIds: [], // No toggles, just the breakdown table
    cameraView: "orbit", // Free rotation around the house
  },
];
