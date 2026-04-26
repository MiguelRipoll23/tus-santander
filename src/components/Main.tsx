import React from "react";
import type { ReactNode, CSSProperties } from "react";

interface MainProps {
  children: ReactNode;
  paddingTop?: string;
  paddingBottom?: string;
}

function Main({ children, paddingTop = "0", paddingBottom = "0" }: MainProps): React.JSX.Element {
  const style: CSSProperties = { paddingTop, paddingBottom };

  return (
    <main className="flex-1 flex flex-col box-border" style={style}>
      {children}
    </main>
  );
}

export default Main;
