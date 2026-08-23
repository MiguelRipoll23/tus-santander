import React from "react";
import type { KeyboardEventHandler, ReactNode, MouseEventHandler } from "react";
import styles from "./EstimationsCard.module.css";
import {
  getLineBackgroundColors,
  getLineTextColor,
} from "../../utils/LineUtils";

interface EstimationsCardProps {
  id: string;
  label: string;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLDivElement>;
}

function EstimationsCard({
  id,
  label,
  children,
  onClick,
}: EstimationsCardProps): React.JSX.Element {
  const backgroundColors = getLineBackgroundColors(label);
  const textColor = getLineTextColor(label);

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      className={styles.EstimationsCard}
      style={{
        background: `linear-gradient(to bottom, ${backgroundColors[0]}, ${backgroundColors[1]})`,
        color: textColor,
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}

export default EstimationsCard;
