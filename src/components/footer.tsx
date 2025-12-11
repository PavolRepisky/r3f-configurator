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
        "flex flex-col gap-1.5 text-xs text-zinc-500 font-sans tracking-wide",
        variant === "desktop" ? "items-start" : "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-conthrax text-zinc-400 uppercase">
          TERRABOX <span className="text-orange-600">©</span> {year}
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
        <span className="text-zinc-500">
          Manufacturer:{" "}
          <Link
            href="https://en.303vessel.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            303 Vessel
          </Link>
        </span>
      </div>

      <div
        className={cn(
          "flex gap-3 mt-0.5",
          variant === "mobile" && "justify-center",
        )}
      >
        <Link
          href="mailto:info@terrabox.sk"
          className="hover:text-orange-500 transition-colors"
        >
          info@terrabox.sk
        </Link>
      </div>
    </div>
  );
}
