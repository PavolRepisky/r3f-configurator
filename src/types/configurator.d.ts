export type Locale = "en" | "sk";

export interface LocalizedString {
  en: string;
  sk: string;
}

// --- CURRENCY & PRICING ---
export type CurrencyCode = "EUR" | "USD" | "CZK";

export interface Currency {
  code: CurrencyCode;
  label: string;
  symbol: string;
  rate: number; // Exchange rate relative to Base Currency (EUR)
}

// --- 3D & ASSETS ---
export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

// --- CONFIGURATION OBJECTS ---
export interface Model {
  id: string;
  label: string;
  description: LocalizedString;
  basePrice: number;
  file: string; // Path to GLB in /public
  dimensions: [number, number, number];
  featureIds: string[]; // List of features available for this model
}

export interface Feature {
  id: string;
  label: LocalizedString;
  type: "color" | "toggle" | "select";
  required?: boolean;
  optionIds: string[];
}

export interface Option {
  id: string;
  label: LocalizedString;
  price: number;
  value?: string; // Hex color code or texture path
  rule?: Rule; // What happens to the 3D scene when selected?
  incompatibleWith?: string[]; // IDs of options that cannot coexist
}

// --- RULES ENGINE ---
export interface Rule {
  show?: string[]; // Node tags to show
  hide?: string[]; // Node tags to hide
  setMaterialColor?: Record<string, string>; // { "MaterialName": "#ff0000" }
  materialVariants?: Record<string, string>; // { "MaterialName": "VariantName" }
  transform?: {
    node: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  };
}
