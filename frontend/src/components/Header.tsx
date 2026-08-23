import React from "react";
import type { ReactNode } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
  children?: ReactNode;
  text: string;
}

function Header({ children, text }: HeaderProps): React.JSX.Element {
  return (
    <div className={styles.Header}>
      <div className={styles.Options}>{children}</div>
      <div className={styles.Title}>{text}</div>
    </div>
  );
}

export default Header;
