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
    <div className="relative z-20 shrink-0 p-5 border-t border-white/10 bg-[#050505]">
      {/* Price & VAT Controls */}
      <div className="flex flex-col mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            {t("ui.total")}
          </span>
          <div className="flex items-center gap-2">
            <label
              htmlFor="sidebar-vat-switch"
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider cursor-pointer",
                showVat ? "text-orange-500" : "text-zinc-600",
              )}
            >
              {t("ui.vat_label")}
            </label>
            <Switch
              id="sidebar-vat-switch"
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
          className="flex-1 h-10 border-zinc-800 bg-transparent hover:bg-white/5 text-zinc-400 uppercase text-[10px] font-bold rounded-none"
        >
          <ArrowLeft className="w-3 h-3 mr-2" /> {t("ui.back")}
        </Button>

        {isLastStep ? (
          <Button
            onClick={onDownload}
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
            onClick={onNext}
            className="flex-2 h-10 bg-white hover:bg-gray-200 text-black uppercase text-[10px] font-bold rounded-none"
          >
            {t("ui.next")} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
