import Styles from "./RefreshIcon.module.css";

const RefreshIcon = (props) => {
  return (
    <button
      className={Styles.RefreshIcon}
      aria-label="Refrescar"
      onClick={props.refreshContent}
    >
      <span></span>
    </button>
  );
};

export default RefreshIcon;
