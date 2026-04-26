import React from "react";
import type { ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
  text: string;
}

function Header({ children, text }: HeaderProps): React.JSX.Element {
  return (
    <div className="px-[14px] pb-1.25">
      <div className="box-border pt-2 h-10.5 text-right">{children}</div>
      <div className="font-bold text-3.5xl">{text}</div>
    </div>
  );
}

export default Header;
