"use client";

import { ArrowRight, Box } from "lucide-react";
import { Footer } from "@/components/footer";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/price";
import { getAllModels } from "@/lib/repository";
import { useConfigurator } from "@/store/useConfigurator";

export function ModelLandingPage() {
  const { selectModel, currency, setLocale, locale } = useConfigurator();
  const { t } = useTranslation();
  const models = getAllModels();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col relative overflow-hidden font-sans text-gray-900">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb08_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb08_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-gray-200/80 bg-white/80 backdrop-blur-md shadow-sm">
        <h1 className="text-2xl font-conthrax tracking-widest uppercase text-gray-900">
          TERRA<span className="text-orange-500">BOX</span>
        </h1>
        <div className="flex gap-4 text-xs font-mono text-gray-500">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={locale === "en" ? "text-gray-900 font-semibold" : "hover:text-gray-900"}
          >
            EN
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => setLocale("sk")}
            className={locale === "sk" ? "text-gray-900 font-semibold" : "hover:text-gray-900"}
          >
            SK
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="text-center mb-12 space-y-4 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-conthrax uppercase tracking-tight text-gray-900">
            {t("ui.select_model") || "Select Your Model"}
          </h2>
          <p className="text-gray-600 text-sm md:text-base font-light">
            Choose a base configuration to begin customizing your personal pod.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {models.map((model) => (
            <div
              key={model.id}
              className="group relative bg-white border border-gray-200 hover:border-orange-500/50 hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden flex flex-col shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <Box className="w-12 h-12 text-gray-300" />
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => selectModel(model.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 uppercase font-bold tracking-widest text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 rounded-md shadow-lg"
                  >
                    Configure <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-conthrax uppercase text-gray-900 group-hover:text-orange-500 transition-colors">
                    {t(model.label)}
                  </h3>
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-mono">
                    {model.dimensions.join(" x ")}m
                  </span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-6 flex-1">
                  {t(model.description)}
                </p>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                    Starting From
                  </span>
                  <span className="text-lg font-mono text-gray-900 font-semibold">
                    {formatPrice(model.basePrice, currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-md">
        <Footer variant="mobile" />
      </div>
    </div>
  );
}
