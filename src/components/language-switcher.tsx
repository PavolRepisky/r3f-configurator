"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/store/useConfigurator";
import type { Locale } from "@/types/configurator";

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "sk", label: "Slovenčina" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useConfigurator();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-sm border transition-all duration-200",
            // Default state
            "bg-transparent border-white/5 text-zinc-400",
            // Hover state
            "hover:bg-white/5 hover:border-white/10 hover:text-white",
            // Open state
            "data-[state=open]:border-orange-500/50 data-[state=open]:text-orange-500 data-[state=open]:bg-orange-500/10",
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-[#0a0a0a]/95 border-white/10 text-white backdrop-blur-xl rounded-sm min-w-[140px] p-1"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={cn(
              "cursor-pointer rounded-sm flex items-center justify-between py-2 px-3 text-xs uppercase tracking-wider font-medium transition-colors",
              "focus:bg-white/5 focus:text-white",
              locale === lang.code
                ? "text-orange-500 focus:text-orange-400 bg-orange-500/10"
                : "text-zinc-400",
            )}
          >
            <span>{lang.label}</span>
            {locale === lang.code && (
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
