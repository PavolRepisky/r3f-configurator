"use client";

import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  Cpu,
  FileDown,
  Info,
  Receipt,
} from "lucide-react";
import { useEffect, useState } from "react";
// App Components
import { CurrencySwitcher } from "@/components/currency-switcher";
import { Footer } from "@/components/footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ModelGraphic } from "@/components/model-graphic";
// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Data & Logic
import { FEATURES } from "@/data/features";
import { OPTIONS } from "@/data/options";
import { STEPS } from "@/data/steps";
import { useTranslation } from "@/hooks/useTranslation";
import { generateQuotePDF } from "@/lib/pdf-generator";
import { formatPrice } from "@/lib/price";
import { getAllModels, getModelDetails } from "@/lib/repository";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/store/useConfigurator";

export default function Sidebar() {
  const {
    currentModelId,
    currentStepIndex,
    selections,
    totalPrice,
    currency,
    showVat,
    toggleVat,
    setModel,
    toggleSelection,
    nextStep,
    prevStep,
    setStep,
  } = useConfigurator();

  const { t } = useTranslation();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const allModels = getAllModels();
  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  // --- VAT CALCULATION ---
  const vatRate = 0.23;
  const vatAmount = totalPrice * vatRate;
  const totalWithVat = totalPrice + vatAmount;
  const displayedPrice = showVat ? totalWithVat : totalPrice;

  // --- PDF LOGIC ---
  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    // 1. Request screenshot from Experience.tsx
    window.dispatchEvent(new Event("request-screenshot"));

    // 2. Safety timeout (reset if something hangs)
    setTimeout(() => {
      setIsGeneratingPdf((prev) => {
        if (prev) console.warn("PDF generation timed out.");
        return false;
      });
    }, 8000);
  };

  useEffect(() => {
    const onScreenshotCaptured = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      const imageDataUrl = customEvent.detail;

      if (imageDataUrl) {
        generateQuotePDF({
          modelId: currentModelId,
          selections,
          totalPrice,
          currency,
          showVat,
          imageDataUrl,
          t, // Pass translation helper
        });
      } else {
        alert("Failed to capture 3D scene.");
      }
      setIsGeneratingPdf(false);
    };

    window.addEventListener("screenshot-captured", onScreenshotCaptured);
    return () =>
      window.removeEventListener("screenshot-captured", onScreenshotCaptured);
  }, [currentModelId, selections, totalPrice, currency, showVat, t]);

  return (
    <div className="absolute top-0 right-0 h-dvh w-full md:w-[400px] bg-[#030303]/95 backdrop-blur-3xl border-l border-white/10 flex flex-col shadow-2xl z-20 text-white font-sans overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none z-0" />

      {/* ================= HEADER ================= */}
      <div className="relative z-10 shrink-0 p-5 border-b border-white/10 bg-black/60">
        <div className="flex justify-between items-start mb-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-conthrax tracking-wider uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
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

        {/* Progress Bar */}
        <div className="flex gap-1 mb-4 h-4 items-center">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            return (
              <button
                type="button"
                key={step.id}
                onClick={() => setStep(idx)}
                className={cn(
                  "h-1.5 flex-1 skew-x-[-20deg] transition-all duration-300 relative group border-l border-black outline-none",
                  isActive
                    ? "bg-orange-500"
                    : idx < currentStepIndex
                      ? "bg-white"
                      : "bg-zinc-800",
                  "hover:h-2",
                )}
                title={t(step.label)}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-orange-400 blur-[3px]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-zinc-600 font-conthrax text-2xl opacity-20">
            0{currentStepIndex + 1}
          </span>
          <h2 className="text-sm font-conthrax tracking-wide uppercase text-white">
            {t(currentStep.label)}
          </h2>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 min-h-0 relative z-10">
        <ScrollArea className="h-full w-full">
          <div className="p-5 space-y-6 pb-6">
            {/* --- STEP 1: MODEL SELECTION --- */}
            {currentStep.id === "step_model" && (
              <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 gap-3">
                  {allModels.map((model) => {
                    const isActive = currentModelId === model.id;
                    return (
                      <button
                        type="button"
                        key={model.id}
                        onClick={() => setModel(model.id)}
                        className={cn(
                          "relative w-full text-left transition-all duration-300 border p-0 group overflow-hidden",
                          isActive
                            ? "border-orange-500 bg-zinc-900/80"
                            : "border-zinc-800 bg-black/40 hover:border-zinc-600",
                        )}
                      >
                        {isActive && (
                          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500" />
                        )}
                        <div className="p-4 flex gap-4">
                          <div className="shrink-0 pt-1">
                            <ModelGraphic
                              modelId={model.id}
                              isActive={isActive}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <span
                                className={cn(
                                  "font-conthrax text-lg uppercase truncate",
                                  isActive ? "text-white" : "text-zinc-500",
                                )}
                              >
                                {t(model.label)}
                              </span>
                              {isActive && (
                                <Check className="w-4 h-4 text-orange-500" />
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-400 mb-3 line-clamp-2">
                              {t(model.description)}
                            </p>
                            <div className="flex justify-between items-end border-t border-dashed border-white/10 pt-2">
                              <span className="text-[9px] font-mono text-zinc-500">
                                {model.dimensions.join(" x ")} M
                              </span>
                              <span
                                className={cn(
                                  "text-sm font-conthrax",
                                  isActive
                                    ? "text-orange-400"
                                    : "text-zinc-500",
                                )}
                              >
                                {formatPrice(model.basePrice, currency)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* --- MIDDLE STEPS: FEATURES --- */}
            {currentStep.featureIds.map((featureId, index) => {
              const feature = FEATURES[featureId];
              if (!feature) return null;
              const options = feature.optionIds
                .map((id) => OPTIONS[id])
                .filter(Boolean);

              return (
                <section
                  key={feature.id}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Cpu className="w-3 h-3 text-orange-500" />
                    <h3 className="text-xs font-conthrax uppercase tracking-wider text-zinc-400">
                      {t(feature.label)}
                    </h3>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    {options.map((option) => {
                      const isSelected = selections[feature.id] === option.id;
                      return (
                        <button
                          type="button"
                          key={option.id}
                          onClick={() => toggleSelection(feature.id, option.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 border transition-all duration-200 group relative overflow-hidden",
                            isSelected
                              ? "bg-zinc-900 border-orange-500/50"
                              : "bg-black/20 border-zinc-800 hover:border-zinc-600",
                          )}
                        >
                          {isSelected && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-orange-500" />
                          )}
                          <div className="flex items-center gap-3 pl-1">
                            {feature.type === "color" && option.value && (
                              <div
                                className={cn(
                                  "w-5 h-5 border shadow-sm",
                                  isSelected
                                    ? "border-white"
                                    : "border-zinc-700",
                                )}
                                style={{ backgroundColor: option.value }}
                              />
                            )}
                            {(feature.type === "toggle" ||
                              feature.type === "select") && (
                              <div
                                className={cn(
                                  "w-4 h-4 border flex items-center justify-center",
                                  isSelected
                                    ? "bg-white border-white"
                                    : "border-zinc-600",
                                )}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 text-black stroke-3" />
                                )}
                              </div>
                            )}
                            <span
                              className={cn(
                                "text-xs font-bold uppercase tracking-wide",
                                isSelected ? "text-white" : "text-zinc-400",
                              )}
                            >
                              {t(option.label)}
                            </span>
                          </div>
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
                    })}
                  </div>
                </section>
              );
            })}

            {/* --- FINAL STEP: SUMMARY --- */}
            {currentStep.id === "step_summary" && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 bg-orange-500/10 p-3 border border-orange-500/20 rounded-sm">
                  <Receipt className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-bold uppercase text-orange-500">
                    {t("ui.summary_title")}
                  </span>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs text-white border-b border-zinc-800 pb-2">
                    <span className="font-bold">{t("ui.base_price")}</span>
                    <span>
                      {formatPrice(
                        getModelDetails(currentModelId)?.basePrice || 0,
                        currency,
                      )}
                    </span>
                  </div>

                  {Object.entries(selections).map(([featureId, optionId]) => {
                    const option = OPTIONS[optionId];
                    if (!option) return null;
                    return (
                      <div
                        key={featureId}
                        className="flex justify-between items-center text-xs"
                      >
                        <span className="text-zinc-300">{t(option.label)}</span>
                        <span className="text-zinc-400 font-mono">
                          {option.price > 0
                            ? `+ ${formatPrice(option.price, currency)}`
                            : t("ui.included")}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total Block */}
                <div className="bg-zinc-900/50 p-4 border border-zinc-800 mt-6 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>{t("ui.subtotal")}</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                  {showVat && (
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{t("ui.vat_label")}</span>
                      <span>{formatPrice(vatAmount, currency)}</span>
                    </div>
                  )}
                  <div className="h-px bg-zinc-700 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold uppercase text-white">
                      {t("ui.total")}
                    </span>
                    <span className="text-xl font-conthrax text-orange-500">
                      {formatPrice(displayedPrice, currency)}
                    </span>
                  </div>
                </div>
              </section>
            )}

            <div className="md:hidden pt-8 mt-8 border-t border-white/5">
              <Footer variant="mobile" />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* ================= FIXED FOOTER ================= */}
      <div className="relative z-20 shrink-0 p-5 border-t border-white/10 bg-[#050505]">
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              {t("ui.total")}
            </span>
            <div className="flex items-center gap-2">
              <label
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wider cursor-pointer",
                  showVat ? "text-orange-500" : "text-zinc-600",
                )}
              >
                {t("ui.vat_label")}
              </label>
              <Switch
                checked={showVat}
                onCheckedChange={toggleVat}
                className="scale-75 data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-zinc-800"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-zinc-600 hover:text-zinc-300 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[200px] bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px]"
                  >
                    {t("ui.vat_tooltip")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-conthrax text-white tracking-wide drop-shadow-lg">
              {formatPrice(displayedPrice, currency)}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirstStep}
            className="flex-1 h-10 border-zinc-800 bg-transparent hover:bg-white/5 text-zinc-400 uppercase text-[10px] font-bold rounded-none"
          >
            <ArrowLeft className="w-3 h-3 mr-2" /> {t("ui.back")}
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex-2 h-10 bg-orange-600 hover:bg-orange-500 text-white uppercase text-[10px] font-bold rounded-none"
            >
              {isGeneratingPdf ? (
                t("ui.generating")
              ) : (
                <>
                  <FileDown className="w-4 h-4 mr-2" /> {t("ui.download_pdf")}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="flex-2 h-10 bg-white hover:bg-gray-200 text-black uppercase text-[10px] font-bold rounded-none"
            >
              {t("ui.next")} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
