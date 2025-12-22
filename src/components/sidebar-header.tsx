"use client";

import { ArrowLeft, Box } from "lucide-react";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProgressBar } from "@/components/progress-bar";
import { Badge } from "@/components/ui/badge";
import { STEPS } from "@/data/steps";
import { useTranslation } from "@/hooks/useTranslation";
import { getModelDetails } from "@/lib/repository";
import { useConfigurator } from "@/store/useConfigurator";

export function SidebarHeader() {
  const { currentStepIndex, currentModelId, resetToLanding } =
    useConfigurator();
  const { t } = useTranslation();

  const currentStep = STEPS[currentStepIndex];
  const model = getModelDetails(currentModelId);

  return (
    <div className="relative z-10 shrink-0 p-5 border-b border-gray-200 bg-white">
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-conthrax tracking-wider uppercase text-gray-900">
            TERRA<span className="text-orange-500">BOX</span>
          </h1>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-orange-500/50 text-orange-500 bg-orange-500/10 text-[9px] px-1.5 py-0 rounded-md h-4"
            >
              BETA v1.0
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <CurrencySwitcher />
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <Box className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-wide">
            {model ? t(model.label) : "Unknown Model"}
          </span>
        </div>

        <button
          type="button"
          onClick={resetToLanding}
          className="group flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
          <span>{t("ui.change_model") || "Switch"}</span>
        </button>
      </div>

      <ProgressBar />

      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-gray-300 font-conthrax text-2xl">
          0{currentStepIndex + 1}
        </span>
        <h2 className="text-sm font-conthrax tracking-wide uppercase text-gray-900">
          {t(currentStep.label)}
        </h2>
      </div>
    </div>
  );
}
