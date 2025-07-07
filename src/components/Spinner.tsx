import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <svg
      className={styles.spinner}
      width="60px"
      height="60px"
      viewBox="0 0 60 60"
    >
      <circle
        className={styles.circle}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        cx="30"
        cy="30"
        r="27"
      />
    </svg>
  );
};

export default Spinner;
