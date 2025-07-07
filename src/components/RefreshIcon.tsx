import styles from "./RefreshIcon.module.css";

const RefreshIcon = (props) => {
  return (
    <button
      className={styles.RefreshIcon}
      aria-label="Refrescar"
      onClick={props.refreshContent}
    >
      <span></span>
    </button>
  );
};

export default RefreshIcon;
