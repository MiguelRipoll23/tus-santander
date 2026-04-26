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
      className={`rounded-full px-6 py-4 text-center font-bold inline-block box-border ${className ?? ""}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
