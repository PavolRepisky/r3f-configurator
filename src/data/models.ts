import type { Model } from "@/types/configurator";
import e3 from "./blueprints/e3.json";
import e7 from "./blueprints/e7.json";

export const MODELS: Record<string, Model> = {
  e3: e3 as Model,
  e7: e7 as Model,
};
