"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Box } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Footer } from "@/components/footer";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/lib/price";
import { getAllModels } from "@/lib/repository";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/store/useConfigurator";

export function ModelLandingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { selectModel, currency, setLocale, locale } = useConfigurator();
  const { t } = useTranslation();
  const models = getAllModels();

  // --- SCROLL SETUP ---
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    container: mainContainerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll horizontal from 0 to -85%
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-85%"]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const ModelCard = ({ model, index }: { model: any; index: number }) => (
    <div className="group relative h-[50vh] w-[80vw] md:w-[600px] flex-shrink-0 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-row shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all duration-300 mx-4">
      {/* Left: Image/Icon Area */}
      <div className="w-1/2 bg-gray-50 relative flex items-center justify-center border-r border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
        <Box className="w-20 h-20 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 left-4 text-xs font-mono text-gray-400">
          0{index + 1}
        </div>
      </div>

      {/* Right: Info Area */}
      <div className="w-1/2 p-6 md:p-8 flex flex-col justify-between bg-white relative">
        <div>
          <h3 className="text-2xl font-conthrax uppercase text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {isMounted ? t(model.label) : model.label}
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-mono uppercase rounded">
              {model.dimensions.join(" x ")}m
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
            {isMounted ? t(model.description) : "..."}
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">
            Starting From
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-mono text-gray-900 font-bold">
              {isMounted ? formatPrice(model.basePrice, currency) : "---"}
            </span>
            <button
              onClick={() => selectModel(model.id)}
              className="bg-gray-900 text-white rounded-full p-3 hover:bg-orange-500 transition-colors shadow-lg"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={mainContainerRef}
      className="h-screen w-full overflow-y-auto overflow-x-hidden bg-white font-sans text-gray-900 relative"
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <h1 className="text-xl font-conthrax tracking-widest uppercase text-gray-900">
          TERRA<span className="text-orange-500">BOX</span>
        </h1>
        <div className="flex gap-4 text-xs font-mono text-gray-500">
          <button
            onClick={() => setLocale("en")}
            className={
              locale === "en"
                ? "text-gray-900 font-bold"
                : "hover:text-gray-900"
            }
          >
            EN
          </button>
          <span>/</span>
          <button
            onClick={() => setLocale("sk")}
            className={
              locale === "sk"
                ? "text-gray-900 font-bold"
                : "hover:text-gray-900"
            }
          >
            SK
          </button>
        </div>
      </header>

      {/* --- SCROLL TRACK --- */}
      <div ref={scrollTrackRef} className="relative h-[400vh] w-full">
        {/* --- STICKY VIEWPORT --- */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px),linear-gradient(to_bottom,#f3f4f6_1px,transparent_1px)] bg-size-[40px_40px]">
          {/* 1. TITLE SECTION (Fixed at Top Center) */}
          <div className="absolute top-24 left-0 right-0 text-center z-20 px-6">
            <h2 className="text-4xl md:text-6xl font-conthrax uppercase tracking-tight text-gray-900 mb-4">
              {isMounted
                ? t("ui.select_model") || "Select Model"
                : "Select Model"}
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base font-light">
              Scroll to explore our range of modular units.
            </p>
          </div>

          {/* 2. CENTERED SCROLL AREA */}
          <div className="absolute inset-0 flex items-center pt-32">
            {/* Fade Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <motion.div
              style={{ x }}
              // CHANGED: pl-[15vw] instead of 50vw.
              // This ensures the first card is visible immediately.
              className="flex items-center pl-6 md:pl-[15vw] w-max"
            >
              {models.map((model, idx) => (
                <ModelCard key={model.id} model={model} index={idx} />
              ))}

              {/* End Spacer */}
              <div className="w-[50vw]" />
            </motion.div>
          </div>

          {/* 3. FOOTER INDICATOR */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center text-xs font-mono text-gray-400 uppercase tracking-widest">
            <span>Swipe to Navigate</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-white border-t border-gray-200">
        <Footer variant="mobile" />
      </div>
    </div>
  );
}
