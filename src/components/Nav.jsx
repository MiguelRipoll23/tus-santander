import { Fragment, useEffect, useState } from "react";
import Header from "./Header.jsx";
import { useI18n } from "../contexts/I18nContext.jsx";

import styles from "./Nav.module.css";

const Nav = (props) => {
  const { t } = useI18n();
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
          style={{ "--border-opacity": borderOpacity }}
        >
          <div className={styles.NavLeft}>
            <button className={styles.BackButton} onClick={goBack}>
              <span className={styles.BackIcon}></span>
              <span>{t("back")}</span>
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
