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
            "h-9 w-9 rounded-md border transition-all duration-200",
            // Default state
            "bg-white border-gray-200 text-gray-600",
            // Hover state
            "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
            // Open state
            "data-[state=open]:border-orange-500/50 data-[state=open]:text-orange-500 data-[state=open]:bg-orange-50",
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-white border-gray-200 text-gray-900 backdrop-blur-xl rounded-lg min-w-[140px] p-1 shadow-lg"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={cn(
              "cursor-pointer rounded-md flex items-center justify-between py-2 px-3 text-xs uppercase tracking-wider font-medium transition-colors",
              "focus:bg-gray-50 focus:text-gray-900",
              locale === lang.code
                ? "text-orange-500 focus:text-orange-600 bg-orange-50"
                : "text-gray-600",
            )}
          >
            <span>{lang.label}</span>
            {locale === lang.code && (
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
