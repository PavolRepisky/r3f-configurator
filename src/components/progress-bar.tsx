"use client";

import { STEPS } from "@/data/steps";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/store/useConfigurator";

export function ProgressBar() {
  const { currentStepIndex, setStep } = useConfigurator();
  const { t } = useTranslation();

  return (
    // Increased container gap slightly to prevent accidental mis-clicks between steps
    <div className="flex gap-2 mb-4 h-4 items-center select-none">
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStepIndex;
        const isCompleted = idx < currentStepIndex;

        return (
          <button
            type="button"
            key={step.id}
            onClick={() => setStep(idx)}
            // Added 'group' to handle hover states cleanly
            className={cn(
              "relative flex-1 skew-x-[-20deg] transition-all duration-300 outline-none group",
              "h-1.5 hover:h-2", // Visual Height logic
              isActive
                ? "bg-orange-500"
                : isCompleted
                  ? "bg-white"
                  : "bg-zinc-800"
            )}
            title={t(step.label)}
          >
            {/* --- INVISIBLE HIT AREA --- */}
            {/* Extends click target 12px up and down without changing visuals */}
            <span className="absolute -top-3 -bottom-3 left-0 right-0 bg-transparent z-20 cursor-pointer" />

            {/* Active Glow Effect */}
            {isActive && (
              <span className="absolute inset-0 bg-orange-400 blur-[3px]" />
            )}
          </button>
        );
      })}
    </div>
  );
}