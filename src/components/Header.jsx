import Styles from "./Header.module.css";

import StyleUtils from "../utils/StyleUtils.jsx";

const Header = (props) => {
  return (
    <div className={Styles.Header}>
      <div className={Styles.Options}>{props.children}</div>
      <div className={Styles.Title}>{props.text}</div>
    </div>
  );
};

export default Header;
