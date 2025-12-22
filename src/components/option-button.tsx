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
        "w-full flex items-center justify-between p-3 border transition-all duration-200 group relative overflow-hidden rounded-lg",
        isSelected
          ? "bg-orange-50 border-orange-500/50 shadow-sm"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm",
      )}
    >
      {/* Active Indicator Line */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-lg" />
      )}

      <div className="flex items-center gap-3 pl-1">
        {/* CASE A: Color Swatch */}
        {feature.type === "color" && option.value && (
          <div
            className={cn(
              "w-5 h-5 border shadow-sm transition-transform rounded",
              isSelected ? "border-orange-500 scale-110 ring-2 ring-orange-200" : "border-gray-300",
            )}
            style={{ backgroundColor: option.value }}
          />
        )}

        {/* CASE B: Toggle/Select Box */}
        {(feature.type === "toggle" || feature.type === "select") && (
          <div
            className={cn(
              "w-4 h-4 border flex items-center justify-center transition-colors rounded",
              isSelected
                ? "bg-orange-500 border-orange-500"
                : "border-gray-300 bg-transparent",
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-white stroke-3" />}
          </div>
        )}

        {/* Label */}
        <div className="flex flex-col items-start">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wide transition-colors",
              isSelected
                ? "text-gray-900"
                : "text-gray-600 group-hover:text-gray-900",
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
            "text-[10px] font-mono px-1.5 py-0.5 border rounded",
            isSelected
              ? "text-orange-600 border-orange-200 bg-orange-50"
              : "text-gray-500 border-gray-200 bg-gray-50",
          )}
        >
          + {formatPrice(option.price, currency)}
        </span>
      )}
    </button>
  );
}
