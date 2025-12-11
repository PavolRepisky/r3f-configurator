"use client";

import { Cpu, Settings, Settings2 } from "lucide-react";
import { OptionButton } from "@/components/option-button";
import { FEATURES } from "@/data/features";
import { OPTIONS } from "@/data/options";
import type { CurrencyCode } from "@/types/configurator";

interface FeatureSelectionProps {
  featureId: string;
  index: number;
  selections: Record<string, string>;
  currency: CurrencyCode;
  onToggle: (featureId: string, optionId: string) => void;
  t: (key: string) => string;
}

export function FeatureSelection({
  featureId,
  index,
  selections,
  currency,
  onToggle,
  t,
}: FeatureSelectionProps) {
  const feature = FEATURES[featureId];
  if (!feature) return null;

  // Hydrate options
  const options = feature.optionIds.map((id) => OPTIONS[id]).filter(Boolean);

  return (
    <section
      className="animate-in fade-in slide-in-from-bottom-2 duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Settings2 className="w-3 h-3 text-orange-500" />
        <h3 className="text-xs font-conthrax uppercase tracking-wider text-zinc-400">
          {t(feature.label)}
        </h3>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* Options List */}
      <div className="space-y-2">
        {options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            feature={feature}
            isSelected={selections[feature.id] === option.id}
            currency={currency}
            onToggle={() => onToggle(feature.id, option.id)}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}
