import styles from "./EstimationsHeader.module.css";

const LineHeader = (props) => {
  return (
    <div className={styles.LineHeader}>
      <span className={styles.LineLabel}>{props.label}</span>
      <span className={styles.LineDestination}>
        {props.destination.toUpperCase()}
      </span>
    </div>
  );
};

export default LineHeader;
