import Styles from "./Spinner.module.css";

const Spinner = (props) => {
  return (
    <svg
      className={Styles.spinner}
      width="65px"
      height="65px"
      viewBox="0 0 66 66"
    >
      <circle
        className={Styles.circle}
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
