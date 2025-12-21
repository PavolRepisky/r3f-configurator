export type Locale = "en" | "sk";
export type CurrencyCode = "EUR" | "USD" | "CZK";

export interface Currency {
  code: CurrencyCode;
  label: string;
  symbol: string;
  rate: number;
}

export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

export interface Model {
  id: string;
  label: string;
  description: string;
  basePrice: number;
  dimensions: number[];

  // NEW: Image for landing page
  image?: string;

  featureIds: string[];

  asset: {
    file: string;
    nodes?: Record<string, string[]>;
    materials?: Record<string, string>;
    hiddenNodes?: string[];
  };

  camera?: {
    exterior?: [number, number, number];
    interior?: [number, number, number];
  };
}

export interface Feature {
  id: string;
  label: string;
  type: "color" | "toggle" | "select";
  required?: boolean;
  optionIds: string[];
}

export interface Option {
  id: string;
  label: string;
  price: number;
  value?: string;
  rule?: Rule;
  incompatibleWith?: string[];
}

export interface Rule {
  show?: string[];
  hide?: string[];
  setMaterialColor?: Record<string, string>;
  materialVariants?: Record<string, string>;
  transform?: {
    node: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  };
}

export interface Step {
  id: string;
  label: string;
  featureIds: string[];
  cameraView: string;
}
