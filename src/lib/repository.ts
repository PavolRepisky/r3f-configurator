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
import type {
  CameraView,
  Currency,
  CurrencyCode,
  Feature,
  Model,
  Option,
  Step,
} from "@/types/configurator";

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

// 3. Validate & Transform
// We parse the JSONs (as Arrays) and verify they match the schema.
const validModelsArray = ModelSchema.parse(rawModels) as unknown as Model[];
const validFeaturesArray = FeatureSchema.parse(rawFeatures) as Feature[];
const validOptionsArray = OptionSchema.parse(rawOptions) as unknown as Option[];
const validCurrenciesArray = CurrencySchema.parse(rawCurrencies) as Currency[];

// 4. Export as Dictionaries (For efficient O(1) app logic)
export const MODELS = toDictionary(validModelsArray);
export const FEATURES = toDictionary(validFeaturesArray);
export const OPTIONS = toDictionary(validOptionsArray);
export const CURRENCIES = toCurrencyDictionary(validCurrenciesArray);

// 5. Export Arrays directly (For sequential usage)
export const STEPS = StepSchema.parse(rawSteps) as Step[];

// --- API Helpers ---
export function getAllModels() {
  return validModelsArray; // Return the array order defined in JSON
}

export function getModelDetails(modelId: string) {
  return MODELS[modelId] || null;
}
