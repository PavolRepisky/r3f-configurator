"use client";

import { ArrowLeft, ArrowRight, FileDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import type { CurrencyCode } from "@/types/configurator";

interface SidebarFooterProps {
  totalDisplayPrice: number;
  currency: CurrencyCode;
  showVat: boolean;
  toggleVat: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDownload: () => void;
  isGeneratingPdf: boolean;
  t: (key: string) => string;
}

export function SidebarFooter({
  totalDisplayPrice,
  currency,
  showVat,
  toggleVat,
  isFirstStep,
  isLastStep,
  onPrev,
  onNext,
  onDownload,
  isGeneratingPdf,
  t,
}: SidebarFooterProps) {
  return (
    <div className="relative z-20 shrink-0 p-5 border-t border-gray-200 bg-white shadow-lg">
      {/* Price & VAT Controls */}
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            {t("ui.total")}
          </span>
          <div className="flex items-center gap-2">
            <label
              htmlFor="sidebar-vat-switch"
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider cursor-pointer",
                showVat ? "text-orange-500" : "text-gray-500",
              )}
            >
              {t("ui.vat_label")}
            </label>
            <Switch
              id="sidebar-vat-switch"
              checked={showVat}
              onCheckedChange={toggleVat}
              className="scale-75 data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-gray-500 hover:text-gray-700 cursor-help" />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[200px] bg-white border-gray-200 text-gray-700 text-xs shadow-lg"
                >
                  {t("ui.vat_tooltip")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-conthrax text-gray-900 tracking-wide">
            {formatPrice(totalDisplayPrice, currency)}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep}
          className="flex-1 h-10 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 uppercase text-[10px] font-bold rounded-md"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> {t("ui.back")}
        </Button>

        {isLastStep ? (
          <Button
            onClick={onDownload}
            disabled={isGeneratingPdf}
            className="flex-2 h-10 bg-orange-500 hover:bg-orange-600 text-white uppercase text-[10px] font-bold rounded-md shadow-md"
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
            onClick={onNext}
            className="flex-2 h-10 bg-gray-900 hover:bg-gray-800 text-white uppercase text-[10px] font-bold rounded-md shadow-md"
          >
            {t("ui.next")} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
