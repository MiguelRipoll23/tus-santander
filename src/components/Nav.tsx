import React from "react";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { ChevronLeft } from "lucide-react";
import Header from "./Header";
import styles from "./Nav.module.css";

interface NavProps {
  isHeader: boolean;
  titleText: string;
  children?: ReactNode;
}

function Nav({ isHeader, titleText, children }: NavProps): React.JSX.Element {
  const goBack = (): void => {
    globalThis.history.back();
  };

  return (
    <Fragment>
      {isHeader && <Header text={titleText}>{children}</Header>}
      {isHeader === false && (
        <div className={styles.Nav}>
          <div className={styles.NavLeft}>
            <button
              type="button"
              className={`${styles.BackButton} liquid-glass`}
              aria-label="Back"
              onClick={goBack}
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
          </div>
          <div className={styles.NavCenter}>
            <span className={`${styles.NavTitle} liquid-glass`}>
              {titleText}
            </span>
          </div>
          <div className={styles.NavRight}>{children}</div>
        </div>
      )}
    </Fragment>
  );
}

export default Nav;
