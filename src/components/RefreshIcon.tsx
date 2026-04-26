import React from "react";
import type { MouseEventHandler } from "react";
import { RotateCw } from "lucide-react";

interface RefreshIconProps {
  refreshContent: MouseEventHandler<HTMLButtonElement>;
}

function RefreshIcon({ refreshContent }: RefreshIconProps): React.JSX.Element {
  return (
    <button
      type="button"
      className="liquid-glass text-white fixed rounded-full w-18.5 h-18.5 left-1/2 -translate-x-1/2 animate-fade-in bottom-7 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 112, 240, 0.6)" }}
      aria-label="Refrescar"
      onClick={refreshContent}
    >
      <RotateCw size={34} aria-hidden="true" />
    </button>
  );
}

export default RefreshIcon;
