import type { z } from "zod";
import rawCameras from "@/data/json/cameras.json";
import rawCurrencies from "@/data/json/currencies.json";
import rawFeatures from "@/data/json/features.json";
// 1. Import Raw JSON Arrays
import rawModels from "@/data/json/models.json";
import rawOptions from "@/data/json/options.json";
import rawSteps from "@/data/json/steps.json";
// 2. Import Validators
import {
  CameraSchema,
  CurrencySchema,
  FeatureSchema,
  ModelSchema,
  OptionSchema,
  StepSchema,
} from "@/lib/validation";

// 3. Infer Types from Schemas
type Model = z.infer<typeof ModelSchema>[number];
type Feature = z.infer<typeof FeatureSchema>[number];
type Option = z.infer<typeof OptionSchema>[number];
type Currency = z.infer<typeof CurrencySchema>[number];
type CameraView = z.infer<typeof CameraSchema>[number];
type Step = z.infer<typeof StepSchema>[number];

// Extract CurrencyCode from Currency type
type CurrencyCode = Currency["code"];

// --- HELPER: Array -> Dictionary ---
function toDictionary<T extends { id: string }>(array: T[]): Record<string, T> {
  return array.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, T>,
  );
}

// --- HELPER: Currency Array -> Dictionary ---
function toCurrencyDictionary(
  array: Currency[],
): Record<CurrencyCode, Currency> {
  return array.reduce(
    (acc, item) => {
      acc[item.code] = item;
      return acc;
    },
    {} as Record<CurrencyCode, Currency>,
  );
}

// 4. Validate & Transform
// We parse the JSONs (as Arrays) and verify they match the schema.
const validModelsArray = ModelSchema.parse(rawModels);
const validFeaturesArray = FeatureSchema.parse(rawFeatures);
const validOptionsArray = OptionSchema.parse(rawOptions);
const validCurrenciesArray = CurrencySchema.parse(rawCurrencies);
const validCamerasArray = CameraSchema.parse(rawCameras);
const validStepsArray = StepSchema.parse(rawSteps);

// 5. Export as Dictionaries (For efficient O(1) app logic)
export const MODELS = toDictionary(validModelsArray);
export const FEATURES = toDictionary(validFeaturesArray);
export const OPTIONS = toDictionary(validOptionsArray);
export const CURRENCIES = toCurrencyDictionary(validCurrenciesArray);
export const CAMERAS = toDictionary(validCamerasArray);
export const STEPS = toDictionary(validStepsArray);

// --- API Helpers ---
export function getAllModels(): Model[] {
  return validModelsArray; // Return the array order defined in JSON
}

export function getModelDetails(modelId: string): Model | null {
  return MODELS[modelId] || null;
}

export function getAllSteps(): Step[] {
  return validStepsArray;
}

export function getStepDetails(stepId: string): Step | null {
  return STEPS[stepId] || null;
}

export function getFeatureDetails(featureId: string): Feature | null {
  return FEATURES[featureId] || null;
}

export function getOptionDetails(optionId: string): Option | null {
  return OPTIONS[optionId] || null;
}

export function getCurrencyDetails(
  currencyCode: CurrencyCode,
): Currency | null {
  return CURRENCIES[currencyCode] || null;
}

export function getAllCurrencies(): Currency[] {
  return validCurrenciesArray;
}

export function getAllCameras(): CameraView[] {
  return validCamerasArray;
}

export function getCameraDetails(cameraId: string): CameraView | null {
  return CAMERAS[cameraId] || null;
}

export type {
  Model,
  Feature,
  Option,
  Currency,
  CurrencyCode,
  CameraView,
  Step,
};
