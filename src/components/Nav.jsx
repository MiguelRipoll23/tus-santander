import { Fragment, useEffect, useState } from "react";
import styles from "./Nav.module.css";
import StyleUtils from "../utils/StyleUtils.jsx";

import Header from "./Header.jsx";

const Nav = (props) => {
  const [borderOpacity, setBorderOpacity] = useState(0);

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const mainElement = document.getElementsByTagName("main")[0];

    const handleScroll = () => {
      let opacity = 0;
      let scrollY = mainElement.scrollTop;

      if (scrollY > 50) {
        opacity = 0.15;
      } else {
        opacity = (scrollY * 0.15) / 50;
      }

      setBorderOpacity(opacity);
    };

    mainElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => mainElement.removeEventListener("scroll", handleScroll);
  });

  return (
    <Fragment>
      {props.isHeader && (
        <Header text={props.titleText}>{props.children}</Header>
      )}
      {props.isHeader === false && (
        <div
          className={styles.Nav}
          style={{ borderBottom: `1px solid rgba(0, 0, 0, ${borderOpacity})` }}
        >
          <div className={styles.NavLeft}>
            <button className={styles.BackButton} onClick={goBack}>
              <span className={styles.BackIcon}></span>
              <span>Atrás</span>
            </button>
          </div>
          <div className={styles.NavCenter}>
            <span className={styles.NavTitle}>{props.titleText}</span>
          </div>
          <div className={styles.NavRight}>{props.children}</div>
        </div>
      )}
    </Fragment>
  );
};

export default Nav;
