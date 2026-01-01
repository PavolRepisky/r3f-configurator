"use client";

import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/store/useConfigurator";
import { getAllCurrencies } from "@/lib/repository";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useConfigurator();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-md border transition-all duration-200",
            "bg-white border-gray-200 text-gray-600",
            "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
            "data-[state=open]:border-orange-500/50 data-[state=open]:text-orange-500 data-[state=open]:bg-orange-50",
          )}
        >
          <Coins className="h-4 w-4" />
          <span className="sr-only">Switch Currency</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-white border-gray-200 text-gray-900 backdrop-blur-xl rounded-lg min-w-[100px] p-1 shadow-lg"
      >
        {getAllCurrencies().map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className={cn(
              "cursor-pointer rounded-md flex items-center justify-between py-2 px-3 text-xs uppercase tracking-wider font-medium transition-colors",
              "focus:bg-gray-50 focus:text-gray-900",
              currency === curr.code
                ? "text-orange-500 focus:text-orange-600 bg-orange-50"
                : "text-gray-600",
            )}
          >
            <span>{curr.code}</span>
            {currency === curr.code && (
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
