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
      className="liquid-glass text-white fixed rounded-full w-[74px] h-[74px] left-1/2 -ml-[37px] animate-fade-in bottom-7 bg-[rgba(0,112,240,0.6)] flex items-center justify-center"
      aria-label="Refrescar"
      onClick={refreshContent}
    >
      <RotateCw size={34} aria-hidden="true" />
    </button>
  );
}

export default RefreshIcon;
