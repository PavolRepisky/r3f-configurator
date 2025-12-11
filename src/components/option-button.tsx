"use client";

import { Check } from "lucide-react";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import type { CurrencyCode, Feature, Option } from "@/types/configurator";

interface OptionButtonProps {
  option: Option;
  feature: Feature;
  isSelected: boolean;
  currency: CurrencyCode;
  onToggle: () => void;
  t: (key: string) => string;
}

export function OptionButton({
  option,
  feature,
  isSelected,
  currency,
  onToggle,
  t,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between p-3 border transition-all duration-200 group relative overflow-hidden",
        isSelected
          ? "bg-zinc-900 border-orange-500/50"
          : "bg-black/20 border-zinc-800 hover:border-zinc-600",
      )}
    >
      {/* Active Indicator Line */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
      )}

      <div className="flex items-center gap-3 pl-1">
        {/* CASE A: Color Swatch */}
        {feature.type === "color" && option.value && (
          <div
            className={cn(
              "w-5 h-5 border shadow-sm transition-transform",
              isSelected ? "border-white scale-110" : "border-zinc-700",
            )}
            style={{ backgroundColor: option.value }}
          />
        )}

        {/* CASE B: Toggle/Select Box */}
        {(feature.type === "toggle" || feature.type === "select") && (
          <div
            className={cn(
              "w-4 h-4 border flex items-center justify-center transition-colors",
              isSelected
                ? "bg-white border-white"
                : "border-zinc-600 bg-transparent",
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-black stroke-3" />}
          </div>
        )}

        {/* Label */}
        <div className="flex flex-col items-start">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wide transition-colors",
              isSelected
                ? "text-white"
                : "text-zinc-400 group-hover:text-zinc-200",
            )}
          >
            {t(option.label)}
          </span>
        </div>
      </div>

      {/* Price Tag */}
      {option.price > 0 && (
        <span
          className={cn(
            "text-[10px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/5",
            isSelected
              ? "text-orange-400 border-orange-500/30"
              : "text-zinc-600",
          )}
        >
          + {formatPrice(option.price, currency)}
        </span>
      )}
    </button>
  );
}
