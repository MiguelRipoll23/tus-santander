import React from "react";
import type { ReactNode, MouseEventHandler } from "react";
import styles from "./Button.module.css";

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
      className={`${className ?? ""} ${styles.button}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
