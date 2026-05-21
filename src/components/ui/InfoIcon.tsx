import { Info } from "lucide-react";

import { Tooltip } from "./Tooltip";

interface InfoIconProps {
  content: string;
  position?: "top" | "bottom";
  className?: string;
}

// Section-header hint: a small (i) button that reveals a tooltip on hover/
// focus. Use this next to titles so users can ask "what does this show?"
// without us cluttering the UI with subtitles.
export function InfoIcon({ content, position = "bottom", className }: InfoIconProps) {
  return (
    <Tooltip content={content} position={position} className={className}>
      <button
        type="button"
        aria-label="More info"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
    </Tooltip>
  );
}
