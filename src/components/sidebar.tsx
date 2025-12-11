"use client";

import { ArrowLeft, ArrowRight, FileDown, Info, Receipt } from "lucide-react";
import { useEffect, useState } from "react";

// App Components
import { FeatureSelection } from "@/components/feature-selection";
import { Footer } from "@/components/footer";
import { ModelSelection } from "@/components/model-selection"; // <--- Imported
import { SidebarHeader } from "@/components/sidebar-header";

// UI Components
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
    window.dispatchEvent(new Event("request-screenshot"));

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
          t,
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

      <SidebarHeader />

      {/* --- SCROLLABLE CONTENT --- */}
      <div className="flex-1 min-h-0 relative z-10">
        <ScrollArea className="h-full w-full">
          <div className="p-5 space-y-6 pb-6">
            {/* STEP 1: MODEL SELECTION */}
            {currentStep.id === "step_model" && (
              <ModelSelection
                models={allModels}
                currentModelId={currentModelId}
                currency={currency}
                onSelect={setModel}
                t={t}
              />
            )}

            {/* MIDDLE STEPS: FEATURES */}
            {currentStep.featureIds.map((featureId, index) => (
              <FeatureSelection
                key={featureId}
                featureId={featureId}
                index={index}
                selections={selections}
                currency={currency}
                onToggle={toggleSelection}
                t={t}
              />
            ))}

            {/* STEP 4: SUMMARY */}
            {/* You could also extract this into <QuoteSummary /> if you like, 
                but it is the last unique block remaining here. */}
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

                {/* Total */}
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

      {/* --- FOOTER ACTIONS --- */}
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
