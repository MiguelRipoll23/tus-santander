import React from "react";
import type { ReactNode, MouseEventHandler } from "react";
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

  return (
    <div
      id={id}
      className="rounded-7.5 mt-3.5 mx-3.5 cursor-pointer animate-fade-in last:mb-3.5"
      style={{
        background: `linear-gradient(to bottom, ${backgroundColors[0]}, ${backgroundColors[1]})`,
        color: textColor,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default EstimationsCard;
