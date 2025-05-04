import styles from "./Header.module.css";

import StyleUtils from "../utils/StyleUtils.jsx";

const Header = (props) => {
  return (
    <div className={styles.HeaderStyled}>
      <div className={styles.OptionsStyled}>{props.children}</div>
      <div className={styles.TitleStyled}>{props.text}</div>
    </div>
  );
};

export default Header;
