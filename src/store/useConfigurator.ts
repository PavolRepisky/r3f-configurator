import { create } from "zustand";
import {
  getAllCurrencies,
  getAllModels,
  getAllSteps,
  getFeatureDetails,
  getModelDetails,
  getOptionDetails,
} from "@/lib/repository";
import type { CurrencyCode, Locale, Rule } from "@/types/configurator";

const DEFAULT_MODEL_ID = getAllModels()[0]?.id || "e3";

export interface ConfigState {
  // --- STATE ---
  currentModelId: string;
  isConfiguring: boolean;
  currentStepIndex: number;

  // NEW: Track the active camera view explicitly
  currentView: string;

  selections: Record<string, string>;
  totalPrice: number;
  activeRules: Rule[];
  currency: CurrencyCode;
  locale: Locale;
  showVat: boolean;

  // --- ACTIONS ---
  selectModel: (modelId: string) => void;
  resetToLanding: () => void;
  setModel: (modelId: string) => void;
  toggleSelection: (featureId: string, optionId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (index: number) => void;

  // NEW: Manual View Switcher
  setView: (view: string) => void;

  setCurrency: (code: CurrencyCode) => void;
  setLocale: (locale: Locale) => void;
  toggleVat: () => void;
  applyRules: () => Rule[];
}

export const useConfigurator = create<ConfigState>((set, get) => ({
  // --- INITIAL STATE ---
  currentModelId: DEFAULT_MODEL_ID,
  isConfiguring: false,
  currentStepIndex: 0,

  // Default to the view of the first step (usually "exterior")
  currentView: getAllSteps()[0]?.cameraView || "exterior",

  selections: {},
  totalPrice: 0,
  activeRules: [],
  currency: getAllCurrencies()[0]?.code || "EUR",
  locale: "en",
  showVat: true,

  // --- ACTIONS ---

  setView: (view) => set({ currentView: view }),

  selectModel: (modelId) => {
    const model = getModelDetails(modelId);
    if (!model) return;
    set({
      currentModelId: modelId,
      isConfiguring: true,
      currentStepIndex: 0,
      currentView: getAllSteps()[0]?.cameraView || "exterior", // Reset view on load
      selections: {},
      totalPrice: model.basePrice,
      activeRules: [],
    });
    // Apply default visibility rules
    get().applyRules();
  },

  resetToLanding: () => {
    set({ isConfiguring: false });
  },

  setModel: (modelId) => {
    const model = getModelDetails(modelId);
    if (!model) return;
    set((state) => {
      const newPrice = calculateTotal(model.basePrice, state.selections);
      return { currentModelId: modelId, totalPrice: newPrice };
    });
    get().applyRules();
  },

  toggleSelection: (featureId, optionId) => {
    set((state) => {
      const newSelections = { ...state.selections };
      const feature = getFeatureDetails(featureId);
      if (!feature) return state;

      if (newSelections[featureId] === optionId) {
        if (!feature.required) delete newSelections[featureId];
      } else {
        newSelections[featureId] = optionId;
        // Conflict logic
        const optionDef = getOptionDetails(optionId);
        if (optionDef?.incompatibleWith) {
          optionDef.incompatibleWith.forEach((inc) => {
            const conflict = Object.keys(newSelections).find(
              (k) => newSelections[k] === inc,
            );
            if (conflict) delete newSelections[conflict];
          });
        }
      }

      const model = getModelDetails(state.currentModelId);
      const basePrice = model ? model.basePrice : 0;
      const newPrice = calculateTotal(basePrice, newSelections);

      return { selections: newSelections, totalPrice: newPrice };
    });
    get().applyRules();
  },

  // Update navigation to sync view with step
  nextStep: () =>
    set((state) => {
      const nextIndex = Math.min(
        state.currentStepIndex + 1,
        getAllSteps().length - 1,
      );
      return {
        currentStepIndex: nextIndex,
        currentView: getAllSteps()[nextIndex].cameraView, // Auto-switch view
      };
    }),

  prevStep: () =>
    set((state) => {
      const prevIndex = Math.max(state.currentStepIndex - 1, 0);
      return {
        currentStepIndex: prevIndex,
        currentView: getAllSteps()[prevIndex].cameraView, // Auto-switch view
      };
    }),

  setStep: (idx) =>
    set({
      currentStepIndex: idx,
      currentView: getAllSteps()[idx].cameraView, // Auto-switch view
    }),

  setCurrency: (code) => set({ currency: code }),
  setLocale: (locale) => set({ locale }),
  toggleVat: () => set((state) => ({ showVat: !state.showVat })),

  applyRules: () => {
    const rules: Rule[] = [];
    const state = get();
    // 1. Model Defaults (could be handled here or in SmartModel)

    // 2. Option Rules
    Object.values(state.selections).forEach((optionId) => {
      const option = getOptionDetails(optionId);
      if (option?.rule) rules.push(option.rule);
    });
    set({ activeRules: rules });
    return rules;
  },
}));

function calculateTotal(basePrice: number, selections: Record<string, string>) {
  let total = basePrice;
  Object.values(selections).forEach((id) => {
    const opt = getOptionDetails(id);
    if (opt) total += opt.price;
  });
  return total;
}
