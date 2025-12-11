"use client";

import { AlertCircle, Hash, Receipt } from "lucide-react";
import { FEATURES } from "@/data/features";
import { OPTIONS } from "@/data/options";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import type { CurrencyCode } from "@/types/configurator";

interface QuoteSummaryProps {
  currentModelId: string;
  selections: Record<string, string>;
  basePrice: number;
  totalPrice: number;
  vatAmount: number;
  totalWithVat: number;
  currency: CurrencyCode;
  showVat: boolean;
  t: (key: string) => string;
}

export function QuoteSummary({
  currentModelId,
  selections,
  basePrice,
  totalPrice,
  vatAmount,
  totalWithVat,
  currency,
  showVat,
  t,
}: QuoteSummaryProps) {
  const hasSelections = Object.keys(selections).length > 0;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Minimalist Card */}
      <div className="bg-zinc-900/30 border border-white/5 backdrop-blur-sm rounded-sm overflow-hidden">
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-zinc-400">
            <Receipt className="w-4 h-4" />
            {/* Increased to text-sm */}
            <span className="text-sm font-medium tracking-widest uppercase">
              {t("ui.summary_title")}
            </span>
          </div>
          {/* Ref ID */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600">
            <Hash className="w-3.5 h-3.5 opacity-40" />
            <span>MOD-{currentModelId.toUpperCase()}</span>
          </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="px-5 py-2">
          {/* 1. Base Model */}
          <div className="py-4 flex justify-between items-center group">
            <div className="flex flex-col gap-0.5">
              {/* Increased to text-base */}
              <span className="text-base font-medium text-zinc-200">
                {t("ui.base_price")}
              </span>
              {/* Increased to text-xs */}
              <span className="text-xs text-zinc-500">Core Configuration</span>
            </div>
            {/* Increased to text-lg */}
            <span className="font-mono text-lg text-zinc-300 tabular-nums">
              {formatPrice(basePrice, currency)}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 my-1" />

          {/* 2. Options */}
          <div className="py-3 space-y-3">
            {!hasSelections && (
              <div className="flex items-center gap-2 text-zinc-600 italic text-sm py-2">
                <AlertCircle className="w-4 h-4" />
                <span>{t("ui.no_addons") || "No add-ons selected"}</span>
              </div>
            )}

            {Object.entries(selections).map(([featureId, optionId]) => {
              const feature = FEATURES[featureId];
              const option = OPTIONS[optionId];
              if (!feature || !option) return null;

              return (
                <div
                  key={featureId}
                  className="flex justify-between items-start text-sm"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-zinc-300">{t(option.label)}</span>
                    {/* Increased to text-xs */}
                    <span className="text-xs text-zinc-600">
                      {t(feature.label)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-mono tabular-nums text-xs pt-0.5",
                      option.price > 0 ? "text-zinc-400" : "text-zinc-600",
                    )}
                  >
                    {option.price > 0
                      ? `+ ${formatPrice(option.price, currency)}`
                      : t("ui.included")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- TOTALS FOOTER --- */}
        <div className="bg-white/[0.02] px-5 py-5 border-t border-white/5 space-y-4">
          {/* Subtotals */}
          <div className="flex flex-col gap-1.5 text-xs text-zinc-500 pb-3 border-b border-dashed border-white/5">
            <div className="flex justify-between">
              <span>{t("ui.subtotal")}</span>
              <span className="font-mono tabular-nums text-zinc-400">
                {formatPrice(totalPrice, currency)}
              </span>
            </div>
            {showVat && (
              <div className="flex justify-between">
                <span>{t("ui.vat_label")}</span>
                <span className="font-mono tabular-nums text-zinc-400">
                  {formatPrice(vatAmount, currency)}
                </span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-1">
              {t("ui.total")}
            </span>
            <div className="text-right">
              {/* Increased to text-3xl */}
              <div className="text-3xl font-light font-mono text-white tracking-tight tabular-nums">
                {formatPrice(showVat ? totalWithVat : totalPrice, currency)}
              </div>
              <div className="text-[10px] text-orange-500/80 mt-1 uppercase tracking-wide">
                {showVat ? "Inc. VAT" : "Excl. VAT"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
