import { Fragment } from "react";
import Header from "./Header.jsx";
import styles from "./Nav.module.css";

const Nav = (props) => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <Fragment>
      {props.isHeader && (
        <Header text={props.titleText}>{props.children}</Header>
      )}
      {props.isHeader === false && (
        <div className={styles.Nav}>
          <div className={styles.NavLeft}>
            <button
              className={`${styles.BackButton} liquid-glass`}
              aria-label="Back"
              onClick={goBack}
            >
              <span className={styles.BackIcon} aria-hidden="true">
                
              </span>
            </button>
          </div>
          <div className={styles.NavCenter}>
            <span className={`${styles.NavTitle} liquid-glass`}>
              {props.titleText}
            </span>
          </div>
          <div className={styles.NavRight}>{props.children}</div>
        </div>
      )}
    </Fragment>
  );
};

export default Nav;
