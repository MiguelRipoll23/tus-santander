import React from "react";
import styles from "./EstimationsBody.module.css";

interface EstimationsBodyProps {
  time1: number;
  time2: number;
}

function getTimeText(minutes: number): string {
  if (minutes === 0) return ">>";
  if (minutes > 0) return `${minutes} MIN`;
  return "- -";
}

function EstimationsBody({ time1, time2 }: EstimationsBodyProps): React.JSX.Element {
  return (
    <div className={styles.Time}>
      <div className={styles.Time1} id="time1" data-time={time1}>
        {getTimeText(time1)}
      </div>
      <div className={styles.Time2}>{getTimeText(time2)}</div>
    </div>
  );
}

export default EstimationsBody;
