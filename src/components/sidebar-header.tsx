"use client";

import { CurrencySwitcher } from "@/components/currency-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ProgressBar } from "@/components/progress-bar";
import { Badge } from "@/components/ui/badge";
import { STEPS } from "@/data/steps";
import { useTranslation } from "@/hooks/useTranslation";
import { useConfigurator } from "@/store/useConfigurator";

export function SidebarHeader() {
  const { currentStepIndex } = useConfigurator();
  const { t } = useTranslation();
  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="relative z-10 shrink-0 p-5 border-b border-white/10 bg-black/60">
      <div className="flex justify-between items-start mb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-conthrax tracking-wider font-medium uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            TERRA<span className="text-orange-500">BOX</span>
          </h1>
          <Badge
            variant="outline"
            className="border-orange-500/50 text-orange-500 bg-orange-500/10 text-[9px] px-1.5 py-0 rounded-none h-4"
          >
            BETA v1.0
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <CurrencySwitcher />
          <LanguageSwitcher />
        </div>
      </div>

      <ProgressBar />

      <div className="flex items-center gap-3 mt-5 pb-2 border-b border-white/5">
        <span className="text-orange-500 font-conthrax text-xl select-none drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
          0{currentStepIndex + 1}
        </span>

        <div className="h-4 w-px bg-zinc-600 rotate-15" />

        <h2 className="text-sm font-medium font-conthrax tracking-wider uppercase text-zinc-100">
          {t(currentStep.label)}
        </h2>
      </div>
    </div>
  );
}
