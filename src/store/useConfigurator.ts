import { create } from "zustand";
import { DEFAULT_CURRENCY } from "@/data/currency";
import { FEATURES } from "@/data/features";
import { MODELS } from "@/data/models";
import { OPTIONS } from "@/data/options";
import { STEPS } from "@/data/steps";
import type { CurrencyCode, Locale, Rule } from "@/types/configurator";

// --- CONFIG DEFAULTS ---
// We pick the first model available as the default
const DEFAULT_MODEL_ID = Object.keys(MODELS)[0] || "e3";

// Calculate initial price immediately
const initialModel = MODELS[DEFAULT_MODEL_ID];
const initialBasePrice = initialModel ? initialModel.basePrice : 0;

export interface ConfigState {
  // --- STATE ---
  currentModelId: string;
  currentStepIndex: number;
  selections: Record<string, string>; // { featureId: optionId }
  totalPrice: number; // Always in Base Currency (EUR)
  activeRules: Rule[]; // Rules derived from selections (for 3D engine)

  // Settings
  currency: CurrencyCode;
  locale: Locale;
  showVat: boolean;

  // --- ACTIONS ---
  setModel: (modelId: string) => void;
  toggleSelection: (featureId: string, optionId: string) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  setStep: (index: number) => void;

  // Settings Actions
  setCurrency: (code: CurrencyCode) => void;
  setLocale: (locale: Locale) => void;
  toggleVat: () => void;

  // Logic
  applyRules: () => Rule[];
}

export const useConfigurator = create<ConfigState>((set, get) => ({
  // --- INITIAL STATE ---
  currentModelId: DEFAULT_MODEL_ID,
  currentStepIndex: 0,
  selections: {}, // Empty start, or pre-populate defaults if needed
  totalPrice: initialBasePrice,
  activeRules: [],

  currency: DEFAULT_CURRENCY,
  locale: "en",
  showVat: true, // Default to showing VAT

  // --- ACTIONS ---

  setModel: (modelId: string) => {
    const model = MODELS[modelId];
    if (!model) return;

    set((state) => {
      // When changing models, we usually keep selections if possible,
      // or you could clear them: selections: {}
      const newPrice = calculateTotal(model.basePrice, state.selections);
      return { currentModelId: modelId, totalPrice: newPrice };
    });

    // Refresh rules after model change
    get().applyRules();
  },

  toggleSelection: (featureId, optionId) => {
    set((state) => {
      const newSelections = { ...state.selections };
      const feature = FEATURES[featureId];

      if (!feature) return state;

      // 1. Toggle Logic
      // If clicking the currently selected option...
      if (newSelections[featureId] === optionId) {
        // Only allow deselecting if NOT required (e.g., toggles)
        if (!feature.required) {
          delete newSelections[featureId];
        }
      } else {
        // Select the new option
        newSelections[featureId] = optionId;

        // 2. Conflict Logic (IncompatibleWith)
        // Check if this new option hates any existing options
        const optionDef = OPTIONS[optionId];
        if (optionDef?.incompatibleWith) {
          optionDef.incompatibleWith.forEach((incompatibleOptionId) => {
            // Check if we have selected this incompatible option anywhere
            const conflictingFeatureId = Object.keys(newSelections).find(
              (fid) => newSelections[fid] === incompatibleOptionId,
            );

            // If found, remove it (deselect)
            if (conflictingFeatureId) {
              delete newSelections[conflictingFeatureId];
            }
          });
        }
      }

      // 3. Recalculate Price
      const model = MODELS[state.currentModelId];
      const basePrice = model ? model.basePrice : 0;
      const newPrice = calculateTotal(basePrice, newSelections);

      return { selections: newSelections, totalPrice: newPrice };
    });

    // 4. Update 3D Rules
    get().applyRules();
  },

  nextStep: () =>
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, STEPS.length - 1),
    })),

  prevStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
    })),

  setStep: (index: number) =>
    set({
      currentStepIndex: Math.min(Math.max(index, 0), STEPS.length - 1),
    }),

  setCurrency: (code) => set({ currency: code }),

  setLocale: (locale) => set({ locale }),

  toggleVat: () => set((state) => ({ showVat: !state.showVat })),

  /**
   * Generates a flat list of rules based on current selections.
   * This is consumed by the Scene Indexer in the 3D Engine.
   */
  applyRules: () => {
    const rules: Rule[] = [];
    const state = get();

    // 1. Add Model specific rules? (Optional, usually model is base)

    // 2. Add Selection rules
    Object.values(state.selections).forEach((optionId) => {
      const option = OPTIONS[optionId];
      if (option?.rule) {
        rules.push(option.rule);
      }
    });

    set({ activeRules: rules });
    return rules;
  },
}));

/**
 * Helper: Sum base price + all selected options
 */
function calculateTotal(basePrice: number, selections: Record<string, string>) {
  let total = basePrice;
  Object.values(selections).forEach((optionId) => {
    const option = OPTIONS[optionId];
    if (option) {
      total += option.price;
    }
  });
  return total;
}
