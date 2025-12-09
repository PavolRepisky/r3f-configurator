import { cn } from "@/lib/utils";

interface ModelGraphicProps {
  modelId: string;
  isActive: boolean;
  className?: string;
}

export function ModelGraphic({
  modelId,
  isActive,
  className,
}: ModelGraphicProps) {
  const color = isActive ? "#f97316" : "#52525b"; // Orange-500 or Zinc-600

  return (
    <div
      className={cn(
        "relative w-12 h-12 flex items-center justify-center bg-black/50 border border-white/5",
        className,
      )}
    >
      {isActive && (
        <div className="absolute inset-0 bg-orange-500/20 blur-md" />
      )}

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 48 48"
        fill="none"
        className="p-2"
      >
        {/* Base Grid */}
        <path
          d="M4 4h1v1H4zM43 4h1v1h-1zM4 43h1v1H4zM43 43h1v1h-1z"
          fill={color}
          opacity={0.5}
        />

        {/* E3: Small Square */}
        {modelId === "e3" && (
          <path d="M14 14H34V34H14V14ZM16 16V32H32V16H16Z" fill={color} />
        )}

        {/* E7: Wide Rect */}
        {modelId === "e7" && (
          <>
            <path d="M4 14H44V34H4V14ZM6 16V32H42V16H6Z" fill={color} />
            <rect
              x="16"
              y="16"
              width="2"
              height="16"
              fill={color}
              opacity={0.5}
            />
          </>
        )}
      </svg>
    </div>
  );
}
