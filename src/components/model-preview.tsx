"use client";

import { Check } from "lucide-react";
import { ModelGraphic } from "@/components/model-graphic";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import { CurrencyCode, Model } from "@/types/configurator";

interface ModelPreviewProps {
  model: Model;
  isActive: boolean;
  currency: CurrencyCode;
  onClick: () => void;
  t: (key: string) => string;
}

export function ModelPreview({
  model,
  isActive,
  currency,
  onClick,
  t,
}: ModelPreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full text-left transition-all duration-300 border p-0 group overflow-hidden rounded-lg",
        isActive
          ? "border-orange-500 bg-orange-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      )}
    >
      {/* Corner Markers (Active State) */}
      {isActive && (
        <>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500 rounded-bl-lg" />
        </>
      )}

      <div className="p-4 flex gap-4">
        {/* SVG Graphic */}
        <div className="shrink-0 pt-1">
          <ModelGraphic modelId={model.id} isActive={isActive} />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <span
              className={cn(
                "font-conthrax text-lg uppercase truncate",
                isActive ? "text-gray-900" : "text-gray-600"
              )}
            >
              {t(model.label)}
            </span>
            {isActive && <Check className="w-4 h-4 text-orange-500" />}
          </div>

          <p className="text-xs text-gray-500 mb-3">
            {t(model.description)}
          </p>

          <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-2">
            <span className="text-xs font-mono text-gray-500">
              {model.dimensions.join(" x ")} M
            </span>
            <span
              className={cn(
                "text-sm font-conthrax font-medium",
                isActive ? "text-orange-600" : "text-gray-600"
              )}
            >
              {formatPrice(model.basePrice, currency)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}