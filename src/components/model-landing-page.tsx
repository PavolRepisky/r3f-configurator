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
    <div className="min-h-screen w-full bg-[#050505] flex flex-col relative overflow-hidden font-sans text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
        <h1 className="text-2xl font-conthrax tracking-widest uppercase">
          TERRA<span className="text-orange-500">BOX</span>
        </h1>
        <div className="flex gap-4 text-xs font-mono text-zinc-500">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={locale === "en" ? "text-white" : "hover:text-white"}
          >
            EN
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => setLocale("sk")}
            className={locale === "sk" ? "text-white" : "hover:text-white"}
          >
            SK
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="text-center mb-12 space-y-4 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-conthrax uppercase tracking-tight text-white drop-shadow-lg">
            {t("ui.select_model") || "Select Your Model"}
          </h2>
          <p className="text-zinc-400 text-sm md:text-base font-light">
            Choose a base configuration to begin customizing your personal pod.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {models.map((model) => (
            <div
              key={model.id}
              className="group relative bg-zinc-900/40 border border-white/10 hover:border-orange-500/50 transition-all duration-300 rounded-sm overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                <Box className="w-12 h-12 text-zinc-700" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => selectModel(model.id)}
                    className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 uppercase font-bold tracking-widest text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    Configure <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-conthrax uppercase text-white group-hover:text-orange-500 transition-colors">
                    {t(model.label)}
                  </h3>
                  <span className="bg-white/10 text-zinc-300 px-2 py-1 rounded text-[10px] font-mono">
                    {model.dimensions.join(" x ")}m
                  </span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-1">
                  {t(model.description)}
                </p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                    Starting From
                  </span>
                  <span className="text-lg font-mono text-white">
                    {formatPrice(model.basePrice, currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="p-6 border-t border-white/5 bg-black/40">
        <Footer variant="mobile" />
      </div>
    </div>
  );
}
