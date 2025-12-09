import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function Footer({ variant = "desktop", className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <div
      className={cn(
        "flex flex-col gap-1 text-[10px] text-zinc-500 font-sans tracking-wide",
        variant === "desktop" ? "items-start" : "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-conthrax text-zinc-400 uppercase">
          TERRABOX <span className="text-orange-900">©</span> {year}
        </span>
        <span className="w-px h-3 bg-zinc-800" />
        <span>All rights reserved</span>
      </div>

      <div
        className={cn(
          "flex flex-wrap gap-x-3",
          variant === "mobile" && "justify-center",
        )}
      >
        <span className="text-zinc-600">Manufacturer: SmartModule s.r.o.</span>
      </div>

      <div
        className={cn(
          "flex gap-3 mt-1",
          variant === "mobile" && "justify-center",
        )}
      >
        <Link href="#" className="hover:text-orange-500 transition-colors">
          info@terrabox.sk
        </Link>
      </div>
    </div>
  );
}
