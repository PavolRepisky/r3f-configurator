// src/types/configurator.ts

// --- LOCALIZATION ---
// We use simple string keys (e.g. "model.e3.label") for translation
export type Locale = "en" | "sk";

// --- CURRENCY ---
export type CurrencyCode = "EUR" | "USD" | "CZK";

export interface Currency {
  code: CurrencyCode;
  label: string;
  symbol: string;
  rate: number; // Exchange rate relative to Base Currency (EUR)
}

// --- 3D ASSETS & CAMERAS ---
export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

// --- DATA MODELS ---

export interface Model {
  id: string;
  label: string; // Translation Key
  description: string; // Translation Key
  basePrice: number;
  file: string; // Path to GLB
  dimensions: [number, number, number];
  featureIds: string[];
}

export interface Feature {
  id: string;
  label: string; // Translation Key
  type: "color" | "toggle" | "select";
  required?: boolean;
  optionIds: string[];
}

export interface Option {
  id: string;
  label: string; // Translation Key
  price: number;
  value?: string; // Hex color or specific value
  rule?: Rule; // Logic applied when selected
  incompatibleWith?: string[]; // Logic for conflicts
}

// --- RULES ENGINE ---
export interface Rule {
  show?: string[]; // Node tags to make visible
  hide?: string[]; // Node tags to hide
  setMaterialColor?: Record<string, string>; // { "MaterialName": "#hex" }
  materialVariants?: Record<string, string>; // { "MaterialName": "VariantName" }
  transform?: {
    node: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  };
}

// --- UI STEPS ---
export interface Step {
  id: string;
  label: string; // Translation Key (e.g., "step.exterior")
  featureIds: string[]; // IDs of features to display in Sidebar
  cameraView: string; // Key matches keys in src/data/cameras.ts
}

