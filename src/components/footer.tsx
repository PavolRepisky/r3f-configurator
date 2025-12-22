import { ExternalLink, Mail } from "lucide-react";
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
        "flex flex-col gap-3 text-[10px] text-gray-600 font-sans tracking-wide",
        variant === "desktop" ? "items-start" : "items-center text-center",
        className,
      )}
    >
      {/* --- TOP ROW: BRANDING --- */}
      <div className="flex items-center gap-2 group cursor-default">
        <span className="font-conthrax text-gray-700 uppercase tracking-wider text-xs transition-colors group-hover:text-gray-900">
          TERRABOX <span className="text-orange-500">©</span> {year}
        </span>
        <span className="h-px w-8 bg-gray-300" />
        <span className="uppercase tracking-widest opacity-70">
          All rights reserved
        </span>
      </div>

      {/* --- BOTTOM ROW: LINKS --- */}
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-y-1 gap-x-4 font-mono text-gray-500",
          variant === "mobile" && "items-center",
        )}
      >
        {/* Manufacturer Link */}
        <span className="flex items-center gap-1.5 transition-colors hover:text-gray-700">
          <span>Manufacturer:</span>
          <Link
            href="https://en.303vessel.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1 border-b border-transparent hover:border-orange-500/50"
          >
            303 Vessel
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </Link>
        </span>

        {/* Separator (Desktop only) */}
        <span className="hidden sm:inline-block text-gray-300">|</span>

        {/* Email Link */}
        <Link
          href="mailto:info@terrabox.sk"
          className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500 transition-colors group/mail"
        >
          <Mail className="w-3 h-3 opacity-70 group-hover/mail:text-orange-500" />
          <span className="border-b border-transparent group-hover/mail:border-orange-500/50">
            info@terrabox.sk
          </span>
        </Link>
      </div>
    </div>
  );
}
