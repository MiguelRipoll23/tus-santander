import styles from "./HeartIcon.module.css";

const HeartIcon = (props) => {
  return (
    <button
      className={styles.HeartIcon}
      aria-label="Añadir a favoritos"
      data-state={props.heartState > 1 ? "" : ""}
      onClick={props.updateFavorite}
    />
  );
};

export default HeartIcon;
