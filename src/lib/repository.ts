import { MODELS } from "@/data/models";
import { OPTIONS } from "@/data/options";

/** Get a full list of available models */
export function getAllModels() {
  return Object.values(MODELS);
}

/** Get details for a specific model */
export function getModelDetails(modelId: string) {
  return MODELS[modelId] || null;
}

/** Get specific option details */
export function getOptionDetails(optionId: string) {
  return OPTIONS[optionId] || null;
}
