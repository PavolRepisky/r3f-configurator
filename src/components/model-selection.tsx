"use client";

import { ModelPreview } from "@/components/model-preview";
import type { CurrencyCode, Model } from "@/types/configurator";

interface ModelSelectionProps {
  models: Model[];
  currentModelId: string;
  currency: CurrencyCode;
  onSelect: (modelId: string) => void;
  t: (key: string) => string;
}

export function ModelSelection({
  models,
  currentModelId,
  currency,
  onSelect,
  t,
}: ModelSelectionProps) {
  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 gap-3">
        {models.map((model) => (
          <ModelPreview
            key={model.id}
            model={model}
            isActive={currentModelId === model.id}
            currency={currency}
            onClick={() => onSelect(model.id)}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}
