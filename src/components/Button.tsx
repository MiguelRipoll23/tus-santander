import React from "react";
import type { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  color?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

function Button({ children, className, color, onClick }: ButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={`rounded-[30px] text-center text-white font-bold inline-block box-border ${className ?? ""}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
