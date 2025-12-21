import { create } from "zustand";
import { DEFAULT_CURRENCY } from "@/data/currency";
import { FEATURES } from "@/data/features";
import { MODELS } from "@/data/models";
import { OPTIONS } from "@/data/options";
import { STEPS } from "@/data/steps";
import type { CurrencyCode, Locale, Rule } from "@/types/configurator";

const DEFAULT_MODEL_ID = Object.keys(MODELS)[0] || "e3";

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
  currentView: STEPS[0]?.cameraView || "exterior",

  selections: {},
  totalPrice: 0,
  activeRules: [],
  currency: DEFAULT_CURRENCY,
  locale: "en",
  showVat: true,

  // --- ACTIONS ---

  setView: (view) => set({ currentView: view }),

  selectModel: (modelId) => {
    const model = MODELS[modelId];
    if (!model) return;
    set({
      currentModelId: modelId,
      isConfiguring: true,
      currentStepIndex: 0,
      currentView: STEPS[0].cameraView, // Reset view on load
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
    const model = MODELS[modelId];
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
      const feature = FEATURES[featureId];
      if (!feature) return state;

      if (newSelections[featureId] === optionId) {
        if (!feature.required) delete newSelections[featureId];
      } else {
        newSelections[featureId] = optionId;
        // Conflict logic
        const optionDef = OPTIONS[optionId];
        if (optionDef?.incompatibleWith) {
          optionDef.incompatibleWith.forEach((inc) => {
            const conflict = Object.keys(newSelections).find(
              (k) => newSelections[k] === inc,
            );
            if (conflict) delete newSelections[conflict];
          });
        }
      }

      const model = MODELS[state.currentModelId];
      const basePrice = model ? model.basePrice : 0;
      const newPrice = calculateTotal(basePrice, newSelections);

      return { selections: newSelections, totalPrice: newPrice };
    });
    get().applyRules();
  },

  // Update navigation to sync view with step
  nextStep: () =>
    set((state) => {
      const nextIndex = Math.min(state.currentStepIndex + 1, STEPS.length - 1);
      return {
        currentStepIndex: nextIndex,
        currentView: STEPS[nextIndex].cameraView, // Auto-switch view
      };
    }),

  prevStep: () =>
    set((state) => {
      const prevIndex = Math.max(state.currentStepIndex - 1, 0);
      return {
        currentStepIndex: prevIndex,
        currentView: STEPS[prevIndex].cameraView, // Auto-switch view
      };
    }),

  setStep: (idx) =>
    set({
      currentStepIndex: idx,
      currentView: STEPS[idx].cameraView, // Auto-switch view
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
      const option = OPTIONS[optionId];
      if (option?.rule) rules.push(option.rule);
    });
    set({ activeRules: rules });
    return rules;
  },
}));

function calculateTotal(basePrice: number, selections: Record<string, string>) {
  let total = basePrice;
  Object.values(selections).forEach((id) => {
    const opt = OPTIONS[id];
    if (opt) total += opt.price;
  });
  return total;
}
