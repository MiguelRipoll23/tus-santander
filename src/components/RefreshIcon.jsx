import styles from "./RefreshIcon.module.css";

const RefreshIcon = (props) => {
  return (
    <button
      type="button"
      className={`${styles.RefreshIcon} liquid-glass`}
      aria-label="Refrescar"
      onClick={props.refreshContent}
    >
      <span></span>
    </button>
  );
};

export default RefreshIcon;
