import Styles from "./EstimationsHeader.module.css";

const LineHeader = (props) => {
  return (
    <div className={Styles.LineHeader}>
      <span className={Styles.LineLabel}>{props.label}</span>
      <span className={Styles.LineDestination}>
        {props.destination.toUpperCase()}
      </span>
    </div>
  );
};

export default LineHeader;
