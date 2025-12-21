// src/store/useConfigurator.ts
import { create } from "zustand";
import { DEFAULT_CURRENCY } from "@/data/currency";
import { FEATURES } from "@/data/features";
import { MODELS } from "@/data/models";
import { OPTIONS } from "@/data/options";
import { STEPS } from "@/data/steps";
import type { CurrencyCode, Locale, Rule } from "@/types/configurator";

const DEFAULT_MODEL_ID = Object.keys(MODELS)[0] || "e3";

export interface ConfigState {
  currentModelId: string;
  isConfiguring: boolean; // <--- NEW
  currentStepIndex: number;
  selections: Record<string, string>;
  totalPrice: number;
  activeRules: Rule[];
  currency: CurrencyCode;
  locale: Locale;
  showVat: boolean;

  selectModel: (modelId: string) => void; // <--- NEW
  resetToLanding: () => void; // <--- NEW

  setModel: (modelId: string) => void;
  toggleSelection: (featureId: string, optionId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (index: number) => void;
  setCurrency: (code: CurrencyCode) => void;
  setLocale: (locale: Locale) => void;
  toggleVat: () => void;
  applyRules: () => Rule[];
}

export const useConfigurator = create<ConfigState>((set, get) => ({
  currentModelId: DEFAULT_MODEL_ID,
  isConfiguring: false, // Start at Landing Page
  currentStepIndex: 0,
  selections: {},
  totalPrice: 0,
  activeRules: [],
  currency: DEFAULT_CURRENCY,
  locale: "en",
  showVat: true,

  selectModel: (modelId) => {
    const model = MODELS[modelId];
    if (!model) return;
    set({
      currentModelId: modelId,
      isConfiguring: true,
      currentStepIndex: 0,
      selections: {},
      totalPrice: model.basePrice,
      activeRules: [],
    });
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

  nextStep: () =>
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, STEPS.length - 1),
    })),
  prevStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
    })),
  setStep: (idx) => set({ currentStepIndex: idx }),
  setCurrency: (code) => set({ currency: code }),
  setLocale: (locale) => set({ locale }),
  toggleVat: () => set((state) => ({ showVat: !state.showVat })),

  applyRules: () => {
    const rules: Rule[] = [];
    const state = get();
    // Default hidden nodes from model
    const model = MODELS[state.currentModelId];
    if (model?.asset.hiddenNodes) {
      // We can handle defaults in SmartModel, or here if we want strict rule control
    }
    // Selection rules
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
