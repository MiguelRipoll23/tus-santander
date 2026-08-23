import React from "react";
import type { ReactNode, CSSProperties } from "react";
import styles from "./Main.module.css";

interface MainProps {
  children: ReactNode;
  paddingTop?: string;
  paddingBottom?: string;
}

function Main({ children, paddingTop = "0", paddingBottom = "0" }: MainProps): React.JSX.Element {
  const style: CSSProperties = { paddingTop, paddingBottom };

  return (
    <main className={styles.Content} style={style}>
      {children}
    </main>
  );
}

export default Main;
