import styles from "./EstimationsHeader.module.css";

const LineHeader = (props) => {
  return (
    <div className={styles.LineHeaderStyled}>
      <span className={styles.LineLabelStyled}>{props.label}</span>
      <span className={styles.LineDestinationStyled}>
        {props.destination.toUpperCase()}
      </span>
    </div>
  );
};

export default LineHeader;
