import styles from "./HeartIcon.module.css";

import StyleUtils from "../utils/StyleUtils.jsx";

const HeartIcon = (props) => {
  return (
    <button
      className={styles.HeartIconStyled}
      aria-label="Añadir a favoritos"
      data-state={props.heartState > 1 ? "\\e903" : "\\e904"}
      onClick={props.updateFavorite}
    />
  );
};

export default HeartIcon;
