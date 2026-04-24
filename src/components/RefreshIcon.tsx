import React from "react";
import type { MouseEventHandler } from "react";
import { RefreshCw } from "lucide-react";
import styles from "./RefreshIcon.module.css";

interface RefreshIconProps {
  refreshContent: MouseEventHandler<HTMLButtonElement>;
}

function RefreshIcon({ refreshContent }: RefreshIconProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={`${styles.RefreshIcon} liquid-glass`}
      aria-label="Refrescar"
      onClick={refreshContent}
    >
      <RefreshCw size={28} aria-hidden="true" />
    </button>
  );
}

export default RefreshIcon;
