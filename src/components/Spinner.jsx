import styles from "./Spinner.module.css";

const Spinner = (props) => {
  return (
    <svg
      className={styles.spinner}
      width="65px"
      height="65px"
      viewBox="0 0 66 66"
    >
      <circle
        className={styles.circle}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </svg>
  );
};

export default Spinner;
