"use client";

import { useEffect, useState } from "react";
import { FeatureSelection } from "@/components/feature-selection";
import { Footer } from "@/components/footer";
import { ModelSelection } from "@/components/model-selection";
import { QuoteSummary } from "@/components/quote-summary";
import { SidebarFooter } from "@/components/sidebar-footer";
import { SidebarHeader } from "@/components/sidebar-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { STEPS } from "@/data/steps";
import { useTranslation } from "@/hooks/useTranslation";
import { generateQuotePDF } from "@/lib/pdf-generator";
import { getAllModels, getModelDetails } from "@/lib/repository";
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
  const currentModel = getModelDetails(currentModelId);
  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  // --- VAT CALCULATIONS ---
  const vatRate = 0.23;
  const vatAmount = totalPrice * vatRate;
  const totalWithVat = totalPrice + vatAmount;
  const displayedPrice = showVat ? totalWithVat : totalPrice;

  // --- PDF LOGIC ---
  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    window.dispatchEvent(new Event("request-screenshot"));
    setTimeout(() => {
      setIsGeneratingPdf((prev) => (prev ? false : prev));
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

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 relative z-10">
        <ScrollArea className="h-full w-full">
          <div className="p-5 space-y-6 pb-6">
            {/* First Step: Models */}
            {currentStep.id === "step_model" && (
              <ModelSelection
                models={allModels}
                currentModelId={currentModelId}
                currency={currency}
                onSelect={setModel}
                t={t}
              />
            )}

            {/* Middle Steps: Features */}
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

            {/* Last Step: Summary */}
            {currentStep.id === "step_summary" && currentModel && (
              <QuoteSummary
                currentModelId={currentModelId}
                selections={selections}
                basePrice={currentModel.basePrice}
                totalPrice={totalPrice}
                vatAmount={vatAmount}
                totalWithVat={totalWithVat}
                currency={currency}
                showVat={showVat}
                t={t}
              />
            )}

            <div className="md:hidden pt-8 mt-8 border-t border-white/5">
              <Footer variant="mobile" />
            </div>
          </div>
        </ScrollArea>
      </div>

      <SidebarFooter
        totalDisplayPrice={displayedPrice}
        currency={currency}
        showVat={showVat}
        toggleVat={toggleVat}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrev={prevStep}
        onNext={nextStep}
        onDownload={handleDownloadPDF}
        isGeneratingPdf={isGeneratingPdf}
        t={t}
      />
    </div>
  );
}
