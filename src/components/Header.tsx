import React from "react";
import type { ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
  text: string;
}

function Header({ children, text }: HeaderProps): React.JSX.Element {
  return (
    <div className="px-3.5 pb-[5px]">
      <div className="box-border pt-2 h-[42px] text-right">{children}</div>
      <div className="font-bold text-[35px]">{text}</div>
    </div>
  );
}

export default Header;
